import {
  Component,
  OnInit,
  AfterViewInit,
  forwardRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import interact from 'interactjs';
import { MatDialog } from '@angular/material/dialog';
import { HtmlEditorDialogComponent } from '../html-editor-dialog/html-editor-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlEditorComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HtmlEditorComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  content: string = '';
  previewState: boolean = false;

  @ViewChild('editableContainer', { static: true })
  editableContainer: ElementRef;
  @ViewChild('tableConstructorBody', { static: true })
  tableConstructorBody: ElementRef;
  @ViewChildren('tableConstructorElement')
  tableConstructorElements: QueryList<ElementRef>;
  @ViewChild('rows', { static: true }) tableConstructorRows: ElementRef;
  @ViewChild('cols', { static: true }) tableConstructorCols: ElementRef;
  initContentEventsBool = false;
  selectedTableId;
  selectedLayoutId;
  htmlItem;
  selectedAssetsImg = '';
  selectedAssetsVideo = '';
  showVideoDialog = false;
  showDialog = false;
  imgURL = null;

  nodeWithCarret;

  imgContainerId = 'imgContainerId-';
  videoContainerId = 'videoContainerId-';
  videoURL = '';

  imgEditFlag = {};
  videoEditFlag = {};

  html;
  paperFormatList = [
    {
      title: 'Format A4',
      name: 'A4',
      portrait: 21,
      landscape: 29.7,
    },
    {
      title: 'Format A3',
      name: 'A3',
      portrait: 1123,
      landscape: 1587,
    },
  ];
  selectedPaperFormat = this.paperFormatList[0];
  cropFormat = 'portrait';
  selectedItem;
  showTableConstructor;

  showParagraphFormat;
  showDrbFontColor;
  showDrbBackgroundColor;
  showLayoutDrb;

  tableCount = 0;

  fieldsList = [
    {
      name: 'Company',
      type: 'company',
      icon: 'apartment',
      key: 'f__company',
      id: 1,
    },
    {
      name: 'DateTime',
      type: 'DateTime',
      icon: 'calendar_clock',
      key: 'f__time',
      id: 2,
    },
    {
      name: 'Email',
      type: 'Email',
      icon: 'mail',
      key: 'f__email',
      id: 3,
    },
    {
      name: 'User',
      type: 'User',
      icon: 'perm_identity',
      key: 'f__user',
      id: 4,
    },
    {
      name: 'Text',
      type: 'Text',
      icon: 'title',
      key: 'f__text',
      id: 5,
    },
    {
      name: 'Number',
      type: 'Number',
      icon: 'numbers',
      key: 'f__number',
      id: 6,
    },
    {
      name: 'GeoLocation',
      type: 'GeoLocation',
      icon: 'location_searching',
      key: 'f__location',
      id: 7,
    },
    {
      name: 'Reference',
      type: 'Reference',
      icon: 'compare_arrows',
      key: 'f__reference',
      id: 8,
    },
  ];
  paragraphFormatList = [
    {
      lable: 'Normal',
      tag: 'div',
    },
    {
      lable: 'Heading 1',
      tag: 'h1',
    },
    {
      lable: 'Heading 2',
      tag: 'h2',
    },
    {
      lable: 'Heading 3',
      tag: 'h3',
    },
    {
      lable: 'Heading 4',
      tag: 'h4',
    },
    {
      lable: 'Heading 5',
      tag: 'h5',
    },
    {
      lable: 'Heading 6',
      tag: 'h6',
    },
  ];
  selectedParagraphFormat;

  currentFontWeight;
  currentItalic;
  currentUnderLine;
  currentStrikeThrough;
  currentJustifyLeft;
  currentJustifyCenter;
  currentJustifyRight;
  currentOrderedList;
  currentUnorderedList;
  currentColour;
  currentBackColour;

  showDrbFontFamily = false;
  selectedFontFamily;
  heightHeader = 0;
  heightFooter = 0;

  fontFamilyList = [
    {
      lable: 'Manrope',
      value: 'Manrope, sans-serif',
    },
    {
      lable: 'Roboto',
      value: 'Roboto, sans-serif',
    },
  ];
  viewStreamList = [
    {
      lable: '1:1',
      value: '1:1',
    },
    {
      lable: '3:1',
      value: '3:1',
    },
    {
      lable: '1:3',
      value: '1:3',
    },
  ];

  showDrbFontSize = false;
  selectedFontSize = { lable: '16px', value: '4' };
  fontSizeList = [
    {
      lable: '10px',
      value: '1',
    },
    {
      lable: '12px',
      value: '2',
    },
    {
      lable: '14px',
      value: '3',
    },
    {
      lable: '16px',
      value: '4',
    },
    {
      lable: '18px',
      value: '5',
    },
    {
      lable: '24px',
      value: '6',
    },
    {
      lable: '32px',
      value: '7',
    },
    {
      lable: '48px',
      value: '8',
    },
  ];

  fontColorList = [
    {
      value: '#2196f3',
    },
    {
      value: '#f37e21',
    },
    {
      value: '#00c853',
    },
    {
      value: '#ff6b68',
    },
    {
      value: '#f6b45d',
    },
    {
      value: '#175485',
    },
    {
      value: '#000000',
    },
    {
      value: '#333333',
    },
    {
      value: '#666666',
    },
    {
      value: '#999999',
    },
    {
      value: '#dddddd',
    },
    {
      value: '#ffffff',
    },
  ];

  constructorData;

  startSelectedRowIndex = 0;
  old_startSelectedRowIndex;
  startSelectedCellIndex = 0;
  old_startSelectedCellIndex;
  endSelectedRowIndex;
  endSelectedCellIndex;

  maxRowIndex;
  maxCellIndex;
  minRowIndex;
  minCellIndex;
  blockMerge = false;
  blockAddCol = false;
  blockAddRow = false;
  selectedCells = [];

  onClickCellButton = false;

  td = `
        <td>
          <div class="table-cell" >
            <div contenteditable="true" ></div>
          </div>
        </td>`;

  colWidth;
  selectedTable;
  shearCol = {};
  dropSelectedItem = {};
  clickOutsideList = [];
  findedItemForApiName;
  selectedPreviewType;
  style: any = { height: '100%' };

  borderColumns = `
    <div class="border--drb column">
      <button class="button">
          <i class="material-icons">
              border_all
          </i>
          <i class="material-icons">
              keyboard_arrow_right
          </i>
      </button>
      <div class="html-editor--drb--borders">
        <label class="html-editor--borders-column-label" type="bottom">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_bottom
          </i>
        </label>
        <label class="html-editor--borders-column-label" type="top">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_top
          </i>
        </label>
        <label class="html-editor--borders-column-label" type="left">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_left
          </i>
        </label>
        <label class="html-editor--borders-column-label" type="right">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_right
          </i>
        </label>
      </div>
    </div>`;
  borderRows = `
    <div class="border--drb border--drb-row">
      <button class="button">
          <i class="material-icons">
              border_all
          </i>
          <i class="material-icons">
              keyboard_arrow_down
          </i>
      </button>
      <div class="html-editor--drb--borders">
        <label class="html-editor--borders-row-label" type="bottom">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_bottom
          </i>
        </label>
        <label class="html-editor--borders-row-label" type="top">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_top
          </i>
        </label>
        <label class="html-editor--borders-row-label" type="left">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_left
          </i>
        </label>
        <label class="html-editor--borders-row-label" type="right">
          <input hidden type="checkbox" checked value="true">
          <i class="material-icons">
              border_right
          </i>
        </label>
      </div>
    </div>`;

  constructor(
    private chRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((routeParams) => {});

    let self = this;

    this.editableContainer.nativeElement.addEventListener(
      'selectstart',
      function (event) {
        let checkElement = self.getSelectionStart();

        if (event.target.id != 'edit-wrap') {
          self.checkSelection(checkElement);
          setTimeout(() => {
            self.checkSelection(checkElement);
          }, 0);
        }
      }
    );
  }

  ngAfterViewInit() {
    let self = this;
    this.editableContainer.nativeElement.innerHTML = `
      <div type="break" contenteditable="false"></div>
      <div class="html-editor--inside-container" style="height:${this.style.height}" contenteditable="true">${this.content}</div>
    `;

    this.editableContainer.nativeElement.addEventListener(
      'click',
      function (event: any) {
        if (
          event.target.className ==
            'html-editor--edit-wrap category-email html-editor--m-b-65' ||
          event.target.className == 'html-editor--edit-wrap html-editor--m-b-65'
        ) {
          let nodes = event.target.childNodes;
          let lastNode = self.findLastElement(nodes);

          self.moveCarret(lastNode);
        }
      },
      false
    );

    this.editableContainer.nativeElement.addEventListener(
      'keydown',
      function (event) {
        if (event.target.lastChild && event.target.lastChild.nodeType === 1) {
          event.target.lastChild.scrollIntoView({ block: 'center' });
        }
        self.checkLiTag(this);
      }
    );

    this.editableContainer.nativeElement.addEventListener(
      'keyup',
      function (event) {
        if ((event.keyCode == 8 || event.keyCode == 46) && self.selectedTable) {
          self.editableContainer.nativeElement
            .querySelector('#table-container-' + self.selectedTable)
            .remove();
          self.selectedTable = null;
        }
      }
    );

    if (this.html) {
      this.editableContainer.nativeElement.innerHTML = this.html;
    }

    this.tableConstructorBody.nativeElement.addEventListener(
      'mouseover',
      function (event) {
        let tArr = event.srcElement.id.split('-');

        self.tableConstructorRows.nativeElement.innerText = tArr[1];
        self.tableConstructorCols.nativeElement.innerText = tArr[2];

        if (!tArr[2]) {
          self.tableConstructorCols.nativeElement.innerText = '0';
        }
        if (!tArr[1]) {
          self.tableConstructorRows.nativeElement.innerText = '0';
        }
        for (var i = 1; i <= 10; i++) {
          for (var j = 1; j <= 10; j++) {
            let findedElement = self.tableConstructorElements.find(
              (element) => {
                if (
                  element.nativeElement.id ===
                  'tableConstructorElement-' + i + '-' + j
                ) {
                  return true;
                }
                return false;
              }
            );

            if (i <= +tArr[1] && j <= +tArr[2]) {
              findedElement.nativeElement.classList.add('active');
            } else {
              findedElement.nativeElement.classList.remove('active');
            }
          }
        }
      },
      false
    );
    this.constructorData = [];
    for (var i = 1; i <= 10; i++) {
      this.constructorData.push([]);
      for (var j = 1; j <= 10; j++) {
        this.constructorData[i - 1].push([]);
      }
    }

    let nodes = self.editableContainer.nativeElement.childNodes;
    let lstNode = this.findLastElement(nodes);
    self.moveCarret(lstNode, true);
    let interval = setInterval(() => {
      let element = document.getElementsByClassName('html-editor--head')[0];
      if (element) {
        element.addEventListener('mousedown', (e) => {
          e.preventDefault();
        });

        clearInterval(interval);
      }
    }, 100);

    let wrapperOuter = document.getElementsByClassName(
      'html-editor--edit-wrap-outer'
    )[0];
    function outputsize(event) {
      setTimeout(() => {
        let wrapHeight = event[0].target.offsetHeight;
        let breakHeight = 0;
        let i;
        if (wrapHeight > 1122.5) {
          i =
            (wrapHeight - 1122.5) /
            (1122.5 - 60 - self.heightFooter - self.heightHeader);
          i++;
        } else {
          i = wrapHeight / 1122.5;
        }
        i = Math.floor(i);
        let breakList = document.getElementsByClassName(
          'html-editor--page-break-indicator'
        );
        if (breakList && breakList.length) {
          let l = breakList.length;
          for (let index = 1; index <= l; index++) {
            let element = document.querySelector(
              `.html-editor--page-break-indicator[break-count='${index}']`
            );
            let breakCount = element.getAttribute('break-count');
            if (breakCount > i) {
              element.remove();
            }
          }
        }
        for (let index = 0; index < breakList.length; index++) {
          const element = breakList[index];
          let breakCount = element.getAttribute('break-count');
          if (breakCount > i) {
          }
        }
        for (let index = 1; index <= i; index++) {
          let pageBreak: any = document.querySelector(
            `.html-editor--page-break-indicator[break-count='${index}']`
          );
          if (pageBreak) {
            pageBreak.remove();
          }

          if (index === 1) {
            breakHeight += 1122.5 - 20 - self.heightFooter;
            pageBreak = `<div class="html-editor--page-break-indicator" break-count="${index}" style="top:${breakHeight}px">Page break</div>`;
            wrapperOuter.insertAdjacentHTML('beforeend', pageBreak);
          } else {
            breakHeight +=
              1122.5 - 20 - self.heightFooter - self.heightHeader - 20 - 20;
            pageBreak = `<div class="html-editor--page-break-indicator" break-count="${index}" style="top:${breakHeight}px">Page break</div>`;
            wrapperOuter.insertAdjacentHTML('beforeend', pageBreak);
          }
        }
      }, 0);
    }

    let resizeObs = new ResizeObserver(outputsize);
    resizeObs.unobserve(wrapperOuter);
    resizeObs.observe(wrapperOuter);
    this.clickOutsideElement();
    this.chRef.detectChanges();
  }

  findLastElement(nodes, index = 1) {
    if (nodes[nodes.length - index]) {
      if (nodes[nodes.length - index]?.nodeName !== '#text') {
        return nodes[nodes.length - index];
      } else {
        return this.findLastElement(nodes, ++index);
      }
    }
  }

  checkSelection(target?) {
    let self = this;
    if (target) {
      let styles = window.getComputedStyle(target);
      self.fontSizeList.forEach((element: any) => {
        if (element.label == styles.fontSize) {
          self.selectedFontSize = element;
        }
      });
    }

    let fontName = document.queryCommandValue('fontName');
    let colour = document.queryCommandValue('ForeColor');
    let backColour = document.queryCommandValue('backcolor');
    // let fontSize = document.queryCommandValue("FontSize");
    let fontWeight: any = document.queryCommandValue('bold');
    let italic: any = document.queryCommandValue('italic');
    let justifyCenter: any = document.queryCommandValue('justifyCenter');
    let justifyFull: any = document.queryCommandValue('justifyFull');
    let underLine: any = document.queryCommandValue('underLine');
    let justifyLeft: any = document.queryCommandValue('justifyLeft');
    let justifyRight: any = document.queryCommandValue('justifyRight');
    let subscript: any = document.queryCommandValue('subscript');
    let superscript: any = document.queryCommandValue('superscript');
    let strikeThrough: any = document.queryCommandValue('strikeThrough');

    let currentOrderedList: any =
      document.queryCommandValue('insertOrderedList');
    let currentUnorderedList: any = document.queryCommandValue(
      'insertUnorderedList'
    );
    let formatBlock: any = document.queryCommandValue('formatBlock');

    self.paragraphFormatList.forEach((format) => {
      if (formatBlock === format.tag) {
        self.selectedParagraphFormat = format;
      }
    });

    self.fontFamilyList.forEach((format) => {
      if (fontName === format.value) {
        self.selectedFontFamily = format;
      }
    });

    self.currentFontWeight = fontWeight === 'true';
    self.currentItalic = italic === 'true';
    self.currentUnderLine = underLine === 'true';
    self.currentStrikeThrough = strikeThrough === 'true';
    self.currentJustifyCenter = justifyCenter === 'true';
    self.currentJustifyLeft = justifyLeft === 'true';
    self.currentOrderedList = currentOrderedList === 'true';
    self.currentUnorderedList = currentUnorderedList === 'true';
    self.currentJustifyRight = justifyRight === 'true';
    self.currentColour = colour;
    self.currentBackColour = backColour;
  }

  moveCarret(element, flag?) {
    if (
      typeof window.getSelection != 'undefined' &&
      typeof document.createRange != 'undefined'
    ) {
      var range = document.createRange();
      console.log(element, 'elementelement');
      console.log(range, 'rrr');

      range.selectNodeContents(element);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // this.setFontSize(this.selectedFontSize.value);
      if (!flag) {
        this.checkSelection();
      }
    } else if (typeof (document.body as any).createTextRange != 'undefined') {
      var textRange = (document.body as any).createTextRange();
      textRange.moveToElementText(element);
      textRange.collapse(false);
      textRange.select();
      // this.setFontSize(this.selectedFontSize.value);
      if (!flag) {
        this.checkSelection();
      }
    }
  }

  dropItem(event) {
    let range = null;
    if (document.caretRangeFromPoint) {
      // Chrome
      range = document.caretRangeFromPoint(event.clientX, event.clientY);
    } else if (event.rangeParent) {
      // Firefox
      range = document.createRange();
      range.setStart(event.rangeParent, event.rangeOffset);
    }
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    event.target.focus();
    let id = `${(~~(Math.random() * 1e8)).toString(16)}`;
    this.pasteHtmlAtCaret(this.selectedItem, id);
    this.initDrbIcon(this.selectedItem.key, id);
  }

  pasteHtmlAtCaret(selectedItem, id, subject?) {
    var sel, range;
    if (selectedItem.type !== 'Detail') {
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          var el = document.createElement('div');
          this.htmlItem = this.getChipObject(selectedItem, id);
          el.innerHTML = this.htmlItem;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    }
  }
  pasteHtmlDateTimeAtCaret(selectedItem, id, subject?) {
    var sel, range;
    if (selectedItem.type !== 'Detail') {
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          var el = document.createElement('div');
          this.htmlItem = this.getChipObject(selectedItem, id, true);

          el.innerHTML = this.htmlItem;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    }
  }

  generateTable(el, existTable?: Element) {
    let self = this;
    let id;
    let colCount;
    let rowCount;
    let cellSize = 50;

    if (!existTable) {
      self.tableCount++;
      el.stopPropagation();
      id = `${(~~(Math.random() * 1e8)).toString(16)}`;
      var tableHTML = `<div type="break" contenteditable="false"></div><div contenteditable="true" class="html-editor--inside-container"></div><div class="table-container" contenteditable="false" id="table-container-${id}"> <table id="table_resize_${id}" contenteditable="false" class="table">`;
      let tArr = el.srcElement.id.split('-');
      colCount = tArr[1];
      rowCount = tArr[2];
      for (var i = 0; i < +rowCount; i++) {
        if (i === 0) {
          tableHTML += '<tr>';
          for (var j = 1; j <= +colCount; j++) {
            if (j === 1) {
              tableHTML += `<td>
              <div class="html-editor--table-edit-rows">
                <div style="height: 30px" class="html-editor--table-edit-rows-item">
                    <button class="html-editor--table-edit-rows-item-button"></button>
                    <div class="html-editor--table-edit-separate-wrap">
                        <div class="html-editor--table-edit-separate-indicator">
                            <button class="html-editor--table-edit-separate-indicator-dot"></button>
                            <button class="html-editor--table-edit-separate-indicator-button">
                                +
                            </button>
                        </div>
                    </div>
                    <div style="position: relative; height: 100%; width: 0;">
                      <button class="html-editor--table-edit-delete">
                        x
                      </button>
                      ${this.borderRows}
                    </div>
                </div>
              </div>
              <div class="html-editor--table-edit-columns">
              <div style="width: ${
                730 / colCount
              }px;" class="html-editor--table-edit-columns-item">
                  <button class="html-editor--table-edit-columns-item-button"></button>
                    <div class="html-editor--table-edit-separate-wrap">
                        <div class="html-editor--table-edit-separate-indicator">
                            <button class="html-editor--table-edit-separate-indicator-dot"></button>
                            <button class="html-editor--table-edit-separate-indicator-button">
                              +
                            </button>
                        </div>
                      </div>
                      <button class="html-editor--table-edit-delete">
                          x
                      </button>
                      ${this.borderColumns}
                  </div>
                  </div>
              </div>
              <div class="table-cell" >
                <div contenteditable="true" ></div>
              </div>
            </td>`;
            } else {
              tableHTML += getFirstTd(colCount);
              if (j === +colCount) {
                tableHTML += '</tr>';
              }
            }
          }
        } else {
          tableHTML += '<tr>';
          for (var j = 1; j <= +colCount; j++) {
            if (j === 1) {
              tableHTML += `
              <td>
                <div class="html-editor--table-edit-rows">
                <div style="height: 30px" class="html-editor--table-edit-rows-item">
                    <button class="html-editor--table-edit-rows-item-button"></button>
                    <div class="html-editor--table-edit-separate-wrap">
                        <div class="html-editor--table-edit-separate-indicator">
                            <button class="html-editor--table-edit-separate-indicator-dot"></button>
                            <button class="html-editor--table-edit-separate-indicator-button">
                                +
                            </button>
                        </div>
                    </div>
                    <div style="position: relative; height: 100%; width: 0;">
                      <button class="html-editor--table-edit-delete">
                        x
                      </button>
                      ${this.borderRows}
                    </div>
                </div>
                </div>
                  <div class="table-cell" >
                    <div contenteditable="true" ></div>
                  </div>
              </td>`;
            } else {
              tableHTML += self.td;
              if (j === +colCount) {
                tableHTML += '</tr>';
              }
            }
          }
        }
      }
      tableHTML += `<div class="html-editor--table-edit">
      <button class="select-all" id="select-all-${id}"></button>
      </table>
      </div> <div contenteditable="true" class="html-editor--inside-container"></div>`;

      document.execCommand('insertHTML', false, tableHTML);
      this.showTableConstructor = false;
    } else {
      let tempParseArr = existTable.getAttribute('id').split('table_resize_');
      id = tempParseArr[tempParseArr.length - 1];
      rowCount = (existTable as any).rows.length;
      colCount = (existTable as any).rows[0].cells.length;
    }
    var th_width;

    var container, table, table_th;

    function selectCell(event) {
      let deleteButton =
        self.editableContainer.nativeElement.querySelector(
          '#table-button-wrap'
        );
      if (deleteButton) {
        deleteButton.remove();
      }
      let allTables =
        self.editableContainer.nativeElement.getElementsByClassName(
          'table-container'
        );
      if (allTables) {
        for (let index = 0; index < allTables.length; index++) {
          const element = allTables[index];
          if (
            element.getAttribute('id') !== 'dynamic-table-container-' + id ||
            element.getAttribute('id') !== 'table-container-' + id
          ) {
            element.classList.add('html-editor--hide-actions');
          }
        }
      }

      if (table.getElementsByClassName('html-editor--drb show').length) {
        table
          .getElementsByClassName('html-editor--drb show')[0]
          .classList.remove('show');
      }

      let existButtons = (table as any).getElementsByClassName(
        'html-editor--table-edit-delete show'
      );
      if (existButtons.length) {
        for (const iterator of existButtons) {
          iterator.classList.remove('show');
        }
      }

      if ((window.event as any).shiftKey) {
        findCell(event.target, 'end');
        self.maxRowIndex = Math.max(
          self.endSelectedRowIndex,
          self.startSelectedRowIndex
        );
        self.maxCellIndex = Math.max(
          self.endSelectedCellIndex,
          self.startSelectedCellIndex
        );
        self.minRowIndex = Math.min(
          self.endSelectedRowIndex,
          self.startSelectedRowIndex
        );
        self.minCellIndex = Math.min(
          self.endSelectedCellIndex,
          self.startSelectedCellIndex
        );
        clearCells(table);
        selectCells(table);
        if (
          self.old_startSelectedCellIndex !== self.startSelectedCellIndex ||
          self.old_startSelectedRowIndex !== self.startSelectedRowIndex
        ) {
          drowCellinfoButton(table);
        }
      } else {
        self.old_startSelectedCellIndex = self.startSelectedCellIndex;
        self.old_startSelectedRowIndex = self.startSelectedRowIndex;
        findCell(event.target, 'start');
        clearCells(table);

        self.shearCol = {};
        for (
          let index = 0;
          index < (table as any).rows[self.startSelectedRowIndex].cells.length;
          index++
        ) {
          if (index < self.startSelectedCellIndex) {
            const cell = (table as any).rows[self.startSelectedRowIndex].cells[
              index
            ];
            let colspan = +cell.getAttribute('colspan');
            if (colspan > 1) {
              self.shearCol[self.startSelectedRowIndex] = colspan - 1;
            }
          }
        }

        (table as any).rows[self.startSelectedRowIndex].cells[
          self.startSelectedCellIndex
        ].classList.add('active');

        if (
          self.old_startSelectedCellIndex !== self.startSelectedCellIndex ||
          self.old_startSelectedRowIndex !== self.startSelectedRowIndex
        ) {
          drowCellinfoButton(table);
        }
      }
      let cellColor;
      if (!existTable && self.startSelectedRowIndex == 0) {
        cellColor = 'rgb(244, 245, 247)';
      } else {
        cellColor = (table as any).rows[self.startSelectedRowIndex].cells[
          self.startSelectedCellIndex
        ].style.background;
      }
      if (cellColor) {
        let element: any;
        let interval = setInterval(() => {
          element = (table as any).rows[self.startSelectedRowIndex].cells[
            self.startSelectedCellIndex
          ].querySelectorAll('.input_dinamic_Cell') as any;
          if (element?.length) {
            element[0].setAttribute('value', self.toHexc(cellColor));
            clearInterval(interval);
          }
        }, 100);
      }
      event.stopPropagation();
    }
    function drowCellinfoButton(table) {
      let bordersDrbCell = `
        <div class="html-editor--drb colors html-editor--drb--borders" style="top: 2px; width: fit-content; flex-wrap: nowrap;">
          <label class="html-editor--borders-cell-label" type="bottom">
            <input hidden type="checkbox" checked>
            <i class="material-icons">
                border_bottom
            </i>
          </label>
          <label class="html-editor--borders-cell-label" type="top">
            <input hidden type="checkbox" checked>
            <i class="material-icons">
                border_top
            </i>
          </label>
          <label class="html-editor--borders-cell-label" type="left">
            <input hidden type="checkbox" checked>
            <i class="material-icons">
                border_left
            </i>
          </label>
          <label class="html-editor--borders-cell-label" type="right">
            <input hidden type="checkbox" checked>
            <i class="material-icons">
                border_right
            </i>
          </label>
        </div>
     `;

      let cellInfo = `
        <div class="html-editor--cell-info-wrap html-editor--drb-wrap-text-style">
            <button class="html-editor--cell-info-button">
                <i class="material-icons">
                    keyboard_arrow_down
                </i>
            </button>
            <div class="html-editor--drb overflow-v">
                <div class="html-editor--drb--item">
                    <button id='insert-row' class="default-drb--item button">
                        Insert Row
                    </button>
                </div>
                <div class="html-editor--drb--item">
                    <button id='insert-column' class="default-drb--item button">
                        Insert Column
                    </button>
                </div>
                <div class="html-editor--drb--item">
                    <button id='merge' class="default-drb--item button">
                        Merge cells
                    </button>
                </div>
                <div class="html-editor--drb--item">
                    <button id='split' class="default-drb--item button">
                        Split cells
                    </button>
                </div>
                <div class="html-editor--drb--item color-picker-item d-flex p-jc-between" style="padding: 8px;">
                    <div class="p-p-2">
                        Cell color
                    </div>
                    <input id="${id}_input_Cell" type="color" name="Cell_color" style="margin-left: 5px;" class="input_dinamic_Cell p-mx-2"
                    value="#ffffff00">
                </div>
                <div class="html-editor--drb--item color-picker-item d-flex p-jc-between" style="padding: 8px;">
                    <div class="p-p-2">
                        Row color
                    </div>
                    <input id="${id}_input_Row" type="color" name="Row_color" style="margin-left: 5px;" class="input_dinamic_Row p-mx-2"
                    value="#ffffff00">
                </div>
                <div class="html-editor--drb--item color-picker-item" style="padding: 8px;">
                    <div class="p-p-2">
                    Column color
                    </div>
                    <input id="${id}_input_Column" type="color" name="Column_color" style="margin-left: 5px;" class="input_dinamic_Column p-mx-2"
                    value="#ffffff00">
                </div>
                <div class="html-editor--drb--item">
                <button id='' class="default-drb--item button">
                  Borders
                  <i class="material-icons">
                    keyboard_arrow_right
                  </i>
                </button>
                ${bordersDrbCell}
            </div>
          </div>
        </div>`;

      (table as any).rows[self.endSelectedRowIndex].cells[
        self.endSelectedCellIndex
      ].insertAdjacentHTML('beforeend', cellInfo);

      let cellButton = table.getElementsByClassName(
        'html-editor--cell-info-button'
      )[0];
      cellButton.addEventListener('click', function (event) {
        let tablesDrbs = table.getElementsByClassName('html-editor--drb');
        for (let j = 0; j < tablesDrbs.length; j++) {
          const drb = tablesDrbs[j];
          if (
            self.editableContainer.nativeElement.getBoundingClientRect().right -
              event.target.getBoundingClientRect().right <
            325
          ) {
            drb.classList.add('left-side');
          }
        }
        table
          .getElementsByClassName('html-editor--drb overflow-v')[0]
          .classList.toggle('show');
        event.stopPropagation();
      });

      let drbEvents = table.getElementsByClassName('default-drb--item button');
      for (let index = 0; index < drbEvents.length; index++) {
        const element = drbEvents[index];
        switch (element.id) {
          case 'insert-row':
            element.addEventListener('mouseup', function (event) {
              addRow(table, self.endSelectedRowIndex);
            });
            break;
          case 'insert-column':
            element.addEventListener('mouseup', function (event) {
              addColumn(table, self.endSelectedCellIndex);
            });
            break;
          case 'merge':
            element.addEventListener('mouseup', function (event) {
              mergeCells(table);
            });
            break;
          case 'split':
            if (self.blockMerge) {
              element.setAttribute('disabled', `true`);
            }
            element.addEventListener('mouseup', function (event) {
              splitCells(table);
            });
            break;
          default:
            break;
        }
      }

      let cellsColorButtons =
        table.getElementsByClassName('input_dinamic_Cell');

      for (let index = 0; index < cellsColorButtons.length; index++) {
        const element = cellsColorButtons[index];
        element.addEventListener('change', function (event, id) {
          let color = event.target.value;
          (table as any).rows[self.startSelectedRowIndex].cells[
            self.startSelectedCellIndex
          ].style.setProperty('background', color);
          (table as any).rows[self.startSelectedRowIndex].cells[
            self.startSelectedCellIndex
          ].classList.remove('active');
          event.stopPropagation();
        });
      }

      let rowsColorButtons = table.getElementsByClassName('input_dinamic_Row');

      for (let index = 0; index < rowsColorButtons.length; index++) {
        const element = rowsColorButtons[index];
        element.addEventListener('change', function (event) {
          let color = event.target.value;
          event.stopPropagation();
          (table as any).rows[self.startSelectedRowIndex].cells[
            self.startSelectedCellIndex
          ].classList.remove('active');
          for (
            let i = 0;
            i < (table as any).rows[self.startSelectedRowIndex].cells.length;
            i++
          ) {
            const cell = (table as any).rows[self.startSelectedRowIndex].cells[
              i
            ];
            cell.style.setProperty('background', color);
          }
        });
      }

      let columnsColorButtons = table.getElementsByClassName(
        'input_dinamic_Column'
      );

      for (let index = 0; index < columnsColorButtons.length; index++) {
        const element = columnsColorButtons[index];
        element.addEventListener('change', function (event) {
          let color = event.target.value;

          (table as any).rows[self.startSelectedRowIndex].cells[
            self.startSelectedCellIndex
          ].classList.remove('active');
          for (let i = 0; i < rowCount; i++) {
            const cell = (table as any).rows[i].cells[
              self.startSelectedCellIndex
            ];
            cell.style.setProperty('background', color);
          }
          event.stopPropagation();
        });
      }

      let cellsBorders =
        self.editableContainer.nativeElement.getElementsByClassName(
          'html-editor--borders-cell-label'
        );
      let activeTD = (table as any).rows[self.startSelectedRowIndex].cells[
        self.startSelectedCellIndex
      ] as Element;

      for (let index = 0; index < cellsBorders.length; index++) {
        const element = cellsBorders[index];

        if (
          activeTD.classList.contains('html-editor--hide-bottom') &&
          element.getAttribute('type') == 'bottom'
        ) {
          element.getElementsByTagName('input')[0].checked = false;
        }
        if (
          activeTD.classList.contains('html-editor--hide-top') &&
          element.getAttribute('type') == 'top'
        ) {
          element.getElementsByTagName('input')[0].checked = false;
        }
        if (
          activeTD.classList.contains('html-editor--hide-left') &&
          element.getAttribute('type') == 'left'
        ) {
          element.getElementsByTagName('input')[0].checked = false;
        }
        if (
          activeTD.classList.contains('html-editor--hide-right') &&
          element.getAttribute('type') == 'right'
        ) {
          element.getElementsByTagName('input')[0].checked = false;
        }

        element.addEventListener('click', function (event) {
          let type = element.getAttribute('type');
          switch (type) {
            case 'bottom':
              activeTD.classList.toggle('html-editor--hide-bottom');
              if ((table as any).rows[self.startSelectedRowIndex + 1]) {
                (table as any).rows[self.startSelectedRowIndex + 1].cells[
                  self.startSelectedCellIndex
                ].classList.toggle('html-editor--hide-top');
              }
              if (activeTD.classList.contains('html-editor--hide-bottom')) {
                element.getElementsByTagName('input')[0].checked = false;
              } else {
                element.getElementsByTagName('input')[0].checked = true;
              }
              break;
            case 'top':
              activeTD.classList.toggle('html-editor--hide-top');
              if ((table as any).rows[self.startSelectedRowIndex - 1]) {
                (table as any).rows[self.startSelectedRowIndex - 1].cells[
                  self.startSelectedCellIndex
                ].classList.toggle('html-editor--hide-bottom');
              }
              if (activeTD.classList.contains('html-editor--hide-top')) {
                element.getElementsByTagName('input')[0].checked = false;
              } else {
                element.getElementsByTagName('input')[0].checked = true;
              }
              break;
            case 'left':
              activeTD.classList.toggle('html-editor--hide-left');
              if (
                (table as any).rows[self.startSelectedRowIndex].cells[
                  self.startSelectedCellIndex - 1
                ]
              ) {
                (table as any).rows[self.startSelectedRowIndex].cells[
                  self.startSelectedCellIndex - 1
                ].classList.toggle('html-editor--hide-right');
              }
              if (activeTD.classList.contains('html-editor--hide-left')) {
                element.getElementsByTagName('input')[0].checked = false;
              } else {
                element.getElementsByTagName('input')[0].checked = true;
              }
              break;
            case 'right':
              activeTD.classList.toggle('html-editor--hide-right');
              if (
                (table as any).rows[self.startSelectedRowIndex].cells[
                  self.startSelectedCellIndex + 1
                ]
              ) {
                (table as any).rows[self.startSelectedRowIndex].cells[
                  self.startSelectedCellIndex + 1
                ].classList.toggle('html-editor--hide-left');
              }
              if (activeTD.classList.contains('html-editor--hide-right')) {
                element.getElementsByTagName('input')[0].checked = false;
              } else {
                element.getElementsByTagName('input')[0].checked = true;
              }
              break;
            default:
              break;
          }
          event.stopPropagation();
          event.preventDefault();
        });
      }
    }

    function mergeCells(table) {
      for (
        let indexRow = self.minRowIndex;
        indexRow <= self.maxRowIndex;
        indexRow++
      ) {
        for (
          let indexCol = self.minCellIndex;
          indexCol <= self.maxCellIndex;
          indexCol++
        ) {
          let cspan = +(table as any).rows[indexRow].cells[
            indexCol
          ].getAttribute('colspan');
          let rspan = +(table as any).rows[indexRow].cells[
            indexCol
          ].getAttribute('rowspan');
          if ((cspan && cspan > 1) || (rspan && rspan > 1)) {
            self.startSelectedRowIndex = indexRow;
            self.startSelectedCellIndex = indexCol;
            splitCells(table);
          }
        }
      }

      self.startSelectedRowIndex = self.minRowIndex;
      self.startSelectedCellIndex = self.minCellIndex;
      self.endSelectedRowIndex = self.maxRowIndex;
      self.endSelectedCellIndex = self.maxCellIndex;

      let colspan = (table as any).rows[self.startSelectedRowIndex].cells[
        self.minCellIndex
      ].getAttribute('colspan');
      let rowspan = (table as any).rows[self.startSelectedRowIndex].cells[
        self.minCellIndex
      ].getAttribute('rowspan');
      (table as any).rows[self.startSelectedRowIndex].cells[
        self.minCellIndex
      ].setAttribute(
        'colspan',
        colspan
          ? +colspan + self.maxCellIndex - self.minCellIndex
          : self.maxCellIndex - self.minCellIndex + 1
      );
      (table as any).rows[self.startSelectedRowIndex].cells[
        self.minCellIndex
      ].setAttribute(
        'rowspan',
        rowspan
          ? +rowspan + self.maxRowIndex - self.minRowIndex
          : self.maxRowIndex - self.minRowIndex + 1
      );

      for (
        let indexRow = self.minRowIndex;
        indexRow <= self.maxRowIndex;
        indexRow++
      ) {
        if (indexRow === self.minRowIndex) {
          for (
            let indexCell = self.minCellIndex + 1;
            indexCell <= self.maxCellIndex;
            indexCell++
          ) {
            (table as any).rows[indexRow].cells[indexCell].style.display =
              'none';
          }
        } else {
          for (
            let indexCell = self.minCellIndex + 1;
            indexCell <= self.maxCellIndex + 1;
            indexCell++
          ) {
            (table as any).rows[indexRow].cells[indexCell - 1].style.display =
              'none';
          }
        }
      }

      self.startSelectedRowIndex = self.minRowIndex;
      self.startSelectedCellIndex = self.minCellIndex;
      self.endSelectedRowIndex = self.minRowIndex;
      self.endSelectedCellIndex = self.minCellIndex;
      (table as any).rows[self.minRowIndex].cells[
        self.minCellIndex
      ].classList.add('active');
      if (self.minRowIndex === 0) {
        let colButton = (table as any).rows[self.minRowIndex].cells[
          self.minCellIndex
        ].getElementsByClassName(
          'html-editor--table-edit-columns-item-button'
        )[0];
        let colWidth =
          (table as any).rows[self.minRowIndex].cells[
            self.minCellIndex
          ].getBoundingClientRect().width - 1;
        colButton.style.width = colWidth + 'px';
      }
      drowCellinfoButton(table);
    }

    function splitCells(table) {
      let colspan = +(table as any).rows[self.startSelectedRowIndex].cells[
        self.startSelectedCellIndex
      ].getAttribute('colspan');
      if (!colspan) {
        colspan = 0;
      }
      let rowspan = +(table as any).rows[self.startSelectedRowIndex].cells[
        self.startSelectedCellIndex
      ].getAttribute('rowspan');
      if (!rowspan) {
        rowspan = 0;
      }

      (table as any).rows[self.startSelectedRowIndex].cells[
        self.startSelectedCellIndex
      ].setAttribute('rowspan', 1);
      (table as any).rows[self.startSelectedRowIndex].cells[
        self.startSelectedCellIndex
      ].setAttribute('colspan', 1);

      for (
        let indexRow = self.startSelectedRowIndex;
        indexRow <= self.startSelectedRowIndex + rowspan;
        indexRow++
      ) {
        for (
          let index = self.startSelectedCellIndex;
          index <= self.startSelectedCellIndex + colspan;
          index++
        ) {
          (table as any).rows[indexRow].cells[index].removeAttribute('style');
          (table as any).rows[indexRow].cells[index].removeAttribute('class');
        }
      }
      table
        .querySelectorAll('.html-editor--cell-info-wrap')
        .forEach(function (element) {
          element.remove();
        });
      (table as any).rows[self.minRowIndex].cells[
        self.minCellIndex
      ].classList.add('active');
      drowCellinfoButton(table);

      if (table.getElementsByClassName('html-editor--drb show').length) {
        table
          .getElementsByClassName('html-editor--drb show')[0]
          .classList.remove('show');
      }
    }

    function selectCells(table, type?, line?) {
      self.blockMerge = false;
      self.blockAddCol = false;
      self.blockAddRow = false;
      switch (type) {
        case 'column':
          self.minRowIndex = 0;
          self.maxRowIndex = rowCount - 1;
          self.minCellIndex = self.startSelectedCellIndex;
          self.maxCellIndex = self.startSelectedCellIndex;
          break;
        case 'row':
          self.minRowIndex = self.startSelectedRowIndex;
          self.maxRowIndex = self.startSelectedRowIndex;
          self.minCellIndex = 0;
          self.maxCellIndex = colCount - 1;
          break;
        case 'all':
          self.minRowIndex = 0;
          self.maxRowIndex = rowCount - 1;
          self.minCellIndex = 0;
          self.maxCellIndex = colCount - 1;
          break;
        default:
          break;
      }

      for (
        let indexRow = self.minRowIndex;
        indexRow <= self.maxRowIndex;
        indexRow++
      ) {
        for (
          let indexCell = self.minCellIndex;
          indexCell <= self.maxCellIndex;
          indexCell++
        ) {
          switch (line) {
            case 'horizontal':
              (table as any).rows[indexRow].cells[indexCell].classList.add(
                'active-border-horizontal'
              );
              if ((table as any).rows[indexRow + 1]) {
                let cssDisplayRow = window
                  .getComputedStyle(
                    (table as any).rows[indexRow + 1].cells[indexCell],
                    null
                  )
                  .getPropertyValue('display');
                if (cssDisplayRow == 'none') {
                  self.blockAddRow = true;
                }
              }
              break;
            case 'vertical':
              if ((table as any).rows[indexRow].cells[indexCell + 1]) {
                let cssDisplayCol = window
                  .getComputedStyle(
                    (table as any).rows[indexRow].cells[indexCell + 1],
                    null
                  )
                  .getPropertyValue('display');
                if (cssDisplayCol == 'none') {
                  self.blockAddCol = true;
                }
              }
              (table as any).rows[indexRow].cells[indexCell].classList.add(
                'active-border-vertical'
              );
              break;
            default:
              let cssDisplay = window
                .getComputedStyle(
                  (table as any).rows[indexRow].cells[indexCell],
                  null
                )
                .getPropertyValue('display');
              if (cssDisplay == 'none') {
                self.blockMerge = true;
              }
              (table as any).rows[indexRow].cells[indexCell].classList.add(
                'active'
              );
              break;
          }
        }
      }
      for (
        let indexRow = self.minRowIndex;
        indexRow <= self.maxRowIndex;
        indexRow++
      ) {
        for (
          let indexCell = self.minCellIndex;
          indexCell <= self.maxCellIndex;
          indexCell++
        ) {
          let rowspan = +(table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('rowspan');
          let colspan = +(table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('colspan');
          if ((rowspan && rowspan > 1) || (colspan && colspan > 0)) {
            self.blockMerge = false;
          }
        }
      }
    }

    function addRow(table, index) {
      let newRow = (table as any).insertRow(index + 1);
      for (let i = 0; i < colCount; i++) {
        if (i === 0) {
          newRow.insertAdjacentHTML(
            'beforeend',
            `
          <td>
            <div class="html-editor--table-edit-rows">
            <div style="height: 30px" class="html-editor--table-edit-rows-item">
                <button class="html-editor--table-edit-rows-item-button"></button>
                <div class="html-editor--table-edit-separate-wrap">
                    <div class="html-editor--table-edit-separate-indicator">
                        <button class="html-editor--table-edit-separate-indicator-dot"></button>
                        <button class="html-editor--table-edit-separate-indicator-button">
                            +
                        </button>
                    </div>
                </div>
                <div style="position: relative; height: 100%; width: 0;">
                  <button class="html-editor--table-edit-delete">
                    x
                  </button>
                  ${self.borderRows}
                </div>
            </div>
            </div>
              <div class="table-cell" >
                <div contenteditable="true" ></div>
              </div>
          </td>`
          );
        } else {
          newRow.insertAdjacentHTML('beforeend', self.td);
        }
      }
      rowCount++;
      initRowColButtonsEvents(newRow, table);
      initCellEvents(newRow);
      self.resizableGrid(table);
    }

    function addColumn(table, index) {
      let table_tr = table.getElementsByTagName('tr');

      for (let i = 0; i < table_tr.length; i++) {
        let new_cell = table_tr[i].insertCell(index + 1);
        if (i === 0) {
          new_cell.insertAdjacentHTML('beforeend', getFirstTd(colCount));
        } else {
          new_cell.insertAdjacentHTML('beforeend', self.td);
        }
        initRowColButtonsEvents(new_cell, table);
        initCellEvents(new_cell);

        if (existTable) {
          table_th = (existTable as any).rows[0].getElementsByTagName('td');
        } else {
          table_th = (table as any).rows[0].getElementsByTagName('td');
        }
        setTdWidth(table);
        self.resizableGrid(table);
      }
      colCount++;
    }

    function findCell(element, type) {
      let cell;
      let row;

      if (element) {
        switch (element.tagName) {
          case 'TD':
          case 'TH':
            cell = element.cellIndex;
            switch (type) {
              case 'start':
                self.startSelectedCellIndex = cell;
                self.endSelectedCellIndex = cell;
                break;
              case 'end':
                self.endSelectedCellIndex = cell;
                break;
              default:
                break;
            }
            findCell(element.parentElement, type);
            break;
          case 'TR':
            row = element.rowIndex;
            switch (type) {
              case 'start':
                self.startSelectedRowIndex = row;
                self.endSelectedRowIndex = row;
                break;
              case 'end':
                self.endSelectedRowIndex = row;
                break;
              default:
                break;
            }
            break;
          default:
            findCell(element.parentElement, type);
            break;
        }
      }
    }

    function clearCells(table) {
      if (
        (self.startSelectedRowIndex || self.startSelectedRowIndex == 0) &&
        (self.startSelectedCellIndex || self.startSelectedCellIndex == 0)
      ) {
        for (const row of (table as any).rows) {
          for (const cell of row.cells) {
            cell.classList.remove('active');
          }
        }
      }

      if (
        self.old_startSelectedCellIndex !== self.startSelectedCellIndex ||
        self.old_startSelectedRowIndex !== self.startSelectedRowIndex
      ) {
        table
          .querySelectorAll('.html-editor--cell-info-wrap')
          .forEach(function (element) {
            element.remove();
          });
      }
    }

    function initRowColButtonsEvents(htmlBlock, table) {
      let cols = htmlBlock.getElementsByClassName(
        'html-editor--table-edit-columns'
      );
      let rows = htmlBlock.getElementsByClassName(
        'html-editor--table-edit-rows'
      );
      function colAddButtonClick(event) {
        if (!self.blockAddCol) {
          findCell(event.target, 'start');

          addColumn(table, self.startSelectedCellIndex);
        }
      }

      for (const col of cols) {
        let colButton = col.getElementsByClassName(
          'html-editor--table-edit-columns-item-button'
        )[0];
        let colAddButton = col.getElementsByClassName(
          'html-editor--table-edit-separate-indicator-button'
        )[0];

        colAddButton.addEventListener('mouseenter', function (event) {
          self.blockAddCol = false;
          findCell(event.target, 'start');
          selectCells(table, 'column', 'vertical');
          if (self.blockAddCol) {
            colAddButton.classList.add('cursor-ds');
          }
        });

        colAddButton.addEventListener('mouseleave', function (event) {
          let existLines = table.getElementsByClassName(
            'active-border-vertical'
          );
          if (existLines.length) {
            while (existLines.length) {
              existLines[0].classList.remove('active-border-vertical');
            }
          }
          colAddButton.classList.remove('cursor-ds');
          self.blockAddCol = false;
        });

        colAddButton.removeEventListener('click', colAddButtonClick);
        colAddButton.addEventListener('click', colAddButtonClick);

        colButton.addEventListener('click', function (event) {
          let existButtons = table.getElementsByClassName(
            'html-editor--table-edit-delete show'
          );
          if (existButtons.length) {
            for (const iterator of existButtons) {
              iterator.classList.remove('show');
            }
          }

          col
            .getElementsByClassName('html-editor--table-edit-delete')[0]
            .classList.add('show');
          clearCells(table);
          findCell(event.target, 'start');
          selectCells(table, 'column');
        });

        let deleteButton = col.getElementsByClassName(
          'html-editor--table-edit-delete'
        )[0];
        deleteButton.addEventListener('mouseenter', function (event) {
          self.checkBlockCol(table, rowCount);
          if (self.blockAddCol) {
            deleteButton.classList.add('cursor-ds');
          } else {
            self.showRemovedTD(table);
          }
        });
        deleteButton.addEventListener('mouseleave', function (event) {
          if (self.blockAddCol) {
            deleteButton.classList.remove('cursor-ds');
            self.blockAddCol = false;
          } else {
            self.showRemovedTD(table);
          }
        });
        deleteButton.addEventListener('click', function (event) {
          if (!self.blockAddCol) {
            findCell(event.target, 'start');
            deleteColumn(table);
          }
        });
      }
      function rowAddButtonClick(event) {
        if (!self.blockAddRow) {
          findCell(event.target, 'start');
          addRow(table, self.startSelectedRowIndex);
        }
      }

      for (const row of rows) {
        let rowButton = row.getElementsByClassName(
          'html-editor--table-edit-rows-item-button'
        )[0];
        let rowAddButton = row.getElementsByClassName(
          'html-editor--table-edit-separate-indicator-button'
        )[0];

        rowAddButton.addEventListener('mouseenter', function (event) {
          self.blockAddRow = false;
          findCell(event.target, 'start');
          selectCells(table, 'row', 'horizontal');
          if (self.blockAddRow) {
            rowAddButton.classList.add('cursor-ds');
          }
        });

        rowAddButton.addEventListener('mouseleave', function (event) {
          let existLines = table.getElementsByClassName(
            'active-border-horizontal'
          );
          if (existLines.length) {
            while (existLines.length) {
              existLines[0].classList.remove('active-border-horizontal');
            }
          }
          rowAddButton.classList.remove('cursor-ds');
          self.blockAddRow = false;
        });

        rowAddButton.removeEventListener('click', rowAddButtonClick);
        rowAddButton.addEventListener('click', rowAddButtonClick);

        rowButton.addEventListener('click', function (event) {
          let existButtons = table.getElementsByClassName(
            'html-editor--table-edit-delete show'
          );
          if (existButtons.length) {
            for (const iterator of existButtons) {
              iterator.classList.remove('show');
            }
          }

          row
            .getElementsByClassName('html-editor--table-edit-delete')[0]
            .classList.add('show');
          clearCells(table);
          findCell(event.target, 'start');
          selectCells(table, 'row');
        });

        let deleteButton = row.getElementsByClassName(
          'html-editor--table-edit-delete'
        )[0];
        deleteButton.addEventListener('mouseenter', function (event) {
          self.checkBlockRow(table, colCount);
          if (self.blockAddRow) {
            deleteButton.classList.add('cursor-ds');
          } else {
            self.showRemovedTD(table);
          }
        });
        deleteButton.addEventListener('mouseleave', function (event) {
          if (self.blockAddRow) {
            deleteButton.classList.remove('cursor-ds');
            self.blockAddRow = false;
          } else {
            self.showRemovedTD(table);
          }
        });
        deleteButton.addEventListener('click', function (event) {
          if (!self.blockAddRow) {
            findCell(event.target, 'start');
            deleteRow(table);
          }
        });
      }
    }

    function deleteRow(table) {
      if (rowCount === 1) {
        self
          .findHTMLElementById('table-container', 'table-container-' + id)
          .remove();
      } else {
        table.deleteRow(self.startSelectedRowIndex);
        rowCount--;
        if (self.startSelectedRowIndex === 0) {
          for (const cell of (table as any).rows[0].cells) {
            cell.insertAdjacentHTML(
              'afterbegin',
              `
            <div class="html-editor--table-edit-columns">
            <div class="html-editor--table-edit-columns-item">
              <button class="html-editor--table-edit-columns-item-button"></button>
                <div class="html-editor--table-edit-separate-wrap">
                  <div class="html-editor--table-edit-separate-indicator">
                      <button class="html-editor--table-edit-separate-indicator-dot"></button>
                      <button class="html-editor--table-edit-separate-indicator-button">
                        +
                      </button>
                  </div>
                </div>
                <button class="html-editor--table-edit-delete">
                    x
                </button>
            </div>
            </div>`
            );
          }
          initRowColButtonsEvents((table as any).rows[0], table);
        }
      }
    }

    function deleteColumn(table) {
      if (colCount === 1) {
        self
          .findHTMLElementById('table-container', 'table-container-' + id)
          .remove();
      } else {
        let table_tr = table.getElementsByTagName('tr');

        for (let i = 0; i < table_tr.length; i++) {
          const tr = table_tr[i];
          tr.deleteCell(self.startSelectedCellIndex);
          if (self.startSelectedCellIndex === 0) {
            if (i === 0) {
              tr.cells[0].insertAdjacentHTML(
                'afterbegin',
                `
              <div class="html-editor--table-edit-rows">
              <div style="height: 30px" class="html-editor--table-edit-rows-item">
                <button class="html-editor--table-edit-rows-item-button"></button>
                <div class="html-editor--table-edit-separate-wrap">
                    <div class="html-editor--table-edit-separate-indicator">
                        <button class="html-editor--table-edit-separate-indicator-dot"></button>
                        <button class="html-editor--table-edit-separate-indicator-button">
                            +
                        </button>
                    </div>
                </div>
                <div style="position: relative; height: 100%; width: 0;">
                  <button class="html-editor--table-edit-delete">
                    x
                  </button>
                </div>
              </div>
              </div>
              <div class="html-editor--table-edit-columns">
              <div class="html-editor--table-edit-columns-item">
                  <button class="html-editor--table-edit-columns-item-button"></button>
                    <div class="html-editor--table-edit-separate-wrap">
                        <div class="html-editor--table-edit-separate-indicator">
                            <button class="html-editor--table-edit-separate-indicator-dot"></button>
                            <button class="html-editor--table-edit-separate-indicator-button">
                              +
                            </button>
                        </div>
                      </div>
                      <button class="html-editor--table-edit-delete">
                          x
                      </button>
                  </div>
                  </div>
              </div>`
              );
            } else {
              tr.cells[0].insertAdjacentHTML(
                'afterbegin',
                `
              <div class="html-editor--table-edit-rows">
              <div style="height: 30px" class="html-editor--table-edit-rows-item">
                  <button class="html-editor--table-edit-rows-item-button"></button>
                  <div class="html-editor--table-edit-separate-wrap">
                      <div class="html-editor--table-edit-separate-indicator">
                          <button class="html-editor--table-edit-separate-indicator-dot"></button>
                          <button class="html-editor--table-edit-separate-indicator-button">
                              +
                          </button>
                      </div>
                  </div>
                  <div style="position: relative; height: 100%; width: 0;">
                    <button class="html-editor--table-edit-delete">
                      x
                    </button>
                  </div>
              </div>
              </div>
            `
              );
            }
            initRowColButtonsEvents(tr.cells[0], table);
          }
        }
        colCount--;
      }
    }

    function initCellEvents(table) {
      let cells = table.getElementsByClassName('table-cell');

      for (let i = 0; i < cells.length; i++) {
        const element = cells[i];
        element.addEventListener('click', function (event) {
          selectCell(event);
          self.checkTableId(event.target, id, 'table-container');
        });
        element.addEventListener('keydown', function (event) {
          if (event.key !== 'Shift') {
            let elementHeight = element.getBoundingClientRect().height - 1;
            if (cellSize !== elementHeight) {
              changeCellsSizeInRow(event, element);
            }
          }
        });
        element.addEventListener('keyup', function (event) {
          if (event.key !== 'Shift') {
            changeCellsSizeInRow(event, element);
          }
        });
        element.addEventListener('drop', function (event) {
          setTimeout(() => {
            changeCellsSizeInRow(event, element);
          }, 500);
        });
      }
    }

    function changeCellsSizeInRow(event, element) {
      findCell(event.target, 'start');
      let elementHeight = element.getBoundingClientRect().height - 1;
      if (cellSize !== elementHeight) {
        for (
          let j = 0;
          j < (table as any).rows[self.startSelectedRowIndex].cells.length;
          j++
        ) {
          const cell = (table as any).rows[self.startSelectedRowIndex].cells[j];
          if (j !== self.startSelectedCellIndex) {
            cell.getElementsByClassName('table-cell')[0].style.minHeight =
              elementHeight + 'px';
          }
        }
      }
    }

    function setTdWidth(table) {
      var elm_bound = table.getBoundingClientRect();
      var table_wt = elm_bound.width;
      var th_length = table_th.length;
      th_width = table_wt / th_length;
      self.colWidth = th_width;
    }

    function getFirstTd(colCount) {
      return `<td>
      <div class="html-editor--table-edit-columns">
        <div style="width: ${
          730 / colCount
        }px;" class="html-editor--table-edit-columns-item">
            <button class="html-editor--table-edit-columns-item-button"></button>
              <div class="html-editor--table-edit-separate-wrap">
                  <div class="html-editor--table-edit-separate-indicator">
                      <button class="html-editor--table-edit-separate-indicator-dot"></button>
                      <button class="html-editor--table-edit-separate-indicator-button">
                        +
                      </button>
                  </div>
                </div>
                <button class="html-editor--table-edit-delete">
                    x
                </button>
                ${self.borderColumns}
            </div>
            </div>
        </div>
        <div class="table-cell" >
          <div contenteditable="true" ></div>
        </div>
      </td>`;
    }

    setTimeout(() => {
      if (!existTable) {
        this.deleteTableSelection(id);
      }

      container = self.findHTMLElementById(
        'table-container',
        'table-container-' + id
      );

      table = self.findHTMLElementById('table', 'table_resize_' + id);
      if (existTable) {
        table_th = (existTable as any).rows[0].getElementsByTagName('td');
      } else {
        table_th = (table as any).rows[0].getElementsByTagName('td');
      }

      container.style.position = 'relative';

      let selectAllButton = self.findHTMLElementById(
        'select-all',
        'select-all-' + id
      );
      selectAllButton.addEventListener('click', function () {
        selectCells(table, 'all');
        self.selectedTable = id;
        let deleteColumnsButtons =
          self.editableContainer.nativeElement.getElementsByClassName(
            'html-editor--table-edit-delete show'
          );
        for (let index = 0; index < deleteColumnsButtons.length; index++) {
          const element = deleteColumnsButtons[index];
          element.classList.remove('show');
        }
      });

      self.clickOutsideList.push({
        element: self.findHTMLElementById(
          'table-container',
          'table-container-' + id
        ),
        elementId: 'table-container-' + id,
        toDo: function () {
          self.selectedTableId = null;
          let tableContainer = self.findHTMLElementById(
            'table-container',
            'table-container-' + id
          );
          if (tableContainer) {
            tableContainer.classList.remove('over-index');
            tableContainer.classList.add('html-editor--hide-actions');
            let allActiveTDs = tableContainer.querySelectorAll('td.active');
            allActiveTDs.forEach((actTD) => {
              (actTD as HTMLElement).classList.remove('active');
            });
          }
        },
      });

      self.initRowsBordersButtons(table);
      self.initColsBordersButtons(table);
      initRowColButtonsEvents(table, table);
      initCellEvents(table);
      setTdWidth(table);
      self.resizableGrid(table);

      table.addEventListener(
        'click',
        function (event: any) {
          if (self.clickOutsideList.length) {
            self.clickOutsideList.map((item) => {
              if (
                !item.element.contains(event.target) &&
                !event.target.className.includes(
                  'html-editor--drb-wrap--item button'
                )
              ) {
                item.toDo();
              }
            });
          }
        },
        true
      );
    }, 200);
    if (!existTable) {
      self.setHeaders('row', 'table_resize_' + id);
    }
  }

  generatecol6(value) {
    let col1, col2, col3, col3Html;
    let id = `row-${(~~(Math.random() * 1e8)).toString(16)}`;
    let self = this;

    switch (value) {
      case '1:1':
        col1 = 'layout-col html-editor--col-6';
        col2 = 'layout-col html-editor--col-6';
        break;
      case '1:3':
        col1 = 'layout-col html-editor--col-3';
        col2 = 'layout-col html-editor--col-9';
        break;
      case '3:1':
        col1 = 'layout-col html-editor--col-9';
        col2 = 'layout-col html-editor--col-3';
        break;
      case '1:1:1':
        col1 = 'layout-col html-editor--col-4';
        col2 = 'layout-col html-editor--col-4';
        col3 = 'layout-col html-editor--col-4';
        break;
      case '1:2:1':
        col1 = 'layout-col html-editor--col-3';
        col2 = 'layout-col html-editor--col-6';
        col3 = 'layout-col html-editor--col-3';
        break;
    }

    col3Html = `
      <div id="${
        id + '-column-3'
      }" class="${col3} m-l-20" contenteditable="false">
        <div class="marker-l row-marker"></div>
        <div contenteditable="true" class="html-editor--content">
          <div class="html-editor--inside-container"></div>
        </div>
        </div>
      `;

    var col = `
          <div contenteditable="true" class="html-editor--inside-container"></div>
          <div class="html-editor--row pos-r" id="${id}" type="${value}">
            <div id="${
              id + '-column-1'
            }" class="${col1}" contenteditable="false">
              <div class="marker-r row-marker"></div>
              <div contenteditable="true" class="html-editor--content">
              <div class="html-editor--inside-container"></div>
            </div>
          </div>
          <div id="${
            id + '-column-2'
          }" class="${col2} m-l-40" contenteditable="false">
            <div class="marker-l row-marker"></div>
            <div contenteditable="true" class="html-editor--content">
              <div class="html-editor--inside-container"></div>
            </div>
          </div>
          ${col3 ? col3Html : ''}
        </div>

        <div contenteditable="true" class="html-editor--inside-container"></div>`;
    document.execCommand('insertHTML', false, col);

    self.findHTMLElementById('html-editor--row', id).addEventListener(
      'click',
      function (event) {
        if (!self.findHTMLElementById('html-editor--row', `actions-${id}`)) {
          self.showLayoutsOptions(id);
        }
      },
      true
    );

    if (!this.checkClickOutsideElement(id)) {
      self.clickOutsideList.push({
        element: self.findHTMLElementById('html-editor--row', id),
        elementId: id,
        toDo: function () {
          self.selectedLayoutId = null;
          let layout = self.findHTMLElementById(
            'html-editor--row-actions',
            `actions-${id}`
          );
          if (layout) {
            self
              .findHTMLElementById('html-editor--row', id)
              .classList.remove('over-index');
            layout.remove();
          }
        },
      });
    }
    let column1 = document.getElementById(id + '-column-1');
    let column2 = document.getElementById(id + '-column-2');
    let column3 = document.getElementById(id + '-column-3');
    self.setInteract(id, 'column-1', column1, column2, column3, value);
    self.setInteract(id, 'column-2', column1, column2, column3, value);
  }

  generateHeaderFooter(type) {
    let id = `html-editor--${type}-block`;
    let parent = document.getElementById('edit-wrap');
    let checkHeader = document.getElementById(id);
    if (!checkHeader) {
      let self = this;
      let marker;
      if (type === 'header') {
        marker = `<div class="marker-b header-marker" contenteditable="false" ></div>`;
      } else {
        marker = `<div class="marker-t footer-marker" contenteditable="false" ></div>`;
      }

      var header = `
            <div class="html-editor--header-block pos-r" type="header" id="${id}">
              <div id="${
                id + '-column-1'
              }" class="layout-col" style="width:100%; padding:0; height:fit-content" contenteditable="false">
                <div contenteditable="true" class="html-editor--content" style="text-align: center;">
                  Your Document Title
                </div>
                </div>
              ${marker}
            </div>`;
      var footer = `
            <div class="html-editor--${type}-block p-d-flex pos-r" type="footer" id="${id}">
              <div id="${
                id + '-column-1'
              }" class="layout-col" style="width:100%; padding:0; height:fit-content" contenteditable="false">
                <div contenteditable="true" class="html-editor--content" style="text-align: center;">
                  Your Document Footer
                </div>
              </div>
              ${marker}
            </div>`;
      if (type === 'header') {
        parent.insertAdjacentHTML('afterbegin', header);
        let btn = document.getElementById('html-editor--header-btn');
        btn.classList.add('active');
      } else {
        parent.insertAdjacentHTML('beforeend', footer);
        let btn = document.getElementById('html-editor--footer-btn');
        btn.classList.add('active');
      }
      function headerFooterClick(event) {
        let blockType = this.getAttribute('type');
        let element = document.getElementById(
          `html-editor--${blockType}-block`
        );
        element.style.setProperty('border', 'dashed 1px #c0c0c0');
        if (
          !self.findHTMLElementById(
            `html-editor--${blockType}-block`,
            `actions-${id}`
          )
        ) {
          self.showLayoutsOptionsHeader(id, blockType);
        }
      }
      function keyUpEvent(event) {
        let blockType = this.getAttribute('type');
        let dateChips = this.querySelectorAll("[header-var='header_date']");
        let timeChips = this.querySelectorAll("[header-var='header_dateTime']");
        let layout = document.getElementById(
          `actions-html-editor--${blockType}-block`
        );
        if (!dateChips?.length && layout) {
          let iconList = layout.querySelectorAll(
            `[${blockType}chipdate='true']`
          );
          if (iconList.length) {
            if (iconList[0].className.includes('active-layout-icon')) {
              iconList[0].classList.remove('active-layout-icon');
            }
          }
        }
        if (!timeChips?.length && layout) {
          let iconList = layout.querySelectorAll(
            `[${blockType}chiptime='true']`
          );
          if (iconList.length) {
            if (iconList[0].className.includes('active-layout-icon')) {
              iconList[0].classList.remove('active-layout-icon');
            }
          }
        }
      }
      function keyPressEvent(event) {
        let blockType = this.getAttribute('type');
        let element = document.getElementById(
          `html-editor--${blockType}-block`
        );
        let child = document.getElementById(
          `html-editor--${blockType}-block-column-1`
        );
        if (
          child.getBoundingClientRect().height >
          element.getBoundingClientRect().height - 40
        ) {
          element.style.setProperty('min-height', 'fit-content');
        }
      }
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .removeEventListener('click', headerFooterClick, true);
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .addEventListener('click', headerFooterClick, true);
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .removeEventListener('keypress', keyPressEvent, true);
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .addEventListener('keypress', keyPressEvent, true);
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .removeEventListener('keyup', keyUpEvent, true);
      self
        .findHTMLElementById(`html-editor--${type}-block`, id)
        .addEventListener('keyup', keyUpEvent, true);

      self.clickOutsideList = self.clickOutsideList.filter((el) => {
        if (el.elementId !== `html-editor--${type}-block`) {
          return true;
        }
        return false;
      });
      if (!this.checkClickOutsideElement(id)) {
        self.clickOutsideList.push({
          element: self.findHTMLElementById(`html-editor--${type}-block`, id),
          elementId: id,
          toDo: function () {
            self.selectedLayoutId = null;
            let layout = document.getElementById(`actions-${id}`);
            if (layout) {
              self
                .findHTMLElementById(`html-editor--${type}-block`, id)
                .classList.remove('over-index');
              layout.remove();
            }

            let element = document.getElementById(`html-editor--${type}-block`);
            if (element) {
              element.style.removeProperty('border');
            } else {
              self.clickOutsideList = self.clickOutsideList.filter(function (
                item
              ) {
                if (item.elementId !== id) {
                  return true;
                }
                return false;
              });
            }
          },
        });
      }
      self.setResize(id);
    }
  }

  createLink() {
    let linkName = prompt('Link name');
    let link = prompt('Link');
    if (link && linkName) {
      document.execCommand(
        'insertHTML',
        false,
        `<a href=${link}>${linkName}</a>`
      );
    }
  }

  resizeOptions(el, imgId, EditFlag, ContainerId) {
    let self = this;

    let addDeleteFunc = function (event) {
      event.stopPropagation();
      let imgBox = self.findHTMLElementById('img-wrap', imgId);
      if (imgBox) {
        imgBox.remove();
      }
    };
    let newElement = `
      <div id="delete-actions-${imgId}" class="image-options-wrap">
        <div class="html-editor--table-actions">
          <button id="delete-${imgId}" class="html-editor--item html-editor--table-delete">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </div>
      </div>
    `;
    let layout = self.findHTMLElementById(
      'image-options-wrap',
      `delete-actions-${imgId}`
    );
    if (!layout) {
      el.classList.add('over-index');
      el.insertAdjacentHTML('beforeend', newElement);
      let layoutEv = self.findHTMLElementById(
        'image-options-wrap',
        `delete-actions-${imgId}`
      );
      layoutEv.addEventListener('click', addDeleteFunc);
    } else {
      layout.removeEventListener('click', addDeleteFunc);
      layout.addEventListener('click', addDeleteFunc);
    }
  }

  readImg() {
    this.moveCarret(this.nodeWithCarret);
    let self = this;
    let id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

    let img =
      `
          <div id='${
            self.imgContainerId + id
          }' class="img-wrap df img-container" contenteditable="false" style="height: fit-content">
          <div class="pos-r max-full" >
              <img draggable="false" class='image img' id="${
                self.imgContainerId + id
              }_imgBox" src='` +
      self.selectedAssetsImg +
      `'">
            <div class="marker-b img-marker"></div>
            <div class="marker-b-r img-marker"></div>
            <div class="marker-r img-marker"></div>
          </div>
        </div>
        <div class="html-editor--inside-container" contenteditable="true"></div>
        `;
    document.execCommand('insertHTML', false, img);

    interact(`#${self.imgContainerId + id}_imgBox`).resizable({
      edges: { left: false, right: true, bottom: true, top: false },

      listeners: {
        move(event) {
          var target = event.target;
          var x = parseFloat(target.getAttribute('data-x')) || 0;
          var y = parseFloat(target.getAttribute('data-y')) || 0;
          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 20, height: 20 },
        }),
      ],

      inertia: true,
    });
    let interval = setInterval(() => {
      let imageWrapper = self.findHTMLElementById(
        'img-wrap',
        self.imgContainerId + id
      );
      if (imageWrapper) {
        imageWrapper.addEventListener('click', function (this, event) {
          self.resizeOptions(
            this,
            self.imgContainerId + id,
            'imgEditFlag',
            'imgContainerId'
          );
          event.stopPropagation();
        });
        if (!self.checkClickOutsideElement(self.imgContainerId + id)) {
          self.clickOutsideList.push({
            element: imageWrapper,
            elementId: self.imgContainerId + id,
            toDo: function () {
              let block = document.getElementById(self.imgContainerId + id);
              if (block) {
                block.classList.remove('over-index');
              }
              let layout = self.findHTMLElementById(
                'image-options-wrap',
                `delete-actions-${self.imgContainerId + id}`
              );
              if (layout) {
                layout.remove();
              }
            },
          });
        }
        clearInterval(interval);
      }
    }, 50);
    this.showDialog = false;
    this.nodeWithCarret = null;
  }

  checkTableId(element, tableNum, name) {
    let layoutActions =
      this.editableContainer.nativeElement.getElementsByClassName(
        'html-editor--row-actions'
      );
    if (layoutActions.length) {
      while (layoutActions.length) {
        let splitArr = layoutActions[0].getAttribute('id').split('actions-');
        this.findHTMLElementById(
          'html-editor--row',
          splitArr[splitArr.length - 1]
        );
        layoutActions[0].remove();
      }
    }
    let containers =
      this.editableContainer.nativeElement.getElementsByClassName(
        'table-container'
      );
    for (let index = 0; index < containers.length; index++) {
      const element = containers[index];
      element.classList.remove('over-index');
    }
    if (element) {
      switch (element.tagName) {
        case 'TABLE':
          for (let index = 1; index <= this.tableCount; index++) {
            const element = this.findHTMLElementById(
              'table',
              'table_resize_' + index
            );
            let tableContainer = this.findHTMLElementById(
              name,
              `${name}-` + index
            );
            if (tableContainer) {
              tableContainer.classList.add('html-editor--hide-actions');
            }
          }
          this.selectedTableId = element.getAttribute('id');

          let dynamicTable = this.findHTMLElementById(
            'table-container',
            `${name}-` + tableNum
          );
          if (dynamicTable) {
            dynamicTable.classList.remove('html-editor--hide-actions');
          }

          let table = this.findHTMLElementById('table', this.selectedTableId);
          let container = this.findHTMLElementById(
            'table-container',
            `${name}-` + tableNum
          );

          let self = this;
          let tableTemplateList = `
          <div class="html-editor--drb-Table-Template">
            <div class="html-editor--drb--item">
              <button class="default-drb--item button" id="table-action-template1">
                <label>
                  <input id="table-action-Template1-checkbox" class="table-action-Template1-checkbox" hidden type="checkbox">
                  <i class="material-icons">
                    check
                  </i>
                </label>
                Gray Template
              </button>
            </div>
            <div class="html-editor--drb--item">
              <button class="default-drb--item button" id="table-action-template2">
                <label>
                  <input id="table-action-Template2-checkbox" class="table-action-Template2-checkbox" hidden type="checkbox">
                  <i class="material-icons">
                    check
                  </i>
                </label>
                Blue Template
              </button>
            </div>
          </div>
          `;
          table.insertAdjacentHTML(
            'afterend',
            `
          <div id="table-button-wrap" class="table-options-wrap">
            <div contenteditable="false">
              <div class="html-editor--table-actions">
                <button class="html-editor--item" id="html-editor--table-options" style="width: 145px;">
                  Table Options
                  <i class="material-icons">
                      keyboard_arrow_down
                  </i>
                </button>
                <div class="setarator"></div>
                <div class="html-editor--drb html-editor--hide-actions" id="html-editor--table-options-drb" style="width: calc(100% - 20px);">
                  <div class="html-editor--drb--item">
                      <button class="default-drb--item button" id="table-action-col-button">
                        <label>
                          <input id="table-action-col-checkbox" class="table-action-col-checkbox" hidden type="checkbox">
                          <i class="material-icons">
                              check
                          </i>
                        </label>
                        Header column
                      </button>
                  </div>
                  <div class="html-editor--drb--item">
                      <button class="default-drb--item button" id="table-action-row-button">
                        <label>
                          <input id="table-action-row-checkbox" class="table-action-row-checkbox" hidden type="checkbox">
                          <i class="material-icons">
                              check
                          </i>
                        </label>
                        Header row
                      </button>
                  </div>
                  <div class="html-editor--drb--item html-editor--drb--item-template">
                    <div class="">Table Templates</div>
                    <div class="html-editor--chips-drb-item-value" >
                      <i class="material-icons">
                        keyboard_arrow_right
                      </i>
                    </div>
                    ${tableTemplateList}
                  </div>
                </div>
                <button class="html-editor--item html-editor--table-delete">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
              </div>
            </div>
          </div>
        `
          );

          if (table.className.includes('header-row')) {
            this.findHTMLElementById(
              'table-action-row-checkbox',
              'table-action-row-checkbox'
            ).setAttribute('checked', 'checked');
          }
          if (table.className.includes('header-column')) {
            this.findHTMLElementById(
              'table-action-col-checkbox',
              'table-action-col-checkbox'
            ).setAttribute('checked', 'checked');
          }
          if (table.className.includes('table-template-1')) {
            this.findHTMLElementById(
              'table-action-Template1-checkbox',
              'table-action-Template1-checkbox'
            ).setAttribute('checked', 'checked');
          }
          if (table.className.includes('table-template-2')) {
            this.findHTMLElementById(
              'table-action-Template2-checkbox',
              'table-action-Template2-checkbox'
            ).setAttribute('checked', 'checked');
          }

          self.editableContainer.nativeElement
            .getElementsByClassName('html-editor--table-delete')[0]
            .addEventListener('click', function () {
              container.remove();
              self.selectedTable = null;
            });
          self.editableContainer.nativeElement
            .getElementsByClassName('html-editor--table-delete')[0]
            .addEventListener('mouseenter', function () {
              self.showRemovedAllTD(table);
            });
          self.editableContainer.nativeElement
            .getElementsByClassName('html-editor--table-delete')[0]
            .addEventListener('mouseleave', function () {
              self.showRemovedAllTD(table);
            });

          self
            .findHTMLElementById(
              'html-editor--item',
              'html-editor--table-options'
            )
            .addEventListener('click', function (event) {
              self
                .findHTMLElementById(
                  'html-editor--drb',
                  'html-editor--table-options-drb'
                )
                .classList.toggle('html-editor--hide-actions');
              event.stopPropagation();
            });
          self
            .findHTMLElementById('default-drb--item', 'table-action-col-button')
            .addEventListener('click', function (event) {
              self.setHeaders('col');
              event.stopPropagation();
            });
          self
            .findHTMLElementById('default-drb--item', 'table-action-row-button')
            .addEventListener('click', function (event) {
              self.setHeaders('row');
              event.stopPropagation();
            });
          self
            .findHTMLElementById('default-drb--item', 'table-action-template1')
            .addEventListener('click', function (event) {
              self.selectTableTemplate(table, 'template1');
              event.stopPropagation();
            });
          self
            .findHTMLElementById('default-drb--item', 'table-action-template2')
            .addEventListener('click', function (event) {
              self.selectTableTemplate(table, 'template2');
              event.stopPropagation();
            });
          container.classList.add('over-index');
          break;
        default:
          this.checkTableId(element.parentElement, tableNum, name);
          break;
      }
    }
  }

  setHeaders(type, id?) {
    if (id) {
      this.selectedTableId = id;
    }
    let table = this.findHTMLElementById('table', this.selectedTableId);
    switch (type) {
      case 'col':
        table.classList.toggle('header-column');
        if (table.className.includes('header-column')) {
          this.findHTMLElementById(
            'table-action-col-checkbox',
            'table-action-col-checkbox'
          ).setAttribute('checked', 'true');
        } else {
          this.findHTMLElementById(
            'table-action-col-checkbox',
            'table-action-col-checkbox'
          ).removeAttribute('checked');
        }
        break;
      case 'row':
        table.classList.toggle('header-row');
        if (table.className.includes('header-row')) {
          let interval = setInterval(() => {
            let element = this.findHTMLElementById(
              'table-action-row-checkbox',
              'table-action-row-checkbox'
            );
            if (element) {
              element.setAttribute('checked', 'true');
              clearInterval(interval);
            }
          }, 100);
        } else {
          let element = this.findHTMLElementById(
            'table-action-row-checkbox',
            'table-action-row-checkbox'
          );
          if (element) {
            element.removeAttribute('checked');
          }
        }
        break;
      default:
        break;
    }
  }

  selectTableTemplate(table, template?) {
    switch (template) {
      case 'template1':
        if (table.className.includes('table-template-2')) {
          this.setTableTemplate(
            table,
            'table-template-2',
            'table-action-Template2-checkbox'
          );
        }
        this.setTableTemplate(
          table,
          'table-template-1',
          'table-action-Template1-checkbox'
        );
        break;
      case 'template2':
        if (table.className.includes('table-template-1')) {
          this.setTableTemplate(
            table,
            'table-template-1',
            'table-action-Template1-checkbox'
          );
        }
        this.setTableTemplate(
          table,
          'table-template-2',
          'table-action-Template2-checkbox'
        );
        break;

      default:
        break;
    }
  }

  setTableTemplate(table, classTemp, classCheck) {
    table.classList.toggle(classTemp);
    if (table.className.includes(classTemp)) {
      let interval = setInterval(() => {
        let element = this.findHTMLElementById(classCheck, classCheck);
        if (element) {
          element.setAttribute('checked', 'true');
          clearInterval(interval);
        }
      }, 100);
    } else {
      let element = this.findHTMLElementById(classCheck, classCheck);
      if (element) {
        element.removeAttribute('checked');
      }
    }
  }

  deleteTableSelection(tableNum) {
    for (let index = 1; index <= this.tableCount; index++) {
      if (tableNum !== index) {
        const element = this.findHTMLElementById(
          'table',
          'table_resize_' + index
        );
        let tableContainer = this.findHTMLElementById(
          'table-container',
          'dynamic-table-container-' + index
        );
        if (tableContainer) {
          tableContainer.classList.add('html-editor--hide-actions');
        }
      }
    }
  }

  clickOutsideElement() {
    let self = this;
    document.addEventListener('click', function (event: any) {
      if (event.target.className !== 'select-all') {
        let deleteButton =
          self.editableContainer.nativeElement.querySelector(
            '#table-button-wrap'
          );
        if (deleteButton) {
          deleteButton.remove();
        }
        if (self.clickOutsideList.length) {
          self.clickOutsideList.map((item) => {
            if (!item.element.contains(event.target)) {
              if (item.parentElement) {
                if (!item.parentElement.contains(event.target)) {
                  item.toDo();
                }
              } else {
                item.toDo();
              }
            }
          });
        }
      }
    });
  }

  getChipObject(item, id, headerChips?) {
    let fontSizeList = `
        <div class="html-editor--drb" id="${id}_size_drb">
          <button class="html-editor--drb-wrap--item button" value="10">10px</button>
          <button class="html-editor--drb-wrap--item button" value="12">12px</button>
          <button class="html-editor--drb-wrap--item button" value="14">14px</button>
          <button class="html-editor--drb-wrap--item button" value="16">16px</button>
          <button class="html-editor--drb-wrap--item button" value="20">20px</button>
          <button class="html-editor--drb-wrap--item button" value="24">24px</button>
          <button class="html-editor--drb-wrap--item button" value="32">32px</button>
        </div>
        `;
    let fontFamilyList = `
        <div class="html-editor--drb" id="${id}_font_drb">
          <button class="html-editor--drb-wrap--item button" value="Manrope, sans-serif">Manrope</button>
          <button class="html-editor--drb-wrap--item button" value="Roboto, sans-serif">Roboto</button>
        </div>
        `;

    if (headerChips) {
      return `
      <span></span>
      <span class="html-editor--chips-wrap" header-var="${item.key}" id="${id}" contenteditable="false">
          <span class="html-editor--chips" style="font-size: 14px;">
              ${item.name}
          </span>
          <button class="html-editor--chips-icon" id="but_${id}_${item.key}">
              <i class="material-icons"> expand_more </i>
          </button>
          <div class="html-editor--chips-drb" id="drb_${id}_${item.key}">
              <div class="html-editor--chips-drb-item">
                <div class="html-editor--chips-drb-item-name p-mr-1">bold</div>
                <input id="${id}_input_txt_bold" type="checkbox" class="input_bold_${id}_txt">
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name p-mr-1">text color</div>
                  <input id="${id}_input_txt" type="color" name="head" class="input_dinamic_${id}_txt input-color_chips"
                  value="#333333">
                  <div id="${id}_txt" class="html-editor--chips-drb-item-value" txt_color="#333333">
                    #333333
                  </div>
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name p-mr-1">background color</div>
                  <input id="${id}_input_bck" type="color" name="head" class="input_dinamic_${id}_bck input-color_chips"
                  value="#ffffff00">
                  <div id="${id}_bck" class="html-editor--chips-drb-item-value" bck_color="#ffffff00">
                    transparent
                  </div>
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name">font size</div>
                  <div id="${id}_size" class="html-editor--chips-drb-item-value" font_size="14px">
                    14px
                    <i class="material-icons">
                      keyboard_arrow_right
                    </i>
                  </div>
                  ${fontSizeList}
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name">font family</div>
                  <div id="${id}_font" class="html-editor--chips-drb-item-value" font_fam="Manrope">
                  Manrope
                    <i class="material-icons">
                      keyboard_arrow_right
                    </i>
                  </div>
                  ${fontFamilyList}
              </div>
          </div>
      </span>&nbsp`;
    } else {
      return `
      <span></span>
      <span class="html-editor--chips-wrap" template-var="${item.key}" id="${id}" contenteditable="false">
          <span class="html-editor--chips" style="font-size: 14px;">
              ${item.name}
          </span>
          <button class="html-editor--chips-icon" id="but_${id}_${item.key}">
              <i class="material-icons"> expand_more </i>
          </button>
          <div class="html-editor--chips-drb" id="drb_${id}_${item.key}">
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name">key</div>
                  <div class="html-editor--chips-drb-item-value p-d-block p-text-left p-text-truncate">${item.key}</div>
              </div>
              <div class="html-editor--chips-drb-item">
                <div class="html-editor--chips-drb-item-name p-mr-1">bold</div>
                <input id="${id}_input_txt_bold" type="checkbox" class="input_bold_${id}_txt">
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name p-mr-1">text color</div>
                  <input id="${id}_input_txt" type="color" name="head" class="input_dinamic_${id}_txt input-color_chips"
                  value="#333333">
                  <div id="${id}_txt" class="html-editor--chips-drb-item-value" txt_color="#333333">
                    #333333
                  </div>
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name p-mr-1">background color</div>
                  <input id="${id}_input_bck" type="color" name="head" class="input_dinamic_${id}_bck input-color_chips"
                  value="#ffffff00">
                  <div id="${id}_bck" class="html-editor--chips-drb-item-value" bck_color="#ffffff00">
                  transparent
                  </div>
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name">font size</div>
                  <div id="${id}_size" class="html-editor--chips-drb-item-value" font_size="14px">
                    14px
                    <i class="material-icons">
                      keyboard_arrow_right
                    </i>
                  </div>
                  ${fontSizeList}
              </div>
              <div class="html-editor--chips-drb-item">
                  <div class="html-editor--chips-drb-item-name">font family</div>
                  <div id="${id}_font" class="html-editor--chips-drb-item-value" font_fam="Manrope">
                  Manrope
                    <i class="material-icons">
                      keyboard_arrow_right
                    </i>
                  </div>
                  ${fontFamilyList}
              </div>
          </div>
      </span>&nbsp`;
    }
  }

  initDrbIcon(key, id, headerChips?) {
    let self = this;
    let chip = self.findHTMLElementById('html-editor--chips-wrap', id);
    let button = self.findHTMLElementById(
      'html-editor--chips-icon',
      'but_' + id + '_' + key
    );
    let fontSizeDrb = self.findHTMLElementById(
      'html-editor--drb',
      id + '_size_drb'
    );
    let fontFamDrb = self.findHTMLElementById(
      'html-editor--drb',
      id + '_font_drb'
    );
    let colorsTextDrb = self.findHTMLElementById(
      'html-editor--drb',
      id + '_colorText_drb'
    );
    let colorsBackDrb = self.findHTMLElementById(
      'html-editor--drb',
      id + '_colorBack_drb'
    );
    let colorsTextInput = document.querySelector(
      '.input_dinamic_' + id + '_txt'
    );
    let colorsBackInput = document.querySelector(
      '.input_dinamic_' + id + '_bck'
    );
    let textBoldInput = document.querySelector('.input_bold_' + id + '_txt');

    if (colorsTextDrb) {
      let buttons = colorsTextDrb.getElementsByClassName(
        'html-editor--drb-wrap--item'
      );
      for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        element.addEventListener('click', function (event) {
          let el = self.findHTMLElementById(
            'html-editor--chips-drb-item-value',
            id + '_txt'
          );
          let value = element.getAttribute('value');
          el.childNodes[1].childNodes[2].nodeValue = value;
          el.setAttribute('txt_color', value);
          (el.getElementsByClassName('rect_color')[0] as any).style.background =
            value;
          (chip as HTMLElement).style.color = value;
          (
            chip.getElementsByClassName(
              'html-editor--chips-icon'
            )[0] as HTMLElement
          ).style.color = value;
          event.stopPropagation();
        });
      }
    }
    if (textBoldInput) {
      textBoldInput.addEventListener('click', function (event) {
        let chipContent = self.findHTMLElementById(
          'html-editor--chips-wrap',
          id
        );
        if (this.checked) {
          chipContent.style.setProperty('font-weight', '700');
          textBoldInput.setAttribute('fnt_w_b', 'true');
          textBoldInput.setAttribute('checked', 'true');
        } else {
          if (textBoldInput.getAttribute('fnt_w_b')) {
            textBoldInput.removeAttribute('fnt_w_b');
          }
          chipContent.style.removeProperty('font-weight');
          textBoldInput.removeAttribute('checked');
        }
      });
    }
    if (colorsBackInput) {
      colorsBackInput.addEventListener('change', function (event) {
        let el = self.findHTMLElementById(
          'html-editor--chips-drb-item-value',
          id + '_bck'
        );
        let value = (event.target as any).value;
        el.childNodes[0].nodeValue = value;
        el.setAttribute('bck_color', value);

        (chip as HTMLElement).style.background = value;

        event.stopPropagation();
      });
    }
    if (colorsTextInput) {
      colorsTextInput.addEventListener('change', function (event) {
        let el = self.findHTMLElementById(
          'html-editor--chips-drb-item-value',
          id + '_txt'
        );
        let value = (event.target as any).value;
        el.childNodes[0].nodeValue = value;
        el.setAttribute('txt_color', value);
        (chip as HTMLElement).style.color = value;
        (
          chip.getElementsByClassName(
            'html-editor--chips-icon'
          )[0] as HTMLElement
        ).style.color = value;
        event.stopPropagation();
      });
    }

    if (colorsBackDrb) {
      let buttons = colorsBackDrb.getElementsByClassName(
        'html-editor--drb-wrap--item'
      );
      for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        element.addEventListener('click', function (event) {
          let el = self.findHTMLElementById(
            'html-editor--chips-drb-item-value',
            id + '_bck'
          );
          let value = element.getAttribute('value');
          el.childNodes[1].childNodes[2].nodeValue = value;
          el.setAttribute('bck_color', value);
          (el.getElementsByClassName('rect_color')[0] as any).style.background =
            value;
          (chip as HTMLElement).style.background = value;
          event.stopPropagation();
        });
      }
    }

    if (fontFamDrb) {
      let buttons = fontFamDrb.getElementsByClassName(
        'html-editor--drb-wrap--item'
      );
      for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        element.addEventListener('click', function (event) {
          let el = self.findHTMLElementById(
            'html-editor--chips-drb-item-value',
            id + '_font'
          );
          let value = element.getAttribute('value');
          el.childNodes[0].nodeValue = value;
          el.setAttribute('font_fam', value);
          (
            chip.getElementsByClassName('html-editor--chips')[0] as HTMLElement
          ).style.setProperty('font-family', value, 'important');
          event.stopPropagation();
        });
      }
    }

    if (fontSizeDrb) {
      let buttons = fontSizeDrb.getElementsByClassName(
        'html-editor--drb-wrap--item'
      );
      for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        element.addEventListener('click', function (event) {
          let el = self.findHTMLElementById(
            'html-editor--chips-drb-item-value',
            id + '_size'
          );
          let value = element.getAttribute('value');
          el.childNodes[0].nodeValue = value + 'px';
          el.setAttribute('font_size', value);
          (
            chip.getElementsByClassName('html-editor--chips')[0] as HTMLElement
          ).style.fontSize = value + 'px';
          event.stopPropagation();
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event: any) {
        self.removeHeaderFoterActions();
        let drb = self.findHTMLElementById(
          'html-editor--chips-drb',
          'drb_' + id + '_' + key
        );
        let boolShow;
        for (let index = 0; index < drb.classList.length; index++) {
          const element = drb.classList[index];
          if (element === 'show') {
            boolShow = true;
            break;
          }
        }
        let textBoldInput = document.querySelector(
          '.input_bold_' + id + '_txt'
        );
        let fontBoldBool = textBoldInput.getAttribute('fnt_w_b');
        if (textBoldInput) {
          if (fontBoldBool) {
            textBoldInput.setAttribute('checked', 'true');
          } else {
            if (textBoldInput.getAttribute('checked')) {
              textBoldInput.removeAttribute('checked');
            }
          }
        }
        if (boolShow) {
          drb.classList.remove('show');
        } else {
          drb.classList.add('show');
        }

        if (!self.checkClickOutsideElement('but_' + id + '_' + key)) {
          self.clickOutsideList.push({
            element: button,
            elementId: 'but_' + id + '_' + key,
            toDo: function () {
              if (drb) {
                drb.classList.remove('show');
              }
            },
          });
        }
      });
    }
  }

  showRemovedTD(table) {
    let activeTds = table.querySelectorAll('td.active');
    for (let index = 0; index < activeTds.length; index++) {
      const element = activeTds[index];
      element.classList.toggle('to_remove');
    }
  }

  showRemovedAllTD(table) {
    let tds = table.getElementsByTagName('td');
    for (let index = 0; index < tds.length; index++) {
      const td = tds[index];
      td.classList.toggle('to_remove');
    }
  }

  showLayoutsOptions(id) {
    this.selectedLayoutId = id;
    let layout = this.findHTMLElementById('html-editor--row', id);
    let layouts = this.editableContainer.nativeElement.getElementsByClassName(
      'html-editor--row-actions'
    );
    if (layouts.length) {
      while (layouts.length) {
        layouts[0].remove();
      }
    }
    let self = this;
    let buttonsWrap = `
    <div class="html-editor--row-actions over-index" id="actions-${id}" contenteditable="false">
      <div class="html-editor--row-actions-inside">
          <button class="doc-layouts-button">
              <i class="html-editor--row-actions-icon" type="1:1">
                  <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M5 5h5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 0h5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
              </i>
          </button>
          <button class="doc-layouts-button">
              <i class="material-icons html-editor--row-actions-icon" type="1:1:1">
                  <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M5 5h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm6 0h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm6 0h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
              </i>
          </button>
          <button class="doc-layouts-button">
              <i class="material-icons html-editor--row-actions-icon" type="3:1">
                  <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M18 5h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM5 5h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
              </i>
          </button>
          <button class="doc-layouts-button">
              <i class="material-icons html-editor--row-actions-icon" type="1:3">
                  <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M5 5h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm5 0h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
              </i>
          </button>
          <button class="doc-layouts-button">
              <i class="material-icons html-editor--row-actions-icon" type="1:2:1">
                  <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M5 5a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm4 0h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
              </i>
          </button>
      </div>
      <button>
        <i class="material-icons html-editor--row-actions-icon" type="border">
          border_style
        </i>
      </button>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" type="delete" height="24" class="html-editor--row-actions-icon" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    </div>
    `;
    if (layout) {
      layout.insertAdjacentHTML('beforeend', buttonsWrap);
    }
    let firstColumnLayout = self.findHTMLElementById(
      'layout-col',
      `${id}-column-1`
    );
    if (
      firstColumnLayout &&
      firstColumnLayout.className.includes('toogle-layout-border')
    ) {
      firstColumnLayout.classList.add('doted-border');
      if (self.findHTMLElementById('layout-col', `${id}-column-2`)) {
        self
          .findHTMLElementById('layout-col', `${id}-column-2`)
          .classList.add('doted-border');
      }
      if (self.findHTMLElementById('layout-col', `${id}-column-3`)) {
        self
          .findHTMLElementById('layout-col', `${id}-column-3`)
          .classList.add('doted-border');
      }
    }
    let col1, col2, col3;
    let actionIcons =
      self.editableContainer.nativeElement.getElementsByClassName(
        'html-editor--row-actions-icon'
      );
    for (let index = 0; index < actionIcons.length; index++) {
      const icon = actionIcons[index];
      let type = icon.getAttribute('type');
      if (type === layout.getAttribute('type')) {
        this.checkActiveLayoutsButtons(icon);
      }
      if (type === 'border') {
        if (
          firstColumnLayout &&
          firstColumnLayout.className.includes('toogle-layout-border')
        ) {
          icon.classList.add('active-border-icon');
        }
      }

      icon.addEventListener('click', function () {
        if (type !== 'border') {
          self
            .findHTMLElementById('html-editor--row', id)
            .setAttribute('type', type);
        }

        if (type === 'delete') {
          self.findHTMLElementById('html-editor--row', id).remove();
        } else if (type === 'border') {
          if (firstColumnLayout) {
            firstColumnLayout.classList.toggle('toogle-layout-border');
            firstColumnLayout.classList.toggle('doted-border');
            if (firstColumnLayout.className.includes('toogle-layout-border')) {
              icon.classList.add('active-border-icon');
            } else {
              icon.classList.remove('active-border-icon');
            }
          }
          if (self.findHTMLElementById('layout-col', `${id}-column-2`)) {
            self
              .findHTMLElementById('layout-col', `${id}-column-2`)
              .classList.toggle('toogle-layout-border');
            self
              .findHTMLElementById('layout-col', `${id}-column-2`)
              .classList.toggle('doted-border');
          }
          if (self.findHTMLElementById('layout-col', `${id}-column-3`)) {
            self
              .findHTMLElementById('layout-col', `${id}-column-3`)
              .classList.toggle('toogle-layout-border');
            self
              .findHTMLElementById('layout-col', `${id}-column-3`)
              .classList.toggle('doted-border');
          }
        } else {
          col3 = null;
          switch (type) {
            case '1:1':
              col1 = 'html-editor--col-6';
              col2 = 'html-editor--col-6';
              break;
            case '1:3':
              col1 = 'html-editor--col-3';
              col2 = 'html-editor--col-9';
              break;
            case '3:1':
              col1 = 'html-editor--col-9';
              col2 = 'html-editor--col-3';
              break;
            case '1:1:1':
              col1 = 'html-editor--col-4';
              col2 = 'html-editor--col-4';
              col3 = 'html-editor--col-4';
              break;
            case '1:2:1':
              col1 = 'html-editor--col-3';
              col2 = 'html-editor--col-6';
              col3 = 'html-editor--col-3';
              break;
          }
          let l1 = self.findHTMLElementById('layout-col', `${id}-column-1`);
          let l2 = self.findHTMLElementById('layout-col', `${id}-column-2`);
          let l3 = self.findHTMLElementById('layout-col', `${id}-column-3`);
          l1.removeAttribute('style');
          l1.className = '';
          l1.classList.add('layout-col');
          l1.classList.add(col1);
          l2.className = '';
          l2.removeAttribute('style');
          l2.classList.add('layout-col');
          l2.classList.add(col2);
          if (type === '1:1' || type === '1:3' || type === '3:1') {
            l2.classList.add('m-l-20');
            if (l3) {
              l3.remove();
            }
          } else {
            l2.classList.add('m-l-20');
          }
          if (l3) {
            l3.className = '';
            l3.removeAttribute('style');
            l3.classList.add('layout-col');
            l3.classList.add(col3);
          }
          self.clickOnLayoutsAction(icon, col3, id);
          let borderIcons = layout.getElementsByClassName('active-border-icon');
          if (borderIcons.length) {
            borderIcons[0].classList.remove('active-border-icon');
          }
          self.setInteract(id, 'column-1', l1, l2, l3, type);
          self.setInteract(id, 'column-2', l1, l2, l3, type);
          self.setInteract(id, 'column-3', l1, l2, l3, type);
        }
      });
      if (type === 'delete') {
        icon.addEventListener('mouseenter', function (event) {
          icon.classList.toggle('active-delete-icon');
          self.showRemovedLayouts(id, true);
        });
        icon.addEventListener('mouseleave', function (event) {
          icon.classList.toggle('active-delete-icon');
          self.showRemovedLayouts(id, true);
        });
      }
    }
  }

  showLayoutsOptionsHeader(id, type) {
    this.selectedLayoutId = id;
    let layout = this.findHTMLElementById(`html-editor--${type}-block`, id);
    let self = this;
    let buttonsWrap = `
    <div class="html-editor--${type}-actions p-d-flex p-ai-center over-index" id="actions-${id}" contenteditable="false">
      <div class="html-editor--${type}-actions-inside p-d-flex p-ai-center" >
          <button class="doc-layouts-button" parent="${type}" type="time">
            <span class="material-icons html-editor--${type}-actions-icon" ${type}chiptime='true' parent="${type}" type="time">
              schedule
            </span>
            <div class="doc-${type}-layouts-button-tooltip" type="time">Add datetime</div>
          </button>
          <button class="doc-layouts-button" parent="${type}" type="date">
            <svg xmlns="http://www.w3.org/2000/svg" class="html-editor--${type}-actions-icon" height="24"  ${type}chipdate="true" parent="${type}" type="date" viewBox="0 -960 960 960" width="24">
              <path d="M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
            </svg>
            <div class="doc-${type}-layouts-button-tooltip" type="date">Add date</div>
          </button>
          <button class="doc-layouts-button" parent="${type}" type="page">
            <svg xmlns="http://www.w3.org/2000/svg" class="html-editor--${type}-actions-icon" parent="${type}" type="page" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"/>
            </svg>
            <div class="doc-${type}-layouts-button-tooltip" type="page">Add pagination</div>
          </button>
          </div>
          <button class="doc-layouts-button" parent="${type}" type="color">
            <input id="${id}_input" type="color" name="Cell_color" parent="${type}" class="input_dinamic_Cell html-editor--${type}-actions-icon"
            value="#ffffff">
            <div class="doc-${type}-layouts-button-tooltip" type="color">Change background-color</div>
          </button>
          <button class="doc-layouts-button" parent="${type}" type="border">
            <span class="material-icons html-editor--${type}-actions-icon" parent="${type}" type="border">
              power_input
            </span>
            <div class="doc-${type}-layouts-button-tooltip" type="border">Show / Hide border</div>
          </button>
          <button  class="doc-layouts-button delete-btn" parent="${type}">
              <svg xmlns="http://www.w3.org/2000/svg" class="html-editor--${type}-actions-icon" parent="${type}" type="delete" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
              </svg>
              <div class="doc-${type}-layouts-button-tooltip" type="delete">Remove</div>
          </button>
    </div>
    `;
    let block = document.getElementById(`actions-${id}`);
    if (!block) {
      if (type === 'header') {
        layout.insertAdjacentHTML('beforeend', buttonsWrap);
      } else {
        layout.insertAdjacentHTML('afterbegin', buttonsWrap);
      }
      let contentColor;
      contentColor = layout.style.background;
      if (contentColor) {
        let element = document.getElementById(`${id}_input`);
        if (element) {
          element.setAttribute('value', self.toHexc(contentColor));
        }
      }
      let actionIcons =
        self.editableContainer.nativeElement.getElementsByClassName(
          `html-editor--${type}-actions-icon`
        );
      for (let index = 0; index < actionIcons.length; index++) {
        const icon = actionIcons[index];
        let type = icon.getAttribute('type');
        let parentType = icon.getAttribute('parent');
        if (type === layout.getAttribute('type')) {
          self.checkActiveLayoutsButtons(icon);
        }
        if (type === 'border') {
          if (layout && layout.className.includes('toogle-layout-border')) {
            icon.classList.add('active-layout-icon');
          }
        } else if (type === 'page') {
          let pageList = layout.getElementsByClassName('pageNumber-wrap');
          if (pageList?.length) {
            icon.classList.add('active-layout-icon');
          }
        } else if (type === 'time') {
          let timeChip = document.getElementById(
            `html-editor--${parentType}-time-chip`
          );
          if (timeChip) {
            icon.classList.add('active-layout-icon');
          }
        } else if (type === 'date') {
          let dateChip = document.getElementById(
            `html-editor--${parentType}-date-chip`
          );
          if (dateChip) {
            icon.classList.add('active-layout-icon');
          }
        }

        icon.addEventListener('click', function (event) {
          let btnType = this.getAttribute('parent');
          let typeAction = this.getAttribute('type');
          switch (typeAction) {
            case 'delete':
              let element = document.getElementById(
                `html-editor--${btnType}-block`
              );
              if (element) {
                element.remove();
              }
              if (btnType === 'header') {
                self.heightHeader = 0;
              } else {
                self.heightFooter = 0;
              }
              let btn = document.getElementById(`html-editor--${btnType}-btn`);
              btn.classList.remove('active');
              break;
            case 'page':
              let pageBox = `<div class="pageNumber-wrap"><span class="pageNumber">1</span>/<span class="totalPages">-</span></div>`;
              let pageList = layout.getElementsByClassName('pageNumber-wrap');
              if (pageList?.length) {
                pageList[0].remove();
                icon.classList.remove('active-layout-icon');
              } else {
                layout.insertAdjacentHTML('beforeend', pageBox);
                icon.classList.add('active-layout-icon');
              }
              break;
            case 'time':
              let timeChip = document.getElementById(
                `html-editor--${btnType}-time-chip`
              );
              if (!timeChip) {
                self.addTymeDateChipsInHeaderFooter('time', btnType);
                if (
                  document.getElementById(`html-editor--${btnType}-time-chip`)
                ) {
                  icon.classList.add('active-layout-icon');
                }
              } else {
                timeChip.remove();
                icon.classList.remove('active-layout-icon');
              }
              break;
            case 'date':
              let dateChip = document.getElementById(
                `html-editor--${btnType}-date-chip`
              );
              if (!dateChip) {
                self.addTymeDateChipsInHeaderFooter('date', btnType);
                if (
                  document.getElementById(`html-editor--${btnType}-date-chip`)
                ) {
                  icon.classList.add('active-layout-icon');
                }
              } else {
                dateChip.remove();
                icon.classList.remove('active-layout-icon');
              }
              break;
            case 'border':
              if (layout) {
                layout.classList.toggle('toogle-layout-border');
                layout.classList.toggle('doted-border-' + btnType);
                if (layout.className.includes('toogle-layout-border')) {
                  icon.classList.add('active-layout-icon');
                } else {
                  icon.classList.remove('active-layout-icon');
                }
              }
              break;
            default:
              break;
          }
        });
        icon.addEventListener('mouseenter', function (event) {
          let btnType = this.getAttribute('parent');
          let typeAction = this.getAttribute('type');
          let tooltipList = document.getElementsByClassName(
            `doc-${btnType}-layouts-button-tooltip`
          );
          let tootip;
          if (tooltipList.length) {
            for (let index = 0; index < tooltipList.length; index++) {
              const element = tooltipList[index];
              if (element.getAttribute('type') === typeAction) {
                tootip = element;
              }
            }
          }
          if (tootip) {
            if (
              typeAction === 'time' ||
              typeAction === 'date' ||
              typeAction === 'page'
            ) {
              tootip.setAttribute('style', 'display:block; top: -35px');
            } else {
              tootip.setAttribute('style', 'display:block');
            }
          }
        });
        icon.addEventListener('mouseleave', function (event) {
          let btnType = this.getAttribute('parent');
          let typeAction = this.getAttribute('type');
          let tooltipList = document.getElementsByClassName(
            `doc-${btnType}-layouts-button-tooltip`
          );
          let tootip;
          if (tooltipList.length) {
            for (let index = 0; index < tooltipList.length; index++) {
              const element = tooltipList[index];
              if (element.getAttribute('type') === typeAction) {
                tootip = element;
              }
            }
          }
          if (tootip) {
            tootip.removeAttribute('style');
          }
        });
        if (type === 'color') {
          icon.addEventListener('change', function (event, id) {
            let color = event.target.value;
            layout.style.setProperty('background', color);
            event.stopPropagation();
          });
        }
        if (type === 'delete') {
          icon.addEventListener('mouseenter', function (event) {
            icon.classList.toggle('active-delete-icon');
            self.showRemovedBlock(id);
          });
          icon.addEventListener('mouseleave', function (event) {
            icon.classList.toggle('active-delete-icon');
            self.showRemovedBlock(id);
          });
        }
      }
    }
  }

  showRemovedLayouts(id, row?) {
    this.findHTMLElementById('layout-col', `${id}-column-1`).classList.toggle(
      'to_remove'
    );
    if (row) {
      this.findHTMLElementById('layout-col', `${id}-column-2`).classList.toggle(
        'to_remove'
      );
      if (this.findHTMLElementById('layout-col', `${id}-column-3`)) {
        this.findHTMLElementById(
          'layout-col',
          `${id}-column-3`
        ).classList.toggle('to_remove');
      }
    }
  }

  showRemovedBlock(id) {
    document.getElementById(id).classList.toggle('to_remove');
  }

  clickOnLayoutsAction(activeButton: Element, col3, id) {
    if (this.findHTMLElementById('layout-col', `${id}-column-3`)) {
      this.findHTMLElementById('layout-col', `${id}-column-3`).remove();
    }
    if (col3) {
      let col3Html = `
        <div id="${
          id + '-column-3'
        }" class="layout-col ${col3} m-l-20" contenteditable="false">
          <div contenteditable="true" class="html-editor--content">
            <div class="html-editor--inside-container"></div>
          </div>
        </div>
      `;
      this.findHTMLElementById(
        'layout-col',
        `${id}-column-2`
      ).insertAdjacentHTML('afterend', col3Html);
    }
    this.checkActiveLayoutsButtons(activeButton);
  }

  checkActiveLayoutsButtons(activeButton) {
    let buttons =
      this.editableContainer.nativeElement.getElementsByClassName(
        `doc-layouts-button`
      );
    for (let index = 0; index < buttons.length; index++) {
      const button = buttons[index];
      button.classList.remove('active');
    }
    activeButton.parentElement.classList.add('active');
  }

  initRowsBordersButtons(table: Element) {
    let self = this;
    let rowsBorders = table.getElementsByClassName(
      'html-editor--borders-row-label'
    );
    for (let index = 0; index < rowsBorders.length; index++) {
      let element = rowsBorders[index];
      let type = element.getAttribute('type');
      switch (type) {
        case 'bottom':
          element.addEventListener('click', function (event) {
            setCellsBordersinRow(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'top':
          element.addEventListener('click', function (event) {
            setCellsBordersinRow(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'left':
          element.addEventListener('click', function (event) {
            setCellsBordersinRow(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'right':
          element.addEventListener('click', function (event) {
            setCellsBordersinRow(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;

        default:
          break;
      }
    }

    function setCellsBordersinRow(type) {
      const row = (table as any).rows[self.startSelectedRowIndex];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        switch (type) {
          case 'bottom':
            cell.classList.toggle('html-editor--hide-bottom');
            if ((table as any).rows[self.startSelectedRowIndex + 1]) {
              (table as any).rows[self.startSelectedRowIndex + 1].cells[
                j
              ].classList.toggle('html-editor--hide-top');
            }
            break;
          case 'top':
            cell.classList.toggle('html-editor--hide-top');
            if ((table as any).rows[self.startSelectedRowIndex - 1]) {
              (table as any).rows[self.startSelectedRowIndex - 1].cells[
                j
              ].classList.toggle('html-editor--hide-bottom');
            }
            break;
          case 'left':
            cell.classList.toggle('html-editor--hide-left');
            if (row.cells[j - 1]) {
              row.cells[j - 1].classList.toggle('html-editor--hide-right');
            }
            if (j == row.cells.length - 1) {
              row.cells[j].classList.toggle('html-editor--hide-right');
            }
            break;
          case 'right':
            cell.classList.toggle('html-editor--hide-right');
            if (row.cells[j + 1]) {
              row.cells[j + 1].classList.toggle('html-editor--hide-left');
            }
            if (j == 0) {
              row.cells[j].classList.toggle('html-editor--hide-left');
            }
            break;
          default:
            break;
        }
      }
    }
  }

  initColsBordersButtons(table: Element) {
    let self = this;
    let colBorders = table.getElementsByClassName(
      'html-editor--borders-column-label'
    );
    for (let index = 0; index < colBorders.length; index++) {
      let element = colBorders[index];
      let type = element.getAttribute('type');
      switch (type) {
        case 'bottom':
          element.addEventListener('click', function (event) {
            setCellsBordersinColumn(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'top':
          element.addEventListener('click', function (event) {
            setCellsBordersinColumn(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'left':
          element.addEventListener('click', function (event) {
            setCellsBordersinColumn(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;
        case 'right':
          element.addEventListener('click', function (event) {
            setCellsBordersinColumn(type);
            event.stopPropagation();
            event.preventDefault();
          });
          break;

        default:
          break;
      }
    }

    function setCellsBordersinColumn(type) {
      let rows = (table as any).rows;
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        switch (type) {
          case 'bottom':
            row.cells[self.startSelectedCellIndex].classList.toggle(
              'html-editor--hide-bottom'
            );
            if (rows[index + 1]) {
              rows[index + 1].cells[
                self.startSelectedCellIndex
              ].classList.toggle('html-editor--hide-top');
            }
            if (index == 0) {
              rows[index].cells[self.startSelectedCellIndex].classList.toggle(
                'html-editor--hide-top'
              );
            }
            break;
          case 'top':
            row.cells[self.startSelectedCellIndex].classList.toggle(
              'html-editor--hide-top'
            );
            if (rows[index - 1]) {
              rows[index - 1].cells[
                self.startSelectedCellIndex
              ].classList.toggle('html-editor--hide-bottom');
            }
            if (index == rows.length - 1) {
              rows[index].cells[self.startSelectedCellIndex].classList.toggle(
                'html-editor--hide-bottom'
              );
            }
            break;
          case 'left':
            row.cells[self.startSelectedCellIndex].classList.toggle(
              'html-editor--hide-left'
            );
            if (row.cells[self.startSelectedCellIndex - 1]) {
              row.cells[self.startSelectedCellIndex - 1].classList.toggle(
                'html-editor--hide-right'
              );
            }
            break;
          case 'right':
            row.cells[self.startSelectedCellIndex].classList.toggle(
              'html-editor--hide-right'
            );
            if (row.cells[self.startSelectedCellIndex + 1]) {
              row.cells[self.startSelectedCellIndex + 1].classList.toggle(
                'html-editor--hide-left'
              );
            }
            break;
          default:
            break;
        }
      }
    }
  }

  checkClickOutsideElement(id) {
    let arr = this.clickOutsideList.filter((element) => {
      if (element.elementId == id) {
        return true;
      }
      return false;
    });
    if (!arr || !arr.length) {
      return false;
    } else {
      return true;
    }
  }

  readVideo() {
    this.moveCarret(this.nodeWithCarret);
    let self = this;
    let id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    let video = `
        <div id='${
          self.videoContainerId + id
        }' class="img-wrap df youtube-box img-container" contenteditable="false" style="height: fit-content;cursor: col-resize;width: fit-content; padding:2px 0">
        <iframe class="youtube-wrap" src="${
          self.selectedAssetsVideo
        }" frameborder="0" style="pointer-events: all" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        <div class="marker-b img-marker"></div>
        <div class="marker-b-r img-marker"></div>
        <div class="marker-r img-marker"></div>
        </div>
        <div class="html-editor--inside-container" contenteditable="true"></div>
        `;
    document.execCommand('insertHTML', false, video);

    interact(`#${self.videoContainerId + id}`).resizable({
      edges: { left: false, right: true, bottom: true, top: false },

      listeners: {
        move(event) {
          var target = event.target;
          var x = parseFloat(target.getAttribute('data-x')) || 0;
          var y = parseFloat(target.getAttribute('data-y')) || 0;
          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 100, height: 100 },
        }),
      ],

      inertia: true,
    });
    let interval = setInterval(() => {
      let videoWrapper = document.getElementById(self.videoContainerId + id);

      if (videoWrapper) {
        videoWrapper.addEventListener('click', function (this, event) {
          event.preventDefault();
          self.resizeOptions(
            this,
            self.videoContainerId + id,
            'videoEditFlag',
            'videoContainerId'
          );
        });
        if (!self.checkClickOutsideElement(id)) {
          self.clickOutsideList.push({
            element: videoWrapper,
            elementId: self.videoContainerId + id,
            toDo: function () {
              let block = document.getElementById(self.videoContainerId + id);
              if (block) {
                block.classList.remove('over-index');
              }
              let layout = self.findHTMLElementById(
                'image-options-wrap',
                `delete-actions-${self.videoContainerId + id}`
              );
              if (layout) {
                layout.remove();
              }
            },
          });
        }
      }
      clearInterval(interval);
    }, 50);
    this.nodeWithCarret = null;
    this.showVideoDialog = false;
    this.showDialog = false;
  }

  writeValue(value: any) {
    if (value) {
      this.content = value;
      this.propagateChange(value);
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  onDomChange(event): void {
    if (event && event.length) {
      this.propagateChange(this.editableContainer.nativeElement.innerHTML);
    }
  }

  findHTMLElementById(className, id) {
    let element = null;
    if (this.editableContainer.nativeElement) {
      this.editableContainer.nativeElement
        .querySelectorAll('.' + className)
        .forEach((el) => {
          if ((el as HTMLElement).getAttribute('id') === id) {
            element = el;
          }
        });
    }
    return element;
  }

  findHRElementById(id) {
    let element = null;
    if (this.editableContainer.nativeElement) {
      this.editableContainer.nativeElement
        .querySelectorAll('hr')
        .forEach((el) => {
          if ((el as HTMLElement).getAttribute('id') === id) {
            element = el;
          }
        });
    }
    return element;
  }

  insertHorizontalRule(breakLine?) {
    let self = this;
    let id = `${(~~(Math.random() * 1e8)).toString(16)}`;
    document.execCommand('insertHorizontalRule', false, id);
    if (breakLine) {
      self.onClickLineBreak(id);
    } else {
      self.onClickLine(id);
    }
  }

  onClickLineBreak(id) {
    let self = this;
    let htmlOptions = `
    <div id="line-button-wrap-break-${id}" class="table-options-wrap-break over-index">
      <div contenteditable="false">
        <div class="html-editor--table-actions">
            <button id="delete-break-page-rule" class="html-editor--item html-editor--table-delete">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
        </div>
      </div>
    </div>
    `;

    let line = this.findHRElementById(id);
    (line as HTMLElement).style.paddingBottom = '1rem';
    (line as HTMLElement).style.breakAfter = 'page';
    (line as HTMLElement).classList.add('break-page-line');

    line.addEventListener('click', (event) => {
      let lineOptions = this.findHTMLElementById(
        'table-options-wrap-break',
        `line-button-wrap-break-${id}`
      );

      if (!lineOptions) {
        line.insertAdjacentHTML('afterend', htmlOptions);
        lineOptions = this.findHTMLElementById(
          'table-options-wrap-break',
          `line-button-wrap-break-${id}`
        );
        let deleteLineButton = this.findHTMLElementById(
          'html-editor--table-delete',
          'delete-break-page-rule'
        );

        deleteLineButton.addEventListener('click', () => {
          lineOptions.remove();
          line.remove();
        });
        let lineStyle = null;
        deleteLineButton.addEventListener('mouseenter', () => {
          lineStyle = line.style.borderTopColor;
          line.style.borderTopColor = '#ff5630';
        });
        deleteLineButton.addEventListener('mouseleave', () => {
          if (lineStyle) {
            line.style.borderTopColor = lineStyle;
            lineStyle = null;
          } else {
            line.style.borderTopColor = '#F37E21';
          }
        });

        if (this.checkClickOutsideElement(`line-button-wrap-break-${id}`)) {
          this.clickOutsideList = this.clickOutsideList.filter((item) => {
            if (item.elementId != `line-button-wrap-break-${id}`) {
              return true;
            }
            return false;
          });
        }
        this.clickOutsideList.push({
          element: lineOptions,
          parentElement: line,
          elementId: `line-button-wrap-break-${id}`,
          toDo: function () {
            self.selectedTableId = null;
            if (lineOptions) {
              lineOptions.remove();
            }
          },
        });
      }
    });
  }

  onClickLine(id) {
    let self = this;
    let colorsDrb = `
    <div class="html-editor--drb colors" style="top: -3px; left: 100%; display: none;">
      <button  style="background: #2196f3" class="html-editor--drb-wrap--item button hr" value="#2196f3"></button>
      <button  style="background: #f37e21" class="html-editor--drb-wrap--item button hr" value="#f37e21"></button>
      <button  style="background: #00c853" class="html-editor--drb-wrap--item button hr" value="#00c853"></button>
      <button  style="background: #ff6b68" class="html-editor--drb-wrap--item button hr" value="#ff6b68"></button>
      <button  style="background: #f6b45d" class="html-editor--drb-wrap--item button hr" value="#f6b45d"></button>
      <button  style="background: #175485" class="html-editor--drb-wrap--item button hr" value="#175485"></button>
      <button  style="background: #000000" class="html-editor--drb-wrap--item button hr" value="#000000"></button>
      <button  style="background: #333333" class="html-editor--drb-wrap--item button hr" value="#333333"></button>
      <button  style="background: #666666" class="html-editor--drb-wrap--item button hr" value="#666666"></button>
      <button  style="background: #999999" class="html-editor--drb-wrap--item button hr" value="#999999"></button>
      <button  style="background: #dddddd" class="html-editor--drb-wrap--item button hr" value="#dddddd"></button>
      <button  style="background: #ffffff" class="html-editor--drb-wrap--item button hr" value="#ffffff"></button>
    </div>
    `;
    let lineSizeDrb = `
      <div class="html-editor--drb" style="top: -3px; left: 100%; display: none;">
        <button class="html-editor--drb-wrap--item button hr" value="1px">1px</button>
        <button class="html-editor--drb-wrap--item button hr" value="2px">2px</button>
        <button class="html-editor--drb-wrap--item button hr" value="3px">3px</button>
        <button class="html-editor--drb-wrap--item button hr" value="4px">4px</button>
        <button class="html-editor--drb-wrap--item button hr" value="5px">5px</button>
        <button class="html-editor--drb-wrap--item button hr" value="6px">6px</button>
        <button class="html-editor--drb-wrap--item button hr" value="7px">7px</button>
        <button class="html-editor--drb-wrap--item button hr" value="8px">8px</button>
        <button class="html-editor--drb-wrap--item button hr" value="9px">9px</button>
        <button class="html-editor--drb-wrap--item button hr" value="10px">10px</button>
      </div>
      `;
    let htmlOptions = `
    <div id="line-button-wrap-${id}" class="table-options-wrap over-index">
      <div contenteditable="false">
        <div class="html-editor--table-actions">
          <button class="html-editor--item" id="html-editor--line-options" style="width: 145px;">
            Line Options
            <i class="material-icons">
                keyboard_arrow_down
            </i>
          </button>
          <div class="setarator"></div>
            <button id="delete-horizontal-rule" class="html-editor--item html-editor--table-delete">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
          <div class="html-editor--drb html-editor--hide-actions" id="html-editor--line-options-drb" style="width: calc(100% - 45px); overflow: visible;">
          <div class="html-editor--drb--item" style="position: relative">
          <button class="default-drb--item button" style="justify-content: center">
              Line color
              <i class="material-icons">
                keyboard_arrow_right
              </i>
          </button>
          ${colorsDrb}
        </div>
          <div class="html-editor--drb--item" style="position: relative">
            <button class="default-drb--item button" style="justify-content: center">
                Line size
                <i class="material-icons">
                  keyboard_arrow_right
                </i>
            </button>
          ${lineSizeDrb}
        </div>
      </div>
    </div>
    `;

    let line = this.findHRElementById(id);
    (line as HTMLElement).style.paddingBottom = '1rem';

    function setColor() {
      (line as HTMLElement).style.borderTopColor = this.getAttribute('value');
    }
    function setSize() {
      (line as HTMLElement).style.borderTopWidth = this.getAttribute('value');
    }

    line.addEventListener('click', (event) => {
      let lineOptions = this.findHTMLElementById(
        'table-options-wrap',
        `line-button-wrap-${id}`
      );
      if (!lineOptions) {
        line.insertAdjacentHTML('afterend', htmlOptions);
        lineOptions = this.findHTMLElementById(
          'table-options-wrap',
          `line-button-wrap-${id}`
        );

        let options = this.findHTMLElementById(
          'html-editor--item',
          'html-editor--line-options'
        );
        let lineOptionsDrb = this.findHTMLElementById(
          'html-editor--drb',
          'html-editor--line-options-drb'
        );
        options.addEventListener('click', () => {
          lineOptionsDrb.classList.toggle('html-editor--hide-actions');
        });
        lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[0]
          .addEventListener('mouseenter', () => {
            (
              lineOptionsDrb
                .getElementsByClassName('html-editor--drb--item')[0]
                .getElementsByClassName('html-editor--drb')[0] as HTMLElement
            ).style.display = 'flex';
          });
        lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[0]
          .addEventListener('mouseleave', () => {
            (
              lineOptionsDrb
                .getElementsByClassName('html-editor--drb--item')[0]
                .getElementsByClassName('html-editor--drb')[0] as HTMLElement
            ).style.display = 'none';
          });
        lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[1]
          .addEventListener('mouseenter', () => {
            (
              lineOptionsDrb
                .getElementsByClassName('html-editor--drb--item')[1]
                .getElementsByClassName('html-editor--drb')[0] as HTMLElement
            ).style.display = 'block';
          });
        lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[1]
          .addEventListener('mouseleave', () => {
            (
              lineOptionsDrb
                .getElementsByClassName('html-editor--drb--item')[1]
                .getElementsByClassName('html-editor--drb')[0] as HTMLElement
            ).style.display = 'none';
          });

        let colors = lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[0]
          .getElementsByClassName('html-editor--drb')[0]
          .getElementsByClassName('html-editor--drb-wrap--item');
        let sizes = lineOptionsDrb
          .getElementsByClassName('html-editor--drb--item')[1]
          .getElementsByClassName('html-editor--drb')[0]
          .getElementsByClassName('html-editor--drb-wrap--item');

        if (colors.length) {
          for (let index = 0; index < colors.length; index++) {
            const element = colors[index];
            element.addEventListener('click', setColor);
          }
        }
        if (sizes.length) {
          for (let index = 0; index < sizes.length; index++) {
            const element = sizes[index];
            element.addEventListener('click', setSize);
          }
        }

        let deleteLineButton = this.findHTMLElementById(
          'html-editor--table-delete',
          'delete-horizontal-rule'
        );
        deleteLineButton.addEventListener('click', () => {
          lineOptions.remove();
          line.remove();
        });
        let lineStyle = null;
        deleteLineButton.addEventListener('mouseenter', () => {
          lineStyle = line.style.borderTopColor;
          line.style.borderTopColor = '#ff5630';
        });
        deleteLineButton.addEventListener('mouseleave', () => {
          if (lineStyle) {
            line.style.borderTopColor = lineStyle;
            lineStyle = null;
          } else {
            line.style.borderTopColor = '#1b9fff';
          }
        });

        if (this.checkClickOutsideElement(`line-button-wrap-${id}`)) {
          this.clickOutsideList = this.clickOutsideList.filter((item) => {
            if (item.elementId != `line-button-wrap-${id}`) {
              return true;
            }
            return false;
          });
        }
        this.clickOutsideList.push({
          element: lineOptions,
          parentElement: line,
          elementId: `line-button-wrap-${id}`,
          toDo: function () {
            self.selectedTableId = null;
            if (lineOptions) {
              lineOptions.remove();
            }
          },
        });
      }
    });
  }

  setFontSize(size) {
    document.execCommand('FontSize', false, size);
    this.checkLiTag(this.editableContainer.nativeElement);
  }

  checkBlockCol(table, rowCount) {
    let self = this;
    self.minRowIndex = 0;
    self.maxRowIndex = rowCount - 1;
    self.minCellIndex = self.startSelectedCellIndex;
    self.maxCellIndex = self.startSelectedCellIndex;
    for (
      let indexRow = self.minRowIndex;
      indexRow <= self.maxRowIndex;
      indexRow++
    ) {
      for (
        let indexCell = self.minCellIndex;
        indexCell <= self.maxCellIndex;
        indexCell++
      ) {
        if ((table as any).rows[indexRow].cells[indexCell]) {
          let cssDisplayCol = window
            .getComputedStyle(
              (table as any).rows[indexRow].cells[indexCell],
              null
            )
            .getPropertyValue('display');
          let rowDysplaySpan = (table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('rowspan');
          let colDysplaySpan = (table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('colspan');
          if (cssDisplayCol == 'none' || rowDysplaySpan || colDysplaySpan) {
            self.blockAddCol = true;
          }
        }
      }
    }
  }

  checkBlockRow(table, colCount) {
    let self = this;
    self.minRowIndex = self.startSelectedRowIndex;
    self.maxRowIndex = self.startSelectedRowIndex;
    self.minCellIndex = 0;
    self.maxCellIndex = colCount - 1;

    for (
      let indexRow = self.minRowIndex;
      indexRow <= self.maxRowIndex;
      indexRow++
    ) {
      for (
        let indexCell = self.minCellIndex;
        indexCell <= self.maxCellIndex;
        indexCell++
      ) {
        if ((table as any).rows[indexRow]) {
          let cssDisplayRow = window
            .getComputedStyle(
              (table as any).rows[indexRow].cells[indexCell],
              null
            )
            .getPropertyValue('display');
          let rowDysplaySpan = (table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('rowspan');
          let colDysplaySpan = (table as any).rows[indexRow].cells[
            indexCell
          ].getAttribute('colspan');
          if (cssDisplayRow == 'none' || rowDysplaySpan || colDysplaySpan) {
            self.blockAddRow = true;
          }
        }
      }
    }
  }

  checkLiTag(elementTag) {
    setTimeout(() => {
      let lis = elementTag.getElementsByTagName('li');
      for (let index = 0; index < lis.length; index++) {
        const el = lis[index];
        let fontEl = el.getElementsByTagName('font');
        if (fontEl.length) {
          let fontSize = fontEl[0].getAttribute('size');
          switch (fontSize) {
            case '1':
              el.style.fontSize = '10px';
              break;
            case '2':
              el.style.fontSize = '12px';
              break;
            case '3':
              el.style.fontSize = '14px';
              break;
            case '4':
              el.style.fontSize = '16px';
              break;
            case '5':
              el.style.fontSize = '18px';
              break;
            case '6':
              el.style.fontSize = '24px';
              break;
            case '7':
              el.style.fontSize = '32px';
              break;
            case '7':
              el.style.fontSize = '48px';
              break;
            default:
              break;
          }
        }
      }
    }, 0);
  }

  insertList(type) {
    switch (type) {
      case 'num':
        this.currentUnorderedList = false;
        document.execCommand('insertOrderedList', false, null);
        break;
      case 'dot':
        this.currentOrderedList = false;
        document.execCommand('insertUnorderedList', false, null);
        break;
      default:
        break;
    }
    this.setFontSize(this.selectedFontSize.value);
  }

  catchDrop(event) {
    if (event) {
      if (event.field) {
        this.selectedItem = event.field;
      } else {
        this.selectedItem = event;
      }
    }
  }

  showFieldBox(showBlocks) {
    let table = document.getElementsByClassName('dynamic-table-cell');
    if (table && table.length) {
      for (let index = 0; index < table.length; index++) {
        let tElement = table[index] as HTMLElement;
        let childs = tElement.querySelectorAll("div[contenteditable='false']");
        if (childs && childs.length) {
          for (let index = 0; index < childs.length; index++) {
            let child = childs[index] as HTMLElement;
            child.setAttribute('contenteditable', 'true');
          }
        }
      }
    }
    let dropBox = document.querySelectorAll("div[contenteditable='true']");
    let detailChild = false;
    if (this.selectedItem?.key) {
      detailChild = this.checkDetailChild(this.selectedItem.key);
    }
    if (showBlocks) {
      for (let index = 0; index < dropBox.length; index++) {
        const element = dropBox[index] as HTMLElement;
        let checkDataTeble = false;
        checkDataTeble = this.hasSomeParentTheClass(
          element,
          'dynamic-table-cell'
        );
        if (checkDataTeble) {
          if (this.selectedItem.type == 'Detail') {
            element.setAttribute('contenteditable', 'false');
          }
          if (detailChild && this.selectedItem.type !== 'Detail') {
            element.style.backgroundColor = 'rgba(226 237 255 / 70%)';
            element.style.border = '#999999 1px dashed';
            element.style.borderRadius = '3px';
          } else {
            element.setAttribute('contenteditable', 'false');
          }
        } else {
          if (this.selectedItem.type != 'Detail' && !detailChild) {
            element.style.backgroundColor = 'rgba(226 237 255 / 70%)';
            element.style.border = '#999999 1px dashed';
            element.style.borderRadius = '3px';
          }
        }
      }
    } else {
      for (let index = 0; index < dropBox.length; index++) {
        const element = dropBox[index] as HTMLElement;
        element.style.backgroundColor = 'inherit';
        element.style.border = 'none';
        element.style.borderRadius = 'none';
      }
    }
  }

  checkDetailChild(element) {
    if (element) {
      let list = element.split('.');
      if (list?.length) {
        let parentList = list[0].split('__');
        if (parentList[1] === 'o') {
          return true;
        }
      }
    }
    return false;
  }

  hasSomeParentTheClass(element, classname) {
    if (element.parentNode.classList.value == classname) return true;
    return false;
  }

  getSelectionStart() {
    var node = document.getSelection().anchorNode;
    if (node) {
      return node.nodeType == 3 ? node.parentNode : node;
    } else {
      return null;
    }
  }

  addedVideoByUrl(e) {
    let videoId;
    let param;
    let id;
    let url;
    let urlArr = e.split('watch?v=');
    if (urlArr.length > 1) {
      videoId = urlArr[urlArr.length - 1];
      param = videoId.split('&');
      if (param.length > 1) {
        id = param[0];
      } else {
        id = videoId;
      }
      url = `https://youtube.com/embed/${id}`;
    } else {
      urlArr = e.split('/');
      urlArr[urlArr.length - 2] = 'youtube.com/embed';
      url = urlArr.join('/');
    }
    this.selectedAssetsVideo = url;
    setTimeout(() => {
      let element = document.getElementById('myFrame') as HTMLIFrameElement;
      if (element) {
        element.src = this.selectedAssetsVideo;
      }
    }, 200);
  }

  toHexc(colorval) {
    let color;
    let parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete parts[0];
    for (let i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
    return color;
  }

  resizableGrid(table) {
    let row = table.getElementsByTagName('tr')[0],
      cols = row ? row.children : undefined;
    if (!cols) return;
    let tableHeight = table.offsetHeight;
    let tableWidth = table.offsetWidth;

    for (var i = 0; i < cols.length - 1; i++) {
      let col = cols[i];
      col.style.width = tableWidth / cols.length + 'px';
      createResizebleDivs(col, tableHeight);
    }

    function createResizebleDivs(col, tableHeight) {
      let divList = col.querySelectorAll('.resize-element');
      if (divList?.length) {
        divList.forEach((element) => {
          element.remove();
        });
      }

      var div = createDiv(tableHeight);
      col.appendChild(div);
      col.style.position = 'relative';
      setListeners(div);
    }
    function setListeners(div) {
      var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

      function eventMouseDown(e) {
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        var padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
        if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
      }

      function eventMouseOver(e) {
        e.target.style.borderRight = '2px solid #0085ff';
      }

      function eventMouseOut(e) {
        e.target.style.borderRight = '';
      }

      function eventMouseMove(e) {
        if (curCol) {
          var diffX = e.pageX - pageX;

          if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + 'px';

          curCol.style.width = curColWidth + diffX + 'px';
        }
      }

      function eventMouseUp(e) {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined;
      }

      div.removeEventListener('mousedown', eventMouseDown);
      div.addEventListener('mousedown', eventMouseDown);

      div.removeEventListener('mouseover', eventMouseOver);
      div.addEventListener('mouseover', eventMouseOver);

      div.removeEventListener('mouseout', eventMouseOut);
      div.addEventListener('mouseout', eventMouseOut);

      document.removeEventListener('mousemove', eventMouseMove);
      document.addEventListener('mousemove', eventMouseMove);

      document.removeEventListener('mouseup', eventMouseUp);
      document.addEventListener('mouseup', eventMouseUp);
    }

    function createDiv(height) {
      var div = document.createElement('div');
      div.style.top = '-1px';
      div.style.right = '-1px';
      div.style.width = '5px';
      div.style.position = 'absolute';
      div.style.cursor = 'col-resize';
      div.style.userSelect = 'none';
      div.style.zIndex = '10';
      div.style.height = height + 'px';
      div.classList.add('resize-element');
      return div;
    }

    function paddingDiff(col) {
      if (getStyleVal(col, 'box-sizing') == 'border-box') {
        return 0;
      }

      var padLeft = getStyleVal(col, 'padding-left');
      var padRight = getStyleVal(col, 'padding-right');
      return parseInt(padLeft) + parseInt(padRight);
    }

    function getStyleVal(elm, css) {
      return window.getComputedStyle(elm, null).getPropertyValue(css);
    }

    function outputsize(event) {
      let height = event[0].target.offsetHeight;
      let row = event[0].target.getElementsByTagName('tr')[0],
        cols = row ? row.children : undefined;
      if (!cols) return;

      for (var i = 0; i < cols.length - 1; i++) {
        let col = cols[i];
        createResizebleDivs(col, height);
      }
    }

    let resizeObs = new ResizeObserver(outputsize);
    resizeObs.unobserve(table);
    resizeObs.observe(table);
  }

  setInteract(id, column, col1, col2, col3, value) {
    let obj = {};
    let marker_l = `<div class="marker-l row-marker"></div>`;
    let marker_r = `<div class="marker-r row-marker"></div>`;
    switch (column) {
      case 'column-1':
        obj = {
          left: false,
          right: true,
          bottom: false,
          top: false,
        };
        break;
      case 'column-2':
        if (value === '1:1:1' || value === '1:2:1') {
          let col_2 = document.getElementById(id + '-column-2');
          let r_marker = col_2.querySelector('.marker-r');
          let colContent = col2.innerHTML;
          if (!r_marker) {
            col_2.innerHTML = colContent + marker_r;
          }
          obj = {
            left: true,
            right: true,
            bottom: false,
            top: false,
          };
        } else {
          let col_2 = document.getElementById(id + '-column-2');
          let r_marker = col_2.querySelector('.marker-r');
          if (r_marker) {
            r_marker.remove();
          }
          obj = {
            left: true,
            right: false,
            bottom: false,
            top: false,
          };
        }
        break;
      case 'column-3':
        let col_3 = document.getElementById(id + '-column-3');
        if (col_3) {
          let colContent = col_3.innerHTML;
          let checkMarker = col_3.querySelector('.marker-l');
          if (!checkMarker) {
            col_3.innerHTML = colContent + marker_l;
          }
        }
        obj = {
          left: true,
          right: false,
          bottom: false,
          top: false,
        };
        break;

      default:
        break;
    }

    interact(`#${id}-${column}`).resizable({
      edges: obj,

      listeners: {
        move(event) {
          var target = event.target;
          if (event.rect.width > 100) {
            let targetBound = target.getBoundingClientRect();
            let w = event.rect.width - parseFloat(targetBound.width);
            if (column === 'column-1') {
              interactCol(col2, target, event, w);
            } else if (column === 'column-2') {
              col3 = document.getElementById(id + '-column-3');
              if (!col3) {
                interactCol(col1, target, event, w);
              } else {
                if (event.deltaRect.left) {
                  interactCol(col1, target, event, w);
                } else if (event.deltaRect.right) {
                  interactCol(col3, target, event, w);
                }
              }
            } else if (column === 'column-3') {
              interactCol(col2, target, event, w);
            }
          }
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 20, height: 20 },
        }),
      ],

      inertia: true,
    });

    function interactCol(col, target, event, w) {
      let bRect = col.getBoundingClientRect();
      if (bRect.width - w >= 100) {
        col.style.maxWidth = bRect.width - w + 'px';
        target.style.maxWidth = event.rect.width + 'px';
        col.style.width = bRect.width - w + 'px';
        target.style.width = event.rect.width + 'px';
      }
    }
  }

  setResize(id) {
    let obj;
    let header;
    let footer;
    switch (id) {
      case 'html-editor--header-block':
        obj = {
          right: false,
          top: false,
          left: false,
          bottom: true,
        };
        header = document.getElementById(id);
        id = '#' + id;
        break;
      case 'html-editor--footer-block':
        obj = {
          right: false,
          top: true,
          left: false,
          bottom: false,
        };
        footer = document.getElementById(id);
        id = '#' + id;
        break;

      default:
        obj = {
          right: true,
          top: false,
          left: false,
          bottom: true,
        };
        break;
    }
    let self = this;
    function outputsize(event) {
      if (footer) {
        self.heightFooter = event[0].target.offsetHeight;
      }
      if (header) {
        self.heightHeader = event[0].target.offsetHeight;
      }
    }
    let resizeHeader = new ResizeObserver(outputsize);
    let resizeFooter = new ResizeObserver(outputsize);
    if (header) {
      resizeHeader.unobserve(header);
      resizeHeader.observe(header);
    }
    if (footer) {
      resizeFooter.unobserve(footer);
      resizeFooter.observe(footer);
    }

    interact(id).resizable({
      edges: obj,

      listeners: {
        move(event) {
          var target = event.target;
          var x = parseFloat(target.getAttribute('data-x')) || 0;
          var y = parseFloat(target.getAttribute('data-y')) || 0;
          let targetId = event.target.getAttribute('id');

          let child = document.getElementById(targetId + '-column-1');
          let childHeight;
          if (child) {
            childHeight = (child as HTMLElement).getBoundingClientRect().height;
          }
          if (
            targetId === 'html-editor--header-block' ||
            targetId === 'html-editor--footer-block'
          ) {
            let padding = targetId === 'html-editor--header-block' ? 40 : 20;
            if (event.rect.height > childHeight + padding) {
              target.style.width = event.rect.width + 'px';
              target.style.minHeight = event.rect.height + 'px';
              if (targetId === 'html-editor--header-block') {
                self.heightHeader = event.rect.height;
              } else if (targetId === 'html-editor--footer-block') {
                self.heightFooter = event.rect.height;
              }
            }
          } else {
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
          }
          let layout = self.findHTMLElementById(
            'image-options-wrap',
            `delete-actions-${id}`
          );
          if (layout) {
            let addDeleteFunc = function (event) {
              event.stopPropagation();
              let imgBox = self.findHTMLElementById('img-wrap', id);
              if (imgBox) {
                imgBox.remove();
              }
            };
            layout.removeEventListener('click', addDeleteFunc);
            layout.addEventListener('click', addDeleteFunc);
          }
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 20, height: 20 },
        }),
      ],

      inertia: true,
    });
  }

  removeHeaderFoterActions() {
    let header = document.getElementById('html-editor--header-block');
    if (header) {
      let actions = document.getElementById(
        'actions-html-editor--header-block'
      );
      if (actions) {
        actions.remove();
      }
    }
    let footer = document.getElementById('html-editor--footer-block');
    if (footer) {
      let actions = document.getElementById(
        'actions-html-editor--footer-block'
      );
      if (actions) {
        actions.remove();
      }
    }
  }

  addTymeDateChipsInHeaderFooter(type, btnType) {
    let self = this;
    self.nodeWithCarret = self.getSelectionStart();
    let checkContentEditable;
    let checlAttrParent;
    if (self.nodeWithCarret) {
      checkContentEditable =
        self.nodeWithCarret.getAttribute('contenteditable');
      checlAttrParent = self.nodeWithCarret.getAttribute('parent');
    }

    if (
      !checlAttrParent &&
      checkContentEditable !== 'false' &&
      self.nodeWithCarret &&
      !self.nodeWithCarret.className.includes(`${btnType}-marker`) &&
      !self.nodeWithCarret.className.includes(`pi`) &&
      !self.nodeWithCarret.className.includes(`marker-l`) &&
      !self.nodeWithCarret.className.includes(`html-editor--chips`) &&
      !self.nodeWithCarret.className.includes(`marker-r`)
    ) {
      let obj = {
        name: type === 'time' ? 'Time' : 'Date',
        apiKey: type === 'time' ? 'header_dateTime' : 'header_date',
        apiName: type === 'time' ? 'header_dateTime' : 'header_date',
        key: type === 'time' ? 'header_dateTime' : 'header_date',
        type: type === 'time' ? 'header_dateTime' : 'header_date',
      };
      let id = `html-editor--${btnType}-${type}-chip`;
      self.pasteHtmlDateTimeAtCaret(obj, id);
      self.initDrbIcon(obj.key, id);
    }
    self.nodeWithCarret = null;
  }

  openDialog(): void {
    this.nodeWithCarret = this.getSelectionStart();
    this.selectedAssetsImg = '';
    this.selectedAssetsVideo = '';
    const dialogRef = this.dialog.open(HtmlEditorDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {});

    dialogRef.componentInstance.buttonClick.subscribe((data) => {
      if (!this.showVideoDialog) {
        this.selectedAssetsImg = data;
        this.readImg();
      } else {
        this.selectedAssetsVideo = data;
        this.readVideo();
      }
    });
    this.showVideoDialog = false;
  }

  onDrop(event) {
    let self = this;
    event.preventDefault();
    if (self.selectedItem) {
      event.dataTransfer.effectAllowed = 'none';
      self.dropItem(event);
      self.selectedItem = null;
    }
  }

  allowDrop(event) {
    event.preventDefault();
  }

  showPreview() {
    this.previewState = true;
    let innerHTML = this.clearAttrAndClasses(this.editableContainer.nativeElement.innerHTML);
    let dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = innerHTML;
    let headerChips = dummyDiv.querySelectorAll('[header-var]');
    let templateChips = dummyDiv.querySelectorAll('[template-var]');
    if (headerChips?.length) this.setInfoInChips(headerChips, 'header-var');
    if (templateChips?.length) this.setInfoInChips(templateChips, 'template-var');
    this.content = dummyDiv.innerHTML;
  }

  closePreview() {
    this.previewState = false;
  }

  clearAttrAndClasses(innerHTML) {
    const htmlContent = this.editableContainer.nativeElement.innerHTML;
    const modifiedHtml = htmlContent.replace(
      /class\s*=\s*["'][^"']*?["']/g,
      (match) => {
        return match.replace(/\bactive\b/g, '');
      }
    );
    return modifiedHtml;
  }

  setInfoInChips(arr, attr) {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      let type = element.getAttribute(attr);
      let style = element.getAttribute('style');
      style = style ? style : '';
      let innerText = '';
      switch (type) {
        case 'header_dateTime':
          innerText = moment().format('DD.MM.YYYY');
          break;
        case 'header_date':
          innerText = moment().format('HH:mm');
          break;
        case 'f__reference':
          innerText = '<a href="https://www.google.com">https://www.google.com</a>';

          break;
        case 'f__location':
          innerText = '1600 Amphitheatre Parkway, Mountain View, CA';

          break;
        case 'f__number':
          innerText = '237';

          break;
        case 'f__text':
          innerText = 'Some Text';

          break;
        case 'f__user':
          innerText = 'Administrator';

          break;
        case 'f__email':
          innerText = 'ad_min@gmail.com';

          break;
        case 'f__time':
          innerText = moment().format('DD.MM.YYYY HH:mm');

          break;
        case 'f__company':
          innerText = 'Google';

          break;

        default:
          break;
      }
      let child = element.querySelector('.html-editor--chips');
      if (child) {
        child.innerHTML = innerText;
        let childStyle = child.getAttribute('style');
        childStyle = childStyle ? childStyle : '';
        if (childStyle || style) {
          let newStyle = childStyle + ' ' + style;
          child.setAttribute('style', newStyle);
        }
        element.outerHTML = child.outerHTML;
      }
    }
  }

  back() {
    if (this.previewState) {
      this.previewState = false;
    } else {
      history.back();
    }
  }
}
