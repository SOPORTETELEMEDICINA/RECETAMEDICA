export class Statistics {
  userRole: string;
  employees: number;
  prescriptions: number;
  patients: number;

  constructor(data: Statistics) {
    this.userRole = data.userRole || '';
    this.employees = data.employees || 0;
    this.prescriptions = data.prescriptions || 0;
    this.patients = data.patients || 0;
  }
}
