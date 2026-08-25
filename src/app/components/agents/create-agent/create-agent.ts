import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService } from '../../../services/agent.service';
import { AgentType } from '../../../models/agent.model';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-agent.html',
  styleUrl: './create-agent.css',
})
export class CreateAgent {
  name = '';
  nameError = false;
  type: AgentType = 'وكيل عقاري مستقل';
  address = '';
  age?: number;
  gender: 'ذكر' | 'أنثى' = 'ذكر';
  email = '';
  agencyName = '';
  agencyAddress = '';
  agencyDescription = '';

  agentTypes: AgentType[] = [
    'وكيل عقاري مستقل',
    'وكيل عقاري',
    'وكيل تجاري',
    'شركة عقارية',
  ];

  constructor(
    private agentService: AgentService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name.trim()) {
      this.nameError = true;
      return;
    }
    this.nameError = false;
    this.agentService
      .addAgent({
        name: this.name,
        type: this.type,
        address: this.address,
        location: this.address || 'غير محدد',
        age: this.age,
        gender: this.gender,
        email: this.email,
        agencyName: this.agencyName,
        agencyAddress: this.agencyAddress,
        agencyDescription: this.agencyDescription,
      })
      .subscribe(() => {
        this.router.navigate(['/agents']);
      });
  }

  onCancel(): void {
    this.router.navigate(['/agents']);
  }
}
