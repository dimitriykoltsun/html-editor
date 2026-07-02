import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {

  }

  transform(code, html){
    let src;
    if(html) {
      src = code;
    } else {
      src = 'data: text/html;charset=utf-8,' + code;
    }
    return this.sanitizer.bypassSecurityTrustHtml(src);
  }

}
