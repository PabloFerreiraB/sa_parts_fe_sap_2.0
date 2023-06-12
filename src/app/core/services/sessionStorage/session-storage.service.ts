import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  store(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  retrieve(key: string): any {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  clear(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAll(): void {
    sessionStorage.clear();
  }
}
