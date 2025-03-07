import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, Renderer2} from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { servicioNoticias } from 'src/app/servicios/servicioNoticias.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false
})

export class BarChartComponent  implements OnInit {

  public apiData: {categoria: string; totalResults: number}[] = [];

  //Estas variables se reciben como parámetro tanto de tab6 como de tab7
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";
  // Atributo que almacena los datos del chart
  public chart!: Chart;

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: servicioNoticias) { }

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
          console.log("Chart actualizar: ");
        } else {
          this.inicializarChart();
          console.log("Chart iniciar: ");
        }
        
        
      } else {console.log("probando");}
      
    });
  }
  
  private inicializarChart(): void {
    console.log("Iniciar chart");
  
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
    this.renderer.setAttribute(canvas, 'id', 'barChart');
  
    // Añadimos el canvas al div con id "contenedor-barchart"
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas);
  
    this.chart = new Chart(canvas, {
      type: 'bar' as ChartType, // Tipo de la gráfica
      data: data, // Datos
      options: { // Opciones de la gráfica
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
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
    console.log("Chart: " + this.chart);
  }

  // Método para actualizar el Chart con los datos de apiData
actualizarChart() {
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


