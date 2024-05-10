import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { isEmpty } from "lodash";

const propTypes = {
  tag: PropTypes.elementType,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  wide: PropTypes.bool,
  wideMobile: PropTypes.bool,
  disabled: PropTypes.bool,
};

// const defaultProps = {
//   tag: "button",
//   color: "",
//   size: "",
//   type: "", // smooth - ghost - raised
//   loading: false,
//   wide: false,
//   wideMobile: false,
//   disabled: false,
// };

export const Button = ({
  className,
  tag = "button",
  color,
  size,
  type,
  loading = false,
  wide = false,
  wideMobile = false,
  disabled = false,
  children,
  onClick,
  ...props
}) => {
  const [target, setTarget] = React.useState(null);
  const [executing, setExecuting] = React.useState(false);
  const buttonRef = React.useRef(null);
  const handleOnClick = (e) => {
    if (executing) return;
    setExecuting(true);
    try {
      setTarget(buttonRef.current);
      buttonRef.current.classList.add("is-loading");
      onClick();
    } finally {
      setExecuting(false);
      buttonRef.current.classList.remove("is-loading");
    }
  };

  React.useEffect(() => {
    if (!isEmpty(target)) {
      target.classList.remove("is-loading");
    }
  }, [target]);

  const classes = classNames(
    "btn",
    color && `btn-${color}`,
    size && `btn-${size}`,
    type && `btn-${type}`,
    loading && "is-loading",
    wide && "btn-block",
    wideMobile && "btn-wide-mobile",
    className
  );

  const Component = tag;
  return (
    <Component
      {...props}
      ref={buttonRef}
      onClick={handleOnClick}
      className={classes}
      disabled={executing || disabled}
    >
      {children}
    </Component>
  );
};

Button.propTypes = propTypes;
// Button.defaultProps = defaultProps;
