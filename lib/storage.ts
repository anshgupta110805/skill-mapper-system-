import { UserProfile } from '@/types';

// Using localStorage safely in Next.js (client side)
export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('skillmapper_profile');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveProfile(profile: Partial<UserProfile>): void {
  if (typeof window === 'undefined') return;
  const current = getProfile() || {
    skills: [],
    targetRoles: [],
    targetCities: [],
    timeline: '12',
    goal: 'Career Growth'
  };
  localStorage.setItem('skillmapper_profile', JSON.stringify({ ...current, ...profile }));
}

export function getSavedPaths(): any[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('skillmapper_saved_paths');
  return data ? JSON.parse(data) : [];
}

export function savePath(path: any): void {
  if (typeof window === 'undefined') return;
  const paths = getSavedPaths();
  paths.push(path);
  localStorage.setItem('skillmapper_saved_paths', JSON.stringify(paths));
}

export function getCompletedWeeks(): number[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('skillmapper_learning_weeks');
  return data ? JSON.parse(data) : [];
}

export function saveCompletedWeek(week: number): void {
  if (typeof window === 'undefined') return;
  const weeks = getCompletedWeeks();
  if (!weeks.includes(week)) {
    weeks.push(week);
    localStorage.setItem('skillmapper_learning_weeks', JSON.stringify(weeks));
  }
}

export function updateDailyMetric(metric: string, value: number) {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  const key = `skillmapper_metrics_${metric}`;
  const data = localStorage.getItem(key);
  const metrics = data ? JSON.parse(data) : {};
  metrics[today] = value;
  localStorage.setItem(key, JSON.stringify(metrics));
}

export function getDailyMetrics(metric: string): { date: string; value: number }[] {
  if (typeof window === 'undefined') return [];
  const key = `skillmapper_metrics_${metric}`;
  const data = localStorage.getItem(key);
  if (!data) return [];
  const metrics = JSON.parse(data);
  
  // Return last 7 days
  const today = new Date();
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  
  return last7Days.map(date => ({
    date,
    value: metrics[date] || 0
  }));
}

export function getLastCitySearch(): { city: string, role: string } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('skillmapper_city_search');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveLastCitySearch(city: string, role: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('skillmapper_city_search', JSON.stringify({ city, role }));
}
