import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { User } from '@auth/interfaces/User';

import { environment } from '@environments/environment';
import { AuthStatus } from '@auth/types/auth-status';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _user = signal<null | User>(null);
  private _token = signal<null | string>(null);
  private _authStatus = signal<AuthStatus>('checking');

  public user = computed(() => this._user());
  public token = computed(() => this._token());
  public authStatus = computed(() => this._authStatus());

  public login(email: string, password: string) {
    this._authStatus.set('checking');

    return this._http.post<APIResponse<User>>(`${BASEURL}/auth/login`, {
      email, 
      password
    })
    .pipe(
      tap((resp: APIResponse<User>) => {
        this.successLogin(resp.data);
      }),
      catchError((error: HttpErrorResponse) => {
        this._authStatus.set('not-authenticated');
        return throwError(() =>  error.error)
      })
    );
  }

  public validateToken() {
    const token = localStorage.getItem('token_devVault');

    if (!token) {      
      this.clearData();
      return;
    }

    return this._http.get<APIResponse<User>>(`${BASEURL}/auth/validate-token`)
    .pipe(
      tap((resp: APIResponse<User>) => {
        this.successLogin(resp.data)
      }),
      catchError((error: HttpErrorResponse) => {
        this.clearData();
        return throwError(() => error.error)
      })
    ).subscribe();
  }

  successLogin(user: User): void {
    this._token.set(user.token)
    this._user.set(user)
    this._authStatus.set('authenticated')
    localStorage.setItem('token_devVault', user.token)
  }

  clearData(): void{
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token_devVault')
  }

}
