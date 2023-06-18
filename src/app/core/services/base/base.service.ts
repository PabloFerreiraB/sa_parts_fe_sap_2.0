import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T, M> {
  protected http = inject(HttpClient);

  getAll(params: HttpParams | null = null): Observable<T> {
    if (!params) {
      params = new HttpParams();
      params = params.append("pageSize", 100);
      params = params.append("pageStart", 0);
    }

    return this.http.get<T>(`${environment.apiUrl}/path`, { params });
  }

  getById(id: number): Observable<M> {
    return this.http.get<M>(`${environment.apiUrl}/path/${id}`);
  }

  put(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/path/${id}`, body);
  }

  patch(body: any = null) {
    return this.http.patch<M>(`${environment.apiUrl}/path`, body);
  }

  post(body: M | any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/path`, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/path/${id}`);
  }

  cancel(id: number, motivo: string): Observable<T> {
    const payload = {
      motivoCancelamento: motivo,
    };

    return this.http.patch<T>(`${environment.apiUrl}/path/${id}/cancel`, payload);
  }
}
