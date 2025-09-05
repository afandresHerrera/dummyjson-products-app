import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { ProductService } from '../../core/services/product.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Product, ProductsResponse } from '../../core/models/product.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  const mockProductsResponse: ProductsResponse = {
    products: [
      { id: 1, title: 'Test Product 1', price: 10, stock: 100, description: 'Desc 1' } as Product,
      { id: 2, title: 'Test Product 2', price: 20, stock: 200, description: 'Desc 2' } as Product,
    ],
    total: 2, skip: 0, limit: 2
  };

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'createProduct', 'updateProduct', 'deleteProduct']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
      ]
    }).compileComponents();

    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProducts on initialization (ngOnInit)', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });

  it('should load products and assign them to products$', (done) => {
    component.products$.subscribe(products => {
      expect(products.length).toBe(2);
      expect(products[0].title).toBe('Test Product 1');
      done();
    });
  });

  it('should open dialog in "new product" mode when openNew is called', () => {
    component.openNew();

    expect(component.isEditMode).toBeFalse();
    expect(component.productDialogVisible).toBeTrue();
    expect(component.productForm.value.title).toBeNull();
  });

  it('should open dialog in "edit mode" and patch form when editProduct is called', () => {
    const productToEdit = mockProductsResponse.products[0];
    component.editProduct(productToEdit);

    expect(component.isEditMode).toBeTrue();
    expect(component.productDialogVisible).toBeTrue();
    expect(component.productForm.value.title).toBe(productToEdit.title);
  });


  it('should call productService.createProduct when saving a new product', () => {
    mockProductService.createProduct.and.returnValue(of({} as Product));
    component.productForm.setValue({ title: 'New Product', description: 'New Desc', price: 50, stock: 500 });
    component.isEditMode = false;
    component.saveProduct();
    expect(mockProductService.createProduct).toHaveBeenCalled();
  });


  it('should call productService.updateProduct when saving an edited product', () => {
    mockProductService.updateProduct.and.returnValue(of({} as Product));
    const productToEdit = mockProductsResponse.products[0];
    component.editProduct(productToEdit);
    component.productForm.patchValue({ title: 'Updated Title' });
    component.saveProduct();

    const expectedPayload = {
      title: 'Updated Title',
      price: productToEdit.price,
      stock: productToEdit.stock,
      description: productToEdit.description
    };
    expect(mockProductService.updateProduct).toHaveBeenCalledWith(productToEdit.id, expectedPayload);
  });

  it('should not call any service if form is invalid on save', () => {
    component.productForm.reset();
    component.saveProduct();
    expect(mockProductService.createProduct).not.toHaveBeenCalled();
    expect(mockProductService.updateProduct).not.toHaveBeenCalled();
  });
});