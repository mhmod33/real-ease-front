import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService } from '../../../services/agent.service';
import { Agent, AgentType, SocialMedia } from '../../../models/agent.model';
import { signal } from '@angular/core';
import { Input, Output } from '@angular/core';
@Component({
  selector: 'app-edit-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-agent.html',
  styleUrl: './edit-agent.css',
})
export class EditAgent {
  //inputs and outputs
  @Input() open=false;
  @Input() agent:Agent|null=null;
  @Input() agentId: number | undefined = undefined;

  @Output() close = new EventEmitter<void>();

  name = '';
  nameError = false;
  type: string = 'وكيل عقاري مستقل';
  address = '';
  age?: number;
  gender: 'ذكر' | 'أنثى' = 'ذكر';
  email = '';
  agencyName = '';
  agencyAddress = '';
  agencyDescription = '';
  isLoading=signal(false)
  agentTypes: string[] = ['realEstateAgent', 'independentRealEstateAgent', 'realEstateCompany', 'commercialAgent'];
  agentRoles: string[] = ['admin', 'user', 'agent'];

  constructor(
    private agentService: AgentService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading.set(true)
    
    if (!this.name.trim()) {
      this.nameError = true;
      return;
    }
    this.nameError = false;
    this.agentService
    .editAgent(this.agentId,{
      name: this.name,
      email: this.email,
      email_verified_at: null,
      avatar: null,
      cover_photo: null,
      google_id: null,
      role: this.type === 'user' ? 'agent' : 'admin',
      type: this.type,
      age: this.age,
      gender: this.gender,
      agency: this.agencyName,
      location: this.agencyAddress || 'غير محدد',
      description: this.agencyDescription,
      phone: this.email,
      whatsapp_phone: this.email,
      social_media: {} as SocialMedia,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .subscribe({
          next: () => {
            this.isLoading.set(false)
            this.router.navigate(['/agents'])              
          },
          error: (err) => {
            this.isLoading.set(false)
            console.error(err)
          },
        });
      }
      
      onCancel(): void {
        this.close.emit();
  }
}
