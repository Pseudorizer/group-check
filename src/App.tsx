import { cn, range } from '@/lib/utils.ts';
import { MouseDownContext } from '@/context/MouseDownContext.tsx';

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
  step: number;
};

type Highlighted = {
  [day: number]: number[];
};

type Props = {
  timeRange: TimeRange;
  days: Date[];
};

const App = ({ timeRange, days }: Props) => {
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

  const handleTimeSelected = (day: number, hour: number) => {
    if (
      highlighted[day]?.includes(hour) &&
      (!currentOperation || currentOperation === CurrentOperation.removing)
    ) {
      setHighlighted((prev) => ({
        ...prev,
        [day]: prev[day].filter((h) => h !== hour),
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
        [day]: [...(prev[day] ?? []), hour],
      }));

      if (currentOperation === null) {
        setCurrentOperation(CurrentOperation.adding);
      }
    }
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (isMouseDown) {
      handleTimeSelected(day, hour);
    }
  };

  const handleMouseDown = (day: number, hour: number) => {
    handleTimeSelected(day, hour);
  };

  useEffect(() => {
    if (!isMouseDown) {
      setCurrentOperation(null);
    }
  }, [isMouseDown]);

  return (
    <div className={cn('flex select-none gap-2')}>
      {days.map((day) => (
        <div key={day.getTime()} className={cn('flex flex-col gap-2')}>
          <div>{day.toLocaleDateString()}</div>
          {hours.map((hour) => (
            <div
              className={cn(
                'select-none',
                highlighted[day.getTime()]?.includes(hour.id)
                  ? 'text-red-500'
                  : null,
              )}
              key={`${day.getTime()}:${hour.id}`}
              onMouseEnter={() => handleMouseEnter(day.getTime(), hour.id)}
              onMouseDown={() => handleMouseDown(day.getTime(), hour.id)}
            >
              {hour.time}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
