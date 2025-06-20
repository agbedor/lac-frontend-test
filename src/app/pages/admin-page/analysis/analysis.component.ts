import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.scss',
})
export class AnalysisComponent {
  public scatterChartData: ChartConfiguration<'scatter'>['data'] = {
    datasets: [
      {
        label: 'Scatter Dataset',
        data: [
          { x: -10, y: 0 },
          { x: 0, y: 10 },
          { x: 10, y: 5 },
          { x: 0.5, y: 5.5 },
        ],
        backgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  public scatterChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  public horizontalBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  public horizontalBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y', // <-- horizontal bar magic here
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  bubbleChartData = {
    datasets: [
      {
        label: 'Applications',
        data: [{ x: 10, y: 20, r: 15 }],
        backgroundColor: 'rgba(245, 49, 49, 0.5)',
      },
      {
        label: 'Cases',
        data: [{ x: 15, y: 10, r: 10 }],
        backgroundColor: 'rgba(0, 158, 0, 0.5)',
      },
      {
        label: 'Actions',
        data: [{ x: 5, y: 25, r: 12 }],
        backgroundColor: 'rgba(51, 51, 222, 0.5)',
      },
    ],
  };

  bubbleChartOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };
}
