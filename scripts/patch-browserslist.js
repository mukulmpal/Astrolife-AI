const fs = require("fs");
const path = require("path");

// 1. Patch browserslist firefox.esr bug under Node 25
const browserslistFile = path.resolve(__dirname, "../node_modules/next/dist/compiled/browserslist/index.js");
if (fs.existsSync(browserslistFile)) {
  let content = fs.readFileSync(browserslistFile, "utf8");
  const target = "browserslist.versionAliases.firefox.esr=y;";
  const replacement = "if(!browserslist.versionAliases){browserslist.versionAliases={};}if(!browserslist.versionAliases.firefox){browserslist.versionAliases.firefox={};}browserslist.versionAliases.firefox.esr=y;";
  
  if (content.includes(target) && !content.includes("browserslist.versionAliases.firefox={};")) {
    content = content.replace(target, replacement);
    fs.writeFileSync(browserslistFile, content, "utf8");
    console.log("[patch-browserslist] Applied browserslist firefox.esr patch successfully.");
  } else {
    console.log("[patch-browserslist] Patch already present or target not found.");
  }
}

// 2. Patch @tailwindcss/node enhanced-resolve import
const tailwindNodeFile = path.resolve(__dirname, "../node_modules/@tailwindcss/node/dist/index.js");
if (fs.existsSync(tailwindNodeFile)) {
  let content = fs.readFileSync(tailwindNodeFile, "utf8");
  
  let modified = false;
  if (content.includes("W.default.ResolverFactory")) {
    content = content.replaceAll("W.default.ResolverFactory", '(W.ResolverFactory||W.default?.ResolverFactory||require("enhanced-resolve").ResolverFactory)');
    modified = true;
  }
  if (content.includes("W.default.CachedInputFileSystem")) {
    content = content.replaceAll("W.default.CachedInputFileSystem", '(W.CachedInputFileSystem||W.default?.CachedInputFileSystem||require("enhanced-resolve").CachedInputFileSystem)');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(tailwindNodeFile, content, "utf8");
    console.log("[patch-deps] Successfully replaced W.default calls in @tailwindcss/node.");
  } else {
    console.log("[patch-deps] @tailwindcss/node already patched or calls not found.");
  }
}

// 3. Patch @tailwindcss/postcss DEBUG under Node 25
const tailwindPostcssFile = path.resolve(__dirname, "../node_modules/@tailwindcss/postcss/dist/index.js");
if (fs.existsSync(tailwindPostcssFile)) {
  let content = fs.readFileSync(tailwindPostcssFile, "utf8");
  if (content.includes("var p=x.env.DEBUG")) {
    content = content.replace("var p=x.env.DEBUG", "var p=x?.env?.DEBUG||false");
    fs.writeFileSync(tailwindPostcssFile, content, "utf8");
    console.log("[patch-deps] Successfully patched x.env.DEBUG in @tailwindcss/postcss.");
  }
}

// 4. Patch enhanced-resolve ExportsFieldPlugin processExportsField under Node 25
const exportsFieldPluginFile = path.resolve(__dirname, "../node_modules/enhanced-resolve/lib/ExportsFieldPlugin.js");
if (fs.existsSync(exportsFieldPluginFile)) {
  let content = fs.readFileSync(exportsFieldPluginFile, "utf8");
  if (content.includes("processExportsField(exportsField)") && !content.includes("_getFn")) {
    content = content.replace("processExportsField(exportsField)", "_getFn()(exportsField)");
    content = content.replace(
      'const { processExportsField } = require("./util/entrypoints");',
      'const { processExportsField } = require("./util/entrypoints");\nconst _getFn = () => typeof processExportsField === "function" ? processExportsField : (require("./util/entrypoints").processExportsField || require("./util/entrypoints").default?.processExportsField || (() => [[], null]));'
    );
    fs.writeFileSync(exportsFieldPluginFile, content, "utf8");
    console.log("[patch-deps] Successfully patched ExportsFieldPlugin.js in enhanced-resolve.");
  }
}

