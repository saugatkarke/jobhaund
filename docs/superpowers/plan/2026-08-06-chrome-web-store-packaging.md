# Chrome Web Store Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a CWS-ready 1.0.0 Chrome zip with root-level manifest and minimum justified permissions.

**Architecture:** Keep the zero-build MV3 layout; fix `package.sh` Chrome zip nesting; trim unused `host_permissions`; add `minimum_chrome_version` and short developer CWS notes.

**Tech Stack:** Manifest V3, bash `package.sh`, vanilla JS (unchanged runtime behavior)

## Global Constraints

- Version stays `1.0.0` unless the owner explicitly asks to bump
- No Firefox/AMO work in this plan beyond not breaking `package.sh firefox`
- No privacy policy HTML / external listing assets
- Do not commit unless the owner asks

---

### Task 1: Manifest permissions + Chrome floor

**Files:**
- Modify: `manifest.json`

- [x] **Step 1: Update manifest**

Remove the entire `host_permissions` array. Add `"minimum_chrome_version": "111"` after `description`. Keep `storage`, `clipboardWrite`, content script matches, and `web_accessible_resources` unchanged. Keep `"version": "1.0.0"`.

- [x] **Step 2: Sanity-check JSON**

Run: `python3 -c 'import json; json.load(open("manifest.json")); print(json.load(open("manifest.json"))["version"], "host_permissions" in json.load(open("manifest.json")))'`

Expected: `1.0.0 False`

---

### Task 2: Fix Chrome zip root layout

**Files:**
- Modify: `package.sh`

- [x] **Step 1: Change Chrome zip branch**

Replace the Chrome zip block so it zips stage contents at root (same idea as Firefox):

```bash
else
  (
    cd "$STAGE"
    zip -r "${ROOT}/${ZIP}" . >/dev/null
  )
fi
```

Leave the Firefox branch and Firefox manifest transform unchanged.

- [x] **Step 2: Build and verify**

Run: `./package.sh && unzip -l dist/indeed-job-tracker-1.0.0.zip | head -25`

Expected: first files include `manifest.json` (not `indeed-job-tracker-1.0.0/manifest.json`).

---

### Task 3: Docs

**Files:**
- Create: `docs/store/chrome-cws-notes.md`
- Modify: `README.md`

- [x] **Step 1: Write CWS notes** with permission justifications for the developer dashboard (storage, clipboardWrite, host access via content_scripts only, data stays local/sync, no remote analytics).

- [x] **Step 2: Update README Package section** to state Chrome zip is CWS-ready (manifest at zip root) and Firefox packaging is deferred.
