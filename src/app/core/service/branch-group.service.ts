import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BranchGroupService {
  private branchGroupIdSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('branchGroupId')
  );
  branchGroupId$ = this.branchGroupIdSubject.asObservable();

  setBranchGroupId(id: string): void {
    localStorage.setItem('branchGroupId', id);
    this.branchGroupIdSubject.next(id);
  }
}
