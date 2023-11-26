import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import EmojiTabIcon from './EmojiTabIcon';
import getCategories from './emojiCategories';

const categories = getCategories();

describe('EmojiTabIcon', () => {
  const category = categories.emotion;
  const RenderIcon = () => (
    <img alt="Emotion Icon" src="category-stub-file" />
  );

  const spyClick = jest.fn();
  const comp = <EmojiTabIcon category={category} Presentation={RenderIcon} onClick={spyClick} />;

  test('should render the passed Icon', () => {
    render(comp);
    const img = screen.getByRole('img', { name: 'Emotion Icon' });
    expect(img.getAttribute('src')).toBe('category-stub-file')
  });

  test('should call onClick when icon is clicked', () => {
    render(comp);
    const img = screen.getByRole('img', { name: 'Emotion Icon' });

    fireEvent.click(img);
    expect(spyClick).toHaveBeenCalledWith(category);
  });
});