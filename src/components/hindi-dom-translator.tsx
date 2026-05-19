"use client";

import { useEffect, useMemo, useRef } from "react";
import { TRANSLATABLE_ATTRIBUTE_NAMES, translateUiText, useLanguage } from "@/lib/language-context";

const SKIP_SELECTOR = [
  "script",
  "style",
  "textarea",
  "input",
  "select",
  "code",
  "pre",
  "[contenteditable='true']",
  "[data-no-translate]",
].join(",");

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  return !parent || parent.closest(SKIP_SELECTOR);
}

function shouldSkipElement(element: Element) {
  return element.closest(SKIP_SELECTOR);
}

export function HindiDomTranslator() {
  const { lang } = useLanguage();
  const textOriginals = useRef<WeakMap<Text, string>>(new WeakMap());
  const attrOriginals = useRef<WeakMap<Element, Partial<Record<(typeof TRANSLATABLE_ATTRIBUTE_NAMES)[number], string>>>>(
    new WeakMap()
  );

  const translateTree = useMemo(() => {
    const translateTextNode = (node: Text) => {
      if (shouldSkipTextNode(node)) return;
      const original = textOriginals.current.get(node) ?? node.nodeValue ?? "";
      if (!textOriginals.current.has(node)) textOriginals.current.set(node, original);
      const translated = translateUiText(original, lang);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    };

    const translateAttributes = (element: Element) => {
      if (shouldSkipElement(element)) return;
      for (const attr of TRANSLATABLE_ATTRIBUTE_NAMES) {
        const current = element.getAttribute(attr);
        if (!current) continue;

        const stored = attrOriginals.current.get(element) ?? {};
        if (!stored[attr]) {
          stored[attr] = current;
          attrOriginals.current.set(element, stored);
        }
        const translated = translateUiText(stored[attr] ?? current, lang);
        if (current !== translated) element.setAttribute(attr, translated);
      }
    };

    return (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root as Text);
        return;
      }

      if (root instanceof Element) translateAttributes(root);

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            return shouldSkipTextNode(node as Text) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
          if (node instanceof Element && shouldSkipElement(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text);
        if (node instanceof Element) translateAttributes(node);
        node = walker.nextNode();
      }
    };
  }, [lang]);

  useEffect(() => {
    const root = document.querySelector(".astro-os-root") ?? document.body;
    translateTree(root);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) translateTree(node as Text);
            if (node instanceof Element) translateTree(node);
          });
        }

        if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
          const textNode = mutation.target as Text;
          const existingOriginal = textOriginals.current.get(textNode);
          const currentValue = textNode.nodeValue ?? "";
          if (existingOriginal && currentValue === translateUiText(existingOriginal, lang)) continue;
          textOriginals.current.set(textNode, currentValue);
          translateTree(textNode);
        }

        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          translateTree(mutation.target);
        }
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTE_NAMES],
    });

    return () => observer.disconnect();
  }, [lang, translateTree]);

  return null;
}
