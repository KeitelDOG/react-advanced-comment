import React from 'react';

export default function At(props: any) {
  return(
    <svg role="svgRoot" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}><title>at</title><circle cx="128" cy="128" fill="none" r="40" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/><path d="M181.1,208A96,96,0,1,1,224,128c0,22.1-8,40-28,40s-28-17.9-28-40V88" fill="none" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/></svg>
  );
}
