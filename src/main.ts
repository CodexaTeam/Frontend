import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * @file main.ts
 * @description The main entry point for the Angular application.
 * It bootstraps the root component `App` with the provided application configuration.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
