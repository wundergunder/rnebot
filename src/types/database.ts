export type ExpertiseLevel = 'labourer' | 'apprentice' | 'journeyman' | 'foreman';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'manager' | 'worker';
  company_id: string | null;
  cell_phone: string | null;
  home_address: string | null;
  expertise_level: ExpertiseLevel | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  company_id: string;
  client_name: string;
  project_name: string;
  location_type: 'field' | 'shop';
  address: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  requires_license: boolean;
  created_at: string;
}