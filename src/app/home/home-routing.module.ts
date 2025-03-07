import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { BarChartComponent } from '../componentes/bar-chart/bar-chart.component';
import { LineChartComponent } from '../componentes/line-chart/line-chart.component';
import { PieChartComponent } from '../componentes/pie-chart/pie-chart.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      { path: 'bar-chart', component: BarChartComponent },
      { path: 'line-chart', component: LineChartComponent },
      { path: 'pie-chart', component: PieChartComponent },
      { path: '', pathMatch: 'full', redirectTo: 'bar-chart' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
