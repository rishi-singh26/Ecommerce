import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app-store';
import {
  selectAllCategories,
  selectCategoryLoading,
  selectCategoryError,
} from '../../../../store/category/category.selector';
import { clearCategoryError } from '../../../../store/category/category.action';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Category } from '../../../../store/category/category.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // Observables
  categories$ = this.store.select(selectAllCategories);
  loading$ = this.store.select(selectCategoryLoading);
  error$ = this.store.select(selectCategoryError);

  // Component state
  showForm = false;
  editingCategoryId: string | null = null;
  categoryForm: FormGroup;

  // Material table columns
  displayedColumns: string[] = ['name', 'createdAt', 'updatedAt', 'actions'];

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.categoryService.fetchCategories();
    this.error$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle form visibility for creating a new category
   */
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }

  /**
   * Submit category form (create or update)
   */
  submitForm(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.editingCategoryId) {
      // Update existing category
      this.categoryService.updateCategory(this.editingCategoryId, formValue);
    } else {
      // Create new category
      this.categoryService.createCategory(formValue);
    }

    this.resetForm();
  }

  /**
   * Edit a category
   * @param category - The category to edit
   */
  editCategory(category: Category): void {
    this.editingCategoryId = category._id;
    this.showForm = true;
    this.categoryForm.patchValue({
      name: category.name,
    });
  }

  /**
   * Delete a category
   * @param categoryId - The ID of the category to delete
   */
  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId);
    }
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategoryId = null;
    this.showForm = false;
  }

  /**
   * Check if form is in edit mode
   */
  isEditMode(): boolean {
    return this.editingCategoryId !== null;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.store.dispatch(clearCategoryError());
  }

  /**
   * Get form control for template validation
   */
  get nameControl() {
    return this.categoryForm.get('name');
  }
}
