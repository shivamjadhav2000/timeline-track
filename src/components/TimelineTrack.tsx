import { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Rocket,
  Flag,
  type LucideIcon,
  XCircle,
  AlertCircle
} from 'lucide-react';

// --- Types ---

export type MilestoneStatus = 'completed' | 'success' | 'cancelled' | 'pending' | 'in-progress';

export interface Milestone {
  id: string;
  name: string;
  endDate: Date;
  status: MilestoneStatus;
  icon?: LucideIcon;
}

export interface Project {
  id: string;
  projectName: string;
  projectStart: Date;
  projectEnd: Date;
  status: MilestoneStatus;
  milestones: Milestone[];
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

export type TimelineColors = {
  primary: string;
  success: string;
  danger: string;
  warning: string;
  muted: string;
  card: string;
  grid: string;
  border: string;
  background: string;
  text: string;
};

const DEFAULT_COLORS: TimelineColors = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  muted: '#94a3b8',
  card: '#ffffff',
  grid: '#f1f5f9',
  border: '#e2e8f0',
  background: '#f8fafc',
  text: '#1e293b',
};

// --- Styled Components ---

const Container = styled.div<{ $bg: string }>` 
  padding: 30px; 
  background: ${props => props.$bg}; 
  font-family: 'Segoe UI', Tahoma, sans-serif; 
`;

const Header = styled.div<{ $bg: string; $color: string }>` 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 20px; 
  background: ${props => props.$bg}; 
  padding: 15px 25px; 
  color: ${props => props.$color}; 
  border-radius: 12px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
`;

const NavBtn = styled.button<{ $bg: string }>` 
  background: ${props => props.$bg}; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  &:hover { opacity: 0.9; } 
`;

const TimelineBoard = styled.div<{ $border: string; $card: string }>` 
  position: relative; 
  background: ${props => props.$card}; 
  border: 1px solid ${props => props.$border}; 
  border-radius: 12px; 
  overflow: hidden; 
`;

const GridLayer = styled.div<{ $sidebarWidth: number; $windowDays: number }>` 
  position: absolute; 
  top: 0; 
  left: ${props => props.$sidebarWidth}px; 
  right: 0; 
  bottom: 0; 
  display: grid; 
  grid-template-columns: repeat(${props => props.$windowDays}, 1fr); 
  pointer-events: none; 
`;

const GridCol = styled.div<{ $grid: string; $color: string }>` 
  border-right: 1px solid ${props => props.$grid}; 
  display: flex; 
  justify-content: center; 
  padding-top: 10px; 
  font-size: 11px; 
  color: ${props => props.$color}; 
  font-weight: 600; 
`;

const ProjectRow = styled.div<{ $rowHeight: number; $border: string }>` 
  display: flex; 
  height: ${props => props.$rowHeight}px; 
  border-bottom: 1px solid ${props => props.$border}; 
  position: relative; 
  &:last-child { border-bottom: none; } 
`;

const Sidebar = styled.div<{ $sidebarWidth: number; $color: string; $border: string }>` 
  width: ${props => props.$sidebarWidth}px; 
  min-width: ${props => props.$sidebarWidth}px; 
  background: rgba(255,255,255,1); 
  display: flex; 
  align-items: center; 
  padding: 0 20px; 
  font-weight: 700; 
  color: ${props => props.$color}; 
  border-right: 2px solid ${props => props.$border}; 
  z-index: 10; 
`;

const Track = styled.div` flex-grow: 1; position: relative; display: flex; align-items: center; `;

const ProjectRangeBox = styled.div<{ $left: number; $width: number; $color: string; $bg: string }>` 
  position: absolute; 
  left: ${props => props.$left}%; 
  width: ${props => props.$width}%; 
  height: 40px; 
  background: ${props => props.$bg}; 
  border: 2px dashed ${props => props.$color}; 
  border-radius: 8px; 
  z-index: 1; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 0 5px; 
  transition: all 0.3s ease; 
`;

const BaseLine = styled.div<{ $color: string }>` 
  position: absolute; 
  top: 50%; 
  left: 0; 
  right: 0; 
  height: 2px; 
  background: ${props => props.$color}; 
  z-index: 0; 
  opacity: 0.2;
`;

const MilestoneNode = styled.div<{ $percent: number }>` 
  position: absolute; 
  left: ${props => props.$percent}%; 
  transform: translateX(-50%); 
  z-index: 5; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
`;

const Circle = styled.div<{ $color: string }>` 
  width: 30px; 
  height: 30px; 
  background: white; 
  border: 2px solid ${props => props.$color}; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
`;

const Label = styled.div<{ $color: string }>` 
  position: absolute; 
  top: 35px; 
  font-size: 10px; 
  font-weight: 700; 
  white-space: nowrap; 
  color: ${props => props.$color}; 
`;

const TodayLine = styled.div<{ $percent: number; $sidebarWidth: number; $color: string }>` 
  position: absolute; 
  left: calc(${props => props.$sidebarWidth}px + ${props => props.$percent}%); 
  top: 0; 
  bottom: 0; 
  width: 2px; 
  background: ${props => props.$color}; 
  z-index: 20; 
  &::after {
    content: 'TODAY';
    position: absolute;
    top: 0;
    left: 4px;
    font-size: 9px;
    font-weight: 800;
    color: ${props => props.$color};
  }
`;

// --- Component ---

export interface TimelineProps {
  projects: Project[];
  viewDate?: Date;
  windowDays?: number;
  onViewDateChange?: (date: Date) => void;
  showTodayLine?: boolean;
  sidebarWidth?: number;
  rowHeight?: number;
  rangeIconSize?: number;
  showHeader?: boolean;
  title?: string;
  prevLabel?: string;
  nextLabel?: string;
  todayLabel?: string;
  className?: string;
  colors?: Partial<TimelineColors>;
}

export default function TimelineTrack({
  projects,
  viewDate,
  windowDays = 7,
  onViewDateChange,
  showTodayLine = true,
  sidebarWidth = 220,
  rowHeight = 120,
  rangeIconSize = 16,
  showHeader = true,
  title = 'Team Roadmap',
  prevLabel = 'Day',
  nextLabel = 'Day',
  todayLabel = 'Today',
  className,
  colors,
}: TimelineProps) {
  const mergedColors = { ...DEFAULT_COLORS, ...colors };
  const [internalDate, setInternalDate] = useState(new Date());
  const currentViewDate = viewDate ?? internalDate;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
const days = useMemo(() => {
  // Subtract half the window days to put currentViewDate in the center
  const centerOffset = Math.floor(windowDays / 2);
  
  return Array.from({ length: windowDays }, (_, i) => {
    const d = new Date(currentViewDate);
    d.setDate(currentViewDate.getDate() + i - centerOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}, [currentViewDate, windowDays]);

const windowStart = days[0].getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

// Percentage width of exactly one day column
const oneDayWidth = 100 / windowDays;

const getRelativePercent = (date: Date, offset = 0) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const msFromStart = d.getTime() - windowStart;
  const dayIndex = msFromStart / DAY_MS;
  
  // Calculate percent based on the day index + specific offset (0=start, 0.5=center, 1=end)
  const percent = ((dayIndex + offset) / windowDays) * 100;
  return Math.max(-10, Math.min(110, percent)); // Allow slight overflow for icons
};

  const getStatusTheme = (status: MilestoneStatus, startDate: Date, endDate: Date) => {
    // Priority 1: Explicit status
    if (status === 'completed' || status === 'success') {
      return { color: mergedColors.success, bg: `${mergedColors.success}20` };
    }
    if (status === 'cancelled') {
      return { color: mergedColors.danger, bg: `${mergedColors.danger}20` };
    }

    // Priority 2: Date-based auto-status
    if (today < startDate) return { color: mergedColors.muted, bg: `${mergedColors.muted}20` };
    if (today > endDate) return { color: mergedColors.danger, bg: `${mergedColors.danger}20` };
    
    return { color: mergedColors.primary, bg: `${mergedColors.primary}15` };
  };

  const shift = (n: number) => {
    const d = new Date(currentViewDate);
    d.setDate(d.getDate() + n);
    if (onViewDateChange) onViewDateChange(d);
    else setInternalDate(d);
  };

  return (
    <Container $bg={mergedColors.background} className={className}>
      {showHeader && (
        <Header $bg={mergedColors.card} $color={mergedColors.text}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <NavBtn $bg={mergedColors.text} onClick={() => shift(-1)}>
              <ChevronLeft size={18}/> {prevLabel}
            </NavBtn>
            <NavBtn $bg={mergedColors.text} onClick={() => {
              const now = new Date();
              if (onViewDateChange) onViewDateChange(now);
              else setInternalDate(now);
            }}>
              <Calendar size={18}/> {todayLabel}
            </NavBtn>
            <NavBtn $bg={mergedColors.text} onClick={() => shift(1)}>
              {nextLabel} <ChevronRight size={18}/>
            </NavBtn>
          </div>
        </Header>
      )}

      <TimelineBoard $border={mergedColors.border} $card={mergedColors.card}>
        <GridLayer $sidebarWidth={sidebarWidth} $windowDays={windowDays}>
          {days.map((d, i) => (
            <GridCol key={i} $grid={mergedColors.grid} $color={mergedColors.muted}>
              {d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </GridCol>
          ))}
        </GridLayer>

        {showTodayLine && (
          <TodayLine 
            $percent={getRelativePercent(today, 0)} 
            $sidebarWidth={sidebarWidth} 
            $color={mergedColors.danger} 
          />
        )}

       {projects.map((p) => {
  const { color, bg } = getStatusTheme(p.status, p.projectStart, p.projectEnd);
  const rangeLeft = getRelativePercent(p.projectStart, 0);
  const rangeRight = getRelativePercent(p.projectEnd, 1);
  const rangeWidth = Math.max(0, rangeRight - rangeLeft);

  // 1. Assign to Capitalized variables with defaults to fix TS(2604)
  const StartIcon = p.startIcon || Rocket;
  const EndIcon = p.endIcon || Flag;

  return (
    <ProjectRow key={p.id} $rowHeight={rowHeight} $border={mergedColors.grid}>
      <Sidebar $sidebarWidth={sidebarWidth} $color={mergedColors.text} $border={mergedColors.grid}>
        {p.projectName}
      </Sidebar>
      <Track>
        <BaseLine $color={mergedColors.muted} />
        
        {rangeWidth > 0 && (
          <ProjectRangeBox $left={rangeLeft} $width={rangeWidth} $color={color} $bg={bg}>
            <StartIcon size={rangeIconSize} color={color} fill={color} />
            <EndIcon size={rangeIconSize} color={color} fill={color} />
          </ProjectRangeBox>
        )}

        {p.milestones.map(m => {
          // 2. Logic for Milestone colors/icons
          const isDone = m.status === 'completed' || m.status === 'success';
          const isCancelled = m.status === 'cancelled';
          const isLate = !isDone && !isCancelled && today > m.endDate;

          let mColor = mergedColors.primary;
          if (isDone) mColor = mergedColors.success;
          else if (isCancelled || isLate) mColor = mergedColors.danger;

          // 3. Fallback Icon logic
          const MIcon = m.icon || (isDone ? Trophy : isCancelled ? XCircle : isLate ? AlertCircle : Clock);

          return (
            <MilestoneNode key={m.id} $percent={getRelativePercent(m.endDate, 0.5)}>
              <Circle $color={mColor}>
                <MIcon size={14} color={mColor} />
              </Circle>
              <Label $color={mergedColors.text}>{m.name}</Label>
            </MilestoneNode>
          );
        })}
      </Track>
    </ProjectRow>
  );
})}
      </TimelineBoard>
    </Container>
  );
}
