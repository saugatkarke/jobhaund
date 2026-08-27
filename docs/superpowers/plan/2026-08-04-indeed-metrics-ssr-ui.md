# Indeed SSR Metrics UI Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans / implement inline. Checkbox steps track progress.

**Goal:** Parse `viewJobSSRData` and show Published + interested chips under card `h3.jobTitle` and detail `h2.jobsearch-JobInfoHeader-title`.

**Architecture:** MAIN inject reads live SSR → isolated content caches by jk → metricsRow inserts after titles; MutationObserver refreshes.

**Tech Stack:** Vanilla JS MV3, no build

## Global Constraints

- Interested = `job.jobStats.organicApplyStarts`
- Published display prefers `hiringInsightsModel.age`, else formatted `datePublished`
- No GraphQL/XHR intercept
- Brand: `#20FC8F`, `#000000`, `#FDB833`

---

### Task 1: Parser + inject + UI + wire-up

**Files:**
- Create: `shared/parseViewJob.js`, `content/inject.js`, `content/ui/styles.js`, `content/ui/metricsRow.js`
- Modify: `content/content.js`, `manifest.json`
- Test: parse `viewsource.js` fixture via node/python

Implement per `docs/superpowers/specs/2026-08-04-indeed-metrics-ssr-ui-design.md`.
