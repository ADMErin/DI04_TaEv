import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { servicioNoticias} from '../servicios/servicioNoticias.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public backgroundColorCat: string[] = ['rgba(255, 99, 132, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 205, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)','rgba(153, 102, 255, 0.2)','rgba(201, 203, 207, 0.2)'];
  public borderColorCat: string[] =['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)','rgb(201, 203, 207)'];

  public categorias: string[] = ["business","entertainment","general","technology","health","science","sports"];
  public tipoDeChartSeleccionado: string = "bar-chart";
  
    // Atributos para generar la consulta REST
  // Están almacenados en los ficheros de la carpeta enviroments
  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  constructor(public gestionServiceApi: servicioNoticias) {}
  ngOnInit() {
    console.log(this.categorias);
    //Mediante el array de categorias, llamamos a la API una vez por cada categoría.
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }

  segmentChanged(event: any) {
    //Recogemos el tipo de chart (bar-chart, line-chart o pie-chart), mediante event.detail.value
    this.tipoDeChartSeleccionado = event.detail.value;
    console.log(this.tipoDeChartSeleccionado);
    
    //En caso de bar-chart, realizamos una llamada al api por cada categoria que tenemos.
    if (this.tipoDeChartSeleccionado == "bar-chart"){
      this.categorias.forEach(categoria => {
        this.gestionServiceApi.cargarCategoria(categoria);
      });
    }
  }

}
