// https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

// accessibility names
// https://russmaxdesign.github.io/html-elements-names/

import React from 'react';
import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';

import Avatar from './Avatar';
import users from '../../data/users';

describe('Avatar', () => {
  const comp = <Avatar user={users[0]} size={24} />;

  test('should render div and img with title', () => {
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
});