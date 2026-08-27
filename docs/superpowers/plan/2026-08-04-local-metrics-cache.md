# Local Metrics Cache — Implementation Plan

> Spec: `docs/superpowers/specs/2026-08-04-local-metrics-cache-design.md`

## Files

| File | Change |
|---|---|
| `shared/constants.js` | Storage key, MSG types, TTL/LRU constants |
| `shared/storage.js` | Local metrics cache get/upsert/evict |
| `background/service-worker.js` | Message handlers |
| `content/content.js` | Hydrate → paint; fill-only passive; force on open job; persist |
| `content/ui/detailActions.js` | Save published fields; seed cache on save |

## Behavior

1. Hydrate memory cache from `local` before first paint.
2. Passive ingest: insert new jks / fill nulls only (no overwrite).
3. Open-job SSR: force overwrite + persist; patch tracked sync if saved.
4. Evict untracked: 60d TTL + LRU 750; tracked pinned.
