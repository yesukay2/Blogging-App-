import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 45;
    component.itemsPerPage = 10;
    expect(component.totalPages).toBe(5);
  });

  it('should return correct page numbers', () => {
    component.totalItems = 30;
    component.itemsPerPage = 10;
    expect(component.Pages).toEqual([1, 2, 3]);
  });

  it('should emit page number when valid page is clicked', () => {
    spyOn(component.pageChange, 'emit');
    component.totalItems = 100;
    component.itemsPerPage = 10;
    component.changePage(5);
    expect(component.pageChange.emit).toHaveBeenCalledWith(5);
  });

  it('should not emit when invalid page number is passed', () => {
    spyOn(component.pageChange, 'emit');
    component.totalItems = 30;
    component.itemsPerPage = 10;
    component.changePage(0); // invalid
    component.changePage(4); // invalid if totalPages is 3
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should return full list of pages when totalPages <= 5', () => {
    component.totalItems = 40;
    component.itemsPerPage = 10;
    expect(component.getVisiblePages()).toEqual([1, 2, 3, 4]);
  });

  it('should return truncated list of pages with ellipses when totalPages > 5', () => {
    component.totalItems = 100;
    component.itemsPerPage = 10;
    component.currentPage = 5;
    expect(component.getVisiblePages()).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('should always include first and last page in visiblePages', () => {
    component.totalItems = 120;
    component.itemsPerPage = 10;
    component.currentPage = 6;
    const pages = component.getVisiblePages();
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(component.totalPages);
  });
});
