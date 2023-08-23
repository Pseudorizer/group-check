import { useEffect, useState } from 'react';
import { cn, range } from './utils.ts';

enum CurrentOperation {
  adding = 1,
  removing,
}

// The ranges themselves will be generated from the range data - start, end, step
// A users time selection will be stored as an array of ids
// This way the table can be changed without impacting a users selection as the ids that are no longer valid will just be ignored

const App = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [currentOperation, setCurrentOperation] =
    useState<CurrentOperation | null>(null);

  const rangeProp = { start: 6, end: 10, step: 30 };
  let index = 0;

  const hours = range(rangeProp.start, rangeProp.end).flatMap((hour) => {
    // If it's the last hour we don't want the minutes of that hour
    const minuteSteps =
      hour === rangeProp.end ? [0] : [...Array(60 / rangeProp.step).keys()];

    return minuteSteps.map((minuteStep) => {
      const hourTime = String(hour).padStart(2, '0');
      const minutes = String(minuteStep * rangeProp.step).padStart(2, '0');

      return {
        id: index++,
        time: `${hourTime}:${minutes}`,
      };
    });
  });

  console.debug(hours);

  const handleMouseEnter = (id: number) => {
    if (isMouseDown) {
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
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    setIsMouseDown(event.button === 0);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 0) {
      setIsMouseDown(false);
      setCurrentOperation(null);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
        >
          {hour.time}
        </div>
      ))}
    </div>
  );
};

export default App;
