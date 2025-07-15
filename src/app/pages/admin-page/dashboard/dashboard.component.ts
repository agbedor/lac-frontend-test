import { Component, inject } from '@angular/core';
import { ActionService } from '../../../services/action.service';
import { ApplicationService } from '../../../services/application.service';
import { CaseService } from '../../../services/case.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private caseService = inject(CaseService);
  private actionService = inject(ActionService);
  private applicationService = inject(ApplicationService);
  applicationCount = this.applicationService.applicantCount;
  caseCount = this.caseService.caseCount;
  actionCount = this.actionService.actionCount;

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

  ngOnInit() {
    this.applicationService.loadApplicantCount();
    this.actionService.loadActionCount();
    this.caseService.loadCaseCount();
  }
}
