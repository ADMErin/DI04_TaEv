import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, Renderer2} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { servicioNoticias } from 'src/app/servicios/servicioNoticias.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: false, 
})

export class LineChartComponent  implements OnInit {

  public apiData: {categoria: string; totalResults: number}[] = [];

  //Estas variables se reciben como parámetro tanto de tab6 como de tab7
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";
  // Atributo que almacena los datos del chart
  public chart!: Chart;

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: servicioNoticias) { 
    Chart.register(...registerables);
  }
  ngOnInit(): void {
    console.log("Ejecuta bar-chart");

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

  private inicializarChart(){
    // datos
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
        //backgroundColor: this.backgroundColorCategorias,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'lineChart');
  
    // Añadimos el canvas al div con id "chartContainer"
    const container = this.el.nativeElement.querySelector('#contenedor-linechart');
    this.renderer.appendChild(container, canvas);

    // Creamos la gráfica
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 10,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }
  public actualizarChart() {
    console.log("Actualizar chart");
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