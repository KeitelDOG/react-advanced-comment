// https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

// accessibility names
// https://russmaxdesign.github.io/html-elements-names/
// aria: Accessible Rich Internet Applications

import React from 'react';
import { render, screen } from '@testing-library/react';

import Avatar from './Avatar';
import users from '../../data/users';

describe('Avatar', () => {
  const comp = <Avatar user={users[0]} size={24} moduleClasses={{ badge: 'hashclass' }} />;

  test('should render div and img with title and custom classes', () => {
    render(comp);
    const elems = screen.getAllByTitle(users[0].name);
    expect(elems.length).toBe(2);
  });

  test('should render img with info', () => {
    render(comp);
    const img = screen.getByRole('img');
    expect(img.getAttribute('title')).toBe(users[0].name);
    expect(img.getAttribute('alt')).toBe(users[0].name);
    expect(img.getAttribute('src')).toBe(users[0].image);
    expect(img.getAttribute('style')).toBe('height: 24px;');
  });

  test('should render default Guest Text Avatar if no user is passed', () => {
    render(<Avatar guestName='DOG' size={24} />);
    const guest = screen.getByLabelText('guest avatar');
    expect(guest.textContent).toBe('DOG');
  });

  test('should render User Text Avatar if no user has no image', () => {
    const { id, name } = users[0];
    render(<Avatar user={{ id, name }} size={24} />);
    const user = screen.getByLabelText(`${name} avatar`);
    expect(user.textContent).toBe(name[0]);
  });
});
