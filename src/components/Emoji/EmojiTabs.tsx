

import React from 'react';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './EmojiTabs.module.css';
import { Categories, Category } from './EmojiPicker';
import { EmojiTabIconProps } from './EmojiTabIcon';

export type EmojiTabsProps = {
  categories: Categories,
  activeCategory: Category,
  /** The Component to display the Icon with appropriate props */
  EmojiTabIcon(props : EmojiTabIconProps) : React.JSX.Element,
  moduleClasses?: { [key : string] : any },
  onCategoryChange(category: Category) : void,
}

export default function EmojiTabs(props : EmojiTabsProps) {
  const { categories, activeCategory, EmojiTabIcon, moduleClasses, onCategoryChange } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  return (
    <div className={classes.tabItems}>
      {Object.keys(categories).map((key: string) => {
        const cat : Category = categories[key];
        let tabStyle = {};
        let color = cat.color;
        if (activeCategory.name === cat.name) {
          tabStyle = {
            top: 1,
            borderBottomStyle: 'solid',
            borderBottomWidth: 3,
            borderBottomColor: color,
            backgroundColor: `${color}a0`,
          };
        }
        return (
          <div
            key={`emoji-category-${key}`}
            className={classes.tabItem}
            style={tabStyle}
          >
            <EmojiTabIcon
              category={cat}
              size={24}
              Presentation={cat.icon}
              onClick={() => onCategoryChange(cat)}
            />
          </div>
        );
      })}
    </div>
  );
}
