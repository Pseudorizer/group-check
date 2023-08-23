import { cn, range } from './utils.ts';
import { MouseDownContext } from './context/MouseDownContext.tsx';

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

type Props = {
  timeRange: TimeRange;
};

const App = ({ timeRange }: Props) => {
  const [highlighted, setHighlighted] = useState<number[]>([]);
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

  const handleTimeSelected = (id: number) => {
    if (
      highlighted.includes(id) &&
      (!currentOperation || currentOperation === CurrentOperation.removing)
    ) {
      setHighlighted((prev) => prev.filter((v) => v !== id));

      if (currentOperation === null) {
        setCurrentOperation(CurrentOperation.removing);
      }
    } else if (
      !currentOperation ||
      currentOperation === CurrentOperation.adding
    ) {
      setHighlighted((prev) => [...prev, id]);

      if (currentOperation === null) {
        setCurrentOperation(CurrentOperation.adding);
      }
    }
  };

  const handleMouseEnter = (id: number) => {
    if (isMouseDown) {
      handleTimeSelected(id);
    }
  };

  const handleMouseDown = (id: number) => {
    handleTimeSelected(id);
  };

  useEffect(() => {
    if (!isMouseDown) {
      setCurrentOperation(null);
    }
  }, [isMouseDown]);

  return (
    <div>
      {hours.map((hour) => (
        <div
          className={cn(
            'select-none',
            highlighted.includes(hour.id) ? 'text-red-500' : null,
          )}
          key={hour.id}
          onMouseEnter={() => handleMouseEnter(hour.id)}
          onMouseDown={() => handleMouseDown(hour.id)}
        >
          {hour.time}
        </div>
      ))}
    </div>
  );
};

export default App;
