// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/login-model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginModel = { username: '', password: '' };
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Login button clicked'); // Debugging log
    this.authService.login(this.credentials).subscribe({
      next: (result) => {
        console.log('Login result:', result);  // Debugging log
        const token = result?.token;  // Ensure the token is in the expected place
        if (!token) {
          console.error('Token not found in the response');
          return;
        }
        localStorage.setItem('token', token);
        
        const decodedToken = this.jwtHelper.decodeToken(token);
        console.log('Decoded Token:', decodedToken);  
        const role = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];  
        const username = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']; // Get username
        
        this.authService.setUser(username); // Set username in AuthService

        if (role === 'Admin') {
          this.router.navigate(['/add-product']);
        } else {
          this.router.navigate(['/product-list']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}
