import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatePersistingService {
  private getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }

  public get<T>(key: string): T | null {
    const settings = localStorage.getItem(key);
    return settings ? JSON.parse(settings) : null;
  }

  public set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value, this.getCircularReplacer()));
  }
}
