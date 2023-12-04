// https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/tabs/tabs-2/tabs.html

import React, { CSSProperties } from 'react';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './EmojiTabs.module.css';
import { Categories, Category } from './EmojiPicker';
import { CategoryName } from './emojiCategories';

export type EmojiTabsProps = {
  categories: Categories,
  activeCategory: Category,
  /** Custom category icons to render */
  categoryIcons?: { [key in CategoryName]? : () => React.JSX.Element },

  /** A Class Module to provide to override some classes of the default Class Modules.
   * classes: `tabItems, tabItem, activeTabItem`
   * @default css module
  */
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
    <div
      role="tablist"
      aria-label="Emoji Categories"
      data-class="tabItems"
      className={classes.tabItems}
    >
      {Object.keys(categories).map((key: string) => {
        const cat : Category = categories[key];
        const Icon = cat.icon;

        // Custom icon render
        let renderCustomIcon = false;
        let CustomIcon: () => React.JSX.Element = () => <></>;
        if (categoryIcons) {
          const ic = categoryIcons[cat.id as CategoryName];
          if (ic) {
            CustomIcon = ic;
            renderCustomIcon = true;
          }
        }

        const isSelected = activeCategory.id === cat.id;
        let tabStyle = {} as CSSProperties;
        let color = cat.color;
        if (color.length === 4) {
          // double the color : #aaa => #aaaaaa
          color += color.slice(1);
        }
        if (isSelected) {
          tabStyle.backgroundColor = `${color}70`;
        }

        return (
          <button
            key={`emoji-category-${key}`}
            id={`${cat.id}-tab`}
            role="tab"
            aria-label={cat.name}
            aria-selected={isSelected}
            aria-controls={`${cat.id}-tabpanel`}
            data-class="tabItem"
            className={classes.tabItem}
            style={tabStyle}
            onClick={() => onCategoryChange(cat)}
          >
            {renderCustomIcon ? (
              <CustomIcon />
            ) : (
              <Icon height={24} width={24} color={cat.color} />
            )}

            {isSelected && (
              <div
                style={tabStyle}
                data-class="activeTabItem"
                className={classes.activeTabItem}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
