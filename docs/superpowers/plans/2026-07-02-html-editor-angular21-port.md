# HTML Editor → Angular 21 Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Портировать WYSIWYG-модуль html-editor с Angular 14 на Angular 21 (standalone + signals) и обернуть в одностраничную демку для портфолио.

**Architecture:** Порт по слоям: сначала рабочая компиляция старого кода в новом workspace (Проход 0), затем модернизация проходами (standalone → шаблон → signals), после каждого прохода приложение работает. Ядро редактирования (`contenteditable` + `document.execCommand` + генерация HTML-строк + interactjs) не рефакторится.

**Tech Stack:** Angular 21 (standalone, zone.js — НЕ zoneless), Angular Material 21 (M3, тема azure-blue), interactjs ^1.10, TypeScript strict.

**Спека:** `docs/superpowers/specs/2026-07-02-html-editor-modernization-design.md`

## Global Constraints

- **git commit / push / merge НИКОГДА не выполняет агент** — в конце каждой задачи остановиться и предложить пользователю сообщение коммита (глобальное правило пользователя).
- **Ядро не трогаем**: методы генерации HTML-строк, работу с Selection/Range, interactjs-логику не рефакторить. Единственное разрешённое исключение — багфикс `writeValue` (Task 3).
- **zone.js обязателен**: `ng new` с `--zoneless=false`; никаких миграций на zoneless.
- Портированные файлы сохраняют имена `*.component.ts|html|scss`, `safe-html.pipe.ts`. Новые файлы демки — в стиле Angular 21 (`app.ts`, `app.html`).
- В портированном коде разрешён явный `any` и `!` (definite assignment) — цель компиляция, не типобезопасность ядра.
- Классы CSS в TS-шаблонных строках и глобальном SCSS должны оставаться синхронными — имена классов не переименовывать.
- Тексты демо-UI — на английском.
- Рабочая директория: `d:\Work\angular\portfolio\html-editor` (далее — корень). Команды shell — Git Bash.
- Dev-сервер: `npm start` → http://localhost:4200. Браузерная проверка — через Playwright MCP.

## Полный чек-лист верификации (из спеки)

Прогоняется в браузере (Playwright) там, где задача этого требует:

1. Набор текста; bold / italic / underline / цвет шрифта и фона.
2. Вставка таблицы через конструктор (кнопка Table → выбор клеток) + ресайз колонок мышью.
3. Layout-колонки (кнопка Page Separation).
4. Вставка картинки по URL (кнопка Upload image → диалог) + ресайз.
5. Chips-поля (Company, DateTime, Email…) перетаскиванием из правой панели.
6. Header/footer (кнопки Header/Footer Document) с чипами даты.
7. Preview (кнопка Show Preview) и возврат из него.
8. Формат A4 по умолчанию: ширина листа 21cm.

---

### Task 1: Angular 21 workspace + зависимости

**Files:**
- Create: весь каркас Angular 21 в корне (`package.json`, `angular.json`, `tsconfig*.json`, `src/**`)
- Create: `legacy/` (переезд старых `components/`, `module/`, `pipes/`)
- Modify: `src/index.html` (шрифты и иконки)

**Interfaces:**
- Consumes: —
- Produces: рабочий workspace; `npm start` поднимает дефолтную страницу; в `package.json` есть `@angular/material` 21.x и `interactjs` 1.10.x.

- [ ] **Step 1: Переместить старый код в `legacy/`**

```bash
cd /d/Work/angular/portfolio/html-editor
mkdir -p legacy
mv components module pipes legacy/
```

Ожидаемо: в корне остались `legacy/`, `docs/`, `CLAUDE.md`, `.serena/`.

- [ ] **Step 2: Сгенерировать workspace во временную папку и слить в корень**

`ng new` не умеет надёжно генерировать в непустую папку, поэтому генерируем рядом и переносим:

```bash
cd /d/Work/angular/portfolio
npx -y @angular/cli@21 new html-editor --directory html-editor-scaffold \
  --style=scss --routing=false --ssr=false --zoneless=false \
  --skip-git --package-manager=npm
cp -r html-editor-scaffold/. html-editor/
rm -rf html-editor-scaffold
```

Ожидаемо: в корне появились `package.json` (name: `html-editor`), `angular.json`, `src/`, `node_modules/`. Флаг `--zoneless=false` обязателен (Global Constraints).

- [ ] **Step 3: Проверить, что каркас запускается**

```bash
cd /d/Work/angular/portfolio/html-editor
npm start
```

Ожидаемо: `Application bundle generation complete` и страница на http://localhost:4200 (проверить через Playwright: заголовок содержит «HtmlEditor» или дефолтный шаблон Angular). Остановить сервер после проверки не нужно — пригодится дальше.

- [ ] **Step 4: Добавить Angular Material 21**

```bash
npx ng add @angular/material@21 --skip-confirmation
```

На интерактивные вопросы (если зададутся): тема — **Azure/Blue** (prebuilt), typography — **Yes**, animations — **Yes/Include**.

Ожидаемо: в `package.json` появились `@angular/material` и `@angular/cdk` 21.x; в `src/styles.scss` подключена тема; в `src/index.html` добавлены шрифты Roboto/иконки.

- [ ] **Step 5: Установить interactjs**

```bash
npm install interactjs@^1.10.30
```

- [ ] **Step 6: Дополнить `src/index.html` шрифтами**

Убедиться, что в `<head>` есть все три ссылки (ng add обычно добавляет только часть); привести к виду:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
```

(шаблон редактора использует и `class="material-icons"`, и `class="material-symbols-outlined"`; Manrope — дефолтный шрифт из fontFamilyList).

- [ ] **Step 7: Сборка**

```bash
npm run build
```

Ожидаемо: `Application bundle generation complete`, ошибок нет.

- [ ] **Step 8: Предложить пользователю коммит**

Остановиться и предложить: `git init` (репозитория ещё нет) и коммит
`chore: scaffold Angular 21 workspace with Material and interactjs`.
Файлы: всё, кроме `node_modules` (проверить, что сгенерированный `.gitignore` его исключает).

---

### Task 2: Проход 0 — порт кода, «компилируется и работает»

**Files:**
- Create: `src/app/editor/html-editor/html-editor.component.{ts,html,scss}` (копия из `legacy/components/html-editor/`)
- Create: `src/app/editor/html-editor-dialog/html-editor-dialog.component.{ts,html,scss}` (копия из `legacy/components/html-editor-dialog/`)
- Create: `src/app/editor/preview/preview.component.{ts,html,scss}` (копия из `legacy/components/preview/`)
- Create: `src/app/editor/safe-html.pipe.ts` (копия `legacy/pipes/safe-html.pipe.ts`)
- Create: `src/app/editor/click-outside.directive.ts`
- Create: `src/app/editor/html-editor.module.ts` (замена старого модуля, без `SharedMaterialModule`)
- Modify: `src/app/app.ts`, `src/app/app.html` (подключить редактор для проверки)
- Не копировать: `legacy/**/*.spec.ts` (заглушки; смоук-тесты появятся в Task 3)

**Interfaces:**
- Consumes: workspace из Task 1.
- Produces: `HtmlEditorModule` (экспортирует `HtmlEditorComponent`, селектор `app-html-editor`, CVA через `ngModel`); `ClickOutsideDirective` (standalone, селектор `[clickOutside]`, output `clickOutside: MouseEvent`). Task 3 удалит модуль, Task 6 перепишет `app.*`.

- [ ] **Step 1: Скопировать исходники**

```bash
cd /d/Work/angular/portfolio/html-editor
mkdir -p src/app/editor
cp -r legacy/components/html-editor src/app/editor/html-editor
cp -r legacy/components/html-editor-dialog src/app/editor/html-editor-dialog
cp -r legacy/components/preview src/app/editor/preview
cp legacy/pipes/safe-html.pipe.ts src/app/editor/safe-html.pipe.ts
rm src/app/editor/*/*.spec.ts
```

- [ ] **Step 2: Создать `src/app/editor/click-outside.directive.ts`**

Замена пакета `ng-click-outside` (шаблон использует `(clickOutside)` в 6 местах):

```ts
import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef<HTMLElement>);

  clickOutside = output<MouseEvent>();

  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.clickOutside.emit(event);
    }
  }
}
```

- [ ] **Step 3: Создать `src/app/editor/html-editor.module.ts`**

Прямые Material-импорты вместо пропавшего `SharedMaterialModule`:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { HtmlEditorDialogComponent } from './html-editor-dialog/html-editor-dialog.component';
import { PreviewComponent } from './preview/preview.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ClickOutsideDirective } from './click-outside.directive';

@NgModule({
  declarations: [
    HtmlEditorComponent,
    HtmlEditorDialogComponent,
    PreviewComponent,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClickOutsideDirective,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [HtmlEditorComponent],
})
export class HtmlEditorModule {}
```

В скопированных компонентах Angular 21 нужно явно пометить их НЕ-standalone, иначе они не могут быть в `declarations`: в декораторы `@Component` всех трёх компонентов и `@Pipe` пайпа добавить `standalone: false`.

- [ ] **Step 4: Починить импорты в `html-editor.component.ts`**

- Путь импорта диалога уже относительный (`../html-editor-dialog/...`) — работает.
- Удалить `import * as moment from 'moment';`
- Удалить `import { ActivatedRoute } from '@angular/router';` пока НЕ надо (удаление роутера — Task 3); но `@angular/router` входит в Angular-пакеты и без `--routing` — импорт скомпилируется.

- [ ] **Step 5: Заменить moment на хелперы**

В `html-editor.component.ts` добавить два приватных метода (например, после конструктора):

```ts
private formatDate(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

private formatTime(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
```

В `setInfoInChips` заменить три строки (поведение сохранить точь-в-точь, включая «перепутанные» имена кейсов):

| Было | Стало |
|---|---|
| `innerText = moment().format('DD.MM.YYYY');` (case `header_dateTime`) | `innerText = this.formatDate();` |
| `innerText = moment().format('HH:mm');` (case `header_date`) | `innerText = this.formatTime();` |
| `innerText = moment().format('DD.MM.YYYY HH:mm');` (case `f__time`) | `innerText = this.formatDate() + ' ' + this.formatTime();` |

- [ ] **Step 6: Первая компиляция и механическая починка strict-ошибок**

```bash
npm run build 2>&1 | head -100
```

Будет пачка ошибок strict-режима. Чинить ТОЛЬКО механически, без изменения поведения:

| Ошибка | Исправление |
|---|---|
| `Property '...' has no initializer` (TS2564) | добавить `!` к полю: `editableContainer!: ElementRef` |
| `Parameter '...' implicitly has an 'any' type` (TS7006) | явно указать `: any` |
| `Object is possibly 'null'/'undefined'` (TS2531/2532/18047) | добавить `!` в месте обращения либо `?.` там, где значение реально может отсутствовать и код это уже учитывал |
| `Element implicitly has an 'any' type` (TS7053, индексация) | привести к `any`: `(obj as any)[key]` |
| `'this' implicitly has type 'any'` (TS2683) в `function`-колбэках | объявить параметр `this: any` у функции: `function (this: any, ...)` |
| `Type 'string \| null' is not assignable...` | `?? ''` или `as string` — по контексту, поведение не менять |

Повторять `npm run build` до чистой сборки. `document.execCommand` даёт deprecation-предупреждение в IDE, но это не ошибка компиляции — не трогать.

- [ ] **Step 7: Подключить редактор в приложение для проверки**

`src/app/app.ts`:

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HtmlEditorModule } from './editor/html-editor.module';

@Component({
  selector: 'app-root',
  imports: [FormsModule, HtmlEditorModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  content = '<p>Hello from the ported editor</p>';
}
```

`src/app/app.html` (полностью заменить содержимое):

```html
<app-html-editor [(ngModel)]="content"></app-html-editor>
```

- [ ] **Step 8: Сборка и браузерная проверка**

```bash
npm run build && npm start
```

Ожидаемо: сборка чистая. В браузере (Playwright, http://localhost:4200):
1. Тулбар редактора отрисован, иконки видны (не текст-заглушки).
2. Кликнуть в лист, набрать текст — печатается.
3. Кнопка Table → выбрать 2×2 → таблица вставилась.
4. Чек-лист п.1 (bold/italic) работает.

Известный допустимый дефект на этом проходе: стили диалога Upload image могут выглядеть криво (Material 13→21) — фиксится ниже, в Step 9.

- [ ] **Step 9: Точечно поправить SCSS диалога под Material 21**

Открыть диалог Upload image в браузере. Если поля/кнопки выглядят сломанно, поправить `src/app/editor/html-editor-dialog/html-editor-dialog.component.scss`, при необходимости добавив в разметку `mat-form-field` атрибут `appearance="outline"`. Менять только стили диалога, не глобальные.

Ожидаемо: диалог с полем URL и кнопками Cancel/Save выглядит аккуратно.

- [ ] **Step 10: Предложить пользователю коммит**

`feat: port html-editor module from Angular 14 (compiles and runs on Angular 21)`

---

### Task 3: Проход 1 — standalone, inject(), чистка, смоук-тесты

**Files:**
- Delete: `src/app/editor/html-editor.module.ts`
- Modify: `src/app/editor/html-editor/html-editor.component.ts`
- Modify: `src/app/editor/html-editor-dialog/html-editor-dialog.component.ts`
- Modify: `src/app/editor/preview/preview.component.ts`
- Modify: `src/app/editor/safe-html.pipe.ts`
- Modify: `src/app/app.ts`
- Test: `src/app/editor/html-editor/html-editor.component.spec.ts` (создать)

**Interfaces:**
- Consumes: `HtmlEditorModule` из Task 2 (удаляется здесь).
- Produces: standalone `HtmlEditorComponent` — импортируется напрямую: `imports: [FormsModule, HtmlEditorComponent]`. Публичный контракт (`app-html-editor`, `ngModel`) не меняется.

- [ ] **Step 1: Пайп и диалог → standalone**

`safe-html.pipe.ts`: убрать `standalone: false`.

`html-editor-dialog.component.ts`: убрать `standalone: false`, добавить импорты:

```ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-html-editor-dialog',
  templateUrl: './html-editor-dialog.component.html',
  styleUrls: ['./html-editor-dialog.component.scss'],
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
})
```

Заодно удалить пустой `ngOnInit` и `implements OnInit`, пустой `constructor() { }`.

- [ ] **Step 2: Preview → standalone**

`preview.component.ts`: убрать `standalone: false`, добавить `imports: [SafeHtmlPipe]` (с импортом `import { SafeHtmlPipe } from '../safe-html.pipe';`). Удалить пустые `ngOnInit`/`constructor`, если они пустые.

- [ ] **Step 3: Редактор → standalone + inject()**

`html-editor.component.ts`:

1. Убрать `standalone: false`; в `@Component` добавить:

```ts
imports: [
  CommonModule,
  MatButtonModule,
  ClickOutsideDirective,
  PreviewComponent,
],
```

с соответствующими import-строками (`CommonModule` из `@angular/common`, `MatButtonModule` из `@angular/material/button`, `ClickOutsideDirective` из `../click-outside.directive`, `PreviewComponent` из `../preview/preview.component`).

2. Конструктор заменить на `inject()`:

```ts
private chRef = inject(ChangeDetectorRef);
private dialog = inject(MatDialog);
```

(добавить `inject` в импорт из `@angular/core`). Удалить `ActivatedRoute` полностью: поле `route`, import, и первую строку `ngOnInit`:
`this.route.queryParams.subscribe((routeParams) => {});` — мёртвый код.

3. Багфикс CVA (разрешённое исключение из «ядро не трогаем»): `writeValue` не должен вызывать `propagateChange`:

```ts
writeValue(value: any) {
  this.content = value ?? '';
}
```

- [ ] **Step 4: Удалить модуль, обновить app**

```bash
rm src/app/editor/html-editor.module.ts
```

`src/app/app.ts`: заменить импорт:

```ts
import { HtmlEditorComponent } from './editor/html-editor/html-editor.component';
```

и в `imports: [FormsModule, HtmlEditorComponent]`.

- [ ] **Step 5: Сборка**

```bash
npm run build
```

Ожидаемо: чисто. Если компилятор укажет на неиспользуемые импорты в standalone-компонентах — убрать названные.

- [ ] **Step 6: Написать смоук-тест**

`src/app/editor/html-editor/html-editor.component.spec.ts`:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlEditorComponent } from './html-editor.component';

describe('HtmlEditorComponent', () => {
  let fixture: ComponentFixture<HtmlEditorComponent>;
  let component: HtmlEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the editor', () => {
    expect(component).toBeTruthy();
  });

  it('writeValue stores the value without emitting', () => {
    let emitted: unknown;
    component.registerOnChange((v: unknown) => (emitted = v));
    component.writeValue('<p>Hi</p>');
    expect(component.content).toBe('<p>Hi</p>');
    expect(emitted).toBeUndefined();
  });

  it('writeValue(null) resets to empty string', () => {
    component.writeValue(null);
    expect(component.content).toBe('');
  });
});
```

- [ ] **Step 7: Прогнать тесты**

```bash
npm test -- --watch=false
```

(если сгенерированный раннер — vitest и флаг не принимается, то `npm test -- --run`).
Ожидаемо: 3 passed. Если `beforeEach` падает на `route`/`dialog` — значит Step 3 не завершён.

- [ ] **Step 8: Браузерная проверка**

`npm start`, чек-лист пп. 1, 2, 4, 7 (текст+форматирование, таблица, диалог картинки, preview). Диалог и preview затронуты этой задачей — проверить обязательно.

- [ ] **Step 9: Предложить пользователю коммит**

`refactor: migrate editor to standalone components and inject(), fix CVA writeValue`

---

### Task 4: Проход 2 — control flow и вынос execCommand из шаблона

**Files:**
- Modify: `src/app/editor/html-editor/html-editor.component.html`
- Modify: `src/app/editor/html-editor/html-editor.component.ts`
- Modify: `src/app/editor/preview/preview.component.html` (если миграция затронет)

**Interfaces:**
- Consumes: standalone-компоненты из Task 3.
- Produces: метод `exec(command: string, value?: string): void` на `HtmlEditorComponent` (Task 5 не меняет его сигнатуру); шаблон без `*ngIf/*ngFor/*ngSwitch` и без inline `onclick`.

- [ ] **Step 1: Официальная миграция control flow**

```bash
npx ng generate @angular/core:control-flow --path src/app/editor --format
```

Ожидаемо: `*ngIf` → `@if`, `*ngFor` → `@for` (с `track`), `[ngSwitch]` → `@switch` в шаблонах редактора. `ngClass`/`ngStyle` останутся — это нормально, `CommonModule` в imports сохранить.

- [ ] **Step 2: Сборка + быстрая проверка**

```bash
npm run build && npm start
```

В браузере: дропдауны тулбара (Normal/шрифт/размер) открываются, список Fields справа отрисован (это `@for` теперь).

- [ ] **Step 3: Добавить метод `exec` в компонент**

В `html-editor.component.ts` (рядом с `setFontSize`):

```ts
exec(command: string, value: string = '') {
  document.execCommand(command, false, value);
}
```

- [ ] **Step 4: Убрать все 11 inline `onclick` из `html-editor.component.html`**

Для каждой кнопки: удалить атрибут `onclick="..."` (и ставший ненужным `[value]`), перенести команду в существующий `(click)`. Точный список замен (номера строк — по состоянию до миграции Step 1, ориентироваться на содержимое):

| Кнопка (было `onclick`) | Новый `(click)` целиком |
|---|---|
| formatBlock (дропдаун Normal/H1…) | `(click)="showParagraphFormat = false; selectedParagraphFormat = format; exec('removeFormat'); exec('formatBlock', format.tag)"` |
| bold | `(click)="currentFontWeight = !currentFontWeight; exec('bold')"` |
| italic | `(click)="currentItalic = !currentItalic; exec('italic')"` |
| underline | `(click)="currentUnderLine = !currentUnderLine; exec('underline')"` |
| strikeThrough | `(click)="currentStrikeThrough = !currentStrikeThrough; exec('strikeThrough')"` |
| fontName (дропдаун шрифтов) | `(click)="showDrbFontFamily = false; selectedFontFamily = font; exec('fontName', font.value)"` |
| justifyLeft | `(click)="currentJustifyLeft = !currentJustifyLeft; currentJustifyCenter = false; currentJustifyRight = false; exec('justifyLeft')"` |
| justifyCenter | `(click)="currentJustifyCenter = !currentJustifyCenter; currentJustifyRight = false; currentJustifyLeft = false; exec('justifyCenter')"` |
| justifyRight | `(click)="currentJustifyRight = !currentJustifyRight; currentJustifyLeft = false; currentJustifyCenter = false; exec('justifyRight')"` |
| foreColor (палитра Font color) | `(click)="showDrbFontColor = false; exec('foreColor', color.value)"` |
| backcolor (палитра Background color) | `(click)="showDrbBackgroundColor = false; exec('backcolor', color.value)"` |

У кнопки Ordered List два отдельных `(click)` — слить в один: `(click)="currentOrderedList = !currentOrderedList; insertList('num')"`.

Проверить, что inline-обработчиков не осталось:

```bash
grep -c "onclick=" src/app/editor/html-editor/html-editor.component.html
```

Ожидаемо: `0`.

- [ ] **Step 5: Сборка и браузерная проверка форматирования**

```bash
npm run build && npm start
```

Чек-лист п.1 полностью: выделить текст → bold, italic, underline, strike, смена шрифта, размер, цвет текста, цвет фона, все три justify, форматы H1/H2. Каждая команда должна применяться к выделению (это и была работа `onclick`; регресс здесь = ошибка в Step 4).

- [ ] **Step 6: Прогнать тесты**

```bash
npm test -- --watch=false
```

Ожидаемо: 3 passed (тесты Task 3 не затронуты).

- [ ] **Step 7: Предложить пользователю коммит**

`refactor: migrate editor templates to control flow, move execCommand calls out of inline onclick`

---

### Task 5: Проход 3 — signals в тулбаре, input()/output()

**Files:**
- Modify: `src/app/editor/html-editor/html-editor.component.ts`
- Modify: `src/app/editor/html-editor/html-editor.component.html`
- Modify: `src/app/editor/preview/preview.component.ts`
- Modify: `src/app/editor/html-editor-dialog/html-editor-dialog.component.ts`
- Modify: `src/app/editor/html-editor/html-editor.component.spec.ts` (если сломается компиляция теста)

**Interfaces:**
- Consumes: `exec()` и standalone-структуру из Task 3–4.
- Produces: сигнальные поля тулбара (список ниже); `PreviewComponent.content: InputSignal<string>`, `closePrev: OutputEmitterRef<void>`; `HtmlEditorDialogComponent.buttonClick: OutputEmitterRef<string>`. Внешний контракт `app-html-editor` не меняется.

- [ ] **Step 1: Перевести UI-поля тулбара на signals**

В `html-editor.component.ts` заменить объявления РОВНО этих полей (ядро — `selectedTable`, `selectedCells`, `selectedItem`, `selectedTableId`, `selectedLayoutId`, `blockAdd*` и прочее — НЕ трогать):

```ts
previewState = signal(false);
showParagraphFormat = signal(false);
showDrbFontFamily = signal(false);
showDrbFontSize = signal(false);
showDrbFontColor = signal(false);
showDrbBackgroundColor = signal(false);
showTableConstructor = signal(false);
showLayoutDrb = signal(false);
currentFontWeight = signal(false);
currentItalic = signal(false);
currentUnderLine = signal(false);
currentStrikeThrough = signal(false);
currentOrderedList = signal(false);
currentUnorderedList = signal(false);
currentJustifyLeft = signal(false);
currentJustifyCenter = signal(false);
currentJustifyRight = signal(false);
currentColour = signal('');
currentBackColour = signal('');
selectedParagraphFormat = signal<any>(null);
selectedFontFamily = signal<any>(null);
selectedFontSize = signal<any>(null);
selectedPaperFormat = signal(this.paperFormatList[0]);
cropFormat = signal<'portrait' | 'landscape'>('portrait');
```

(`signal` добавить в импорт из `@angular/core`; `paperFormatList` должен быть объявлен ВЫШЕ `selectedPaperFormat`).

- [ ] **Step 2: Починить все обращения по ошибкам компилятора**

```bash
npm run build 2>&1 | head -60
```

Компилятор укажет каждое чтение/запись. Правило замены — механическое:

| Было | Стало |
|---|---|
| чтение `this.showX` / `showX` в шаблоне | `this.showX()` / `showX()` |
| `this.showX = v` / `showX = v` в шаблоне | `.set(v)` |
| `this.showX = !this.showX` | `.update((v) => !v)` |
| `[ngStyle]="{'width': selectedPaperFormat[cropFormat] + 'cm'}"` | `[ngStyle]="{'width': selectedPaperFormat()[cropFormat()] + 'cm'}"` |

Повторять сборку до чистой. Особое внимание: обращения из `function`-колбэков через `self.` — тоже заменяются (`self.showX.set(...)`).

- [ ] **Step 3: Preview и Dialog → input()/output()**

`preview.component.ts`:

```ts
import { Component, input, output } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  imports: [SafeHtmlPipe],
})
export class PreviewComponent {
  content = input<string>('');
  closePrev = output<void>();

  back() {
    this.closePrev.emit();
  }
}
```

В `preview.component.html` заменить `[innerHTML]="content | safeHtml:true"` на `[innerHTML]="content() | safeHtml:true"`.

`html-editor-dialog.component.ts`: `@Output() buttonClick = new EventEmitter();` → `buttonClick = output<string>();` (импорт `output` из `@angular/core`, убрать `Output`/`EventEmitter`). Методы `onButtonClick`/`onButtonSave` не меняются (`emit('')` / `emit(this.imgURL)`).

В `openDialog()` редактора подписка `dialogRef.componentInstance.buttonClick.subscribe((data) => {...})` работает и с `output()` — не менять.

- [ ] **Step 4: Сборка + тесты**

```bash
npm run build && npm test -- --watch=false
```

Ожидаемо: чисто, 3 passed.

- [ ] **Step 5: Полный чек-лист в браузере**

`npm start`, прогнать ВСЕ пункты 1–8. Signals затронули каждый дропдаун и активные состояния кнопок — проверить, что: дропдауны открываются/закрываются (в т.ч. по клику мимо — это `clickOutside` + `.set(false)`), активные кнопки подсвечиваются, preview открывается и закрывается, ширина листа меняется от `selectedPaperFormat`.

- [ ] **Step 6: Предложить пользователю коммит**

`refactor: convert toolbar UI state to signals, input()/output() in preview and dialog`

---

### Task 6: Демо-обвязка (шапка + предзаполненный документ)

**Files:**
- Create: `src/app/demo-content.ts`
- Modify: `src/app/app.ts`, `src/app/app.html`, `src/app/app.scss`
- Modify: `src/index.html` (title)

**Interfaces:**
- Consumes: standalone `HtmlEditorComponent` (`[(ngModel)]`).
- Produces: финальная демо-страница; `DEMO_CONTENT: string` из `demo-content.ts`.

- [ ] **Step 1: Создать `src/app/demo-content.ts`**

```ts
export const DEMO_CONTENT = `
<h1>Project Proposal</h1>
<p>This document is created with a hand-built WYSIWYG editor. Try the toolbar above:
make text <b>bold</b>, <i>italic</i> or <u>underlined</u>, change fonts, colors and alignment.</p>
<p>Insert tables, multi-column layouts, images and headers/footers — everything is
editable right on this page. Drag the fields from the panel on the right into the
document to add dynamic chips.</p>
<h2>What to try</h2>
<p>1. Select this text and hit <b>B</b> in the toolbar.</p>
<p>2. Insert a table with the table constructor and resize its columns.</p>
<p>3. Open the preview with the eye icon in the top right corner.</p>
`;
```

- [ ] **Step 2: Переписать `src/app/app.ts`**

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HtmlEditorComponent } from './editor/html-editor/html-editor.component';
import { DEMO_CONTENT } from './demo-content';

@Component({
  selector: 'app-root',
  imports: [FormsModule, HtmlEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  content = DEMO_CONTENT;
}
```

- [ ] **Step 3: Переписать `src/app/app.html`**

```html
<header class="demo-header">
  <div class="demo-header__title">
    <h1>HTML Editor</h1>
    <p>A hand-built WYSIWYG document editor — no editor libraries under the hood.</p>
  </div>
  <ul class="demo-header__badges">
    <li>Angular 21</li>
    <li>Signals</li>
    <li>Angular Material</li>
    <li>interactjs</li>
  </ul>
  <!-- TODO(user): вставить ссылку на GitHub-репозиторий, когда он появится -->
</header>
<main class="demo-main">
  <app-html-editor [(ngModel)]="content"></app-html-editor>
</main>
```

- [ ] **Step 4: Стили `src/app/app.scss`**

```scss
:host {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;

  &__title {
    h1 {
      margin: 0;
      font-size: 1.25rem;
    }

    p {
      margin: 0.15rem 0 0;
      font-size: 0.85rem;
      color: #666;
    }
  }

  &__badges {
    display: flex;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.2rem 0.6rem;
      border-radius: 1rem;
      background: #eef2ff;
      color: #3949ab;
      font-size: 0.8rem;
    }
  }
}

.demo-main {
  flex: 1;
}
```

- [ ] **Step 5: Заголовок вкладки**

В `src/index.html` заменить `<title>` на `<title>HTML Editor — Angular WYSIWYG demo</title>`.

- [ ] **Step 6: Сборка и визуальная проверка**

```bash
npm run build && npm start
```

В браузере: шапка с бейджами, ниже редактор с предзаполненным документом (заголовок Project Proposal, списки). Сделать скриншот через Playwright — пригодится для README (сохранить в `docs/screenshot.png`).

- [ ] **Step 7: Предложить пользователю коммит**

`feat: portfolio demo page with header, badges and prefilled document`

---

### Task 7: Финализация — README, CLAUDE.md, удаление legacy

**Files:**
- Create: `README.md`
- Modify: `CLAUDE.md` (переписать под новую структуру)
- Delete: `legacy/`

**Interfaces:**
- Consumes: всё предыдущее.
- Produces: готовый к публикации репозиторий.

- [ ] **Step 1: Финальный полный чек-лист**

`npm start`, прогнать ВСЕ пункты 1–8 чек-листа. Любой регресс — чинить до перехода дальше (это Definition of Done спеки).

- [ ] **Step 2: Удалить `legacy/`**

```bash
rm -rf legacy
npm run build
```

Ожидаемо: сборка чистая (ничего не импортировало legacy).

- [ ] **Step 3: Написать `README.md`**

```markdown
# HTML Editor

A hand-built WYSIWYG document editor on Angular 21 — no editor libraries under the hood.
Originally written for a production CRM (Angular 14), then extracted and modernized
(standalone components, signals, new control flow) as a portfolio project.

![screenshot](docs/screenshot.png)

## Features

- Rich text formatting: paragraph styles, fonts, sizes, colors, alignment, lists
- Table constructor with mouse-resizable columns (interactjs)
- Multi-column page layouts, headers and footers
- Image and video embedding with drag-resize
- Draggable data chips (company, date/time, user, ...) resolved on render
- A4/A3 page emulation, live preview
- Integrates with Angular forms via `ControlValueAccessor` (`[(ngModel)]`)

## Tech notes

- The editing core is intentionally DOM-first: `contenteditable` +
  `document.execCommand`. The API is deprecated but still supported by every
  browser; replacing it with Selection/Range is out of scope of this port.
- Editor content is rendered without sanitization (`SafeHtmlPipe`) — fine for a
  demo without server-provided user data, not for production input.

## Run

npm install
npm start   # http://localhost:4200
```

- [ ] **Step 4: Переписать `CLAUDE.md`**

Обновить: структура (`src/app/editor/**`, демо в `src/app/`), команды (`npm start`, `npm run build`, `npm test -- --watch=false`), архитектурные факты из старого CLAUDE.md, которые остались верны (DOM-first ядро, execCommand — осознанно, `ViewEncapsulation.None` и синхронность классов SCSS/TS-строк, CVA), новые факты (standalone, signals в тулбаре, `exec()` — единая точка execCommand, своя `ClickOutsideDirective`). Убрать разделы про «нет workspace» и `legacy/`.

- [ ] **Step 5: Финальная сборка + тесты**

```bash
npm run build && npm test -- --watch=false
```

Ожидаемо: чисто, 3 passed.

- [ ] **Step 6: Предложить пользователю коммит**

`docs: portfolio README, updated CLAUDE.md, drop legacy sources`

---

## Соответствие спеке (self-review)

- Проход 0 → Task 1–2; Проход 1 → Task 3; Проход 2 → Task 4; Проход 3 → Task 5; демо-обвязка → Task 6; DoD (build, чек-лист, legacy удалена, README+CLAUDE.md) → Task 7.
- Отклонение от спеки: `ng-click-outside` не «удаляется без замены» — шаблон реально использует `(clickOutside)` в 6 местах, поэтому создаётся своя `ClickOutsideDirective` (Task 2, Step 2). Спека этого не предусматривала; поведение сохранено.
- Смоук-тесты из спеки — Task 3, Step 6.
- Деплой, zoneless, разбиение ядра — вне скоупа, в плане отсутствуют намеренно.
