import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  children: PropTypes.node,
  status: PropTypes.string
}

export const FormHint = ({
  children,
  className,
  status,
  ...props
}) => {

  const classes = classNames(
    'form-hint',
    status && `text-color-${status}`,
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      {children}
    </div>
  );
}

FormHint.propTypes = propTypes;
