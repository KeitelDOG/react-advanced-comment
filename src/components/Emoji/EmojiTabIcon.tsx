import React from 'react';
import { Category } from './EmojiPicker';

export type EmojiTabIconProps = {
  category: Category,
  /** The View Component to display the EmojiTabIcon */
  Presentation : () => React.JSX.Element,
  onClick(cat : Category) : void,
}

export default function EmojiTabIcon(props : EmojiTabIconProps) {
  const { category, Presentation, onClick } = props;

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => onClick(category)}>
      <Presentation />
    </div>
  );
}

