import { CaseModel } from './case-model';
import { RepresentativeModel } from './representative-model';
import { SpouseModel } from './spouse-model';
import { WorkModel } from './work-model';

export interface ApplicantModel {
  id?: number;
  title_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender_id: number;
  dob: string;
  age: number;
  email: string;
  address: string;
  period_of_stay: string;
  nationality_id: number;
  id_type_id: number;
  id_number: string;
  contact: string;
  language_id: number;
  children?: number;
  employment_status_id: number;
  marital_status_id: number;
  case: CaseModel;
  work?: WorkModel;
  spouse?: SpouseModel;
  representative?: RepresentativeModel;
}
