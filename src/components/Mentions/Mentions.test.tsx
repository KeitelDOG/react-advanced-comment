import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Mentions from './Mentions';
import users from '../../data/users';

describe('Mentions', () => {
  const spySelected = jest.fn();
  const comp = <Mentions users={users} onMentionSelected={spySelected} />;

  test('should render all users', () => {
    render(comp);
    users.forEach(user => {
      screen.getByRole('img', { name: user.name });
      screen.getByText(user.name);
    });
  });

  test('should render SVG for closing', () => {
    render(comp);
    screen.getByRole('svgRoot', { name: 'close' });
  });

  test('should call onMentionSelected when first User is clicked', () => {
    render(comp);
    const li = screen.getByRole('listitem', { name: `select ${users[0].name}` });

    fireEvent.click(li);
    expect(spySelected).toHaveBeenCalledWith(users[0].id)
  });
});