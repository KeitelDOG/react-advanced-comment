import React from 'react';
import { render, screen } from '@testing-library/react';

import Content from './Content';
import users from '../../data/users';
import { ContentPart } from '../CommentInput/helper';

describe('Content', () => {

  test('should display string comment with custom classes', () => {
    render(
      <Content
        content="Hello World."
        moduleClasses={{ content: 'hashclass' }}
      />
    );

    screen.getByText('Hello World.');
  });

  test('should display comment with mentioned Users', () => {
    const content = 'Hey {{2}} well done 😃.\n\nI like the new App you made {{3}} 👍, pretty nice.';
    render(
      <Content
        content={content}
        mentionedUsers={[users[1], users[2]]}
      />
    );

    screen.getByRole('mark', { name: `${users[1].name} mentioned` });
    screen.getByRole('mark', { name: `${users[2].name} mentioned` });
  });

  test('should display comment with custom MentionComponent', () => {
    const content = 'Hello {{2}}';
    const customLabel = `${users[1].name} custom mentioned`;
    render(
      <Content
        content={content}
        mentionedUsers={[users[1]]}
        MentionComponent={({ user }) => {
          return (
            <span
              role="mark"
              aria-label={customLabel}
            >{user.name}</span>
          );
        }}
      />
    );

    screen.getByRole('mark', { name: customLabel });
  });

  test('should display content parts comment', () => {
    const parts : ContentPart[] = [
      { type: 'text', data: 'Hello World.' },
      { type: 'newline', data: '\n' },
      { type: 'mention', data: users[1] },
    ];

    render(
      <Content
        content={parts}
        moduleClasses={{ content: 'hashclass' }}
      />
    );

    const par = screen.getByRole('paragraph');
    // <br/> will be omitted by .textContent
    expect(par.textContent).toBe('Hello World.KeitelDOG');
  });
});
