import React from 'react';

export default function Emotion(props: any) {
  return(
    <svg role="svgRoot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={props.color} {...props}><title>emotion</title><path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.01,9.01,0,0,1,12,21ZM8,11V9a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm8-2v2a1,1,0,0,1-2,0V9a1,1,0,0,1,2,0ZM8,14h8a4,4,0,0,1-8,0Z"/></svg>
  );
}
