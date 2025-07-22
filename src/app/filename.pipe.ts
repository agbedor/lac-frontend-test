import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filename' })
export class FilenamePipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    const fullName = parts[parts.length - 1]; // 1753044673684_Omar%20Internship%20Report.pdf
    // Remove timestamp prefix and decode %20
    return decodeURIComponent(fullName.replace(/^\d+_/, ''));
  }
}
