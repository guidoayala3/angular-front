import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TinyUrlComponent } from './components/tiny-url/tiny-url.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: '', component: TinyUrlComponent }, // Ruta raíz, carga el TinyUrlComponent
    ]),
    importProvidersFrom(HttpClientModule), // Soporte para peticiones HTTP
    importProvidersFrom(ReactiveFormsModule), // Soporte para formularios reactivos
  ],
};
