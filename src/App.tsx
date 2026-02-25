import TimelineTrack from './components/TimelineTrack';
import type { Project, TimelineTheme } from './components/TimelineTrack';

/**
 * Helper to keep the demo evergreen.
 * offset 0 = today, -1 = yesterday, 1 = tomorrow
 */
const relativeDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
};

function App() {
  const projects: Project[] = [
    {
      id: 'active-01',
      projectName: 'Active Sprint', // Currently happening
      projectStart: relativeDate(-2),
      projectEnd: relativeDate(5),
      status: 'in-progress',
      milestones: [
        { id: 'm1', name: 'Design Fix', endDate: relativeDate(0), status: 'completed' },
        { id: 'm2', name: 'API Integration', endDate: relativeDate(2), status: 'pending' },
      ],
    },
    {
      id: 'done-02',
      projectName: 'Completed Task', // Entirely in the past
      projectStart: relativeDate(-10),
      projectEnd: relativeDate(-5),
      status: 'completed',
      milestones: [
        { id: 'm3', name: 'Handover', endDate: relativeDate(-6), status: 'success' },
      ],
    },
    {
      id: 'late-03',
      projectName: 'Overdue Project', // End date passed but not marked completed
      projectStart: relativeDate(-8),
      projectEnd: relativeDate(-1),
      status: 'pending', 
      milestones: [
        { id: 'm4', name: 'Missed Deadline', endDate: relativeDate(-2), status: 'pending' },
      ],
    },
    {
      id: 'future-04',
      projectName: 'Upcoming Launch', // Entirely in the future
      projectStart: relativeDate(2),
      projectEnd: relativeDate(7),
      status: 'pending',
      milestones: [
        { id: 'm5', name: 'Kickoff', endDate: relativeDate(3), status: 'pending' },
      ],
    },
  ];
  const compactTheme: TimelineTheme = {
    spacing: { padding: 18, headerPadding: 12 },
    sizes: { sidebarWidth: 180, rowHeight: 96, rangeIconSize: 14 },
    colors: {
      primary: '#2563eb',
      success: '#16a34a',
      danger: '#dc2626',
      muted: '#64748b',
      background: '#f8fafc',
    },
  };

  const darkTheme: TimelineTheme = {
    colors: {
      primary: '#38bdf8',
      success: '#22c55e',
      danger: '#f87171',
      warning: '#f59e0b',
      muted: '#94a3b8',
      card: '#0f172a',
      grid: '#1f2937',
      border: '#1f2937',
      background: '#0b1220',
      text: '#e2e8f0',
    },
    spacing: { padding: 24, headerPadding: 14 },
    sizes: { sidebarWidth: 220, rowHeight: 110, rangeIconSize: 16 },
  };

  return (
    <>
      <TimelineTrack
        projects={projects}
        windowDays={12}
        title="Default Theme"
      />

      <TimelineTrack
        projects={projects}
        windowDays={10}
        title="Compact Theme"
        theme={compactTheme}
        style={{ marginTop: 24 }}
      />

      <TimelineTrack
        projects={projects}
        windowDays={14}
        title="Dark Theme"
        theme={darkTheme}
        style={{ marginTop: 24 }}
      />
    </>
  );
}

export default App;
