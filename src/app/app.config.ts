import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    importProvidersFrom(BrowserModule, FormsModule, CommonModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
