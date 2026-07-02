import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input() content: any = ''; 
  @Output() closePrev = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
    console.log(this.content, 'cccc');
    
  }

  back() {
    this.closePrev.emit(false);
  }

}
