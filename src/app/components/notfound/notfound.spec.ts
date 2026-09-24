import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notfound } from './notfound';

describe('Notfound', () => {
  let component: Notfound;
  let fixture: ComponentFixture<Notfound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notfound],
    }).compileComponents();

    fixture = TestBed.createComponent(Notfound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the burger menu state on click', () => {
    fixture.detectChanges();

    const burger = document.querySelector('.burger') as HTMLElement | null;
    const nav = document.querySelector('nav') as HTMLElement | null;

    expect(burger).not.toBeNull();
    expect(nav).not.toBeNull();

    burger?.click();
    expect(burger?.dataset['state']).toBe('open');
    expect(nav?.dataset['state']).toBe('open');

    burger?.click();
    expect(burger?.dataset['state']).toBe('closed');
    expect(nav?.dataset['state']).toBe('closed');
  });
});
