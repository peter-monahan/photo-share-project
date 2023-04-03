import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyToasterComponent } from './my-toaster.component';

describe('MyToasterComponent', () => {
  let component: MyToasterComponent;
  let fixture: ComponentFixture<MyToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyToasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
