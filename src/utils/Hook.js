import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import _ from "lodash";
import { handleErrorAxios, handleResponseAxios } from "services/helpers";
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
export const useDebounce = (obj, wait = 1000) => {
  const [state, setState] = useState(obj);

  const setDebouncedState = (_val) => {
    debounce(_val);
  };

  const debounce = useCallback(
    _.debounce((_prop) => {
      setState(_prop);
    }, wait),
    []
  );

  return [state, setDebouncedState];
};

export const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef(null);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};


export const useInterval = (callback, delay) => {
  const saveCallback = useRef();

  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      saveCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useTimeout = (
  callback, // function to call. No args passed.
  timeout = 0, // delay, ms (default: immediately put into JS Event Queue)
  {
    // manage re-render behavior.
    // by default, a re-render in your component will re-define the callback,
    //    which will cause this timeout to cancel itself.
    // to avoid cancelling on re-renders (but still cancel on unmounts),
    //    set `persistRenders: true,`.
    persistRenders = true,
  } = {},
  // These dependencies are injected for testing purposes.
  // (pure functions - where all dependencies are arguments - is often easier to test)
  _setTimeout = setTimeout,
  _clearTimeout = clearTimeout,
  _useEffect = useEffect,
) => {
  let timeoutId;
  const cancel = () => timeoutId && _clearTimeout(timeoutId);

  _useEffect(
    () => {
      timeoutId = _setTimeout(callback, timeout);
      return cancel;
    },
    persistRenders
      ? [_setTimeout, _clearTimeout]
      : [callback, timeout, _setTimeout, _clearTimeout],
  );

  return cancel;
}

export const useKeyPress = (callback, keyCodes) => {
  const handler = (e) => {
    let code = e.keyCode || e.which;
    if (keyCodes.includes(code)) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handler]);
}


export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return windowSize
}

export const useScrollDirection = (scrollFactor = 0) => {
  // const [scrollDirection, setScrollDirection] = useState(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      setPosition(scrollY);
      // const direction = scrollY > lastScrollY ? "down" : "up";
      // if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
      //   setScrollDirection(direction);
      // }
      // lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, []);

  return position * scrollFactor;
};


export const useSticky = () => {
  const stickyRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(0);

  useEffect(() => {
    if (!stickyRef.current) {
      return;
    }
    setStickyOffset(stickyRef.current.offsetTop);
  }, [stickyRef, setStickyOffset]);

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current) {
        return;
      }

      const shouldBeSticky = window.scrollY > stickyOffset;
      setSticky(shouldBeSticky);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setSticky, stickyRef, stickyOffset]);
  return { stickyRef, sticky };
};

export const useAxios = (configObj) => {
  const {
    axiosInstance,
    method,
    url,
    requestConfig = {}
  } = configObj;

  const [response, setResponse] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const refetch = () => setReload(prev => prev + 1);

  useEffect(() => {
    //let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await axiosInstance[method.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal
        });
        let response = handleResponseAxios(res.data);
        setResponse(response);
      } catch (err) {
        let error = handleErrorAxios(err)
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    // call the function
    fetchData();

    // useEffect cleanup function
    return () => controller.abort();

    // eslint-disable-next-line
  }, [reload]);

  return { response, error, loading, refetch };
}

export const useAxiosFunction = () => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); //different!
  const [controller, setController] = useState();

  const axiosFetch = async (configObj) => {
    const {
      axiosInstance,
      method,
      url,
      requestConfig = {}
    } = configObj;

    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const res = await axiosInstance[method.toLowerCase()](url, {
        ...requestConfig,
        signal: ctrl.signal
      });
      let response = handleResponseAxios(res.data);
      setResponse(response);
    } catch (err) {
      let error = handleErrorAxios(err)
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // useEffect cleanup function
    return () => controller && controller.abort();

  }, [controller]);

  return { response, error, loading, axiosFetch };
}
