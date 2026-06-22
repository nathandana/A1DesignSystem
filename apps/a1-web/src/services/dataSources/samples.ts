/**
 * Data sources — built-in sample datasets (A1-94). Seeded once into an empty
 * workspace so the Data page has something to edit out of the box, and offered as a
 * one-click "Add sample" in the empty state. All data is obviously fake.
 */
import type { CreateDataSourceInput, DataColumn, DataRow } from './types';

const SEEDED_FLAG = 'a1-data-sources-seeded';

/** True once the one-time sample seed has run in this browser. */
export function hasSeededSamples(): boolean {
  try { return localStorage.getItem(SEEDED_FLAG) === '1'; } catch { return false; }
}

/** Mark the one-time sample seed as done so deleting the sample won't resurrect it. */
export function markSeededSamples(): void {
  try { localStorage.setItem(SEEDED_FLAG, '1'); } catch { /* ignore */ }
}

const USER_COLUMNS: DataColumn[] = [
  { key: 'name', name: 'Name', type: 'text' },
  { key: 'email', name: 'Email', type: 'text' },
  { key: 'phone', name: 'Phone', type: 'text' },
  { key: 'company', name: 'Company', type: 'text' },
  { key: 'role', name: 'Role', type: 'text' },
  { key: 'city', name: 'City', type: 'text' },
  { key: 'country', name: 'Country', type: 'text' },
  { key: 'status', name: 'Status', type: 'text' },
];

const USER_ROWS: DataRow[] = [
  { name: 'Ada Bennett',     email: 'ada.bennett@example.com',    phone: '+1 (415) 555-0142', company: 'Northwind Labs',  role: 'Product designer',     city: 'San Francisco', country: 'United States', status: 'Active' },
  { name: 'Marcus Hale',     email: 'marcus.hale@example.com',    phone: '+1 (212) 555-0188', company: 'Brightside Co.',  role: 'Engineering lead',     city: 'New York',      country: 'United States', status: 'Active' },
  { name: 'Priya Nair',      email: 'priya.nair@example.com',     phone: '+44 20 7946 0321',  company: 'Loft & Co.',      role: 'Data analyst',         city: 'London',        country: 'United Kingdom', status: 'Invited' },
  { name: 'Diego Santos',    email: 'diego.santos@example.com',   phone: '+55 11 95555-0117', company: 'Verde Studio',    role: 'Frontend engineer',    city: 'São Paulo',     country: 'Brazil',         status: 'Active' },
  { name: 'Lena Fischer',    email: 'lena.fischer@example.com',   phone: '+49 30 5555 0163',  company: 'Atlas Group',     role: 'UX researcher',        city: 'Berlin',        country: 'Germany',        status: 'Suspended' },
  { name: 'Yuki Tanaka',     email: 'yuki.tanaka@example.com',    phone: '+81 3-5555-0199',   company: 'Sakura Tech',     role: 'Mobile developer',     city: 'Tokyo',         country: 'Japan',          status: 'Active' },
  { name: 'Sofia Romano',    email: 'sofia.romano@example.com',   phone: '+39 06 5555 0124',  company: 'Mercato Digital',  role: 'Content strategist',   city: 'Rome',          country: 'Italy',          status: 'Invited' },
  { name: 'Omar Haddad',     email: 'omar.haddad@example.com',    phone: '+971 4 555 0176',   company: 'Dunes Interactive', role: 'Solutions architect',  city: 'Dubai',         country: 'United Arab Emirates', status: 'Active' },
  { name: 'Grace Okafor',    email: 'grace.okafor@example.com',   phone: '+234 1 555 0150',   company: 'Lagoon Works',    role: 'Project manager',      city: 'Lagos',         country: 'Nigeria',        status: 'Active' },
  { name: 'Henrik Larsen',   email: 'henrik.larsen@example.com',  phone: '+45 32 55 0131',    company: 'Fjord Systems',   role: 'QA engineer',          city: 'Copenhagen',    country: 'Denmark',        status: 'Suspended' },
  { name: 'Mei Chen',        email: 'mei.chen@example.com',       phone: '+1 (604) 555-0193', company: 'Cedar & Pine',    role: 'Marketing lead',       city: 'Vancouver',     country: 'Canada',         status: 'Active' },
  { name: 'Tomás Vega',      email: 'tomas.vega@example.com',     phone: '+34 91 555 0108',   company: 'Sol Collective',  role: 'Backend engineer',     city: 'Madrid',        country: 'Spain',          status: 'Invited' },
];

/** The "Users" sample dataset — global (available to every project). */
export function buildUsersSample(): CreateDataSourceInput {
  return {
    name: 'Users',
    description: 'Sample people with contact details. Edit, scope, or bind into a page.',
    columns: USER_COLUMNS,
    rows: USER_ROWS,
    projectIds: [], // global
  };
}

/** All built-in samples offered in the UI. */
export const SAMPLE_DATA_SOURCES: { id: string; label: string; build: () => CreateDataSourceInput }[] = [
  { id: 'users', label: 'Users', build: buildUsersSample },
];
