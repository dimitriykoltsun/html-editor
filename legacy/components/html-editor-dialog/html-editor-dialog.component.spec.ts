import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlEditorDialogComponent } from './html-editor-dialog.component';

describe('HtmlEditorDialogComponent', () => {
  let component: HtmlEditorDialogComponent;
  let fixture: ComponentFixture<HtmlEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlEditorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
