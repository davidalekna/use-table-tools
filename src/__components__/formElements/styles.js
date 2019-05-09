import styled from 'styled-components';
import { FlexRow, Transition } from '../globals';

export const StyledCheckboxWrapper = styled(FlexRow)`
  color: ${({ theme }) => theme.colours.neutral['800']};
  align-items: ${props => props.align};
  line-height: 1.4;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    color: ${({ theme, disabled }) =>
      disabled
        ? theme.colours.neutral['800']
        : theme.colours.accents.features['200']};
  }
  > div {
    margin-left: -6px;
    margin-right: 6px;
  }
  > a {
    text-decoration: none;
    color: ${({ theme }) => theme.colours.accents.features['200']};
    font-weight: 600;
    border-bottom: 2px solid transparent;
    position: relative;
    padding-bottom: 0px;
    transition: ${Transition.hover.off};
    &:hover {
      border-bottom: 2px solid
        ${({ theme }) => theme.colours.accents.features['200']};
      padding-bottom: 2px;
      transition: ${Transition.hover.on};
    }
  }
`;

export const StyledHiddenInput = styled.input`
  visibility: hidden;
  width: 0;
  height: 0;
`;

export const StyledLabel = styled.label`
  &:hover > input,
  &:hover > input:focus,
  &:hover > textarea:focus {
    border-color: ${props =>
      props.disabled
        ? props.theme.colours.neutral['300']
        : props.theme.colours.accents.features['200']};
  }
`;
