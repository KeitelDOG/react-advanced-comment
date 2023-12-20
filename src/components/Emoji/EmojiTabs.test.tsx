import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import EmojiTabs from './EmojiTabs';
import { getCategories} from './emojiCategories';

const categories = getCategories();

describe('EmojiTabs', () => {
  const category = categories.emotion;
  const cutomIcons = {
    emotion: () => (
      <img alt="Custom Emotion Icon" src="category-stub-file" />
    )
  };

  const spyCategoryChange = jest.fn();

  const props = {
    categories,
    activeCategory: category,
    onCategoryChange: spyCategoryChange
  };

  const comp = <EmojiTabs {...props} />

  test('should render the tablist with custom classes', () => {
    render(<EmojiTabs {...props} moduleClasses={{ tabItem: 'hashclass' }} />);
    screen.getByRole('tablist', { name: 'Emoji Categories' });
  });

  test('should render all Tabs with Icons with Emotion Tabs as Selected', () => {
    render(comp);
    Object.values(categories).forEach(cat => {
      screen.getByRole('tab', { name: cat.name });
      screen.getByRole('svgRoot', { name: cat.id });
    });

    const tab = screen.getByRole('tab', { selected: true });
    expect(tab.getAttribute('aria-label')).toBe(categories.emotion.name);
  });

  test('should call onClick and switch to flags when Flags Category is clicked', () => {
    render(comp);
    const tab = screen.getByRole('tab', { name: categories.flags.name });

    fireEvent.click(tab);
    expect(spyCategoryChange).toHaveBeenCalledWith(categories.flags);
  });

  test('should render custom Icon for Tab if provided', () => {
    // should work with color Hex 7 length
    categories.emotion.color = '#aaaaaa';
    render(<EmojiTabs {...props} categoryIcons={cutomIcons} />);
    screen.getByRole('img', { name: 'Custom Emotion Icon' });
  });
});
