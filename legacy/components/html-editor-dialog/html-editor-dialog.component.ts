import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-html-editor-dialog',
  templateUrl: './html-editor-dialog.component.html',
  styleUrls: ['./html-editor-dialog.component.scss']
})
export class HtmlEditorDialogComponent implements OnInit {
  imgURL: string = '';

  @Output() buttonClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  onButtonClick() {
    this.buttonClick.emit('');
  }
  onButtonSave() {
    this.buttonClick.emit(this.imgURL);
  }


}
