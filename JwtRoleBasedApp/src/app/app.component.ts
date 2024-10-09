// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular JWT Role-Based Authorization';
  role: string | null = null;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = localStorage.getItem('username'); // Retrieve username from localStorage
    if (this.isLoggedIn()) {
      this.role = this.authService.getRole();
    }

    // Subscribe to username changes
    this.authService.getUsernameObservable().subscribe(username => {
      this.username = username;
      if (this.isLoggedIn()) {
        this.role = this.authService.getRole();
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.role = null;
    this.username = null;
    this.authService.logout();
  }
}
