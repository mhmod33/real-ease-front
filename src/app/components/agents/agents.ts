import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { AgentService } from '../../services/agent.service';
import { Agent, AgentTypeStats } from '../../models/agent.model';
import { AppModal } from '../shared/app-modal/app-modal';
import { ChatModal, ChatContact } from '../shared/chat-modal/chat-modal';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, AppModal, ChatModal],
  templateUrl: './agents.html',
  styleUrl: './agents.css',
})
export class Agents implements OnInit, AfterViewInit {
  agents: Agent[] = [];
  stats: AgentTypeStats = {
    realEstateCompanyCount: 50,
    independentAgentCount: 50,
    exclusiveAgentCount: 30,
    commercialAgentCount: 20,
    total: 150,
  };

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
    this.agentService.agents$.subscribe((data) => {
      this.agents = data.slice(0, 4);
    });
    this.stats = this.agentService.getAgentTypeStats();
  }

  ngAfterViewInit(): void {
    this.renderDonutChart();
  }

  renderDonutChart(): void {
    Highcharts.chart('agentsDonutChart', {
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
          data: [
            { name: 'شركة عقارية', y: this.stats.realEstateCompanyCount, color: '#2563eb' },
            { name: 'وكيل عقاري مستقل', y: this.stats.independentAgentCount, color: '#fa8b3c' },
            { name: 'وكيل حصري', y: this.stats.exclusiveAgentCount, color: '#0d9488' },
            { name: 'وكيل تجاري', y: this.stats.commercialAgentCount, color: '#38bdf8' },
          ],
        },
      ],
    });
  }

  goToCreate(): void {
    this.router.navigate(['/agents/create']);
  }

  goToDetails(id: string): void {
    this.router.navigate(['/agents', id]);
  }

  onMessage(agent: Agent, event: MouseEvent): void {
    event.stopPropagation();
    this.chatContact = {
      id: agent.id,
      name: agent.name,
      image: agent.image,
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
