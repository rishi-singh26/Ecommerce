import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CategoryService } from './category.service';
import { HttpService } from '../http/http.service';
import { BASE_URL } from '../../../shared/app-constants';
import * as CategoryActions from '../../../store/category/category.action';
import { Category } from '../../../store/category/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let store: MockStore;

  const API_BASE = `${BASE_URL}/ecommerce/categories`;

  const mockCategory: Category = {
    _id: '691407b18736f1d74361b3ab',
    name: 'Clothes',
    owner: 'owner123',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  const mockCategory2: Category = {
    _id: '691407b18736f1d74361b3ac',
    name: 'Books',
    owner: 'owner123',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService, HttpService, provideMockStore()],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchCategories', () => {
    it('dispatches fetch and success actions on success', () => {
      spyOn(store, 'dispatch');

      service.fetchCategories();

      const req = httpMock.expectOne(API_BASE);
      expect(req.request.method).toBe('GET');

      req.flush({ statusCode: 200, data: [mockCategory, mockCategory2], message: 'ok', success: true });

      expect(store.dispatch).toHaveBeenCalledWith(CategoryActions.fetchCategories());
      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.fetchCategoriesSuccess({ categories: [mockCategory, mockCategory2] })
      );
    });

    it('dispatches failure action on http error', () => {
      spyOn(store, 'dispatch');

      service.fetchCategories();

      const req = httpMock.expectOne(API_BASE);
      expect(req.request.method).toBe('GET');

      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      // first call is fetchCategories, second should be failure
      const calls = (store.dispatch as jasmine.Spy).calls.allArgs().map(a => a[0]);
      expect(calls[0].type).toBe(CategoryActions.fetchCategories().type);
      // ensure a failure action was dispatched
      const failure = calls.find(c => c.type === CategoryActions.fetchCategoriesFailure.type);
      expect(failure).toBeDefined();
    });
  });

  describe('fetchCategoryById', () => {
    it('dispatches fetchCategoryById and success actions on success', () => {
      spyOn(store, 'dispatch');

      service.fetchCategoryById(mockCategory._id);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      expect(req.request.method).toBe('GET');

      req.flush({ statusCode: 200, data: mockCategory, message: 'ok', success: true });

      expect(store.dispatch).toHaveBeenCalledWith(CategoryActions.fetchCategoryById({ categoryId: mockCategory._id }));
      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.fetchCategoryByIdSuccess({ category: mockCategory })
      );
    });

    it('dispatches fetchCategoryByIdFailure on error', () => {
      spyOn(store, 'dispatch');

      service.fetchCategoryById(mockCategory._id);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });

      const calls = (store.dispatch as jasmine.Spy).calls.allArgs().map(a => a[0]);
      expect(calls[0].type).toBe(CategoryActions.fetchCategoryById({ categoryId: mockCategory._id }).type);
      const failure = calls.find(c => c.type === CategoryActions.fetchCategoryByIdFailure.type);
      expect(failure).toBeDefined();
    });
  });

  describe('createCategory', () => {
    it('dispatches createCategory and createCategorySuccess on success', () => {
      spyOn(store, 'dispatch');

      const payload = { name: 'Clothes' };
      service.createCategory(payload as any);

      const req = httpMock.expectOne(API_BASE);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);

      req.flush({ statusCode: 201, data: mockCategory, message: 'created', success: true });

      expect(store.dispatch).toHaveBeenCalledWith(CategoryActions.createCategory({ categoryData: payload }));
      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.createCategorySuccess({ category: mockCategory })
      );
    });

    it('dispatches createCategoryFailure on error', () => {
      spyOn(store, 'dispatch');

      const payload = { name: 'Clothes' };
      service.createCategory(payload as any);

      const req = httpMock.expectOne(API_BASE);
      req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });

      const calls = (store.dispatch as jasmine.Spy).calls.allArgs().map(a => a[0]);
      expect(calls[0].type).toBe(CategoryActions.createCategory({ categoryData: payload as any }).type);
      const failure = calls.find(c => c.type === CategoryActions.createCategoryFailure.type);
      expect(failure).toBeDefined();
    });
  });

  describe('updateCategory', () => {
    it('dispatches updateCategory and updateCategorySuccess on success', () => {
      spyOn(store, 'dispatch');

      const updatePayload = { name: 'Updated Clothes' };
      service.updateCategory(mockCategory._id, updatePayload as any);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updatePayload);

      const updated = { ...mockCategory, name: updatePayload.name };
      req.flush({ statusCode: 200, data: updated, message: 'updated', success: true });

      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.updateCategory({ categoryId: mockCategory._id, categoryData: updatePayload as any })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.updateCategorySuccess({ category: updated })
      );
    });

    it('dispatches updateCategoryFailure on error', () => {
      spyOn(store, 'dispatch');

      const updatePayload = { name: 'Updated Clothes' };
      service.updateCategory(mockCategory._id, updatePayload as any);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      const calls = (store.dispatch as jasmine.Spy).calls.allArgs().map(a => a[0]);
      expect(calls[0].type).toBe(CategoryActions.updateCategory({ categoryId: mockCategory._id, categoryData: updatePayload as any }).type);
      const failure = calls.find(c => c.type === CategoryActions.updateCategoryFailure.type);
      expect(failure).toBeDefined();
    });
  });

  describe('deleteCategory', () => {
    it('dispatches deleteCategory and deleteCategorySuccess on success', () => {
      spyOn(store, 'dispatch');

      service.deleteCategory(mockCategory._id);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      expect(req.request.method).toBe('DELETE');

      req.flush({ statusCode: 200, data: null, message: 'deleted', success: true });

      expect(store.dispatch).toHaveBeenCalledWith(CategoryActions.deleteCategory({ categoryId: mockCategory._id }));
      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.deleteCategorySuccess({ categoryId: mockCategory._id })
      );
    });

    it('dispatches deleteCategoryFailure on error', () => {
      spyOn(store, 'dispatch');

      service.deleteCategory(mockCategory._id);

      const req = httpMock.expectOne(`${API_BASE}/${mockCategory._id}`);
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      const calls = (store.dispatch as jasmine.Spy).calls.allArgs().map(a => a[0]);
      expect(calls[0].type).toBe(CategoryActions.deleteCategory({ categoryId: mockCategory._id }).type);
      const failure = calls.find(c => c.type === CategoryActions.deleteCategoryFailure.type);
      expect(failure).toBeDefined();
    });
  });
});
