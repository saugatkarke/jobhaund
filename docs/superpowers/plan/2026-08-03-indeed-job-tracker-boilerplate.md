# Indeed Job Tracker Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a loadable Manifest V3 Chrome skeleton for Indeed Job Tracker with branded Coming soon popup, stub content script, and PING/PONG service worker.

**Architecture:** Zero-build vanilla JS mirroring Seek folder layout (`background/`, `content/`, `popup/`, `shared/`, `icons/`). Content script runs ISOLATED on Indeed hosts; service worker routes stub messages; popup is a branded placeholder only.

**Tech Stack:** Manifest V3, vanilla JavaScript (ES2022), no npm/bundler

## Global Constraints

- Display name: `Indeed Job Tracker`
- Hosts: `au.indeed.com`, `nz.indeed.com`, `www.indeed.com`, `uk.indeed.com`, `ca.indeed.com`
- Permissions: `storage` only
- Brand: `#20FC8F`, `#000000`, `#FDB833`; font `"Roboto", system-ui, sans-serif`
- Logo file: `icons/Indeed-chrome-extension-logo-white.svg` (popup + source for PNG toolbar icons)
- No Indeed scraping/tracking in this pass
- Future extraction note: published date and interested applicants are hidden in UI; read from page `<script>` tags in source

---

### Task 1: Icons from white SVG

**Files:**
- Create: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`
- Keep: `icons/Indeed-chrome-extension-logo-white.svg`

- [x] **Step 1:** Rasterize SVG to 16/48/128 PNGs via macOS `qlmanage` + `sips`
- [x] **Step 2:** Confirm files exist under `icons/`

### Task 2: Shared constants + service worker + content stub

**Files:**
- Create: `shared/constants.js`, `background/service-worker.js`, `content/content.js`, `content/ui/.gitkeep`

- [x] **Step 1:** Add host list, brand tokens, `IJT_MESSAGE_SOURCE`, `PING`/`PONG`
- [x] **Step 2:** SW responds to `PING` with `PONG`
- [x] **Step 3:** Content script logs ready + optional ping

### Task 3: Manifest + popup + README

**Files:**
- Create: `manifest.json`, `popup/popup.html`, `popup/popup.css`, `popup/popup.js`, `README.md`

- [x] **Step 1:** MV3 manifest with Indeed matches, storage, icons, popup, SW, content scripts
- [x] **Step 2:** Branded Coming soon popup using white SVG logo
- [x] **Step 3:** README with load-unpacked steps and future script-tag extraction note

### Task 4: Verify

- [x] **Step 1:** Confirm required files exist and `manifest.json` is valid JSON
- [ ] **Step 2:** Manual: Load unpacked in Chrome, open Indeed host, open popup
