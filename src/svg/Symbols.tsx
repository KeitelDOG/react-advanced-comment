import React from 'react';

export default function Symbols(props: any) {
  return(
    <svg role="svgRoot" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={props.color} {...props}><title>symbols</title><path d="M9,13c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S11.8,13,9,13z M9,21c-1.7,0-3-1.3-3-3s1.3-3,3-3c1.7,0,3,1.3,3,3  S10.7,21,9,21z M16.7,10.4l1.4,1.4L23.9,6l-5.8-5.8l-1.4,1.4L20,5h-5c-3.9,0-7,3-7,7h2c0-3,2.2-5,5-5h5.2L16.7,10.4z M6.3,7.7  l1.4-1.4L5.4,4l2.3-2.3L6.3,0.3L4,2.6L1.7,0.3L0.3,1.7L2.6,4L0.3,6.3l1.4,1.4L4,5.4L6.3,7.7z M22.3,16.3L20,18.6l-2.3-2.3l-1.4,1.4  l2.3,2.3l-2.3,2.3l1.4,1.4l2.3-2.3l2.3,2.3l1.4-1.4L21.4,20l2.3-2.3L22.3,16.3z"/></svg>
  );
}