import React from 'react';

// field reducer pattern will help to modify each row item the way you want.

function fieldReducer(fieldValue = '🍔', fieldName) {
  switch (fieldName) {
    case 'name':
      return `🌄 ${fieldValue}`;
    case 'username':
      return `📝 ${fieldValue}`;
    case 'email':
      return (
        <div style={{ color: 'orange', fontStyle: 'italic' }}>{fieldValue}</div>
      );
    default:
      return fieldValue;
  }
}

export default fieldReducer;
