import classNames from "classnames";
import { createRef, forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IMAGES } from "assets/images";
import { isEmpty, map, uniqueId } from "lodash";
import { DomUtils } from "utils/DomUtil";
import { execFunc } from "common";
import { Image } from "../Image";
import { Button } from "../Button";
import { Icon } from "../Icon";

export const messageRef = createRef();
export const Message = {
  show: (obj) => messageRef?.current?.show(obj),
  success: (obj) => messageRef?.current?.show({ type: 'success', ...obj }),
  error: (obj) => messageRef?.current?.show({ type: 'error', ...obj }),
}

export const MessageComponent = forwardRef((_, ref) => {

  const prefixCls = 'message';
  const [active, setActive] = useState(false);
  const [data, setData] = useState([]);
  const [type, setType] = useState('');
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState(null);
  const [description, setDescription] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [duration, setDuration] = useState(10);
  // const timeouts = useRef([]);

  useImperativeHandle(ref, () => ({
    show: (data) => {
      let { message, description, duration = 10, icon, isAutoClose=false, buttons, type = '' } = data;
      setData(data);
      setType(type);
      setIcon(icon);
      setMessage(message);
      setDescription(description);
      setDuration(duration);
      setActive(true);
      setButtons(buttons);
      isAutoClose && (
        setTimeout(() => { 
          handleCancel();
        }, [duration * 1000])
      )
      DomUtils.addClass(document.body, 'js-active');
    },
    hide: () => {
      setActive(false);
      DomUtils.removeClass(document.body, 'js-active');
    },
  }));

  // NOTE : handle

  const handleCancel = (action, type) => {
    action && execFunc(action())
    ref.current.hide();
  }

  // NOTE : RN
  const rnIcon = useMemo(() => {
    return icon ? <Icon name={icon} size={120} /> : "";
  }, [icon])
  const rnMessageTitle = useMemo(() => {
    switch (message) {
      case 500:
        return (
          <div className="message-title-image">
            <Image className="message-image" src={IMAGES.internal_server_error} alt={toString(message)} />
          </div>
        )
      case 401:
        return (
          <div className="message-title-image">
            <Image className="message-image" src={IMAGES.login_agin} alt={toString(message)} />
          </div>
        )
      default:
        return <h5 className="message-title">{message}</h5>
    }
  }, [message])

  const rnButton = useMemo(() => {
    if (isEmpty(buttons)) {
      return (
        <Button className={classNames('message-btn btn-cancel')} onClick={() => handleCancel()}>
          <span>OK</span>
        </Button>
      ) 
    } else {
      return map(buttons, function (btn, index) {
        return (
          <Button key={'button' + uniqueId()} className={classNames('message-btn', btn?.className)} onClick={() => handleCancel(btn?.action, btn?.actionType)}>
            {btn.content}
          </Button>
        )
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons])
  // NOTE : Config
  const classname = classNames(prefixCls, `${prefixCls}-${type}`, active && 'js-active');
  if (!active) return null;
  return createPortal(<div
    id={prefixCls + uniqueId()}
    className={classname}
    aria-labelledby="alert"
    aria-hidden="true"
  // onClick={handleClose}
  >
    <div className={`${prefixCls}-mask`}></div>
    <div className={`${prefixCls}-container`}>
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-header`}>
          {rnIcon}
        </div>
        <div className={`${prefixCls}-body`}>
          {rnMessageTitle}
          {description && <p>{description}</p>}
        </div>
        <div className={`${prefixCls}-footer`}>
          {rnButton}
        </div>
      </div>
    </div>
  </div>, document.body)
})
