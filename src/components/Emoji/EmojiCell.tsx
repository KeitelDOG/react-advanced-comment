import React from 'react';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './EmojiCell.module.css';
import { Emoji } from './EmojiPicker';

export type EmojiCellProps = {
  emoji: Emoji,
  /** A Class Module to provide to override some classes of the default Class Modules.
   * classes: `emojiCell, emojiText`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },
  onHover?(isHover: boolean, emoji: Emoji) : void,
  onSelect(emoji: Emoji, emojiChar: string) : void,
}

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
    <div data-class="emojiCell" className={classes.emojiCell}>
      <span
        role="img"
        aria-label={emoji.name}
        data-class="emojiText"
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
