import React from 'react';
import classNames from 'classnames';
import { Controller } from 'react-hook-form';
import { map } from 'lodash';
import { FormHint } from './FormHint';

const RadioCustom = ({ name, options, control, classes }) => {
  return (
    <>
      {options.map((option) => (
        <label className={classes} key={option.value}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="radio"
                  value={option.value}
                  onChange={field.onChange}
                  checked={field.value === option.value}
                />
                <span className={field.value === option.value ? 'form-radio-checked' : ''}>{option.label}</span>
              </>
            )}
          />
        </label>
      ))}
    </>
  );
}

export const FormRadio = ({
  className,
  formGroup,
  name,
  options,
  control,
  hint,
  status
}) => {
  // NOTE : FORM

  // NOTE : ClassName
  const wrapperClasses = classNames(`form-group-${formGroup}`);
  const classes = classNames(
    'form-radio',
    status && `form-${status}`,
    className
  );
  // NOTE : RN
  return (
    <div
      className={wrapperClasses}
    >
      <Controller
        name='name'
        control={control}
        defaultValue={''} // Set the default value
        rules={{ required: 'Please select an option' }} // Add validation rules if needed
        render={({ field }) => <RadioCustom classes={classes} status={status} name={name} options={options} control={control} />}
      />
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </div>
  );
}
