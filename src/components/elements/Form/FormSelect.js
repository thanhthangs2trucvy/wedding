import React from "react";
import PropTypes from 'prop-types';
import Select, { components } from "react-select";
import { Controller } from "react-hook-form";
import classNames from "classnames";
import { FormLabel } from "./FormLabel";
import { FormHint } from "./FormHint";


const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={props.isFocused}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, child =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

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
    borderColor: state.isFocused ? 'grey' : 'red',
  })
};

export const FormSelect = ({
  floating,
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
  options = [],
  control,
  isClearable,
  menuPlacement = 'bottom',
  ...props
}) => {
  // NOTE : ClassName
  const classes = classNames(
    'form-select-container',
    status && `form-select-${status}`,
    floating && 'form-select-floating',
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
            options={options}
            styles={{
              ...customStyles,
              control: (baseStyles, state) => {
                let color = '#d9d9d9';
                let backgroundColor = '#f6f6f7';

                if (state.hasValue) {
                  color = "#198754";
                  backgroundColor = '#ffffff';
                }

                if (state.isFocused) {
                  color = "#1b2750";
                  backgroundColor = '#ffffff';
                }
                return {
                  ...baseStyles,
                  color,
                  backgroundColor
                }
              },
            }}
            // menuIsOpen={true}
            menuPlacement={menuPlacement}
            isClearable={isClearable}
            placeholder={placeholder}
            className={classes}
            classNamePrefix="react-select"
            components={floating && {
              ValueContainer: CustomValueContainer
            }}
          />
        )}
      />
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
}
