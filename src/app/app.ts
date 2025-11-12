import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Authentication } from './features/authentication/authentication';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Authentication],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce');
}
