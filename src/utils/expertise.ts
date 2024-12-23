import { ExpertiseLevel } from '../types/database';

export const expertiseLevels: ExpertiseLevel[] = [
  'labourer',
  'apprentice',
  'journeyman',
  'foreman'
];

export function formatExpertiseLevel(level: ExpertiseLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}