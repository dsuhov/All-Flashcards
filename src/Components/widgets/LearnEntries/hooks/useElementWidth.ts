import { useLayoutEffect, useState } from 'react';

export const useElementWidth = (): [
  number,
  (element: HTMLElement | null) => void,
] => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (!element) return;

    const mutationHandler = (entries: ResizeObserverEntry[]) => {
      setWidth(entries[0].contentBoxSize[0].inlineSize);
    };

    const observer = new ResizeObserver(mutationHandler);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  return [width, setElement];
};
