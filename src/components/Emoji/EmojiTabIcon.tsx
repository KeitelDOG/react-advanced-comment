import React from 'react';
import { EmojiTabIconProps } from './index.types';

export default function EmojiTabIcon(props : EmojiTabIconProps) {
  const { category, Presentation, size = 24, onClick } = props;

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => onClick(category)}>
      <Presentation height={size} width={size} color={category.color} />
    </div>
  );
}

