import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // tslint:disable-next-line:object-literal-key-quotes
    'Authorization': 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class LocationAPIService {
  constructor(private http: HttpClient) { }

  SaveLocation(Location: any) {
    return this.http.post(environment.endPointAddress + 'GeoLocations', Location, httpOptions);
  }
}
