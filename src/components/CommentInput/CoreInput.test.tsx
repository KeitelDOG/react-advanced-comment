import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CoreInput, { CoreInputProps } from './CoreInput';
import users from '../../data/users';

describe('CoreInput', () => {
  const comment = 'Hey {{2}} well done 😃.\n\nI like the new App you made {{3}} 👍, pretty nice.';

  const spyEmojiSet = jest.fn();
  const spyMentionedUserSet = jest.fn();
  const spyMentionMatch = jest.fn();
  const spyMentionedUsersUpate = jest.fn();
  const spyValidationChange = jest.fn();
  const spyLengthChange = jest.fn();
  const spyContentChange = jest.fn();
  const spySend = jest.fn();

  const props = {
    users,
    minLength: 2,
    maxLength: 0,
    // initialValue: '',
    // initialMentionedUsers: [],
    mentionsLimit: 2,
    lineColor: 'blue',
    tagColor: 'green',
    // emoji:,
    // mentionedUser: ,
    // sending: false,
    // moduleClasses,
    // mentionParseRegex: /{{[0-9]*}}/m,
    // mentionToString: : () => {},
    // parseMentionId: () => {},
    onEmojiSet: spyEmojiSet,
    onMentionedUserSet: spyMentionedUserSet,
    onMentionMatch: spyMentionMatch,
    onMentionedUsersUpdate: spyMentionedUsersUpate,
    onValidationChange: spyValidationChange,
    onLengthChange: spyLengthChange,
    onContentChange: spyContentChange,
    onSend: spySend
  } as CoreInputProps;

  xtest('should render input with line color and with custom classes', () => {
    render(<CoreInput {...props} moduleClasses={{ input: 'hashclass' }} />);
    // screen.debug();
    screen.getByRole('textbox', { name: 'advanced comment input' });
    // input container should have brown bottom border
    const container = screen.getByTestId('core-input-container');
    expect(container.style.borderBottomColor).toBe('blue');
  });

  xtest('should callback content and content length on user input', () => {
    render(<CoreInput {...props} />);
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });

    const typing = 'Hello World';
    fireEvent.input(input, {
      target: { textContent: 'H' }
    });

    // input should be invalid for minLength = 2
    expect(spyValidationChange).toHaveBeenCalledWith(false);

    fireEvent.input(input, {
      target: { textContent: typing }
    });

    expect(spyLengthChange).toHaveBeenCalledWith(typing.length);
    expect(spyContentChange).toHaveBeenCalledWith(typing);

    // input should be valid for a content length > 2
    expect(spyValidationChange).toHaveBeenCalledWith(true);
  });

  xtest('input should block user typing once it reaches maxLength', async () => {
    const user = userEvent.setup();
    render(<CoreInput {...props} maxLength={40} />);
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });

    const typing = 'The quick brown fox jumps over the lazy dog';
    await user.click(input);
    await act(async() => await user.keyboard(typing));

    // input should only contain the first 40 chars ([The ... lazy ])
    expect(input.textContent).toBe(typing.slice(0, 40));
  });

  xtest('user writes full comment with text, 2 Mentions, 2 Emojis and 2 new lines', async () => {
    const user = userEvent.setup();

    let content : string = '';
    const newProps = {
      ...props,
      onContentChange: (cnt : string) => content = cnt,
    }
    const { rerender } = render(<CoreInput {...newProps} />);

    const input = screen.getByRole('textbox', { name: 'advanced comment input' });

    await user.click(input);
    // 1- typing with mention match
    const typing1 = 'Hey @keit';
    await act(async() => await user.keyboard(typing1));
    // 2- mention KeitelDOG (users index : 1)
    rerender(<CoreInput {...newProps} mentionedUser={users[1]} />);
    expect(spyMentionedUserSet).toHaveBeenCalledTimes(1);
    // 3- typing
    const typing2 = 'well done ';
    await act(async() => await user.keyboard(typing2));
    // 4- emoji
    const emoji1 = '😃';
    rerender(<CoreInput {...newProps} emoji={emoji1} />);
    expect(spyEmojiSet).toHaveBeenCalledTimes(1);

    // 5 typing
    document.execCommand = jest.fn().mockImplementation(async () => {
      await user.keyboard('\n');
    });
    const typing3 = '.[Enter][Enter]';
    await act(async() => await user.keyboard(typing3));
    // 6- Enter twice
    expect(document.execCommand).toHaveBeenCalledWith('insertLineBreak');
    // simulate the 2 new lines

    // 7- typing
    const typing4 = 'I like the new App you made ';
    await act(async() => await user.keyboard(typing4));

    // 8- mention Julio (users index : 2)
    rerender(<CoreInput {...newProps} mentionedUser={users[2]} />);
    expect(spyMentionedUserSet).toHaveBeenCalledTimes(2);

    // 9- emoji
    const emoji2 = '👍';
    rerender(<CoreInput {...newProps} emoji={emoji2} />);
    expect(spyEmojiSet).toHaveBeenCalledTimes(2);

    // 10- typing
    const typing5 = ', pretty nice.';
    await act(async() => await user.keyboard(typing5));

    // content is same as comment
    expect(content).toBe(comment);

    // send comment, pass sending props to true
    rerender(<CoreInput {...newProps} sending={true} />);
    expect(spySend).toHaveBeenCalledWith(comment);
  });

  xtest('user edits a comment and send it', async () => {
    const user = userEvent.setup();
    let content: string = '';
    const { rerender } = render(
      <CoreInput
        {...props}
        initialValue={comment}
        initialMentionedUsers={[users[1], users[2]]}
        onContentChange={(cnt: string) => {
          content = cnt;
        }}
      />
    );
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });

    // mentioned users tags should be there
    screen.getByRole('mark', { name: `${users[1].name} mentioned` });
    screen.getByRole('mark', { name: `${users[2].name} mentioned` });

    // the input content should be the same as the initial comment passed
    expect(content).toBe(comment);

    // put caret at the end
    input.setAttribute('data-caretstart', '84');
    input.setAttribute('data-caretend', '84');
    await user.click(input);
    // typing: change "...pretty nice." to "...pretty nice brother"
    await act(async() => await user.keyboard('[Backspace] brother.'));
    const edited = `${comment.slice(0, -1)} brother.`;
    expect(content).toBe(edited);

    // send edited comment, pass sending props to true
    rerender(<CoreInput {...props} sending={true} />);
    expect(spySend).toHaveBeenCalledWith(edited);
  });

  xtest('should use custom functions and regex to convert and parse mentioned user id', async () => {
    const customComment = 'Hey [**2**] well done 😃.\n\nI like the new App you made [**3**] 👍, pretty nice.';

    const mentionToString = (id: number | string) : string => {
      return `[**${id}**]`;
    }
    const parseMentionId = (stringWithID: string) : number | string => {
      const id : string = stringWithID.slice(3, -3);
      return isNaN(parseInt(id)) ? id : Number(id);
    }
    const mentionParseRegex = /\[\*\*[0-9]*\*\*]/m;

    let content: string = '';
    render(
      <CoreInput
        {...props}
        initialValue={customComment}
        initialMentionedUsers={[users[1], users[2]]}
        onContentChange={(cnt: string) => {
          content = cnt;
        }}
        mentionToString={mentionToString}
        parseMentionId={parseMentionId}
        mentionParseRegex={mentionParseRegex}
      />
    );

    // 2 mentions should be there
    screen.getByRole('mark', { name: `${users[1].name} mentioned`});
    screen.getByRole('mark', { name: `${users[2].name} mentioned`});

    // the input content shoulds be the same as the initial custom comment passed
    expect(content).toBe(customComment);
  });

  test('user writes text, mention a user and delete that mention', async () => {
    const user = userEvent.setup();

    let content : string = '';
    const newProps = {
      ...props,
      onContentChange: (cnt : string) => content = cnt,
    }
    const { rerender } = render(<CoreInput {...newProps} />);
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });

    await user.click(input);
    // typing with mention match
    await act(async() => await user.keyboard('Hey @keit'));
    // mention KeitelDOG (users index : 1)
    rerender(<CoreInput {...newProps} mentionedUser={users[1]} />);
    screen.getByRole('mark', { name: `${users[1].name} mentioned` });
    expect(content).toBe('Hey {{2}} ');

    // delete mention tag
    await act(async() => await user.keyboard('[Backspace]'));
    const mark = screen.queryByRole('mark', { name: `${users[1].name} mentioned` });
    expect(mark).toBeNull();
    expect(content).toBe('Hey ');
  });
});