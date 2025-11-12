import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpService, HttpRequestConfig } from './http.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should perform a GET request without config', () => {
      const mockData = { id: 1, name: 'Test' };
      const url = '/api/test';

      service.get<typeof mockData>(url).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockData);
    });

    it('should perform a GET request with custom headers', () => {
      const mockData = { id: 1 };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token123' },
      };

      service.get<typeof mockData>(url, config).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockData);
    });

    it('should perform a GET request with query params', () => {
      const mockData = { items: [] };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        params: { page: 1, limit: 10, active: true },
      };

      service.get<typeof mockData>(url, config).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === url &&
          request.params.get('page') === '1' &&
          request.params.get('limit') === '10' &&
          request.params.get('active') === 'true'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle array params in GET request', () => {
      const mockData = { items: [] };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        params: { ids: ['1', '2', '3'] },
      };

      service.get<typeof mockData>(url, config).subscribe();

      const req = httpMock.expectOne((request) => {
        const ids = request.params.getAll('ids');
        return request.url === url && !!(ids && ids.length === 3);
      });
      expect(req.request.params.getAll('ids')).toEqual(['1', '2', '3']);
      req.flush(mockData);
    });

    it('should merge headers and params in GET request', () => {
      const mockData = { result: true };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        headers: { 'X-Custom': 'value' },
        params: { filter: 'active' },
      };

      service.get<typeof mockData>(url, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url === url && request.params.get('filter') === 'active';
      });
      expect(req.request.headers.get('X-Custom')).toBe('value');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockData);
    });
  });

  describe('POST requests', () => {
    it('should perform a POST request without config', () => {
      const requestBody = { name: 'Test', email: 'test@example.com' };
      const responseData = { id: 1, ...requestBody };
      const url = '/api/test';

      service.post<typeof responseData>(url, requestBody).subscribe((data) => {
        expect(data).toEqual(responseData);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(requestBody);
      req.flush(responseData);
    });

    it('should perform a POST request with custom headers', () => {
      const requestBody = { data: 'test' };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
      };

      service.post(url, requestBody, config).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      expect(req.request.body).toEqual(requestBody);
      req.flush({ success: true });
    });

    it('should perform a POST request with query params', () => {
      const requestBody = { name: 'Test' };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        params: { notify: true },
      };

      service.post(url, requestBody, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url === url && request.params.get('notify') === 'true';
      });
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(requestBody);
      req.flush({ id: 1 });
    });

    it('should perform a POST request without body', () => {
      const url = '/api/test';

      service.post(url).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ success: true });
    });

    it('should merge default headers with custom headers in POST', () => {
      const requestBody = { test: true };
      const url = '/api/test';
      const config: HttpRequestConfig = {
        headers: { 'X-Custom': 'header' },
      };

      service.post(url, requestBody, config).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('X-Custom')).toBe('header');
      req.flush({});
    });
  });

  describe('PUT requests', () => {
    it('should perform a PUT request', () => {
      const requestBody = { id: 1, name: 'Updated' };
      const url = '/api/test/1';

      service.put(url, requestBody).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(requestBody);
      req.flush({ success: true });
    });

    it('should perform a PUT request with headers and params', () => {
      const requestBody = { name: 'Updated' };
      const url = '/api/test/1';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
        params: { version: 2 },
      };

      service.put(url, requestBody, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url === url && request.params.get('version') === '2';
      });
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      expect(req.request.body).toEqual(requestBody);
      req.flush({});
    });

    it('should perform a PUT request without body', () => {
      const url = '/api/test/1';

      service.put(url).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBeNull();
      req.flush({});
    });
  });

  describe('PATCH requests', () => {
    it('should perform a PATCH request', () => {
      const requestBody = { name: 'Updated' };
      const url = '/api/test/1';

      service.patch(url, requestBody).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(requestBody);
      req.flush({ success: true });
    });

    it('should perform a PATCH request with config', () => {
      const requestBody = { status: 'active' };
      const url = '/api/test/1';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
        params: { fields: 'status,name' },
      };

      service.patch(url, requestBody, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url === url && request.params.get('fields') === 'status,name';
      });
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(requestBody);
      req.flush({});
    });

    it('should perform a PATCH request without body', () => {
      const url = '/api/test/1';

      service.patch(url).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toBeNull();
      req.flush({});
    });
  });

  describe('DELETE requests', () => {
    it('should perform a DELETE request', () => {
      const url = '/api/test/1';

      service.delete(url).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });

    it('should perform a DELETE request with headers', () => {
      const url = '/api/test/1';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
      };

      service.delete(url, config).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });

    it('should perform a DELETE request with params', () => {
      const url = '/api/test/1';
      const config: HttpRequestConfig = {
        params: { force: true },
      };

      service.delete(url, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url === url && request.params.get('force') === 'true';
      });
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should perform a DELETE request with headers and params', () => {
      const url = '/api/test/1';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
        params: { force: true, confirm: false },
      };

      service.delete(url, config).subscribe();

      const req = httpMock.expectOne((request) => {
        return (
          request.url === url &&
          request.params.get('force') === 'true' &&
          request.params.get('confirm') === 'false'
        );
      });
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });
  });

  describe('Default Headers Management', () => {
    beforeEach(() => {
      service.clearDefaultHeaders();
    });

    it('should have default Content-Type header', () => {
      const headers = service.getDefaultHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should set default headers', () => {
      const newHeaders = {
        Authorization: 'Bearer token',
        'X-Custom': 'value',
      };

      service.setDefaultHeaders(newHeaders);
      const headers = service.getDefaultHeaders();

      expect(headers['Authorization']).toBe('Bearer token');
      expect(headers['X-Custom']).toBe('value');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should merge new headers with existing default headers', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token' });
      service.setDefaultHeaders({ 'X-Custom': 'header' });

      const headers = service.getDefaultHeaders();
      expect(headers['Authorization']).toBe('Bearer token');
      expect(headers['X-Custom']).toBe('header');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should overwrite existing default headers when setting duplicates', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer old' });
      service.setDefaultHeaders({ Authorization: 'Bearer new' });

      const headers = service.getDefaultHeaders();
      expect(headers['Authorization']).toBe('Bearer new');
    });

    it('should remove a specific default header', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token', 'X-Custom': 'value' });
      service.removeDefaultHeader('Authorization');

      const headers = service.getDefaultHeaders();
      expect(headers['Authorization']).toBeUndefined();
      expect(headers['X-Custom']).toBe('value');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should not remove Content-Type when removing other headers', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token' });
      service.removeDefaultHeader('Authorization');

      const headers = service.getDefaultHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should clear all default headers except Content-Type', () => {
      service.setDefaultHeaders({
        Authorization: 'Bearer token',
        'X-Custom': 'value',
        'X-Another': 'header',
      });

      service.clearDefaultHeaders();

      const headers = service.getDefaultHeaders();
      expect(Object.keys(headers).length).toBe(1);
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should apply default headers to GET request', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token' });
      const url = '/api/test';

      service.get(url).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });

    it('should apply default headers to POST request', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token' });
      const url = '/api/test';

      service.post(url, { data: 'test' }).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });

    it('should allow custom headers to override default headers', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer default' });
      const url = '/api/test';
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer custom' },
      };

      service.get(url, config).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer custom');
      req.flush({});
    });

    it('should return a copy of default headers to prevent external mutation', () => {
      service.setDefaultHeaders({ Authorization: 'Bearer token' });
      const headers1 = service.getDefaultHeaders();
      headers1['Authorization'] = 'Bearer modified';

      const headers2 = service.getDefaultHeaders();
      expect(headers2['Authorization']).toBe('Bearer token');
    });
  });

  describe('Error Handling', () => {
    it('should propagate HTTP errors in GET request', () => {
      const url = '/api/test';

      service.get(url).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(url);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should propagate HTTP errors in POST request', () => {
      const url = '/api/test';

      service.post(url, { data: 'test' }).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(url);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should propagate HTTP errors in DELETE request', () => {
      const url = '/api/test/1';

      service.delete(url).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
        }
      );

      const req = httpMock.expectOne(url);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Type Safety', () => {
    it('should return correctly typed data from GET request', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUser: User = { id: 1, name: 'John', email: 'john@example.com' };
      const url = '/api/users/1';

      service.get<User>(url).subscribe((user) => {
        expect(user.id).toBe(1);
        expect(user.name).toBe('John');
        expect(user.email).toBe('john@example.com');
      });

      const req = httpMock.expectOne(url);
      req.flush(mockUser);
    });

    it('should return correctly typed data from POST request', () => {
      interface CreateUserResponse {
        id: number;
        createdAt: string;
      }

      const mockResponse: CreateUserResponse = { id: 1, createdAt: '2025-01-01' };
      const url = '/api/users';

      service.post<CreateUserResponse>(url, { name: 'John' }).subscribe((response) => {
        expect(response.id).toBe(1);
        expect(response.createdAt).toBe('2025-01-01');
      });

      const req = httpMock.expectOne(url);
      req.flush(mockResponse);
    });
  });
});
