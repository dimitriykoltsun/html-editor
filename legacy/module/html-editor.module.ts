import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlEditorComponent } from '../components/html-editor/html-editor.component';
import { HtmlEditorDialogComponent } from '../components/html-editor-dialog/html-editor-dialog.component';
import { PreviewComponent } from '../components/preview/preview.component';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { SharedMaterialModule } from 'src/app/shared-module/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HtmlEditorComponent,
    HtmlEditorDialogComponent,
    PreviewComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedMaterialModule
  ],
  exports: [
    HtmlEditorComponent
  ]
})
export class HtmlEditorModule { }
