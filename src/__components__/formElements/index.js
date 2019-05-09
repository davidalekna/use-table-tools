import React from 'react';
import { Icon } from '../icons';
import {
  StyledCheckboxWrapper,
  StyledHiddenInput,
  StyledLabel,
} from './styles';

// todo create and import icon

function pickAppropriateCheckbox({
  checked,
  selectAllCheckboxState,
  disabled,
}) {
  if (typeof checked === 'boolean') {
    switch (checked) {
      case true:
        return <Icon name="Checkbox" />;
      case false:
        return (
          <Icon name="CheckboxBaseline" color={disabled ? '#CCC' : '#777'} />
        );
      default:
        return null;
    }
  }

  if (typeof selectAllCheckboxState === 'string') {
    switch (selectAllCheckboxState) {
      case 'all':
        return <Icon name="Checkbox" />;
      case 'some':
        return <Icon name="CheckboxIndetermined" />;
      default:
        return (
          <Icon name="CheckboxBaseline" color={disabled ? '#CCC' : '#777'} />
        );
    }
  }
}

export const Checkbox = props => {
  return (
    <StyledLabel>
      <StyledCheckboxWrapper
        disabled={props.disabled || false}
        align={props.align || 'center'}
        data-cy={
          props.dataCy
            ? `${props.dataCy}-${props.checked ? 'checked' : 'unchecked'}`
            : null
        }
      >
        {pickAppropriateCheckbox(props)}
        <StyledHiddenInput
          type="checkbox"
          id={props.id}
          checked={props.checked}
          disabled={props.disabled || false}
          onChange={props.onChange}
          data-cy={props.dataCy}
        />
        {props.children}
      </StyledCheckboxWrapper>
    </StyledLabel>
  );
};
