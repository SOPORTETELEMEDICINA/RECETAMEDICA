import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessGroupService {
  private businessGroupIdSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('businessGroupId')
  );
  businessGroupId$ = this.businessGroupIdSubject.asObservable();

  setBusinessGroupId(id: string): void {
    localStorage.setItem('businessGroupId', id);
    this.businessGroupIdSubject.next(id);
  }
}
