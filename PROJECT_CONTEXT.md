# SSUI Framework Project Context

Last updated: 2026-02-15

## Project Overview
- Name: SSUI Framework
- Type: reusable CSS/JS UI framework with a comprehensive interactive demo
- Root: `/Users/craigbeck/Documents/DevOps/SSUI Framework`

## Primary Files
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/tokens.css`
  - Dark theme design tokens.
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/tokens.light.css`
  - Light theme design tokens.
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/components.css`
  - Component styles.
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/components.js`
  - Behavior layer, event delegation, public `SSUI` APIs.
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/demo.html`
  - Interactive showcase and example integrations.
- `/Users/craigbeck/Documents/DevOps/SSUI Framework/README.md`
  - Project readme.

## Current Naming State (Important)
- Advanced data table component uses **dataTable** naming.
- There are no remaining `data-ss-table2` references in the project.
- Primary selectors/classes:
  - `data-ss-data-table`
  - `data-ss-data-table-search`
  - `data-ss-data-table-mode`
  - `data-ss-data-table-endpoint`
  - `.ss-data-table-tools`
  - `.ss-data-table-bulk`
  - `.ss-data-table-actions`

## Implemented Component Areas
- Foundation:
  - Header/footer/navigation
  - Hero/flow sections
  - Cards/stats/highlights
  - Tabs and base tables
  - Forms (validation + upload)
  - Modals and progress components
- Layout primitives:
  - container, section, stack, cluster, grid, surface card
- Feedback/state:
  - alerts, toasts, empty states, skeletons
- Accessibility:
  - focus-visible styles
  - reduced-motion support
  - ARIA state wiring for tabs/flows/sortable headers/row actions
  - keyboard activation support
  - validation ARIA (`aria-invalid`, `aria-describedby`)
- Transfer list:
  - available/selected dual list
  - move selected/all both directions
  - search on both sides
  - required validation + selected values submitted
- Overlay/interaction:
  - drawer
  - popover
  - tooltip
  - command palette
- Input/workflow:
  - date/time row
  - combobox with tags + creatable entries
  - stepper/wizard
- Data table:
  - search
  - column visibility toggles
  - row selection + select-all
  - row icon actions (edit/delete)
  - bulk action menu for selected rows
  - pagination + page size
  - column sorting
  - client and server pagination modes
- Added navigation/content patterns:
  - breadcrumbs
  - accordion (animated)

## DataTable Behavior Summary
- Both the scrollable “standard table” demo section and the advanced data table section are wired to `data-ss-data-table` pagination behavior.
- Default page size is `20`.
- Page size options in demo: `20, 50, 100, 200, 500`.
- Sorting, searching, page-size changes, and page navigation route through a unified refresh path.

## Server-Side Pagination Support
- Mode options:
  - `client` (default)
  - `server`
- Endpoint mode:
  - Add `data-ss-data-table-mode="server"`
  - Optional `data-ss-data-table-endpoint="/api/..."`
- Provider mode:
  - `SSUI.setDataTableServerProvider(tableWrap, providerFn)`
  - Optional global fallback provider: `SSUI.dataTableServerProvider`
- Provider params:
  - `page`, `pageSize`, `query`, `sortIndex`, `sortDir`, `sortType`, `wrap`
- Expected provider return:
  - `{ rows, total }` or `{ rowsHtml, total }`
  - `rows` can be string HTML or array.
- Error hook:
  - `SSUI.onDataTableError({ wrap, error, ...params })`

## Theme + Header Controls
- Theme APIs:
  - `SSUI.setTheme('dark'|'light')`
  - `SSUI.getTheme()`
- Header fixed API:
  - `SSUI.setHeaderFixed(headerEl, isFixed)`
- Demo includes toggles for both.

## Modal Layering + Confirm API
- Modal z-index is above fixed header.
- Reusable confirm helper:
  - `SSUI.confirm(options) -> Promise<boolean>`
- Supports label variants (yes/no, ok/cancel, continue/deny).
- Backdrop/close/Escape resolve `false`.

## Navigation
- Parent + submenu groups in header.
- Click open/close, outside click close, Escape close.
- Mobile submenu layout adjustments included.

## Accordion + Breadcrumbs Notes
- Accordion has animated open/close transitions.
- Breadcrumb spacing adjusted so it is not flush against following content.

## Alert Animation
- Warning and error alerts include pulsing glow animation.

## Key Runtime Hooks
- `SSUI.onRowAction({ row, action, value })`
- `SSUI.onTableRowAction({ action, rowId, row, button })`
- `SSUI.onTableBulkAction({ action, rows, rowIds, tableWrap })`
- `SSUI.onDataTableError({ wrap, error, ...params })`
- `SSUI.onFormSuccess(form)`
- `SSUI.onFormError(form, err)`

## Key Public APIs
- Progress/Button:
  - `SSUI.setProgress(el, value)`
  - `SSUI.setButtonLoading(btn, isLoading, label?)`
- Alerts/Toasts:
  - `SSUI.setAlert(el, options)`
  - `SSUI.showToast(options|string)`
  - `SSUI.clearToasts()`
- State helpers:
  - `SSUI.setEmptyState(container, isEmpty)`
  - `SSUI.setSkeletonLoading(container, isLoading)`
- Transfer list:
  - `SSUI.getTransferValues(container)`
  - `SSUI.setTransferValues(container, values)`
- DataTable:
  - `SSUI.setDataTableServerProvider(tableWrap, provider)`
  - `SSUI.setDataTableMode(tableWrap, mode)`
  - `SSUI.refreshDataTable(tableWrap)`
  - `SSUI.getDataTableParams(tableWrap)`
  - `SSUI.getTableSelectedRows(tableWrap)`
- Overlay/utilities:
  - `SSUI.openDrawer(id)` / `SSUI.closeDrawer(drawerEl)`
  - `SSUI.openCommandPalette()` / `SSUI.closeCommandPalette()`
  - `SSUI.confirm(options)`
  - `SSUI.ajax(url, options)`

## Demo Notes
- Demo includes live examples for:
  - nav submenu, breadcrumbs, accordion
  - transfer list
  - overlays and command palette
  - data table single-row and bulk actions
  - confirm modal
  - theme switching
  - fixed header behavior

## Suggested Next Steps
- Add per-component docs blocks in demo (attrs + events + API usage).
- Add optional compatibility aliases only if external consumers still use legacy names.
- Add lightweight regression checks for:
  - DataTable server mode
  - transfer list
  - confirm modal
  - fixed header + modal stacking
