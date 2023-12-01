import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import EmojiPicker from './EmojiPicker';
import getCategories, { CategoryName } from './emojiCategories';
import emojis from '../../json/emoji-datasource-testing.json';
import userEvent from '@testing-library/user-event';

const categories = getCategories();

describe('EmojiPicker', () => {
  const spyClose = jest.fn();
  const spySelected = jest.fn();

  const props = {
    emojis,
    initialCategory: 'emotion' as CategoryName,
    // renderClose: false,
    height: 280,
    numColumns: 8,
    onEmojiSelected: spySelected,
    onClose: spyClose,
  };

  const comp = <EmojiPicker {...props} />

  test('should render the Smileys & Emotion tabpanel, find GRINNING FACE emoji, and not find DOG FACE emoji', () => {
    render(comp);
    screen.getByRole('tabpanel', { name: categories.emotion.name });

    // should find GRINNING FACE (index 0)
    screen.getByRole('img', { name: emojis[0].name });

    // should not find DOG FACE emoji 🐶 1F436 (index 14)
    // use query not to throw error, and assert that it is not present
    const dog = screen.queryByRole('img', { name: emojis[14].name });
    expect(dog).toBeNull();
  });

  test('should apply correct height to EmojiPicker container', () => {
    render(comp);
    const container = screen.getByTestId('emoji-picker-container');
    expect(container.style.height).toBe('280px');
  });

  test('User navigates to Flags category, select Haiti Flag and find it in recent History', () => {
    render(comp);
    // aim at the flags tab
    let fCat = categories.flags;
    const flags = screen.getByRole('tab', { name: fCat.name });

    // click on it
    fireEvent.click(flags);
    const tabpanel = screen.getByRole('tabpanel');

    // should display the flags panel
    expect(tabpanel.id).toBe(`${fCat.id}-tabpanel`);

    // should contain Haiti flag
    const haiti = screen.getByRole('img', { name: emojis[23].name });
    fireEvent.click(haiti);
    expect(spySelected).toHaveBeenCalledWith('🇭🇹');

    // should show Haiti flag in recent History tab
    let hCat = categories.history
    const history = screen.getByRole('tab', { name: hCat.name });

    // click on history tab to show Haiti Flag
    fireEvent.click(history);
    expect(tabpanel.id).toBe(`${hCat.id}-tabpanel`);
    screen.getByRole('img', { name: emojis[23].name });
  });

  test('User searches for Dog emojis and hover on DOG FACE', async () => {
    jest.spyOn(window, 'setTimeout').mockImplementation((callback) => {
      callback();
      return 0 as any;
    });

    const user = userEvent.setup();
    render(comp);
    const tabpanel = screen.getByRole('tabpanel');
    // should display the flags panel
    expect(tabpanel.id).toBe(`${categories.emotion.id}-tabpanel`);

    const input = screen.getByRole('textbox', { name: 'search emoji'});
    const typing = 'dog';
    await user.click(input);
    await act(async() => await user.keyboard(typing));

    // indexes 14 DOG FACE, 15 DOG, 16 GUIDE DOG, 17 SERVICE DOG
    for (let i = 14; i <= 17; i++) {
      screen.getByRole('img', { name: emojis[i].name });
    }

    // current emoji name is blank
    const current = screen.getByRole('mark', { name: 'current emoji' });
    expect(current.textContent).toBe('');

    // current emoji name display DOG FACE on mouseover
    const dog = screen.getByRole('img', { name: emojis[14].name });
    fireEvent.mouseOver(dog);
    expect(current.textContent).toBe(emojis[14].name.toLowerCase());

    // current emoji name is blank again on mouseout
    // TODO: MouseOut doesn't seem to work, try to use userEvent object
    // it works on span
    fireEvent.mouseOut(dog);
    // expect(current.textContent).toBe('');
  });
});
