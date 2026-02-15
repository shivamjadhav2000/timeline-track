import { useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Play,
  Flag,
} from 'lucide-react';

export type MilestoneStatus = 'completed' | 'success' | 'cancelled' | 'pending' | 'in-progress';

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

export type TimelineColors = {
  primary: string;
  success: string;
  danger: string;
  muted: string;
  card: string;
  grid: string;
  border: string;
};

export type TimelineProps = {
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
};

const DEFAULT_COLORS: TimelineColors = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  muted: '#0f172a',
  card: '#ffffff',
  grid: '#f1f5f9',
  border: '#e2e8f0',
};

const Container = styled.div`
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  @media (max-width: 900px) {
    padding: 20px;
  }
  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px 25px;
  color: #1e293b;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  gap: 12px;
  flex-wrap: wrap;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavBtn = styled.button`
  background: #1e293b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: #334155; }
`;

const TimelineBoard = styled.div<{ $border: string; $card: string }>`
  position: relative;
  background: ${props => props.$card};
  border: 1px solid ${props => props.$border};
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 900px) {
    overflow-x: auto;
  }
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
  min-width: 700px;
  @media (max-width: 900px) {
    min-width: 600px;
  }
  @media (max-width: 640px) {
    min-width: 520px;
  }
`;

const GridCol = styled.div<{ $grid: string }>`
  border-right: 1px solid ${props => props.$grid};
  display: flex;
  justify-content: center;
  padding-top: 10px;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
`;

const ProjectRow = styled.div<{ $rowHeight: number }>`
  display: flex;
  height: ${props => props.$rowHeight}px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  &:last-child { border-bottom: none; }
  @media (max-width: 640px) {
    height: auto;
    min-height: 96px;
    flex-direction: column;
  }
`;

const Sidebar = styled.div<{ $sidebarWidth: number }>`
  width: ${props => props.$sidebarWidth}px;
  min-width: ${props => props.$sidebarWidth}px;
  background: #fcfcfd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-weight: 700;
  color: #1e293b;
  border-right: 2px solid #f1f5f9;
  z-index: 10;
  @media (max-width: 900px) {
    width: 180px;
    min-width: 180px;
  }
  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    padding: 12px 16px;
  }
`;

const Track = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 700px;
  @media (max-width: 900px) {
    min-width: 600px;
  }
  @media (max-width: 640px) {
    min-width: 520px;
    padding: 8px 0 12px;
  }
`;

const ProjectRangeBox = styled.div<{ $left: number; $width: number; $color: string; $bg: string }>`
  position: absolute;
  left: ${props => props.$left}%;
  width: ${props => props.$width}%;
  height: 40px;
  background: ${props => props.$bg};
  border: 2px dashed ${props => props.$color};
  border-radius: 8px;
  z-index: 1;
  transition: all 0.4s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); opacity: 0.4; }
  to { transform: scaleX(1); opacity: 1; }
`;

const pop = keyframes`
  0% { transform: scale(0.85); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
`;

const sparkle = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(16, 185, 129, 0.0); }
  50% { transform: scale(1.08); box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); }
`;

const BlackLine = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: ${props => props.$color};
  z-index: 0;
  transform-origin: left center;
  animation: ${lineGrow} 500ms ease;
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

const Circle = styled.div<{ $color: string; $pulse?: boolean; $late?: boolean }>`
  width: 30px;
  height: 30px;
  background: white;
  border: 2px solid ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 200ms ease, box-shadow 200ms ease;
  animation: ${pop} 320ms ease;
  ${props => props.$pulse && css`
    animation: ${pop} 320ms ease, ${sparkle} 1.6s ease-in-out infinite;
  `}
  ${props => props.$late && css`
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
  `}
  &:hover {
    transform: scale(1.06);
  }
`;

const Label = styled.div`
  position: absolute;
  top: 35px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  color: #334155;
`;

const TodayLine = styled.div<{ $percent: number; $sidebarWidth: number; $color: string }>`
  position: absolute;
  left: calc(${props => props.$sidebarWidth}px + ${props => props.$percent}%);
  top: 0; bottom: 0;
  width: 2px;
  background: ${props => props.$color};
  z-index: 20;
  animation: pulse 1.6s ease-in-out infinite;
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

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

  const days = useMemo(() => {
    return Array.from({ length: windowDays }, (_, i) => {
      const d = new Date(currentViewDate);
      d.setDate(currentViewDate.getDate() - Math.floor(windowDays / 2) + i);
      return d;
    });
  }, [currentViewDate, windowDays]);

  const windowStart = days[0].getTime();
  const windowEnd = days[windowDays - 1].getTime() + 86400000;

  const getPos = (date: Date) => {
    const percent = ((date.getTime() - windowStart) / (windowEnd - windowStart)) * 100;
    return Math.max(-10, Math.min(110, percent));
  };

  const getRangeProps = (start: Date, end: Date) => {
    const left = getPos(start);
    const right = getPos(end);
    return { left, width: Math.max(0, right - left) };
  };

  const shift = (n: number) => {
    const d = new Date(currentViewDate);
    d.setDate(d.getDate() + n);
    if (onViewDateChange) onViewDateChange(d);
    else setInternalDate(d);
  };

  const goToday = () => {
    if (onViewDateChange) onViewDateChange(new Date());
    else setInternalDate(new Date());
  };

  return (
    <Container className={className}>
      {showHeader && (
        <Header>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <NavBtn onClick={() => shift(-1)}><ChevronLeft size={18}/> {prevLabel}</NavBtn>
            <NavBtn onClick={goToday}><Calendar size={18}/> {todayLabel}</NavBtn>
            <NavBtn onClick={() => shift(1)}>{nextLabel} <ChevronRight size={18}/></NavBtn>
          </div>
        </Header>
      )}

      <TimelineBoard $border={mergedColors.border} $card={mergedColors.card}>
        <GridLayer $sidebarWidth={sidebarWidth} $windowDays={windowDays}>
          {days.map((d, i) => (
            <GridCol key={i} $grid={mergedColors.grid}>
              {d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </GridCol>
          ))}
        </GridLayer>

        {showTodayLine && today.getTime() >= windowStart && today.getTime() <= windowEnd && (
          <TodayLine
            $percent={getPos(today)}
            $sidebarWidth={sidebarWidth}
            $color={mergedColors.danger}
          />
        )}

        {projects.map(p => {
          const range = getRangeProps(p.projectStart, p.projectEnd);
          const isCompleted = p.milestones.every(
            m => m.status === 'completed' || m.status === 'success'
          );
          const isLate = !isCompleted && today > p.projectEnd;
          const projectColor = isCompleted
            ? mergedColors.success
            : isLate
              ? mergedColors.danger
              : mergedColors.primary;
          const projectBg = isCompleted
            ? 'rgba(16, 185, 129, 0.12)'
            : isLate
              ? 'rgba(239, 68, 68, 0.12)'
              : 'rgba(59, 130, 246, 0.08)';

          return (
            <ProjectRow key={p.id} $rowHeight={rowHeight}>
              <Sidebar $sidebarWidth={sidebarWidth}>{p.projectName}</Sidebar>
              <Track>
                <BlackLine $color={mergedColors.muted} />

                {range.width > 0 && (
                  <ProjectRangeBox
                    $left={range.left}
                    $width={range.width}
                    $color={projectColor}
                    $bg={projectBg}
                  >
                    <Play size={rangeIconSize} color={projectColor} fill={projectColor} />
                    <Flag size={rangeIconSize} color={projectColor} fill={projectColor} />
                  </ProjectRangeBox>
                )}

                {p.milestones.map(m => {
                  const percent = getPos(m.endDate);
                  if (percent < 0 || percent > 100) return null;

                  const isDone = m.status === 'completed' || m.status === 'success';
                  const isLateMilestone = m.status === 'in-progress' && today > m.endDate;
                  const color = isDone
                    ? mergedColors.success
                    : isLateMilestone
                      ? mergedColors.danger
                      : mergedColors.primary;

                  return (
                    <MilestoneNode key={m.id} $percent={percent}>
                      <Circle $color={color} $pulse={isDone} $late={isLateMilestone}>
                        {isDone ? <Trophy size={14} color={color}/> : <Clock size={14} color={color}/>}
                      </Circle>
                      <Label>{m.name}</Label>
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
