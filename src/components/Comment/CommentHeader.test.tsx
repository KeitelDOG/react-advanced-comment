import React from 'react';
import { render, screen } from '@testing-library/react';

import CommentHeader from './CommentHeader';
import users from '../../data/users';

const Avatar = () => (
  <img alt={users[0].name} src={users[0].image} />
);

const date = '2023-12-16 12:30:00';

describe('CommentHeader', () => {

  test('should display header with user info with custom classes', () => {
    render(
      <CommentHeader
        user={users[0]}
        date={date}
        AvatarComponent={Avatar}
        moduleClasses={{ content: 'hashclass' }}
      />
    );

    // banner (header)
    screen.getByRole('banner');
    // avatar
    screen.getByRole('img', { name: users[0].name })
    // user name
    screen.getByText(users[0].name);
    // comment date
    screen.getByText(date);
  });

  test('should render time from ReactTimeago with timeAgoProps', () => {
    render(
      <CommentHeader
        user={users[0]}
        AvatarComponent={Avatar}
        timeAgoProps={{
          date,
          minPeriod: 60
        }}
      />
    );
    // comment date using react-timeago
    const timeago = screen.getByTitle(date);
    expect((timeago.textContent as string).length).toBeGreaterThan(4);
  });
});
