import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import EmojiCell from './EmojiCell';
import emojis from '../../json/emoji-datasource-testing.json';

/*
Haiti flag emoji 🇭🇹 1F1ED-1F1F9 (index 23)
DOG FACE emoji 🐶 1F436 (index 14)
// Dog emojis (index 14 to 17)
*/

describe('EmojiCell', () => {
  const spyHover = jest.fn();
  const spySelect = jest.fn();
  const comp = <EmojiCell emoji={emojis[23]} onHover={spyHover} onSelect={spySelect} />;

  test('should render Haiti Emoji 🇭🇹', () => {
    render(comp);
    const emo = screen.getByText('🇭🇹');
  });

  test('should call onHover when mouse goes over and out the emoji', () => {
    render(comp);
    const span = screen.getByRole('img', { name: emojis[23].name });

    fireEvent.mouseOver(span);
    expect(spyHover).toHaveBeenCalledWith(true, emojis[23]);

    fireEvent.mouseOut(span);
    expect(spyHover).toHaveBeenCalledWith(false, emojis[23]);
  });

  test('should call onSelect when emoji is clicked', () => {
    render(comp);
    const span = screen.getByRole('img', { name: emojis[23].name });

    fireEvent.click(span);
    expect(spySelect).toHaveBeenCalledWith(emojis[23], '🇭🇹');
  });
});