import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function remove_array_element(array, index) {
  if (index > -1) {
    if (index === 0) {
      array.shift();
    } else if (index === (array.length - 1) ) {
      array.pop();
    } else {
      array = array.slice(0, index).concat(array.slice(-index));
    }
  }
  return array;
}
