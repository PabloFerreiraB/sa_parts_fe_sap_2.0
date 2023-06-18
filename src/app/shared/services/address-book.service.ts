import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService extends BaseService<any, any> {
  protected override http = inject(HttpClient);

  getFranchises(dealerCode: string | unknown): Observable<any> {
    return this.http.get<any>(`${environment.addressBookUrl}/dealer-configuration?dealerNumber=${dealerCode}&moduleCode=PART`);
  }
}
