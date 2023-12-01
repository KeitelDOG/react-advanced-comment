import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Mentions from './Mentions';
import users from '../../data/users';

describe('Mentions', () => {
  const spySelected = jest.fn();
  const spyClose = jest.fn();
  const props = {
    users,
    onMentionSelected: spySelected,
  };

  const comp = <Mentions {...props} />;

  test('should render all users with custom classes', () => {
    render(
      <Mentions
        {...props}
        moduleClasses={{ user: 'hashclass' }}
      />
    );

    users.forEach(user => {
      screen.getByRole('img', { name: user.name });
      screen.getByText(user.name);
    });
  });

  test('should render SVG for closing', () => {
    render(comp);
    screen.getByRole('svgRoot', { name: 'close' });
  });

  test('should render custom Close Icon component', () => {
    render(
      <Mentions
        {...props}
        renderCloseIcon={<span arial-label="custom close">close</span>}
        onClose={spyClose}
      />
    );
    const close = screen.getByLabelText('custom close');
    fireEvent.click(close);
    expect(spyClose).toHaveBeenCalled();
  });

  test('should call onMentionSelected when first User is clicked', () => {
    render(
      <Mentions
        {...props}
        moduleClasses={{ user: 'hashclass' }}
        renderCloseIcon={<span arial-label="custom close">close</span>}
        onClose={spyClose}
      />
    );
    const li = screen.getByRole('listitem', { name: `select ${users[0].name}` });

    fireEvent.click(li);
    expect(spySelected).toHaveBeenCalledWith(users[0].id)
  });
});