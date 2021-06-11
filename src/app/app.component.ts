import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'demo-calendar';

  //Variables 
  week: any = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  colors = [{name: 'yellow',value: '#ffff00'},{name: 'red',value: '#ff3300'},{name: 'green',value: '#00ff00'}];
  daysOfMonth: any = [];
  indexDay: any;
  currentIndex: any;
  pastIndex: any;
  arrayReminder: any = [[]];
  reminderCalendar: any;
  weather: any;
  globalJ: any = undefined;

  //Formulario
  reminderForm: FormGroup = new FormGroup({
    day: new FormControl(''),
    time: new FormControl(''),
    activity: new FormControl(''),
    city: new FormControl(''),
    color: new FormControl('')
  }) 

  constructor(private weatherService: WeatherService){

  }

  ngOnInit():void{
    this.getDaysOfMonth(6,2021);
  }

  //Funciones
  //Obtención de Array con el total de días del mes
  //y el día de la semana en que empieza el mes
  getDaysOfMonth(month: number, year: number){
    const firstDate = moment.utc(`${year}/${month}/01`);
    const lastDate = firstDate.clone().endOf('month');
    var totalDays = lastDate.diff(firstDate,'days',true);
    totalDays = Math.round(totalDays);
    const arrayDays = [];
    for(var i = 1; i <= totalDays; i++){
      arrayDays.push(i);
    }
    this.indexDay = firstDate.isoWeekday() + 1;
    this.daysOfMonth = arrayDays;
  }

  //Registro en Array de recordatorios nuevo o edición de existente
  saveForm(){
    //Si es la primera vez se genera vacío
    if (this.arrayReminder[this.reminderForm.value.day - 1] == undefined){
      this.arrayReminder[this.reminderForm.value.day - 1] = [];
    }
    //Si no es edición, entonces genera registro nuevo
    if(this.globalJ == undefined){
      this.arrayReminder[this.reminderForm.value.day - 1].push(
        {
          "day":this.reminderForm.value.day,
          "time":this.reminderForm.value.time,
          "activity":this.reminderForm.value.activity,
          "city":this.reminderForm.value.city,
          "color":this.reminderForm.value.color
        }
      )
    //Si es edición, se posiciona en el registro
    }else{
      this.arrayReminder[this.reminderForm.value.day - 1][this.globalJ] = {
          "day":this.reminderForm.value.day,
          "time":this.reminderForm.value.time,
          "activity":this.reminderForm.value.activity,
          "city":this.reminderForm.value.city,
          "color":this.reminderForm.value.color
        }
    }
    //Obtención del clima según la ciudad
    this.getWeather(`${this.reminderForm.value.city}`);
    
    //Una vez guardado el nuevo registro o los cambios, inicializa formulario
    this.cleanForm();
  }

  //Se pinta formulario con recordatorio seleccionado
  editForm(i: any,j: any){
    this.globalJ = j;
    this.reminderForm.get('day')?.setValue( (this.arrayReminder[i] == undefined) ? '' : this.arrayReminder[i][j].day );
    this.reminderForm.get('time')?.setValue( (this.arrayReminder[i] == undefined) ? '' : this.arrayReminder[i][j].time );
    this.reminderForm.get('activity')?.setValue( (this.arrayReminder[i] == undefined) ? '' : this.arrayReminder[i][j].activity );
    this.reminderForm.get('city')?.setValue( (this.arrayReminder[i] == undefined) ? '' : this.arrayReminder[i][j].city );
    this.reminderForm.get('color')?.setValue( (this.arrayReminder[i] == undefined) ? '' : this.arrayReminder[i][j].color ); 
    //Si existe recordatorio con ciudad, lo pinta
    if(this.arrayReminder[i] !== undefined){
      if(this.arrayReminder[i][j].city !== undefined && this.arrayReminder[i][j].city !== ''){
        this.getWeather(`${this.arrayReminder[i][j].city}`);
      }
    }else{
      this.weather = '';
    }
  }

  //Elimina el recordatorio seleccionado
  deleteReminder(){
    this.arrayReminder[this.reminderForm.value.day - 1][this.globalJ] = {
      "day":'',
      "time":'',
      "activity":'',
      "city":'',
      "color":''
    }
  }

  //Inicializa arreglo de recordatorios
  deleteAll(){
    this.arrayReminder = [[]];
  }

  //Inicializa Formulario
  cleanForm(){
    this.reminderForm.get('day')?.setValue('');
    this.reminderForm.get('time')?.setValue('');
    this.reminderForm.get('activity')?.setValue('');
    this.reminderForm.get('city')?.setValue('');
    this.reminderForm.get('color')?.setValue('');
    this.globalJ = undefined;
    this.weather = '';
  }

  //Consume servicio para obtener clima
  getWeather(city: string){
    this.weatherService.getWeather(city).subscribe(
      res => {
        console.log(res);
        this.weather = res;
      },
      err => console.log(err)
    );
  }

}
