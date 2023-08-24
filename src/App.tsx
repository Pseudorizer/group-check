import { cn, makeDayKey, range } from '@/lib/utils.ts';
import { MouseDownContext } from '@/contexts/MouseDownContext.tsx';

// The ranges themselves will be generated from the range data - start, end, step
// A users time selection will be stored as an array of ids
// This way the table can be changed without impacting a users selection as the ids that are no longer valid will just be ignored

enum CurrentOperation {
  adding = 1,
  removing,
}

type TimeRange = {
  start: number;
  end: number;
  // Step can be a max of 30
  step: number;
};

type MappedUserSelections = {
  [date: string]: {
    [time: number]: {
      users: string[];
    };
  };
};

type Highlighted = {
  [date: string]: number[];
};

type UserSelection = {
  id: number;
  user: string;
  times: Highlighted;
};

type Props = {
  timeRange: TimeRange;
  days: Date[];
  selections: UserSelection[];
};

const App = ({ timeRange, days, selections }: Props) => {
  const [highlighted, setHighlighted] = useState<Highlighted>({});
  const [currentOperation, setCurrentOperation] =
    useState<CurrentOperation | null>(null);
  const isMouseDown = useContext(MouseDownContext);

  const hours = useMemo(() => {
    let index = 0;

    return range(timeRange.start, timeRange.end).flatMap((hour) => {
      // If it's the last hour we don't want the minutes of that hour
      const minuteSteps =
        hour === timeRange.end ? [0] : [...Array(60 / timeRange.step).keys()];

      return minuteSteps.map((minuteStep) => {
        const hourTime = String(hour).padStart(2, '0');
        const minutes = String(minuteStep * timeRange.step).padStart(2, '0');

        return {
          id: index++,
          time: `${hourTime}:${minutes}`,
        };
      });
    });
  }, [timeRange]);

  const handleTimeSelected = (date: string, hour: number) => {
    if (
      highlighted[date]?.includes(hour) &&
      (!currentOperation || currentOperation === CurrentOperation.removing)
    ) {
      setHighlighted((prev) => ({
        ...prev,
        [date]: prev[date].filter((h) => h !== hour),
      }));

      if (currentOperation === null) {
        setCurrentOperation(CurrentOperation.removing);
      }
    } else if (
      !currentOperation ||
      currentOperation === CurrentOperation.adding
    ) {
      setHighlighted((prev) => ({
        ...prev,
        [date]: [...(prev[date] ?? []), hour],
      }));

      if (currentOperation === null) {
        setCurrentOperation(CurrentOperation.adding);
      }
    }
  };

  const handleMouseEnter = (date: string, hour: number) => {
    if (isMouseDown) {
      handleTimeSelected(date, hour);
    }
  };

  const handleMouseDown = (date: string, hour: number) => {
    handleTimeSelected(date, hour);
  };

  useEffect(() => {
    if (!isMouseDown) {
      setCurrentOperation(null);
    }
  }, [isMouseDown]);

  const mappedSelections = useMemo(() => {
    return selections.reduce((userHighlights, selection) => {
      Object.entries(selection.times).forEach(([date, hours]) => {
        hours.forEach((hour) => {
          if (userHighlights[date]) {
            if (userHighlights[date][hour]) {
              userHighlights[date][hour].users.push(selection.user);
            } else {
              userHighlights[date][hour] = {
                users: [selection.user],
              };
            }
          } else {
            userHighlights[date] = {
              [hour]: {
                users: [selection.user],
              },
            };
          }
        });
      });

      return userHighlights;
    }, {} as MappedUserSelections);
  }, [selections]);

  console.debug(mappedSelections);

  return (
    <div className={cn('flex flex-col gap-2')}>
      <div className={cn('flex select-none gap-1')}>
        {days.map((day) => (
          <div
            key={day.getTime()}
            className={cn('flex flex-col items-center gap-1.5')}
          >
            <div className={cn('text-sm')}>{day.toLocaleDateString()}</div>
            {hours.map((hour) => {
              const dayKey = makeDayKey(day);
              const isHighlighted = highlighted[dayKey]?.includes(hour.id);
              const mappedSelection = mappedSelections[dayKey]?.[hour.id];

              return (
                <button
                  className={cn(
                    'hover: select-none rounded-lg border-2 p-2 text-zinc-400 hover:cursor-pointer hover:bg-zinc-700',
                    isHighlighted ? 'bg-zinc-800 text-zinc-100' : null,
                    mappedSelection ? 'text-green-500' : null,
                  )}
                  key={`${dayKey}:${hour.id}`}
                  onMouseEnter={() => handleMouseEnter(dayKey, hour.id)}
                  onMouseDown={() => handleMouseDown(dayKey, hour.id)}
                  title={mappedSelection?.users.join(', ') ?? ''}
                >
                  {hour.time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <button>Submit</button>
      </div>
    </div>
  );
};

export default App;
