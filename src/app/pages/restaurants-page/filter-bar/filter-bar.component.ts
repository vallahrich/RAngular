import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<any>();
  
  filterForm!: FormGroup;
  
  // Filter options
  neighborhoods: string[] = ['Nørrebro', 'Vesterbro', 'Østerbro', 'Indre By', 'Amager', 'Frederiksberg'];
  cuisines: string[] = ['Italian', 'Danish', 'Asian', 'Mexican', 'French', 'Indian', 'International'];
  
  constructor(private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      neighborhood: [''],
      cuisine: [''],
      priceRange: [''],
      dietaryOptions: ['']
    });
  }
  
  applyFilters(): void {
    this.filtersApplied.emit(this.filterForm.value);
  }
  
  clearFilters(): void {
    this.filterForm.reset();
    this.filtersApplied.emit(this.filterForm.value);
  }
}
