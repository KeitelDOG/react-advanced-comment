import React from 'react';
import { EmojiCellProps } from './index.types';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './EmojiCell.module.css';

// convert utf6 string to representing charater.
  // Useful for emoji (unified code to emoji char)
const charFromUtf16 = (utf16 : string) => {
  return String.fromCodePoint(...utf16.split('-').map(u => Number(`0x${u}`)));
};

export default function EmojiCell(props : EmojiCellProps) {
  const { emoji, moduleClasses, onHover = () => {}, onSelect } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);
  const emojiChar = charFromUtf16(emoji.unified);

  return (
    <div className={classes.emojiCell}>
      <span
        className={classes.emojiText}
        onMouseOver={() => onHover(true, emoji)}
        onMouseOut={() => onHover(false, emoji)}
        onClick={() => onSelect(emoji, emojiChar)}
      >
        {emojiChar}
      </span>
    </div>
  );
}
