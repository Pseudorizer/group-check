import { type ReactNode } from 'react';

export const MouseDownContext = createContext(false);

export const MouseDownProvider = ({ children }: { children: ReactNode }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    setIsMouseDown(event.button === 0);
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (event.button === 0) {
      setIsMouseDown(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp, handleMouseDown]);

  return (
    <MouseDownContext.Provider value={isMouseDown}>
      {children}
    </MouseDownContext.Provider>
  );
};
