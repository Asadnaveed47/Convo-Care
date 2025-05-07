import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';  // Import provideHttpClient

// Adjust the appConfig to include provideHttpClient
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [], // Ensure any existing providers are kept
    provideHttpClient(),          // Add HttpClient provider globally
  ],
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
