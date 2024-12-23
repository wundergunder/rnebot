import { ExpertiseLevel } from '../types/database';

export const expertiseLevels: ExpertiseLevel[] = [
  'labourer',
  'apprentice',
  'journeyman',
  'foreman'
];

export function formatExpertiseLevel(level: ExpertiseLevel): string {
  return level
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}