import { useState, useEffect, useCallback } from "react";

const useLongPress = (
  onLongPress,
  { delay = 300 } = {},
  onClick
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(() => {
        onLongPress(startLongPress);
        setLongPressTriggered(true);
      }, delay);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, delay, onLongPress]);

  const start = useCallback((data) => {
    setStartLongPress(data);
  }, []);

  const stop = useCallback(
    (event) => {
      if (!longPressTriggered && onClick) {
        onClick(event);
      }
      setStartLongPress(false);
      setLongPressTriggered(false);
    },
    [longPressTriggered, onClick]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchEnd: stop,
  };
};

export default useLongPress;
