import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';
import { BaseService } from '../base/base.service';
import { SessionStorageService } from '../sessionStorage/session-storage.service';
import { AddressBookService } from '@shared/index';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService extends BaseService<any, any> {
  private dealer$ = new BehaviorSubject<any>(null);
  public selectedDealer$ = this.dealer$.asObservable();

  protected override http = inject(HttpClient);

  private sessionStorage = inject(SessionStorageService);
  private addressBookService = inject(AddressBookService);

  public getInitial = () => forkJoin({
    user: this.getUser(),
    franchises: this.getFranchises(),
    userPermissions: this.getUserPermissions(),
    userDealers: this.getUserDealers()
  }).pipe(map((resp: any) => {
    Object.keys(resp).forEach((key: string) =>
      resp[key] = resp[key]
    );

    return resp;
  }));

  public setLanguageCode(languageCode: string) {
    switch (languageCode) {
      case '1':
        this.sessionStorage.store('language', 'pt');
        break;
      case '2':
        this.sessionStorage.store('language', 'en');
        break;
      case '3':
        this.sessionStorage.store('language', 'es');
        break;
      default:
        this.sessionStorage.store('language', 'pt');
        break;
    }
  }

  public changeDealer(dealer: any) {
    this.dealer$.next(dealer);
  }

  public getUser() {
    return this.http.get(`${environment.securityApi.baseUrl}${environment.securityApi.paths.getUser}`);
  }

  public getFranchises(params: HttpParams | null = null): Observable<any> {
    if (!params) {
      params = new HttpParams();
    }
    return this.http.get<any>(`${environment.apiUrl}/path`, { params });
  }

  public getUserPermissions(): Observable<any> {
    return this.http.get(`${environment.securityApi.baseUrl}${environment.securityApi.paths.getUserPermissions}`);
  }

  public getUserDealers(): Observable<any> {
    return this.http.get(`${environment.securityApi.baseUrl}${environment.securityApi.paths.getUserDealers}`);
  }
}
