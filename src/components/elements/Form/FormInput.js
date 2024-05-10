import React from 'react';
import classNames from 'classnames';
import { FormLabel } from './FormLabel';
import { FormHint } from './FormHint';
import { Controller, useFormContext } from 'react-hook-form';

export const FormInput = ({
  className,
  children,
  label,
  labelHidden,
  type,
  name,
  status,
  disabled,
  value,
  formGroup,
  hasIcon,
  size,
  placeholder,
  rows,
  hint,
  register,
  required, 
  ...props
}) => {
  // NOTE : FORM
  // NOTE : ClassName
  const wrapperClasses = classNames(
    (formGroup ? `form-group-${formGroup}` : `form-group` ) ,
    (hasIcon && hasIcon !== '') && 'has-icon-' + hasIcon
  );

  const classes = classNames(
    'form-input',
    size && `form-input-${size}`,
    status && `form-${status}`,
    className
  );

  // NOTE : RN
  const Component = type === 'textarea' ? 'textarea' : 'input';
  return (
    <>
      {label && <FormLabel labelHidden={labelHidden} id={props.id}>{label}</FormLabel>}
      <div
        className={wrapperClasses}
      >
        <Component
          {...register(name, { required })}
          type={type !== 'textarea' ? type : null}
          className={classes}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          autoComplete='off'
          rows={type === 'textarea' ? rows : null}
        />
        {children}
      </div>
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
}
