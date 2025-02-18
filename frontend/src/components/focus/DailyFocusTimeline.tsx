import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, startOfDay, differenceInMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { FocusSessionWithTask } from '@/types/focus';

interface DailyFocusTimelineProps {
  sessions: FocusSessionWithTask[];
}

interface TooltipData {
  status: string;
  tasks: Array<{ id: string; title: string; description: string | null }>;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'interrupted':
      return 'Interrupted';
    case 'active':
      return 'In Progress';
    default:
      return status;
  }
};

const getBarFillColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'hsl(var(--primary, 221 83% 53%))';
    case 'interrupted':
      return 'hsl(var(--destructive, 0 84% 60%))';
    case 'active':
      return 'hsl(var(--primary, 221 83% 53%))';
    default:
      return 'hsl(var(--muted, 217 19% 27%))';
  }
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as TooltipData;
    const status = data?.status;
    const tasks = data?.tasks || [];
    const statusColors: Record<string, string> = {
      completed: 'text-primary-foreground dark:text-primary',
      interrupted: 'text-destructive dark:text-destructive',
      active: 'text-primary-foreground dark:text-primary'
    };

    return (
      <div className="p-3 bg-background border shadow-lg rounded-lg relative z-50">
        <div className="absolute inset-0 bg-popover/20 rounded-lg -z-10" />
        <p className="text-sm font-medium text-foreground">Time: {label}</p>
        <p className="text-sm text-muted-foreground">
          Duration: {payload[0]?.value} minutes
        </p>
        {tasks.length > 0 && (
          <div className="text-sm text-muted-foreground mt-1.5">
            <p className="font-medium text-foreground">Tasks:</p>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
              {tasks.map((task) => (
                <li key={task.id} className="truncate max-w-[200px]">
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className={`text-sm mt-1.5 font-medium ${statusColors[status] || ''}`}>
          Status: {getStatusText(status)}
        </p>
      </div>
    );
  }
  return null;
};

export function DailyFocusTimeline({ sessions }: DailyFocusTimelineProps) {
  const validSessions = sessions
    .filter(session => 
      session.start_time && 
      !isNaN(new Date(session.start_time).getTime())
    )
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const groupedData = validSessions.reduce((acc, session) => {
    const sessionDate = new Date(session.start_time);
    const hour = format(sessionDate, 'HH:mm', { locale: enUS });
    const startOfDayDate = startOfDay(sessionDate);
    const minutesSinceStartOfDay = differenceInMinutes(sessionDate, startOfDayDate);
    
    const existingIndex = acc.findIndex(item => item.time === hour);
    
    if (existingIndex >= 0) {
      acc[existingIndex] = {
        ...acc[existingIndex],
        duration: (acc[existingIndex].duration || 0) + (session.duration || 0),
        status: session.status === 'active' ? 'active' : acc[existingIndex].status,
        tasks: [...(acc[existingIndex].tasks || []), session.task].filter((task): task is NonNullable<typeof session.task> => Boolean(task))
      };
    } else {
      acc.push({
        id: session.id,
        time: hour,
        duration: session.duration || 0,
        start_time: session.start_time,
        status: session.status,
        minutesSinceStartOfDay,
        tasks: session.task ? [session.task] : []
      });
    }
    return acc;
  }, [] as Array<{
    id: string;
    time: string;
    duration: number;
    start_time: string;
    status: string;
    minutesSinceStartOfDay: number;
    tasks: Array<NonNullable<FocusSessionWithTask['task']>>;
  }>);

  if (groupedData.length === 0) {
    return (
      <div className="w-full h-[200px] mt-4 flex flex-col items-center justify-center bg-card rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Time Distribution</h3>
        <p className="text-muted-foreground">No sessions to display</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Time Distribution</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={groupedData} 
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="currentColor" 
              opacity={0.1}
              className="dark:opacity-[0.07]"
            />
            <XAxis
              dataKey="time"
              scale="point"
              padding={{ left: 10, right: 10 }}
              tick={{ fill: 'currentColor', fontSize: 12, opacity: 1 }}
              tickLine={{ stroke: 'currentColor', opacity: 1 }}
              axisLine={{ stroke: 'currentColor', opacity: 1 }}
            />
            <YAxis
              label={{ 
                value: 'Minutes', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  fill: 'currentColor',
                  fontSize: 12,
                  opacity: 1
                }
              }}
              tick={{ fill: 'currentColor', fontSize: 12, opacity: 1 }}
              tickLine={{ stroke: 'currentColor', opacity: 1 }}
              axisLine={{ stroke: 'currentColor', opacity: 1 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'currentColor', opacity: 1 }}
            />
            <Bar
              dataKey="duration"
              name="Duration"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200 hover:opacity-90"
            >
              {groupedData.map((entry) => (
                <rect
                  key={`bar-${entry.id}-${entry.time}`}
                  fill={getBarFillColor(entry.status)}
                  className="bg-white dark:bg-black"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}