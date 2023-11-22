/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.module.css' {
  const content: { [className: string]: string }
  export default content
}

/*
interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}
*/

/*
declare module '*.svg' {
  // import React = require('react');
  // export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // export const ReactComponent: React.FC<React.SVGAttributes<SVGElement>>
  export default any
}
*/

declare module '*.svg' {
  // import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
