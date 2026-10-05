# Dashboard hydration mismatch

## Cause and fixes

The dashboard header formatted `new Date()` during render and relied on each machine's default timezone. The server container and browser can use different timezones, so the server-rendered date text could differ from the first client render.

The header now starts with a stable empty value, then formats the clock after the client mounts using the explicit `Asia/Bangkok` timezone. It refreshes once per minute and clears its timer when the header unmounts.

The reported `/login` warning was specifically caused by the Kantu browser extension adding `data-kantu="1"` to the root `<html>` element before hydration. The root layout now uses `suppressHydrationWarning` on `<html>` only, so React ignores that extension-added root attribute without suppressing warnings in the page tree.

## Verification

- Frontend typecheck passed.
- Frontend production build passed.
