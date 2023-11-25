

import React from 'react';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './EmojiTabs.module.css';
import { Categories, Category } from './EmojiPicker';
import EmojiTabIcon from './EmojiTabIcon';
import { CategoryName } from './emojiCategories';

export type EmojiTabsProps = {
  categories: Categories,
  activeCategory: Category,
  /** Custom category icons to render */
  categoryIcons?: { [key in CategoryName] : () => React.JSX.Element },
  moduleClasses?: { [key : string] : any },
  onCategoryChange(category: Category) : void,
}

export default function EmojiTabs(props : EmojiTabsProps) {
  const {
    categories,
    activeCategory,
    categoryIcons,
    moduleClasses,
    onCategoryChange
  } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  return (
    <div className={classes.tabItems}>
      {Object.keys(categories).map((key: string) => {
        const cat : Category = categories[key];
        const Icon = cat.icon;

        // Custom icon render
        let CustomIcon: () => React.JSX.Element;
        if (categoryIcons) {
          CustomIcon = categoryIcons[cat.id as CategoryName];
        }

        let tabStyle = {};
        let color = cat.color;
        if (activeCategory.id === cat.id) {
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
              Presentation={() => {
                if (CustomIcon) {
                  return <CustomIcon />
                } else {
                  return <Icon height={24} width={24} color={cat.color} />
                }
              }}
              onClick={() => onCategoryChange(cat)}
            />
          </div>
        );
      })}
    </div>
  );
}
