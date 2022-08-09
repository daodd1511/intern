import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';

/** Shared module. */
@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  exports: [NavbarComponent],
})
export class SharedModule { }
