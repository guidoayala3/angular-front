import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';  
import { TinyUrlService } from '../../services/tiny-url.service';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-tiny-url',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './tiny-url.component.html',
  styleUrls: ['./tiny-url.component.scss'],
})
export class TinyUrlComponent {
  encodeForm: FormGroup;
  decodeForm: FormGroup;
  shortUrl: string | null = null;
  longUrl: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private tinyUrlService: TinyUrlService) {
    this.encodeForm = this.fb.group({
      longUrl: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      alias: [''],
      description: [''],
    });
    this.decodeForm = this.fb.group({
      shortUrl: ['', [Validators.required]],
    });
  }

  onEncode(): void {
    this.shortUrl = null;
    this.errorMessage = null;

    const { longUrl, alias, description } = this.encodeForm.value;

    this.tinyUrlService.encodeUrl({
      longUrl, 
      alias, 
      description
    }).subscribe({
      next: (response) => (this.shortUrl = response.tiny_url),
      error: (error) => (this.errorMessage = error.message),
    });
  }

  onDecode(): void {
    this.longUrl = null;
    this.errorMessage = null;

    const shortUrl = this.decodeForm.get('shortUrl')?.value;
    this.tinyUrlService.decodeUrl(shortUrl).subscribe({
      next: (response) => (this.longUrl = response.long_url),
      error: (error) => (this.errorMessage = error.message),
    });
  }
}
