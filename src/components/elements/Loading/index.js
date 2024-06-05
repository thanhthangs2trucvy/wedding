import classNames from "classnames";
import { createRef, forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import { uniqueId } from "lodash";
import { DomUtils } from "utils/DomUtil";
import { Image } from "../Image";
import { Icon } from "../Icon";

export const loadingRef = createRef();
export const Loading = {
  show: (obj) => loadingRef?.current?.show(obj),
  hide: () => loadingRef?.current?.hide(),
  payment: (obj) => loadingRef?.current?.payment(obj),
}

export const LoadingComponent = forwardRef((_, ref) => {
  const prefixCls = 'loading';
  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setActive(true);
      DomUtils.addClass(document.body, 'js-active');
    },
    payment: (data) => {
      setActive(true);
      DomUtils.addClass(document.body, 'js-active');
    },
    hide: () => {
      setActive(false);
      DomUtils.removeClass(document.body, 'js-active');
    },
  }));

  // NOTE : Config
  const classname = classNames(prefixCls, active && 'js-active');
  if (!active) return null;
  return createPortal(<div
    id={prefixCls +"-"+  uniqueId()}
    className={classname}
    aria-labelledby="alert"
    aria-hidden="true"
  // onClick={handleClose}
  >
    <div className={`${prefixCls}-mask`}></div>
    <div className={`${prefixCls}-inner`}>
      <div className={`${prefixCls}-content`}>
        <Image src={require('assets/images/pictures/loading.webp')} />
        <div className="loader">
          <div className="box-load1"><Icon name="heart" /></div>
          <div className="box-load2"><Icon name="heart" /></div>
          <div className="box-load3"><Icon name="heart" /></div>
        </div>
      </div>
    </div>
  </div>, document.body)
})
