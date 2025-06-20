export interface WorkModel {
  id?: number;
  job: number;
  qualification: string;
  working_period: string;
  monthly_income: number;
  employer_type: number;
  employer: string;
  employer_address: string;
  asset?: string;
}
