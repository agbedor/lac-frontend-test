import { OpponentModel } from "./opponent-model";

export interface CaseModel {
  id?: number;
  case_type_id: number;
  main_charge: string;
  court_room_id?: number;
  suit_no?: string;
  case_pending_duration?: string;
  case_relation_id: number;
  beneficiary_type_id?: number;
  number_of_times?: number;
  previous_case_number?: string;
  opponent: OpponentModel;
  case_summary: string;
}
