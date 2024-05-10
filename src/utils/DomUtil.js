import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

export const DomUtils = {
  useScrollDirection(scrollFactor = 0) {
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
  },
  addEventListener(target, eventType, cb, option) {
    /* eslint camelcase: 2 */
    const callback = ReactDOM.unstable_batchedUpdates
      ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
      : cb;
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, option);
    }
    return {
      remove: () => {
        if (target.removeEventListener) {
          target.removeEventListener(eventType, callback, option);
        }
      },
    };
  },
  hasClass(node, className) {
    if (node.classList) {
      return node.classList.contains(className);
    }
    const originClass = node.className;
    return ` ${originClass} `.indexOf(` ${className} `) > -1;
  },
  addClass(node, className) {
    if (node.classList) {
      node.classList.add(className);
    } else {
      if (!DomUtils.hasClass(node, className)) {
        node.className = `${node.className} ${className}`;
      }
    }
  },
  removeClass(node, className) {
    if (node.classList) {
      node.classList.remove(className);
    } else {
      if (DomUtils.hasClass(node, className)) {
        const originClass = node.className;
        node.className = ` ${originClass} `.replace(` ${className} `, ' ');
      }
    }
  },
  getScroll() {
    return {
      scrollLeft: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
      scrollTop: Math.max(document.documentElement.scrollTop, document.body.scrollTop),
    };
  },
  getOffset(node) {
    const box = node.getBoundingClientRect();
    const docElem = document.documentElement;

    // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
    return {
      left: box.left + (window.pageXOffset || docElem.scrollLeft) -
        (docElem.clientLeft || document.body.clientLeft || 0),
      top: box.top + (window.pageYOffset || docElem.scrollTop) -
        (docElem.clientTop || document.body.clientTop || 0),
    };
  },
  getClientSize() {
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;
    return {
      width,
      height,
    };
  },
  getOuterHeight(el) {
    if (el === document.body) {
      return window.innerHeight || document.documentElement.clientHeight;
    }
    return el.offsetHeight;
  }

}
