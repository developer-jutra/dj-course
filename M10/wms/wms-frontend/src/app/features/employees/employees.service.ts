import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee, Role, Permission, AuditLog } from './employees.interfaces';
import { MOCK_AUDIT_LOGS, MOCK_EMPLOYEES, MOCK_ROLES } from '../../mock/employees.mock';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private mockEmployees: Employee[] = MOCK_EMPLOYEES;
  private mockRoles: Role[] = MOCK_ROLES;
  private mockAuditLogs: AuditLog[] = MOCK_AUDIT_LOGS;

  getEmployees(): Observable<Employee[]> {
    return of(this.mockEmployees).pipe(delay(300));
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    const employee = this.mockEmployees.find(e => e.id === id);
    return of(employee).pipe(delay(200));
  }

  getRoles(): Observable<Role[]> {
    return of(this.mockRoles).pipe(delay(300));
  }

  getRole(id: number): Observable<Role | undefined> {
    const role = this.mockRoles.find(r => r.id === id);
    return of(role).pipe(delay(200));
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return of(this.mockAuditLogs).pipe(delay(300));
  }

  assignRoleToUser(userId: number, roleId: number, assignedBy: number): Observable<void> {
    // Mock implementation
    return of(void 0).pipe(delay(500));
  }

  removeRoleFromUser(userId: number, roleId: number, removedBy: number): Observable<void> {
    // Mock implementation
    return of(void 0).pipe(delay(500));
  }

  createRole(role: Partial<Role>): Observable<Role> {
    const newRole: Role = {
      id: Math.max(...this.mockRoles.map(r => r.id)) + 1,
      name: role.name || '',
      description: role.description || '',
      permissions: role.permissions || [],
      assignedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockRoles.push(newRole);
    return of(newRole).pipe(delay(500));
  }

  updateRole(id: number, updates: Partial<Role>): Observable<Role | undefined> {
    const roleIndex = this.mockRoles.findIndex(r => r.id === id);
    if (roleIndex !== -1) {
      this.mockRoles[roleIndex] = { ...this.mockRoles[roleIndex], ...updates, updatedAt: new Date() };
      return of(this.mockRoles[roleIndex]).pipe(delay(500));
    }
    return of(undefined).pipe(delay(500));
  }

  deleteRole(id: number): Observable<boolean> {
    const roleIndex = this.mockRoles.findIndex(r => r.id === id);
    if (roleIndex !== -1 && this.mockRoles[roleIndex].assignedUsers.length === 0) {
      this.mockRoles.splice(roleIndex, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
}