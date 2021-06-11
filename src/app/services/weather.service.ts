import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey: string = '1cdffe78d9eafa56cb98603fb1585358';
  //apiKey: string = 'fdf0fb5ac9ae62a9cb422103f830dd27';
  URL: string = '';

  constructor(private httpClient: HttpClient) {
    this.URL = `http://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&q=`;
    //this.URL = `http://api.openweathermap.org/data/2.5/forecast/daily?appid=${this.apiKey}&cnt=16&q=`;
  }

  getWeather(city: string){
    return this.httpClient.get(`${this.URL}${city}`);    
  }

}
