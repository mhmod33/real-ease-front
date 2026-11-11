import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Agent, AgentsResponse, AgentStatsResponse } from '../models/agent.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AgentService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  stats = {
    realEstateCompanyCount: 50,
    independentAgentCount: 50,
    exclusiveAgentCount: 30,
    commercialAgentCount: 20,
    total: 150,
  };
  getAgents():Observable<AgentsResponse> {
    return this.http.get<AgentsResponse>(`${this.apiUrl}users/agents`);
  }

  getAgentById(id: string): Observable<Agent | undefined> {
    return this.http.get<Agent | undefined>(`${this.apiUrl}users/${id}`);
  }

  getAgentStats():Observable<AgentStatsResponse> {
    return this.http.get<AgentStatsResponse>(`${this.apiUrl}users/agents-statistics`);
  }

  addAgent(newAgentData: Partial<Agent>):Observable<Agent> {
    return this.http.post<Agent>(`${this.apiUrl}users/agents`, newAgentData);
  }

  deleteAgent(id: string) {
  
  }

  deleteAgentProperty(agentId: string, propertyId: string) {

  }
}
