import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from './delete-modal.component';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../Services/posts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '../../Services/error-handler.service';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockRoute: ActivatedRoute;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(async () => {
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockPostsService = jasmine.createSpyObj('PostsService', ['deletePost']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ]);

    mockRoute = {
      snapshot: {
        paramMap: {
          get: () => '123', // mock post ID
        },
      },
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DeleteModalComponent],
      providers: [
        { provide: Location, useValue: mockLocation },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: PostsService, useValue: mockPostsService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back() when close() is called', () => {
    component.close();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should delete post and show snackbar on success', () => {
    mockPostsService.deletePost.and.returnValue(of({}));

    component.deletePost();

    expect(mockPostsService.deletePost).toHaveBeenCalledWith(123);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Post deleted successfully',
      'Close'
    );
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should handle error when deletePost fails', () => {
    const error = new Error('Delete failed');
    mockPostsService.deletePost.and.returnValue(throwError(() => error));

    component.deletePost();

    expect(mockErrorHandler.handleError).toHaveBeenCalledWith(error as any);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
