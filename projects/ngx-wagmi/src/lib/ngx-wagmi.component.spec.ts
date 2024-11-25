import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWagmiComponent } from './ngx-wagmi.component';

describe('NgxWagmiComponent', () => {
  let component: NgxWagmiComponent;
  let fixture: ComponentFixture<NgxWagmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWagmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxWagmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
