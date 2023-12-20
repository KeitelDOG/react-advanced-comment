export type CategoryName = 'history' | 'emotion' | 'nature' | 'food' | 'activities' | 'places' | 'objects' | 'symbols' | 'flags';

export type Colors = {
  [key in CategoryName]?: string
}

import history from '../../svg/History';
import emotion from '../../svg/Emotion';
import nature from '../../svg/Nature';
import food from '../../svg/Food';
import activities from '../../svg/Activities';
import places from '../../svg/Places';
import objects from '../../svg/Objects';
import symbols from '../../svg/Symbols';
import flags from '../../svg/Flags';

export function getCategories(colors : Colors = {}) {
  const defaultColor = '#aaa';
  return {
    history: {
      id: 'history',
      name: 'Recently used',
      icon: history,
      color: defaultColor,
    },
    emotion: {
      id: 'emotion',
      name: 'Smileys & Emotion', // Smileys & Emotion + People & Body
      icon: emotion,
      color: colors.emotion || defaultColor,
    },
    nature: {
      id: 'nature',
      name: 'Animals & Nature',
      icon: nature,
      color: colors.nature || defaultColor,
    },
    food: {
      id: 'food',
      name: 'Food & Drink',
      icon: food,
      color: colors.food || defaultColor,
    },
    activities: {
      id: 'activities',
      name: 'Activities',
      icon: activities,
      color: colors.activities || defaultColor,
    },
    places: {
      id: 'places',
      name: 'Travel & Places',
      icon: places,
      color: colors.places || defaultColor,
    },
    objects: {
      id: 'objects',
      name: 'Objects',
      icon: objects,
      color: colors.objects || defaultColor,
    },
    symbols: {
      id: 'symbols',
      name: 'Symbols',
      icon: symbols,
      color: colors.symbols || defaultColor,
    },
    flags: {
      id: 'flags',
      name: 'Flags',
      icon: flags,
      color: colors.flags || defaultColor,
    },
  };
}
