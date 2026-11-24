import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppModal } from '../../shared/app-modal/app-modal';
import { AgentService } from '../../../services/agent.service';
@Component({
  selector: 'app-delete-modal-confirm',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal-confirm.html',
  styleUrl: './delete-modal-confirm.css',
})
export class DeleteModalConfirm {
  isDeleting = false;
  @Input() open = false;
  @Input() agentId: number | null = null;

  @Output() deleted = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private agentService: AgentService
  ) {}

  onDelete(): void {
    if (this.agentId === null) {
      console.error('Cannot delete agent: no agent ID was provided.');
      return;
    }
    if (this.isDeleting) return;

    this.isDeleting = true;
    this.agentService.deleteAgent(this.agentId).subscribe({
      next:()=>{
        this.isDeleting = false;
        this.deleted.emit();
      },
      error:(err)=>{
        this.isDeleting = false;
        console.error(err);
      },
    });
  }

  onCancel(): void {
    if (this.isDeleting) return;
    this.cancel.emit();
  }
}
