import * as React from 'react';
import { Avatar, AvatarWrapper } from './styles';

function fieldReducer(
  fieldValue: any = '🍔',
  fieldName: string,
  row: { [key: string]: any },
) {
  switch (fieldName) {
    case 'boil_volume': {
      const { unit, value } = fieldValue;
      return <div>{`${value} ${unit}`}</div>;
    }
    case 'food_pairing': {
      return fieldValue.map(pair => pair);
    }
    case 'ingredients': {
      return Object.keys(fieldValue).join(', ');
    }
    case 'method': {
      return Object.keys(fieldValue).join(', ');
    }
    case 'volume': {
      const { unit, value } = fieldValue;
      return <div>{`${value} ${unit}`}</div>;
    }
    case 'name': {
      return (
        <AvatarWrapper>
          <Avatar>
            <img src={row.image_url} alt="" />
          </Avatar>
          <span>{fieldValue}</span>
        </AvatarWrapper>
      );
    }
    default:
      return fieldValue;
  }
}

export default fieldReducer;
