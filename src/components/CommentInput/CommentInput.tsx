import React, { ReactNode } from 'react';

import CoreInput from './CoreInput';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './CommentInput.module.css';
import EmojiIcon from '../../svg/Emoticon';
import AtIcon from '../../svg/At';
import { BaseInputProps } from './CoreInput';
import { User } from '../Mentions/Mentions';

export type RenderEmojiPickerProps = {
  /** provide a Callback passing the Emoji Character when Emoji is selected */
  onEmojiSelected(emojiChar : string) : void,
  onClose() : void,
}

export type RenderMentionsProps = {
  users: User[],
  /** provide a Callback passing the User id when a User is mentioned */
  onMentionSelected(id: number | string) : void,
  onClose() : void
};

type CommentInputProps = BaseInputProps & {
  /** authenticated user info if any */
  auth?: User,

  /** Start showing Countdown counter from and below a certain number (including) */
  showCounterAt: number,

  /** 4 colors to vary the color of the text length progression */
  textProgressColors?: { [key in 'one' | 'two' | 'three' | 'four']: string },

  /** Block input from receiving new character when maxLength is reached */
  blockInputOnMaxLength?: boolean,

  /**
   * Render the User mention list if needed. You can use internal Mentions component, or use your own component. Usage:
   * ```
   * <CommentInput
   *   renderMentions={({ users, onMenionSelected, onClose }) => (
   *     <Mentions
   *       users={users}
   *       onClose={onClose}
   *       onMentionSelected={onMentionSelected}
   *     />
   *   )}
   * />
   * ```
  */
  renderMentions?(props: RenderMentionsProps) : React.ReactNode,

  /**
   * Render the EmojiPicker if needed. You can use internal EmojiPicker component, or use your own component. Usage:
   * ```
   * <CommentInput
   *   renderEmojiPicker={({ onEmojiSelected, onClose }) => (
   *     <EmojiPicker
   *       emojis={emojis}
   *       height={280}
   *       numColumns={8}
   *       initialCategory="emotion"
   *       onClose={onClose}
   *       onEmojiSelected={onEmojiSelected}
   *     />
   *   )}
   * />
   * ```
  */
  renderEmojiPicker?(props: RenderEmojiPickerProps) : React.ReactNode,

  /** Render the Mentions list at default position, which is absolute on top. If not you will provide your own custom styles to display it */
  renderMentionsInDefaultPosition?: boolean,

  /** Render the Picker list at default position, at bottom. If not you will provide your own custom styles to display it */
  renderEmojiPickerInDefaultDisplay?: boolean,

  /** Render Authenticated User Avatar in needed. */
  renderAvatar?: React.ReactNode,

  /** Render the Icon responsible to open the EmojiPicker if needed. An Icon is rendered by default. */
  renderEmojiIcon?: React.ReactNode,

  /** Render the Icon responsible to open the Mentions list if needed. An Icon is rendered by default. */
  renderAtIcon?: React.ReactNode,

  /** Render a Submit Button Avatar in needed. A button is rendered by default */
  renderSubmitButton?: React.ReactNode,

  /** Custom Text that should appear in Submit Button. Default: 'Send' */
  submitButtonText?: string,

  /** Custom Color of the Submit Button. Default: some green color */
  submitButtonColor?: string,

  /** Should the submit button be disabled no matter what? */
  forceDisableSubmitButton?: boolean,

  /** Color of icon that open the Mentions list */
  atIconColor?: string,

  /** Color of icon that open the Mentions list */
  emojiIconColor?: string,

  /** Callback when the Emoji Picker is open */
  onEmojiOpen?() : void,

  /** Callback when the Emoji Picker is close */
  onEmojiClose?() : void,

  /** Callback when the Mentions list is open */
  onMentionsOpen?() : void,

  /** Callback when the Mentions list is close */
  onMentionsClose?() : void,
};

const colors = { one: '#358856', two: '#fbbf07', three: '#cc701e', four: '#e82c2f' };

export default function CommentInput(props : CommentInputProps) {
  const {
    users = [],
    minLength = 1,
    maxLength = 0,
    initialValue = '',
    initialMentionedUsers = [],
    showCounterAt = 30,
    textProgressColors = colors,
    blockInputOnMaxLength = false,
    mentionsLimit = 2,
    renderMentions,
    renderEmojiPicker,
    renderMentionsInDefaultPosition = false,
    renderEmojiPickerInDefaultDisplay = false,
    renderAvatar,
    renderEmojiIcon,
    renderAtIcon,
    renderSubmitButton,
    submitButtonText = 'Send',
    submitButtonColor = colors.one,
    forceDisableSubmitButton = false,
    lineColor,
    tagColor = colors.one,
    atIconColor = '#cc701e',
    emojiIconColor = '#fbbf07',
    moduleClasses,
    onEmojiOpen = () => {},
    onEmojiClose = () => {},
    onMentionsOpen = () => {},
    onMentionsClose = () => {},
    onContentChange,
    onSend = () => {},
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  const [mentionedUser, setMentionedUser] = React.useState<User>();
  const [mentionUsers, setMentionUsers] = React.useState<User[]>([]);
  const [mentionedIds, setMentionedIds] = React.useState<(number | string)[]>([]);
  const [enableSubmit, setEnableSubmit] = React.useState<boolean>(false);
  const [showEmoji, setShowEmoji] = React.useState<boolean>(false);
  const [emoji, setEmoji] = React.useState<string>();
  // sending mechanism is a way to tell CoreInput to throw out the content for for
  const [content, setContent] = React.useState<string>(initialValue);
  const [sending, setSending] = React.useState<boolean>(false);

  let mentionView : ReactNode;
  let atView : ReactNode;
  if (renderMentions) {
    mentionView = renderMentions({
      users: mentionUsers,
      onMentionSelected: (id : number | string) => {
        const usr : User = mentionUsers.filter(u => u.id === id)[0];
        setMentionedUser(usr);
      },
      onClose: () => {
        setMentionUsers([]);
        onMentionsClose();
      }
    });

    if (renderAtIcon) {
      atView = renderAtIcon;
    } else {
      atView = (
        <AtIcon
          height={24}
          width={24}
          color={mentionedIds.length >= mentionsLimit ? '#ccc' : atIconColor}
        />
      );
    }
  }

  if (renderMentionsInDefaultPosition) {
    mentionView = (
      <div className={classes.mentionsContainer}>
        {mentionView}
      </div>
    );
  }

  let emojiPickerView : ReactNode;
  let emoticonView : ReactNode;
  if (renderEmojiPicker) {
    emojiPickerView = renderEmojiPicker({
      onEmojiSelected: (emojiChar : string) => {
        setEmoji(emojiChar);
      },
      onClose: () => {
        setShowEmoji(false);
        onEmojiClose();
      },
    });

    if (renderEmojiIcon) {
      emoticonView = renderEmojiIcon;
    } else {
      emoticonView = (
        <EmojiIcon height={24} width={24} fill={emojiIconColor} />
      );
    }
  }

  if (renderEmojiPickerInDefaultDisplay) {
    emojiPickerView = (
      <div className={classes.emojiPickerContainer}>
        {emojiPickerView}
      </div>
    );
  }

  // Calculations for text and color progress, submit button status
  const charsRemained = maxLength - content.length;
  const submitDisabled = forceDisableSubmitButton || !enableSubmit || charsRemained < 0;

  const percent = Math.floor(100 * (content.length / maxLength));
  let progressColor;
  if (percent >= 100) {
    progressColor = textProgressColors.four;
  } else if (percent >= 80) {
    progressColor = textProgressColors.three;
  } else if (percent >= 60) {
    progressColor = textProgressColors.two;
  } else {
    progressColor = textProgressColors.one
  }

  return (
    <div id="react-advanced-comment">
      <div className={classes.userInputComment}>
        <div className={classes.authWrapper}>
          {renderAvatar}
        </div>

        <div className={classes.inputWrapper} style={{ borderColor: lineColor }}>
          {Boolean(mentionUsers.length) && (
            mentionView
          )}

          <CoreInput
            users={renderMentions ? users : []}
            minLength={minLength}
            maxLength={blockInputOnMaxLength ? maxLength : 0 }
            initialValue={initialValue}
            initialMentionedUsers={initialMentionedUsers}
            mentionsLimit={mentionsLimit}
            lineColor={lineColor}
            tagColor={tagColor}
            emoji={emoji}
            mentionedUser={mentionedUser}
            onEmojiSet={() => setEmoji(undefined)}
            onMentionedUserSet={() => setMentionedUser(undefined)}
            onMentionMatch={(usrs: User[]) => {
              setMentionUsers(usrs);
            }}
            onMentionedUsersUpdate={(ids: number[]) => {
              setMentionedIds(ids);
            }}
            onValidationChange={(val: boolean) => setEnableSubmit(val)}
            onContentChange={(cnt: string) => {
              if (onContentChange) {
                onContentChange(cnt);
              }
              setContent(cnt);
            }}
            sending={sending}
            onSend={(cnt: string) => {
              setSending(false);
              onSend(cnt);
            }}
          />

          <div className={classes.editableTools}>
            <div className={classes.toolsLeftSection}>
              {Boolean(emoticonView) && (
                <div
                  className={classes.toolClickable}
                  onClick={() => {
                    if (!showEmoji) {
                      setMentionUsers([]);
                      setShowEmoji(true);
                      onEmojiOpen();
                    } else {
                      setShowEmoji(false);
                      onEmojiClose();
                    }
                  }}>
                  {emoticonView}
                </div>
              )}

              {Boolean(atView) && (
                <div
                  className={classes.toolClickable}
                  style={{ cursor: mentionedIds.length >= mentionsLimit ? 'auto' : 'pointer' }}
                  onClick={() => {
                    if (mentionUsers.length) {
                      // close if already opened
                      setMentionUsers([]);
                    } else {
                      // skip if there is already 2 mentions
                      if (mentionedIds.length >= mentionsLimit) {
                        return;
                      }
                      setShowEmoji(false);
                      setMentionUsers(
                        users.filter(u => !mentionedIds.includes(u.id)),
                      );
                      setMentionUsers(users);
                      onMentionsOpen();
                      onEmojiClose();
                    }
                  }}>
                  {atView}
                </div>
              )}
            </div>

            <div className={classes.toolsRightSection}>
              {maxLength && (
                <div className={classes.tool}>
                  <div
                    className={classes.textProgress}
                    style={{
                      background: `radial-gradient(closest-side, white 75%, transparent 85% 100%),
                      conic-gradient(${progressColor} ${percent}%, #ddd 0)`,
                    }}
                  >
                    <span
                      className={classes.textCounter}
                      style={{ color: progressColor }}
                    >
                      {charsRemained <= showCounterAt ? charsRemained : ''}
                    </span>
                  </div>
                </div>
              )}

              <div
                id="submit-wrapper"
                onClick={() => {
                  if (onContentChange) {
                    // content is already available in State
                    onSend(content);
                  } else {
                    // content will be sent back after passing sending state to true
                    setSending(true);
                  }
                }}
              >
                {renderSubmitButton ? (
                  renderSubmitButton
                ) : (
                  <button
                    data-test-id="submit-button"
                    className={classes.submit}
                    style={{
                      backgroundColor: submitDisabled ? '#ccc' : submitButtonColor,
                      cursor: submitDisabled ? 'auto' : 'pointer',
                    }}
                    disabled={submitDisabled}
                  >
                    {submitButtonText}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {showEmoji && (
        emojiPickerView
      )}
    </div>
  );
}
