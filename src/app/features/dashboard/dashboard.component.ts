import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductsResponse } from '../../core/models/product.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextarea } from 'primeng/inputtextarea';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextarea,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
})
export class DashboardComponent implements OnInit {

  products$!: Observable<Product[]>;
  productDialogVisible: boolean = false;
  productForm!: FormGroup;
  isEditMode: boolean = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products$ = this.productService.getProducts().pipe(
      map((response: ProductsResponse) => response.products),
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos.',
        });
        return of([]); //error regresamos un arry []
      })
    );
  }

  openNew(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.selectedProduct = null;
    this.productDialogVisible = true;
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = { ...product };
    this.productForm.patchValue(product);
    this.productDialogVisible = true;
  }

  hideDialog(): void {
    this.productDialogVisible = false;
    this.productForm.reset();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.value;
    const operation$ = (this.isEditMode && this.selectedProduct)
      ? this.productService.updateProduct(this.selectedProduct.id, productData)
      : this.productService.createProduct(productData);

    operation$.subscribe({
      next: () => {
        const detail = this.isEditMode ? 'Producto actualizado' : 'Producto creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail });
        this.loadProducts();
      },
      error: () => {
        const detail = this.isEditMode ? 'No se pudo actualizar' : 'No se pudo crear';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });

    this.hideDialog();
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar "${product.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado' });
            this.loadProducts();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
        });
      },
    });
  }
}