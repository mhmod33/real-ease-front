import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { AgentService } from '../../services/agent.service';
import { Agent, AgentsResponse, stats } from '../../models/agent.model';
import { AppModal } from '../shared/app-modal/app-modal';
import { ChatModal, ChatContact } from '../shared/chat-modal/chat-modal';
import { signal } from '@angular/core';
@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, AppModal, ChatModal],
  templateUrl: './agents.html',
  styleUrl: './agents.css',
})
export class Agents implements OnInit, AfterViewInit {
  agents = signal<AgentsResponse|undefined>(undefined);
  stats=signal<stats|undefined> (undefined);
  private donutChart?: Highcharts.Chart;
  private viewInitialized = false;

  // Info Modal
  modalOpen = false;
  modalTitle = '';
  modalMessage = '';

  // Chat Modal
  showChatModal = false;
  chatContact?: ChatContact;

  constructor(
    private agentService: AgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAgents();
    this.getAgentStats();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.renderDonutChart();
  }

  renderDonutChart(): void {
    const data = [
      { name: 'شركة عقارية', y: this.stats()?.real_estate_company ?? 0, color: '#2563eb' },
      { name: 'وكيل عقاري', y: this.stats()?.real_estate_agents ?? 0, color: '#fa8b3c' },
      { name: 'وكيل عقاري مستقل', y: this.stats()?.independent_real_estate_agents ?? 0, color: '#0d9488' },
      { name: 'وكيل تجاري', y: this.stats()?.commercial_agents ?? 0, color: '#38bdf8' },
    ];

    if (this.donutChart) {
      this.donutChart.series[0].setData(data);
      return;
    }

    this.donutChart = Highcharts.chart('agentsDonutChart', {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 100,
        width: 100,
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
      },
      title: { text: '' },
      credits: { enabled: false },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.y}</b>',
      },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderWidth: 0,
          dataLabels: { enabled: false },
          states: { hover: { halo: { size: 0 } } },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'الوكلاء',
          data,
        },
      ],
    });
  }
  getAgents(){
    this.agentService.getAgents().subscribe({
      next:(res)=>{
        this.agents.set(res);
        console.log('Agents:', res);
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }
  getAgentStats(){
    this.agentService.getAgentStats().subscribe({
      next:(res)=>{
        this.stats.set(res.data)
        if (this.viewInitialized) {
          this.renderDonutChart();
        }
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }
  goToCreate(): void {
    this.router.navigate(['/agents/create']);
  }

  goToDetails(id: number): void {
    this.router.navigate(['/agents', id]);
  }

  onMessage(agent: Agent, event: MouseEvent): void {
    event.stopPropagation();
    this.chatContact = {
      id: agent.id,
      name: agent.name,
      role: agent.type,
      phone: agent.phone,
    };
    this.showChatModal = true;
  }

  closeChat(): void {
    this.showChatModal = false;
    this.chatContact = undefined;
  }

  onCall(agent: Agent, event: MouseEvent): void {
    event.stopPropagation();
    this.openInfo(
      'الاتصال بالوكيل',
      `الاتصال بالوكيل: ${agent.name} (${agent.phone || 'رقم الهاتف متوفر'})`
    );
  }

  private openInfo(title: string, message: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }
}
