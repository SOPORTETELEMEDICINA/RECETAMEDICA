import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuarioSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userName')
  );
  userName$ = this.usuarioSubject.asObservable();

  setUserName(nameSurname: string): void {
    localStorage.setItem('userName', nameSurname);
    this.usuarioSubject.next(nameSurname);
  }
}
