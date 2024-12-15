import { ExpertiseLevel } from '../types/database';

export const expertiseLevels: ExpertiseLevel[] = [
  'labourer',
  '1st_year_apprentice',
  '2nd_year_apprentice',
  '3rd_year_apprentice',
  '4th_year_apprentice',
  'journeyman',
  'master_level',
];

export function formatExpertiseLevel(level: ExpertiseLevel): string {
  return level
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}