import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, Renderer2} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { servicioNoticias } from 'src/app/servicios/servicioNoticias.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: false, 
})
export class PieChartComponent  implements OnInit {
  public apiData: {categoria: string; totalResults: number}[] = [];

  
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";
  // Atributo que almacena los datos del chart
  public chart!: Chart;

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: servicioNoticias) { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log("Ejecuta pie-chart");

    // Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
    this.gestionServiceApi.datos$.subscribe((datos) => {
      
      if (datos != undefined) {
        // Cuando recibimos un valor actualizamos los arrays de nombre y valor de categorias, para guardar el nombre y su valor en las mismas posiciones del array.
        this.apiData.push(datos);
        console.log(this.apiData);
  
        // Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        if (this.chart) {
          this.actualizarChart();
        } else {
          this.inicializarChart();
        }

      } else {console.log("probando");}
      
    });
  }

  public inicializarChart(): void {
  
    const categorias = this.apiData.map(datos => datos.categoria);
    const datosCategorias = this.apiData.map(datos => datos.totalResults);
    console.log(categorias);
    console.log(datosCategorias);
  
    const data = {
      labels: categorias,
      datasets: [{
        label: "My First Dataset",
        data: datosCategorias,
        fill: false,
        backgroundColor: this.backgroundColorCategorias,
        borderColor: this.borderColorCategorias,
        tension: 0.1
      }]
    };
    console.log(data);
  
    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'pieChart');
  
    // Añadimos el canvas al div con id "chartContainer"
    const container = this.el.nativeElement.querySelector('#contenedor-piechart');
    this.renderer.appendChild(container, canvas);
 
     // Creamos la gráfica
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType, // tipo de la gráfica 
      data: data, // datos 
    });

  }
  public actualizarChart() {
    console.log("Actualizar pie-chart");
    // Creamos el objeto datasetsByCompany con una key para cada categoría
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};
  
    // Recorremos apiData con forEach
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const categoria = row.categoria;
      const totalResults = row.totalResults;
      
      // Comprobamos si ya hemos dibujado la categoría, si no, la inicializamos
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 1
        };
      }
  
      // Asignamos los valores a datasetsByCompany
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });
  
    // Modificamos los valores de labels del Chart con map
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
  
    // Transformamos datasetsByCompany en el formato esperado por el Chart con Object.values
    this.chart.data.datasets = Object.values(datasetsByCompany);
  
    // Actualizamos el Chart
    this.chart.update();
  
  }

}
