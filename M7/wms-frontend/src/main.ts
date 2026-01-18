import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MessageBroker } from './app/broker/MessageBroker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [MessageBroker],
  template: `
    <div class="dark">
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
});
