import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AnimeRoutingModule } from './anime-routing.module';
import { AnimeComponent } from './anime.component';
import { TableComponent } from './table/table.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { SortComponent } from './sort/sort.component';

/** Anime module. */
@NgModule({
  declarations: [
    AnimeComponent,
    TableComponent,
    PaginatorComponent,
    SortComponent,
  ],
  imports: [
    CommonModule,
    AnimeRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AnimeModule {}
