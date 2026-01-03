import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  mainRef: RefObject<T>,
  handler: Handler,
  triggerRef?: RefObject<HTMLElement>
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      // Do nothing if clicking ref's element or descendent elements
      if (mainRef.current && mainRef.current.contains(target)) {
        return;
      }
      // Do nothing if clicking trigger ref's element
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [mainRef, triggerRef, handler]);
} 