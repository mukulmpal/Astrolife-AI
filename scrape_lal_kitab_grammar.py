#!/usr/bin/env python3
"""
Build a research-safe index for the Lal Kitab Grammar blog.

This script intentionally stores metadata, labels, URLs, short snippets, and a
light keyword index. It does not archive full post bodies verbatim.
"""

from __future__ import annotations

import json
import re
import time
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


BASE = "https://lalkitablk1952grammar.blogspot.com"
FEED = f"{BASE}/feeds/posts/default"
SITEMAP = f"{BASE}/sitemap.xml"
OUT = Path("data/lalkitab_grammar")
RAW = OUT / "raw"
MD = OUT / "markdown"
SNIPPET_CHARS = 360

HEADERS = {
    "User-Agent": "AstroLifeResearchBot/1.0 (private research; contact: astrolife)"
}

KEYWORDS = [
    "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu",
    "surya", "chandra", "mangal", "budh", "guru", "shukra", "shani",
    "house", "bhava", "grah", "planet", "remedy", "upay", "daan", "malefic",
    "benefic", "exalted", "debilitated", "lalkitab", "lal kitab",
]


def clean_text(html: str) -> str:
    soup = BeautifulSoup(html or "", "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = soup.get_text("\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def safe_slug(text: str) -> str:
    text = re.sub(r"[^\w\u0900-\u097F]+", "-", text, flags=re.UNICODE)
    text = text.strip("-")
    return text[:120] or "post"


def short_snippet(text: str) -> str:
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= SNIPPET_CHARS:
        return compact
    return compact[:SNIPPET_CHARS].rsplit(" ", 1)[0].strip() + "..."


def keyword_hits(text: str) -> list[str]:
    lower = text.lower()
    return [word for word in KEYWORDS if word in lower]


def post_url(entry: dict[str, Any]) -> str:
    for link in entry.get("link", []):
        if link.get("rel") == "alternate":
            return link.get("href", "")
    return ""


def normalize_post(entry: dict[str, Any], index: int) -> dict[str, Any]:
    title = entry.get("title", {}).get("$t", "").strip()
    content_text = clean_text(entry.get("content", {}).get("$t", ""))
    labels = [
        c.get("term", "")
        for c in entry.get("category", [])
        if c.get("term")
    ]
    url = post_url(entry)
    parsed = urlparse(url)

    return {
        "index": index,
        "id": entry.get("id", {}).get("$t", ""),
        "title": title,
        "url": url,
        "domain": parsed.netloc,
        "published": entry.get("published", {}).get("$t", ""),
        "updated": entry.get("updated", {}).get("$t", ""),
        "labels": labels,
        "snippet": short_snippet(content_text),
        "keywords": keyword_hits(f"{title}\n{content_text}\n{' '.join(labels)}"),
        "word_count_estimate": len(re.findall(r"\S+", content_text)),
    }


def normalize_page(url: str, html: str, index: int) -> dict[str, Any]:
    soup = BeautifulSoup(html or "", "html.parser")
    title_node = soup.select_one(".post-title, h1, h2.entry-title, title")
    body_node = soup.select_one(".post-body, .entry-content, article")
    title = title_node.get_text(" ", strip=True) if title_node else url
    content_text = clean_text(str(body_node if body_node else soup.body or soup))
    labels = [
        a.get_text(" ", strip=True)
        for a in soup.select('a[rel="tag"], .post-labels a, .labels a')
        if a.get_text(" ", strip=True)
    ]
    published = ""
    updated = ""
    time_node = soup.select_one("time[datetime], abbr.published[title], abbr.updated[title]")
    if time_node:
        published = time_node.get("datetime") or time_node.get("title") or ""
        updated = published
    parsed = urlparse(url)

    return {
        "index": index,
        "id": url,
        "title": title,
        "url": url,
        "domain": parsed.netloc,
        "published": published,
        "updated": updated,
        "labels": list(dict.fromkeys(labels)),
        "snippet": short_snippet(content_text),
        "keywords": keyword_hits(f"{title}\n{content_text}\n{' '.join(labels)}"),
        "word_count_estimate": len(re.findall(r"\S+", content_text)),
    }


def write_markdown(post: dict[str, Any]) -> None:
    filename = f"{post['index']:03d}-{safe_slug(post['title'])}.md"
    md_text = [
        f"# {post['title']}",
        "",
        f"URL: {post['url']}",
        f"Published: {post['published']}",
        f"Updated: {post['updated']}",
        f"Labels: {', '.join(post['labels'])}",
        f"Keywords: {', '.join(post['keywords'])}",
        "",
        "> Research index only. Open the source URL for the original article.",
        "",
        "## Snippet",
        "",
        post["snippet"],
        "",
    ]
    (MD / filename).write_text("\n".join(md_text), encoding="utf-8")


def discover_post_urls_from_sitemap() -> list[str]:
    response = requests.get(SITEMAP, headers=HEADERS, timeout=30)
    response.raise_for_status()
    root = ET.fromstring(response.text)
    urls: list[str] = []
    for loc in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        url = (loc.text or "").strip()
        if re.search(r"/20\d\d/\d\d/.+\.html$", url):
            urls.append(url)
    return list(dict.fromkeys(urls))


def fetch_posts_from_sitemap() -> list[dict[str, Any]]:
    urls = discover_post_urls_from_sitemap()
    print(f"Feed disabled; sitemap discovered {len(urls)} post URLs")
    posts: list[dict[str, Any]] = []
    for url in urls:
        print(f"Fetching {len(posts) + 1}/{len(urls)}: {url}")
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        post = normalize_page(url, response.text, len(posts) + 1)
        posts.append(post)
        write_markdown(post)
        time.sleep(0.35)
    return posts


def fetch_posts() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    MD.mkdir(parents=True, exist_ok=True)

    all_posts: list[dict[str, Any]] = []
    start = 1
    batch = 100

    try:
        while True:
            params = {
                "alt": "json",
                "max-results": batch,
                "start-index": start,
            }

            print(f"Fetching posts {start}...")
            response = requests.get(FEED, params=params, headers=HEADERS, timeout=30)
            if response.status_code == 404:
                all_posts = fetch_posts_from_sitemap()
                break
            response.raise_for_status()

            data = response.json()
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                break

            for entry in entries:
                post = normalize_post(entry, len(all_posts) + 1)
                all_posts.append(post)
                write_markdown(post)

            if len(entries) < batch:
                break

            start += batch
            time.sleep(1.5)
    except requests.HTTPError:
        if not all_posts:
            all_posts = fetch_posts_from_sitemap()
        else:
            raise

    jsonl = RAW / "posts_index.jsonl"
    with jsonl.open("w", encoding="utf-8") as file:
        for post in all_posts:
            file.write(json.dumps(post, ensure_ascii=False) + "\n")

    keyword_index: dict[str, list[dict[str, str]]] = {}
    for post in all_posts:
        for keyword in post["keywords"]:
            keyword_index.setdefault(keyword, []).append({
                "title": post["title"],
                "url": post["url"],
            })

    (OUT / "keyword_index.json").write_text(
        json.dumps(keyword_index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    manifest = {
        "source": BASE,
        "post_count": len(all_posts),
        "note": "Research-safe index only. Full copyrighted post bodies are not archived.",
        "outputs": {
            "jsonl": str(jsonl),
            "markdown_dir": str(MD),
            "keyword_index": str(OUT / "keyword_index.json"),
        },
    }

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"\nDONE: indexed {len(all_posts)} posts")
    print(f"JSONL: {jsonl}")
    print(f"Markdown: {MD}")
    print(f"Keyword index: {OUT / 'keyword_index.json'}")
    print(f"Manifest: {OUT / 'manifest.json'}")


if __name__ == "__main__":
    fetch_posts()
