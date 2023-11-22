import React from 'react';

export default function Food(props: any) {
  return(
    <svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props} ><g><path d="M9,1v8 c0,3.866,3.134,7,7,7h0c3.866,0,7-3.134,7-7V1H9z" fill="none" stroke={props.color} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><line fill="none" stroke={props.color} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" x1="16" x2="16" y1="16" y2="31"/><line fill="none" stroke={props.color} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" x1="11" x2="21" y1="31" y2="31"/><line fill="none" stroke={props.color} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" x1="9" x2="23" y1="9" y2="9"/></g></svg>
  );
}
