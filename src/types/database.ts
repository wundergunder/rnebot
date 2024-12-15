// Add to existing database.ts file

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}