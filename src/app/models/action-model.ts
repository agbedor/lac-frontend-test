export interface ActionModel {
  id?: number;
  applicant: number;
  completed_by_id: number;
  action_taken: string;
  remarks: string;
  appointment_date: string;
  appointment_time: string;
  mediator_id: number;
}
