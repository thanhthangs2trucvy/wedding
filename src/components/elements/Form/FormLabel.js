import React from 'react';
import classNames from 'classnames';

export const FormLabel = ({
  className,
  children,
  labelHidden,
  id,
  ...props
}) => {

  const classes = classNames(
    'form-label',
    labelHidden && 'screen-reader',
    className
  );

  return (
    <label
      {...props}
      className={classes}
      htmlFor={id}
    >
      {children}
    </label>
  );
}
