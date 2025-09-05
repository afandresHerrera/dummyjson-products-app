import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product, ProductsResponse } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  const apiUrl = 'https://dummyjson.com/auth/products';

  const mockProduct: Product = { id: 1, title: 'Test Product', price: 100 } as Product;
  const mockProductsResponse: ProductsResponse = {
    products: [mockProduct],
    total: 1,
    skip: 0,
    limit: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductService
      ]
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should fetch products with a GET request to the correct URL', () => {
    service.getProducts().subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    const req = httpTestingController.expectOne(apiUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(mockProductsResponse);
  });

  it('should fetch a single product by ID with a GET request', () => {
    const productId = 1;
    service.getProductById(productId).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProduct);
  });

  it('should create a product with a POST request', () => {
    const newProduct: Partial<Product> = { title: 'New Product', price: 150 };

    service.createProduct(newProduct).subscribe(response => {
      expect(response.id).toBeDefined();
    });

    const req = httpTestingController.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newProduct);

    req.flush({ ...newProduct, id: 101 });
  });

  it('should update a product with a PUT request', () => {
    const productId = 1;
    const updatedData: Partial<Product> = { title: 'Updated Product Title' };

    service.updateProduct(productId, updatedData).subscribe(response => {
      expect(response.title).toEqual('Updated Product Title');
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedData);

    req.flush({ ...mockProduct, ...updatedData });
  });

  it('should delete a product with a DELETE request', () => {
    const productId = 1;

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockProduct);
  });
});