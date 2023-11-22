import React from 'react';

export type ToolIconProps = {
  src: string,
  size?: number,
  alt?: string,
}

export default function ToolIcon(props : ToolIconProps) {
  const { src, size = 24, alt = 'Tool Icon' } = props;
  const styles = useStyles(size);

  return (
    <img
      src={src}
      style={styles.icon}
      alt={alt}
    />
  );
}

const useStyles = (size: number) : { [key: string]: React.CSSProperties } => ({
  icon: {
    width: size,
    height: size,
    cursor: 'pointer',
  },
});
