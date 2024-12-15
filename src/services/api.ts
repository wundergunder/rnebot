import { supabase } from '../lib/supabase';
import { Company, Profile, Project } from '../types/database';

export async function createCompany(data: Partial<Company>) {
  const { data: company, error } = await supabase
    .from('companies')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return company;
}

export async function updateProfile(id: string, data: Partial<Profile>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert([{ id, ...data }])
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function createProject(data: {
  company_id: string;
  client_name: string;
  project_name: string;
  location_type: 'field' | 'shop';
  address?: string;
  start_time: string;
  end_time: string;
  requirements: { expertise_level: string; hours_required: number }[];
}) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{
      company_id: data.company_id,
      client_name: data.client_name,
      project_name: data.project_name,
      location_type: data.location_type,
      address: data.address,
      start_time: data.start_time,
      end_time: data.end_time,
    }])
    .select()
    .single();

  if (projectError) throw projectError;

  const requirementsData = data.requirements.map(req => ({
    project_id: project.id,
    expertise_level: req.expertise_level,
    hours_required: req.hours_required,
  }));

  const { error: requirementsError } = await supabase
    .from('project_requirements')
    .insert(requirementsData);

  if (requirementsError) {
    await supabase.from('projects').delete().eq('id', project.id);
    throw requirementsError;
  }

  return project;
}

export async function getCompanyProjects(companyId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_requirements (
        *
      ),
      project_skill_requirements (
        skill_id,
        skills (
          *
        )
      ),
      project_assignments (
        *,
        profiles (
          *
        )
      )
    `)
    .eq('company_id', companyId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createBranch(data: {
  company_id: string;
  name: string;
  address: string;
  phone: string | null;
}) {
  const { data: branch, error } = await supabase
    .from('company_branches')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return branch;
}

export async function updateBranch(id: string, data: {
  name?: string;
  address?: string;
  phone?: string | null;
}) {
  const { data: branch, error } = await supabase
    .from('company_branches')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return branch;
}

export async function deleteBranch(id: string) {
  const { error } = await supabase
    .from('company_branches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}