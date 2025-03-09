import { ReactSimplyCarouselProps } from 'react-simply-carousel';

export const CAROUSEL_SETTINGS: Partial<ReactSimplyCarouselProps> = {
  infinite: false,
  itemsToShow: 1,
  backwardBtnProps: {
    style: {
      display: 'none',
    },
  },
  forwardBtnProps: {
    style: {
      display: 'none',
    },
  },
  containerProps: {
    style: {
      height: '100%',
      gap: '10px',
    },
  },
  itemsListProps: {
    style: {
      outline: 'none',
      userSelect: 'none',
    },
  },
  speed: 400,
  disableSwipeByMouse: true,
  disableSwipeByTouch: true,
};
