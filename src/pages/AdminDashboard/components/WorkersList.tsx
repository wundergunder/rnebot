import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Profile, Project } from '../../../types/database';
import { Spinner } from '../../../components/ui/Spinner';
import WorkerCard from './WorkerCard';
import toast from 'react-hot-toast';

export default function WorkersList() {
  const [workers, setWorkers] = useState<(Profile & { projects: Project[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            *,
            projects:project_assignments(
              projects(*)
            )
          `)
          .eq('role', 'worker')
          .order('full_name');

        if (profilesError) throw profilesError;

        // Transform the data to flatten the structure
        const workersWithProjects = profiles.map(profile => ({
          ...profile,
          projects: profile.projects
            ?.map((pa: any) => pa.projects)
            .filter((p: Project) => p !== null) || []
        }));

        setWorkers(workersWithProjects);
      } catch (error) {
        console.error('Error fetching workers:', error);
        toast.error('Failed to load workers');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No workers found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Workers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}