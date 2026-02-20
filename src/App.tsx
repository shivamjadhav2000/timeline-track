import TimelineTrack from './components/TimelineTrack';
import type { Project } from './components/TimelineTrack';

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
  return (
      <TimelineTrack 
        projects={projects} 
        windowDays={12} 
        
        title="Dynamic Roadmap Demo"
        sidebarWidth={200}
      />
  );
}

export default App;