import React from 'react';
import { render, screen } from '@testing-library/react';

import Comment from './Comment';
import users from '../../data/users';
import { ContentPart } from '../CommentInput/CoreInput';

const Avatar = () => (
  <img alt={users[0].name} src={users[0].image} />
);

const date = '2023-12-16 12:30:00';

describe('Comment', () => {

  test('should display comment with custom classes', () => {
    render(
      <Comment
        user={users[0]}
        content="Hello World."
        date={date}
        AvatarComponent={Avatar}
        moduleClasses={{ content: 'hashclass' }}
      />
    );

    screen.getByText('Hello World.');
  });

  test('should render with time from ReactTimeago with timeAgoProps', () => {
    render(
      <Comment
        user={users[0]}
        content="Hello World."
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

  test('should display content parts comment', () => {
    const parts : ContentPart[] = [
      { type: 'text', data: 'Hello World.' },
      { type: 'newline', data: '\n' },
      { type: 'mention', data: users[1] },
    ];

    render(
      <Comment
        user={users[0]}
        content={parts}
        date={date}
        AvatarComponent={Avatar}
      />
    );

    const par = screen.getByRole('paragraph');
    // <br/> will be omitted by .textContent
    expect(par.textContent).toBe('Hello World.KeitelDOG');
  });
});
