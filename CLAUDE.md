# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An extracted Angular feature module — a WYSIWYG HTML editor (`HtmlEditorModule`) — **not a standalone Angular workspace**. There is no `package.json`, `angular.json`, `node_modules`, or test runner config in this directory, so build/lint/test commands cannot be run from here. The module is designed to be dropped into a host Angular application; all tooling commands (`ng build`, `ng test`, etc.) must be run from that host app's root.

Expected host-app dependencies (imports that resolve only inside the host):
- `SharedMaterialModule` from `src/app/shared-module/shared/shared.module` (host-app path)
- `@angular/material` (MatDialog), `@angular/forms`, `@angular/router`
- `interactjs`, `moment`

## Architecture

`module/html-editor.module.ts` declares all components/pipes and exports only `HtmlEditorComponent` (`app-html-editor`) — the single public entry point.

### HtmlEditorComponent (components/html-editor/) — the core

A ~5300-line monolithic component. Key design facts that shape any change here:

- **Form integration**: implements `ControlValueAccessor` (registered via `NG_VALUE_ACCESSOR` provider), so the editor is used through `ngModel`/reactive forms. `content` holds the HTML string; `writeValue` sets it and immediately re-propagates.
- **Editing model is DOM-first, not Angular-first.** The editable area is a tree of nested `contenteditable` divs. Text formatting is done via `document.execCommand` — much of it invoked from raw inline `onclick` attributes in `html-editor.component.html`, completely bypassing Angular change detection. Component state (e.g. `currentColour`, `blockAddRow`, selection indices) mirrors what's in the DOM; the source of truth is the DOM itself.
- **Structural content is built from HTML template strings.** Tables, multi-column layouts (`generatecol6`, `generateTable`), headers/footers (`generateHeaderFooter`), images, and YouTube embeds are assembled as string literals in the TS and inserted with `document.execCommand('insertHTML')`. Inserted elements get generated ids (`table_resize_<id>`, `imgContainerId-<id>`, `actions-<id>`); later manipulation finds them via `document.getElementById`-style lookups (`findHTMLElementById`, `checkTableId`, etc.). Editing any generated HTML string usually requires updating the matching finder/handler methods and the SCSS class names.
- **interactjs** powers drag/resize of images, videos, and table columns (`setInteract`, `resizableGrid`, `setResize`).
- **Template variables ("chips")**: `fieldsList` defines draggable field chips (`f__company`, `f__time`, `f__email`, …) inserted as `<span header-var="...">` / `<span template-var="...">` markers, later filled by `setInfoInChips`. `moment` is used for date/time chips.
- **Page emulation**: `paperFormatList` (A4/A3, portrait/landscape) sizes the editing surface like a printed page, with header/footer regions marked by `.header-marker`/`.footer-marker` elements.
- **`ViewEncapsulation.None`**: the 2100-line SCSS is global by design — it must style DOM that is created at runtime via `insertHTML`, which Angular's scoped styles wouldn't reach. Class names in TS template strings and in the SCSS must stay in sync.

### Supporting pieces

- `HtmlEditorDialogComponent` — small dialog (opened via `MatDialog`) for entering an image URL; emits result through `buttonClick`.
- `PreviewComponent` — renders the current HTML (`@Input content`) through `SafeHtmlPipe`; `@Output closePrev` closes it.
- `SafeHtmlPipe` (pipes/safe-html.pipe.ts) — `DomSanitizer.bypassSecurityTrustHtml`. Editor content is rendered unsanitized; treat any change to content sources with that in mind.

### Testing note

The `.spec.ts` files are untouched CLI scaffolds; there is no runnable test setup in this directory.
