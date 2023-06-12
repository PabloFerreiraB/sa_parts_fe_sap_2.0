import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializerComponent } from './initializer.component';

describe('InitializerComponent', () => {
  let component: InitializerComponent;
  let fixture: ComponentFixture<InitializerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InitializerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitializerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
