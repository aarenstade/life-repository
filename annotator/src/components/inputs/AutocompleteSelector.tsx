import { FC, useState, useEffect, CSSProperties, forwardRef } from "react";
import SearchBar from "./SearchBar";
import React from "react";

type AutocompleteSelectorProps = {
  className?: string;
  dropdownClassName?: string;
  value: string;
  onChange: (value: string) => void;
  options: any[];
  placeholder?: string;
  autoFocus?: boolean;
  rowComponent: FC<any>;
  optionComponentKey?: string;
  onSearch: (query: string) => void;
  loading: boolean;
  onSelect: (option: any) => void;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
};

const AutocompleteSelector = forwardRef((props: AutocompleteSelectorProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    dropdownClassName,
    value,
    onChange,
    options,
    rowComponent: RowComponent,
    optionComponentKey = "option",
    onSearch,
    loading,
    onSelect,
    top,
    left,
    bottom,
    right,
  } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (options) setShow(true);
  }, [options]);

  const positionStyle: CSSProperties = {
    position: "absolute",
    top: top,
    left: left,
    bottom: bottom,
    right: right,
  };

  return (
    <div className={`${className}`} ref={ref} style={top || left || bottom || right ? positionStyle : {}}>
      <SearchBar
        value={value}
        loading={loading}
        onChange={onChange}
        onSearch={() => onSearch(value)}
        autoFocus={props.autoFocus || false}
        placeholder={props.placeholder ? props.placeholder : "Search..."}
        searchMode={"automatic"}
      />
      {show && (
        <div className={`${dropdownClassName} overflow-y-scroll absolute z-50 shadow-md`}>
          {options.map((option, index) => {
            let props = { [optionComponentKey]: option };
            return (
              <div
                key={index}
                className='cursor-pointer'
                onClick={() => {
                  onSelect(option);
                  setShow(false);
                }}
              >
                <RowComponent {...props} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default AutocompleteSelector;
