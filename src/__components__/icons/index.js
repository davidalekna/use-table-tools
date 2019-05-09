import React from 'react';
import { StyledIconButton } from './styles';

const SVG = ({
  style = {},
  fill = '#000',
  width = '24',
  className = '',
  viewBox = '0 0 24 24',
  children,
}) => (
  <svg
    width={width}
    height={width}
    style={style}
    fill={fill}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    {children}
  </svg>
);

const Checkbox = props => {
  return (
    <SVG {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </SVG>
  );
};

const CheckboxBaseline = props => {
  return (
    <SVG {...props}>
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </SVG>
  );
};

const CheckboxIndetermined = props => {
  return (
    <SVG {...props}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
    </SVG>
  );
};

const IconsCollection = {
  Checkbox,
  CheckboxBaseline,
  CheckboxIndetermined,
};

export const IconButton = ({ name, iconStyle = {}, ...props }) => {
  const IconC = IconsCollection[name];
  if (!IconC) throw Error(`Icon with name ${name} doesn\`t exist!`);
  return <StyledIconButton {...props} children={<IconC style={iconStyle} />} />;
};

export const Icon = ({ name, ...props }) => {
  const IconC = IconsCollection[name];
  if (!IconC) throw Error(`Icon with name ${name} doesn\`t exist!`);
  return <IconC {...props} />;
};
