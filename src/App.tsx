import TimelineTrack from './components/TimelineTrack'
import type { Project } from './components/TimelineTrack'

function App() {
  const projects: Project[] = [
    {
      id: 'p1',
      projectName: 'Cloud Migration',
      projectStart: new Date('2026-02-10'),
      projectEnd: new Date('2026-02-14'),
      milestones: [
        { id: 'm1', name: 'DB Sync', endDate: new Date('2026-02-13'), status: 'success' },
        { id: 'm2', name: 'Security', endDate: new Date('2026-02-14'), status: 'success' },
        { id: 'm3', name: 'Go-Live', endDate: new Date('2026-02-14'), status: 'success' },
      ],
    },
    {
      id: 'p2',
      projectName: 'Mobile Refresh',
      projectStart: new Date('2026-02-11'),
      projectEnd: new Date('2026-02-13'),
      milestones: [
        { id: 'm4', name: 'UI Update', endDate: new Date('2026-02-12'), status: 'completed' },
        { id: 'm5', name: 'Beta', endDate: new Date('2026-02-13'), status: 'pending' },
      ],
    },
    {
      id: 'p3',
      projectName: 'HR Portal',
      projectStart: new Date('2026-02-15'),
      projectEnd: new Date('2026-02-25'),
      milestones: [
        { id: 'm6', name: 'Form Logic', endDate: new Date('2026-02-16'), status: 'pending' },
      ],
    },
  ]

  return (
      
      <TimelineTrack projects={projects} />
  )
}

export default App
