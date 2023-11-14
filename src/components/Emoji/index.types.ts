import { CategoryName } from './emojiCategories';

export type EmojiPickerProps = {
  emojis: Emoji[],
  recentEmojis?: Emoji[],
  initialCategory?: CategoryName,
  /** Set height for Emoji Picker container. You can leave it blank and set height in an outside container. */
  height?: number,
  numColumns?: number,
  moduleClasses?: { [key : string] : any },
  onEmojiSelected(emojiChar : string) : void,
  onClose() : void,
}

export type RenderEmojiPickerProps = {
  onEmojiSelected(emojiChar : string) : void,
  onClose() : void,
}

export type Emoji = {
  name: string,
  unified: string,
  short_name: string,
  short_names: string[],
  category: string,
  sort_order: number,
  added_in: string,
};


export type Category = {
  // [key: string]: string | React.JSX.Element,
  id: string,
  name: string,
  icon(props: any) : React.JSX.Element,
  color: string,
};

export type Categories = {
  [key: string]: Category,
};

export type EmojiTabIconProps = {
  category: Category,
  size: number,
  Presentation(props: any) : React.JSX.Element,
  onClick(cat : Category) : void,
}

export type EmojiTabsProps = {
  categories: Categories,
  activeCategory: Category,
  EmojiTabIcon(props : EmojiTabIconProps) : React.JSX.Element,
  moduleClasses?: { [key : string] : any },
  onCategoryChange(category: Category) : void,
}

export type EmojiCellProps = {
  emoji: Emoji,
  moduleClasses?: { [key : string] : any },
  onHover?(isHover: boolean, emoji: Emoji) : void,
  onSelect(emoji: Emoji, emojiChar: string) : void,
}
