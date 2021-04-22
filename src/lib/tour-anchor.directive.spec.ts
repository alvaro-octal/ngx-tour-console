import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TourService } from '@ngx-tour/core';
import { TourAnchorConsoleDirective } from './tour-anchor.directive';

@Component({
  template: ` <h2 tourAnchor="first">First Anchor</h2>
    <h2 tourAnchor="second">Second Anchor</h2>
    <h2>No Anchor</h2>`,
})
class TestComponent {}

describe('TourAnchorConsoleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];
  let service: TourService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [TourAnchorConsoleDirective, TestComponent],
      providers: [TourService],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached TourAnchorConsoleDirective
    des = fixture.debugElement.queryAll(
      By.directive(TourAnchorConsoleDirective)
    );

    service = TestBed.get(TourService);
  });

  it('should have two anchor elements', () => {
    expect(des.length).toBe(2);
  });

  it('should have two registered steps', () => {
    expect(Object.keys(service.anchors).length).toBe(2);
  });

  it('should unregister', () => {
    expect(Object.keys(service.anchors).length).toBe(2);

    fixture.destroy();

    expect(Object.keys(service.anchors).length).toBe(0);
  });

  it('show should print', (done) => {
    service.initialize([
      {
        anchorId: 'first',
        placement: 'below',
        title: 'First Title',
        content: 'First Content',
      },
      {
        anchorId: 'second',
        title: 'Anchor Title',
        content: 'Some Content',
      },
    ]);
    const spyLog = spyOn(console, 'log');
    const spyGroup = spyOn(console, 'group');
    service.startAt(1);
    service.startAt(0);
    setTimeout(() => {
      expect(console.log).toHaveBeenCalledTimes(4);
      expect(spyLog.calls.allArgs()).toEqual([
        ['Some Content'],
        ['above second'],
        ['First Content'],
        ['below first'],
      ]);
      expect(console.group).toHaveBeenCalledTimes(2);
      expect(spyGroup.calls.allArgs()).toEqual([
        ['Anchor Title'],
        ['First Title'],
      ]);
      done();
    }, 10);
  });
});
