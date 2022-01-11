import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Gif, SearchGIFResponse} from "../interfaces/interface";

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '3HNP0pgzFieSGwFHtI6Op7wd4TH4pXGi';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  // Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    //this._historial = localStorage.getItem(('historial'));
  }

  buscarGifs(query: string = '') {

    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    // eslint-disable-next-line no-console
    console.log(params.toString());

    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });


  }
}

