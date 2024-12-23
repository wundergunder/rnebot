// Add to existing types
export type ProjectStage = 'estimate' | 'parts_ordered' | 'appointment_booked' | 'onsite' | 'complete';
export type ProjectType = 'shop' | 'site' | 'service';

export interface Project {
  id: string;
  company_id: string;
  work_order: string;
  stage: ProjectStage;
  project_type: ProjectType;
  expected_hours: number | null; // null means ongoing
  description: string;
  client_name: string;
  tools_needed: string[];
  created_at: string;
  updated_at: string;
}