import { Component } from '@angular/core';
import { RegisterModel } from '../models/register-model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Corrected import

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class RegisterComponent {
  user: RegisterModel = { username: '', email: '', password: '', role: 'User' };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: (result) => {
        console.log('User registered successfully');
        this.router.navigate(['/login']); // Moved this line inside the next callback
      },
      error: (err) => console.error(err)
    });
  }
}
