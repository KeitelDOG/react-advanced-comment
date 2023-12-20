import React from 'react';

export default function Like(props: any) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>like</title><rect fill={props.rectFill} height="10" width="3" x="2" y="10"/><path fill={props.fill} strokeWidth="1" stroke={props.stroke} d="M19,9H14V4a1,1,0,0,0-1-1H12L7.66473,8.37579A3.00021,3.00021,0,0,0,7,10.259V18a2,2,0,0,0,2,2h6.43481a2.99991,2.99991,0,0,0,2.69037-1.67273L21,12.5V11A2,2,0,0,0,19,9Z"/></svg>
  );
}
