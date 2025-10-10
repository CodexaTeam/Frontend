import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

/**
 * @Component
 * @description The main layout component for the application. It includes the header, sidebar, and the main content area where routed components are displayed.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarVisible = false;

  /**
   * @method toggleSidebar
   * @description Toggles the visibility of the sidebar, used for mobile navigation.
   */
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
