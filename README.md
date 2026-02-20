# Timeline Track

Enterprise-ready React timeline component for projects and milestones, with status-aware colors and range navigation.

![Timeline Track Preview](https://raw.githubusercontent.com/shivamjadhav28/timeline-track/main/public/preview.png)

## Install

```bash
npm i @shivamjadhav28/timeline-track
```

## Usage

```tsx
import { TimelineTrack, type Project } from '@shivamjadhav28/timeline-track';

const projects: Project[] = [
  {
    id: 'p1',
    projectName: 'Cloud Migration',
    projectStart: new Date('2026-02-10'),
    projectEnd: new Date('2026-02-14'),
    milestones: [
      { id: 'm1', name: 'DB Sync', endDate: new Date('2026-02-13'), status: 'success' },
      { id: 'm2', name: 'Security', endDate: new Date('2026-02-14'), status: 'success' },
    ],
  },
  {
    id: 'p2',
    projectName: 'Mobile Refresh',
    projectStart: new Date('2026-02-11'),
    projectEnd: new Date('2026-02-13'),
    milestones: [
      { id: 'm3', name: 'UI Update', endDate: new Date('2026-02-12'), status: 'completed' },
      { id: 'm4', name: 'Beta', endDate: new Date('2026-02-13'), status: 'pending' },
    ],
  },
  {
    id: 'p3',
    projectName: 'HR Portal',
    projectStart: new Date('2026-02-15'),
    projectEnd: new Date('2026-02-25'),
    milestones: [
      { id: 'm5', name: 'Form Logic', endDate: new Date('2026-02-16'), status: 'pending' },
    ],
  },
];
export default function Example() {
  return <TimelineTrack projects={projects} />;
}
```

## Props

- `projects` (required): `Project[]`
- `viewDate`: `Date` (controlled view date)
- `onViewDateChange`: `(date: Date) => void`
- `windowDays`: number (default `7`)
- `showTodayLine`: boolean (default `true`)
- `sidebarWidth`: number (default `220`)
- `rowHeight`: number (default `120`)
- `rangeIconSize`: number (default `16`)
- `showHeader`: boolean (default `true`)
- `title`: string (default `Team Roadmap`)
- `prevLabel`: string (default `Day`)
- `nextLabel`: string (default `Day`)
- `todayLabel`: string (default `Today`)
- `colors`: partial theme override
- `className`: string

## Types

```ts
export type MilestoneStatus =
  | 'completed'
  | 'success'
  | 'cancelled'
  | 'pending'
  | 'in-progress';

export interface Milestone {
  id: string;
  name: string;
  endDate: Date;
  status: MilestoneStatus;
}

export interface Project {
  id: string;
  projectName: string;
  projectStart: Date;
  projectEnd: Date;
  milestones: Milestone[];
}
```

## Status Rules

- Project is **green** if all milestones are `completed` or `success`.
- Project is **red** if end date is past today and not all milestones are complete.
- Milestone is **red** if status is `in-progress` and end date is past today.

## Build

```bash
npm run build
```

## Publish

If you use npm 2FA, publish with a **Granular Access Token** (recommended):

1. Create a token on npmjs.com:
   - Scope: `@shivamjadhav28`
   - Permissions: **Read and Publish**
   - 2FA: **bypass publish**
2. Login with the token:
   ```bash
   npm logout
   npm login --auth-type=legacy
   ```
   - Username: `shivamjadhav28`
   - Password: **paste the token**
   - Email: your npm email
3. Bump version and publish:
   ```bash
   npm version patch
   npm publish --access public
   ```

Check who you’re logged in as:
```bash
npm whoami
```

## License

MIT
