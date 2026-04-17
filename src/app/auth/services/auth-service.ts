import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, tap, throwError } from 'rxjs';

import { APIResponse } from '@shared/interfaces/APIResponse';
import { User } from '@auth/interfaces/User';

import { environment } from '@environments/environment';

const BASEURL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _user = signal<null | User>(null);
  private _token = signal<null | string>(null);
  private _authStatus = signal('not-authenticated');

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

  successLogin(user: User): void {
    this._token.set(user.token)
    this._user.set(user)
    this._authStatus.set('authenticated')
    localStorage.setItem('token_devVault', JSON.stringify(user.token))
  }

}
