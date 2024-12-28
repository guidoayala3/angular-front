import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TinyUrlService {
  private apiUrl = 'https://tinyurl.com/app/dev';  // URL base de la API
  private apiKey = 'lTQXzITd0B0S8BwFfd536spPiMhNyVP4v4nJcVnoPiyU7TBlAtLlnfRxZKvs';  // API Key

  constructor(private http: HttpClient) {}

  // Codificar la URL
  encodeUrl(params: { 
    longUrl: string; 
    domain?: string; 
    alias?: string; 
    description?: string 
  }): Observable<any> {
    // Validar la URL
    if (!this.validateUrl(params.longUrl)) {
      return throwError(() => new Error('URL inválida'));
    }

    // Construir el cuerpo de la solicitud
    const body = {
      url: params.longUrl,
      domain: params.domain || '', // Establece vacío si no se proporciona un dominio
      alias: params.alias || '',  // Establece vacío si no se proporciona un alias
      description: params.description || 'string',  // Establece un valor por defecto para la descripción
    };

    // Enviar la solicitud con la API Key
    return this.http.post(`${this.apiUrl}/create`, body, {
      headers: { 'x-api-key': this.apiKey },
    }).pipe(
      catchError((error) => throwError(() => new Error('Error al codificar la URL')))
    );
  }

  // Decodificar la URL
  decodeUrl(shortUrl: string): Observable<any> {
    const alias = shortUrl.split('/').pop();  // Obtener el alias de la URL corta
    return this.http.get(`${this.apiUrl}/alias/tinyurl.com/${alias}`, {
      headers: { 'x-api-key': this.apiKey },
    }).pipe(
      catchError((error) => throwError(() => new Error('Error al decodificar la URL')))
    );
  }

  // Validar la URL
  validateUrl(url: string): boolean {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocolo
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Dominio
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // o Dirección IP
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Puerto y Ruta
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query
      '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  }
}
