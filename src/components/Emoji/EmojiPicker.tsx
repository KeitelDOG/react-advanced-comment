import React from 'react';

import EmojiTabs from './EmojiTabs';
import EmojiCell from './EmojiCell';
import { combineClasses } from '../helpers/combineClasses';
import getCategories from './emojiCategories';
import EmojiTabIcon from './EmojiTabIcon';
import defaultClasses from './EmojiPicker.module.css';
import Magnify from '../../svg/Magnify';
import Close from '../../svg/Close';
import { CategoryName } from './emojiCategories';
import { User } from '../Mentions/Mentions';
import { EmojiCellProps } from './EmojiCell';

export type Category = {
  id: string,
  name: string,
  icon(props: any) : React.JSX.Element,
  color: string,
};

export type Categories = {
  [key: string]: Category,
};

export type Emoji = {
  name: string,
  unified: string,
  short_name: string,
  short_names: string[],
  category: string,
  sort_order: number,
  added_in: string,
};

export type EmojiPickerProps = {
  /** Array of Emoji with standard attributes:
   * (name, unified, short_name, short_name, category, sort_order, added_in)
   */
  emojis: Emoji[],

  /** Pass recent emojis to automatically load them into history of recently used emoji */
  recentEmojis?: Emoji[],

  /** Which emoji category to load initially */
  initialCategory?: CategoryName,

  /** Set height for Emoji Picker container. You can leave it blank and set height in an outside container. */
  height?: number,

  /** Number of column to display Emojis in grid */
  numColumns?: number,

   /** A Class Module to provide to override some classes of the default Class Modules */
  moduleClasses?: { [key : string] : any },

  /** Callback when an Emoji is selected */
  onEmojiSelected(emojiChar : string) : void,

  /** Callback when the EmojiPicker container is closed */
  onClose() : void,
}

const groupedCategories = (emos : Emoji[]) => {
  return emos.reduce((acc, emo) => {
    acc[emo.category] = acc[emo.category] || [];
    acc[emo.category].push(emo);
    return acc;
  }, {} as { [key: string]: Emoji[] });
};

const filterEmojis = (emojis : Emoji[]) => {
  return emojis.reduce((acc, emo) => {
    // skip unified that has more than 2 dashes
    if (emo.unified.split('-').length > 3) {
      return acc;
    }
    // skip recent version
    if (Number(emo.added_in) > 12) {
      return acc;
    }

    const emolight : Emoji = {
      name: emo.name,
      unified: emo.unified,
      short_name: emo.short_name,
      short_names: emo.short_names,
      category: emo.category,
      sort_order: emo.sort_order,
      added_in: emo.added_in,
    };

    acc.push(emolight);
    return acc;
  }, [] as Emoji[]);
};

const sortEmojis = (emos : Emoji[]) => {
  return emos.sort((e1, e2) => e1.sort_order - e2.sort_order);
};

const additionalNames = {
  '1F1ED-1F1F9': ['ayiti', 'voodoo', 'vodou'], // 🇭🇹
  '1F1FA-1F1F8': ['usa', 'america'], // 🇺🇸
  '1F1E7-1F1F7': ['brics'], // 🇧🇷
  '1F1F7-1F1FA': ['brics'], // 🇷🇺
  '1F1EE-1F1F3': ['brics', 'bharat'], // 🇮🇳
  '1F1E8-1F1F3': ['brics'], // 🇨🇳
  '1F1FF-1F1E6': ['brics'], // 🇿🇦
  '1F3C5': ['gold'], // 🏅
  '1F947': ['gold'], // 🥇
  '1F948': ['silver'], // 🥈
  '1F949': ['bronze'], // 🥉
  '1F3C6': ['gold', 'champion'], // 🏆
} as { [key: string] : string[] };

let timeOut : NodeJS.Timeout;
const TIME_OUT_AMOUNT = 500;

export default function EmojiPicker(props : EmojiPickerProps) {
  const {
    emojis = [],
    initialCategory = 'emotion',
    height,
    numColumns = 8,
    moduleClasses,
    onEmojiSelected,
    onClose,
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);
  const categories = getCategories();
  let emos = sortEmojis(emojis);

  const emojiListRef = React.useRef<HTMLDivElement | null>(null);

  const [category, setCategory] = React.useState<Category>(categories[initialCategory]);
  const [currentEmoji, setCurrentEmoji] = React.useState<Emoji>();
  const [recentEmojis, setRecentEmojis] = React.useState<Emoji[]>([]);
  const [searchedEmojis, setSearchedEmojis] = React.useState<Emoji[]>([]);
  const [keywords, setKeywords] = React.useState<string>('');

  React.useEffect(() => {
    // scroll back to top when category is changed
    (emojiListRef.current as HTMLDivElement).scrollTop = 0;
  }, [category]);

  const searchEmojis = React.useCallback(() => {
    const qry = keywords.toLowerCase();
    type Scores = { [key: string] : number };
    const scores : Scores = {};

    const results = emos.filter(emo => {
      let score = 0;
      if (emo.name.toLowerCase().startsWith(qry)) {
        score += 10;
      }

      if (emo.short_name.toLowerCase().startsWith(qry)) {
        score += 50;
      }

      if (emo.short_name.split('_').length > 1) {
        const keys = emo.short_name.split('_');
        keys.map(key => {
          if (key.startsWith(qry)) {
            score += 20;
          }
        });
      }

      if (emo.short_name.split('-').length > 1) {
        const keys = emo.short_name.split('-');
        keys.map(key => {
          if (key.startsWith(qry)) {
            score += 20;
          }
        });
      }

      if (emo.short_names.includes(qry)) {
        score += 50;
      }

      // Custom additional names
      if (additionalNames[emo.unified]) {
        const keys = additionalNames[emo.unified];
        keys.map(key => {
          if (key.startsWith(qry)) {
            score += 20;
          }
        });
      }

      scores[emo.unified] = score;
      return score > 0;
    });

    return results.sort((e1, e2) => {
      return scores[e1.unified] - scores[e2.unified];
    });
  }, [emos, keywords]);

  React.useEffect(() => {
    if (timeOut) {
      clearTimeout(timeOut);
    }

    if (keywords.length > 1) {
      timeOut = setTimeout(() => {
        const results = searchEmojis();
        setSearchedEmojis(results);
      }, TIME_OUT_AMOUNT);
    } else {
      setSearchedEmojis([]);
    }
  }, [keywords, searchEmojis]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentEmoji) {
      setCurrentEmoji(undefined);
    }
    setKeywords(event.target.value);
  };

  const onSelect = (emoji: Emoji, emojiChar: string) => {
    onEmojiSelected(emojiChar);
    setRecentEmojis(remojis => {
      // skip change if in Recently used category
      if (category.name !== 'Recently used') {
        let filtered = remojis.filter(e => e.unified !== emoji.unified);
        filtered.unshift(emoji);
        return filtered;
      }
      return remojis;
    });
  };

  const onHover = (isHover: boolean, emoji: Emoji) => {
    if (isHover) {
      setCurrentEmoji(emoji);
    } else {
      setCurrentEmoji(undefined);
    }
  };

  const PureEmojiCell = React.memo(function EmojiMemo(prps : EmojiCellProps) {
    return <EmojiCell {...prps} />;
  });

  const groupedEmojis = groupedCategories(emos);

  // charFromUtf16('0x1F600')

  let activeEmojis : Emoji[] = groupedEmojis[category.name];

  if (category.name === 'Smileys & Emotion' && groupedEmojis['People & Body']) {
    // add people and body emojis on that list
    activeEmojis = activeEmojis.concat(groupedEmojis['People & Body']);
  }
  if (category.name === 'Recently used') {
    // add history emojis here
    activeEmojis = recentEmojis;
  }
  if (keywords.length) {
    activeEmojis = searchedEmojis;
  }

  return (
    <div
      className={classes.emojiPicker}
      style={{ height }}
    >
      <div className={classes.tools}>
        <div className={classes.search}>
          <div className={classes.magnifyIcon}>
            <Magnify height={22} with={22} color="#aaa"/>
          </div>
          <input
            className={classes.searchInput}
            placeholder="Search Emoji"
            aria-label="search emoji"
            value={keywords}
            onChange={handleChange}
          />
        </div>

        <div className={classes.currentEmojiContainer}>
          <span className={classes.currentEmoji}>
            {currentEmoji ? currentEmoji.name.toLowerCase() : ''}
          </span>
        </div>

        <div className={classes.closeIcon} onClick={onClose}>
          <Close height={18} with={18} color="#aaa"/>
        </div>
      </div>
      <EmojiTabs
        categories={categories}
        activeCategory={category}
        EmojiTabIcon={EmojiTabIcon}
        onCategoryChange={cat => {
          // remove search keywords
          if (keywords) {
            setKeywords('');
          }
          if (currentEmoji) {
            setCurrentEmoji(undefined);
          }
          setCategory(cat);
        }}
      />
      <div
        ref={emojiListRef}
        className={classes.emojiContainer}
        style={{ gridTemplateColumns: 'auto '.repeat(numColumns) }}
      >
        {activeEmojis.map(emoji => (
          <PureEmojiCell
            key={`emoji-cell-${emoji.unified}`}
            emoji={emoji}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}
