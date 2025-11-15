import { useEffect, useState } from "react";

const useDebounced = (value: string, delay: number = 600) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Cleanup function to cancel timeout if value changes
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounced;
