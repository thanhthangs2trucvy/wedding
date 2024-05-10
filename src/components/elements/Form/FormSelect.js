import React from "react";
import PropTypes from 'prop-types';
import Select from "react-select";
import { Controller, useForm, useFormContext } from "react-hook-form";
import classNames from "classnames";
import { FormLabel } from "./FormLabel";
import { FormHint } from "./FormHint";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#EBF2FF" : "white",
    color: "rgba(0, 0, 0, 0.87)"
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    borderRadius: "4px",
    border: "none",
    backgroundColor: state.isDisabled ? '#EBF2FF' : '#D8E6FF',
    color: 'rgba(0, 0, 0, 0.87)',
  })
};

export const FormSelect = ({
  className,
  children,
  label,
  labelHidden,
  name,
  status,
  disabled,
  value,
  defaultValue,
  placeholder,
  hint,
  options,
  control,
  ...props
}) => {
  // NOTE : ClassName
  const classes = classNames(
    'form-select-container',
    status && `form-select-${status}`,
    className
  );
  // NOTE : RN
  return (
    <>
      {label && <FormLabel labelHidden={labelHidden} id={props.id}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            // menuIsOpen={true}
            options={options}
            styles={customStyles}
            className={classes}
            placeholder={placeholder}
            classNamePrefix="react-select"
          />
        )}
      />
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
}
