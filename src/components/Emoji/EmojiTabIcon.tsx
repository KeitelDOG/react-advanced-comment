import React from 'react';
import { Category } from './EmojiPicker';

export type EmojiTabIconProps = {
  category: Category,
  size: number,
  /** The View Component to display the EmojiTabIcon */
  Presentation(props: any) : React.JSX.Element,
  onClick(cat : Category) : void,
}

export default function EmojiTabIcon(props : EmojiTabIconProps) {
  const { category, Presentation, size = 24, onClick } = props;

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => onClick(category)}>
      <Presentation height={size} width={size} color={category.color} />
    </div>
  );
}
