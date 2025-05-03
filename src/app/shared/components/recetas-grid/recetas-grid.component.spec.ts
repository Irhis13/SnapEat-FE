import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasGridComponent } from './recetas-grid.component';

describe('RecetasGridComponent', () => {
  let component: RecetasGridComponent;
  let fixture: ComponentFixture<RecetasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
