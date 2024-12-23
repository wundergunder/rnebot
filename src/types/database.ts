export type ExpertiseLevel = 'labourer' | 'apprentice' | 'journeyman' | 'foreman';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'manager' | 'worker';
  company_id: string | null;
  cell_phone: string | null;
  home_address: string | null;
  expertise_level: ExpertiseLevel | null;
  created_at: string;
  updated_at: string;
}

// ... rest of the file remains the same