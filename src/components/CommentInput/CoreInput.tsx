import React, { ForwardedRef, useEffect } from 'react';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './CoreInput.module.css';
import { User } from '../Mentions/Mentions';
import helper, { ContentPart } from './helper';

export type BaseInputProps = {
  /** Array of users to match against @ mention and filter while typing.
   * @default []
   */
  users?: User[],

  /** Minimum characters allowing to validate the input.
   * @default 1
   */
  minLength?: number,

  /** Maximum characters allowing to validate and block the input. 0 for no limit.
   * @default 0
  */
  maxLength?: number,

  /** Pass an initial text value in the input to be displayed. Useful if User want to Edit a comment.
   * @default
   */
  initialValue?: string,

  /** Initial list of Users mentioned in the initial value. Only use with initialValue prop if it contains Users.
   * @default []
  */
  initialMentionedUsers?: User[],

  /** How many users can be mentioned in the comments. 0 is for no limit.
   * @default 2
  */
  mentionsLimit?: number,

  /** Bottom line color for personalisation to match your Application theme.
   * @default #ccc in css
  */
  lineColor?: string,

  /** Color to highlight the tag for mentioned users.
   * @default #358856
  */
  tagColor?: string,

  /** When passing an initialValue, you can provide a regular expression to retrieve the mention expressions containing the User ID if any. The regex should only match the first occurence, the algorithm will split and retrieve them recursively.
   *
   *  N.B. **A Default RegExp is already provided**
   * @default '/{{[0-9]*}}/m',
   */
  mentionParseRegex?: RegExp,

  /** Implementation to convert mention tag to unique string that identifies the user in the comment.
   *
   *  N.B. **A Default Implementation is already provided**.
   *
   *  It is important to transform each tag in string to make the counting in total text length. For example, if User(10) is Keitel Jovin:
   *
   * `<div>Hello <span data-id="10">Keitel Jovin</span>` will be transfom to "Hello {{10}}". with `mentionToString(10); // => {{10}}`
   *
   *  And "Hello {{10}}" will be only 12 chars, instead of 18 chars in "Hello Keitel Jovin" provided by the HTML Div input. An example of algorithm:
   * ```
   * mentionToString = (id: number | string) : string => {
   *   return `{{${id}}}`;
   * }
   * ```
  */
  mentionToString?(id : number | string) : string,

  /** Implementation to parse the mention string to ID value.
   *
   *  N.B. **A Default Implementation is already provided**.
   *
   *  When editing, an initial value can be passed. If that value contains mentions, like: `Hello {{10}} and {{747}}.`
   *  You provide a regex like /{{[0-9]*}}/m and a match is found: {{10}}. Now you need a function to tell the input how to retrieve the ID in it.
   */
  parseMentionId?(stringWithID : string) : number | string,

  /** Callback on each input and change to track the length of comment outside the component */
  onLengthChange?(length: number) : void,

  /** Callback on each input and change to track the whole content outside the component. Might be heavy if text is huge. */
  onContentChange?(content: string) : void,

  /** Callback on sending the Content back to parent */
  onSend(content: string) : void,
}

export type CoreInputProps = BaseInputProps & {
  /** Pass an Emoji string here to be added in the current carret position. It will call the onEmojiSet callback. */
  emoji?: string,

  /** Pass a User here to be added as mentioned User in the current carret position. It will call the onMentionedUserSet callback */
  mentionedUser?: User,

  /** Tell the input to transform and send the content back via onSend callback. When not using onContentChange callback for typing performance, only onLengthChange is called. Therefore you can pass `sending={true}` at the end to get the content for you.
  * @default false
  */
  sending?: boolean,

  /** A Class Module to provide to override some classes of the default Class Modules.
   * classes: `editableContainer, input`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },

  /** Callback when the passed Emoji string has been inserted */
  onEmojiSet() : void,

  /** Callback when the passed User has been inserted for mention */
  onMentionedUserSet() : void,

  /** Callback when the @ typing is matching some users */
  onMentionMatch?(users: User[]) : void,

  /** Callback when the mentioned Users list is changed in the input */
  onMentionedUsersUpdate(ids: (number | string)[]) : void,

  /**  Callback with true when content is between minLength and maxLength, and with false when content is out of range */
  onValidationChange?(isValid: boolean) : void,
};

type Caret = {
  start: number,
  end: number,
};

// No-Break Space (unicode character, equivalent to &nbsp; in HTML)
const NBSP = '\u00A0';

const mentionToStringDefault = (id: number | string) : string => {
  return `{{${id}}}`;
}

const parseMentionIdDefault = (stringWithID: string) : number | string => {
  const id : string = stringWithID.slice(2, -2);
  return isNaN(parseInt(id)) ? id : Number(id);
}

/**
 * The CoreInput and the core functionalities for the comment Input
 * based on an Editable DIV (`<div contenteditable ></div>`)
 * capable of inserting Emoji and mentioning Users in SPAN tags.
 */
export default function CoreInput(props: CoreInputProps) {
  const {
    users = [],
    minLength = 1,
    maxLength = 0,
    initialValue = '',
    initialMentionedUsers = [],
    mentionsLimit = 2,
    lineColor,
    tagColor = '#358856',
    emoji,
    mentionedUser,
    sending = false,
    moduleClasses,
    mentionParseRegex = /{{[0-9]*}}/m,
    mentionToString = mentionToStringDefault,
    parseMentionId = parseMentionIdDefault,
    onEmojiSet,
    onMentionedUserSet,
    onMentionMatch = () => {},
    onMentionedUsersUpdate,
    onValidationChange = () => {},
    onLengthChange = () => {},
    onContentChange,
    onSend,
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  // set editable
  const [initialized, setInitialized] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  const getCaretValue = () => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    const start = parseInt(editable.getAttribute('data-caretstart') as string) || 0;
    const end = parseInt(editable.getAttribute('data-caretend') as string) || 0;
    return { start, end };
  }
  const setCaretValue = (crt: Caret) => {
    // Save caret Position because we lose it when using Emoji and Mention selectors
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    editable.setAttribute('data-caretstart', crt.start.toString());
    const end = editable.setAttribute('data-caretend', crt.end.toString());
  }
  const handleContentChange = () : void => {
    // handle content change
    const content: string = getContent();
    onLengthChange(content.length);
    if (onContentChange) {
      onContentChange(content);
    }

    // validate in content is within limit
    if (content && content.length >= minLength) {
      onValidationChange(true);
    } else {
      onValidationChange(false);
    }

    // update mentions if any
    const ids = getMentionedIds();
    onMentionedUsersUpdate(ids);
  }

  const createMentionTag = (user: User) : HTMLSpanElement => {
    const tag: HTMLSpanElement = document.createElement('span');
    // Android chrome browser cannot delete SPAN when contenteditable is set to false
    // tag.setAttribute('contenteditable', false);
    // add data-id to tagged user
    tag.setAttribute('data-id', user.id.toString());
    // accessibility for reference (mark)
    tag.setAttribute('role', 'mark');
    tag.setAttribute('aria-label', `${user.name} mentioned`);
    tag.style.color = tagColor;
    tag.style.fontWeight = 'bold';
    tag.textContent = user.name;
    return tag;
  }

  const getCaretPosition = () : Caret => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    /*
    Note: Anchor and focus should not be confused with the start and end positions of a selection. The anchor can be placed before the focus or vice versa, depending on the direction you made your selection.
    https://developer.mozilla.org/en-US/docs/Web/API/Selection
    */

    // get window selection object
    const sel: Selection | null = window.getSelection();
    const cPos: Caret = { start: 0, end: 0 };

    // check each child node in editable
    for (let i = 0; i < editable.childNodes.length; i++) {
      const node = editable.childNodes[i];
      let done = false;
      // div can contain text and span for example
      // <div>Hello <span>World</span> coders!</div>
      if (!sel || !sel.anchorNode || !sel.anchorNode.parentNode) {
        continue;
      }

      if (sel.anchorNode.parentNode.nodeName === 'DIV') {
        // This is a Text Node inside main contenteditable DIV
        if (sel.anchorNode === node) {
          cPos.start += sel.anchorOffset;
          // caret start is found now, we can stop everything
          done = true;
        } else {
          cPos.start += (node.textContent as string).length;
        }

        if (sel.focusNode === node) {
          cPos.end += sel.focusOffset;
          done = true;
        } else {
          cPos.end += (node.textContent as string).length;
        }
      } else if (sel.anchorNode.parentNode.nodeName === 'SPAN') {
        // This is a Text Node inside Mention contenteditable SPAN
        if ((sel.anchorNode.parentNode as Node) === node) {
          cPos.start += sel.anchorOffset;
          // caret start is found now, we can stop everything
          done = true;
        } else {
          cPos.start += (node.textContent as string).length;
        }

        if (sel.focusNode && (sel.focusNode.parentNode as Node) === node) {
          cPos.end += sel.focusOffset;
          done = true;
        } else {
          cPos.end += (node.textContent as string).length;
        }
      }

      if (done) {
        break;
      }
    }

    // in case is user select from right to left,
    // if start position is greater than end, swap them
    if (cPos.start > cPos.end) {
      const temp = cPos.start;
      cPos.start = cPos.end;
      cPos.end = temp;
    }
    return cPos;
  };

  const setCaretPosition = (cPos : Caret) => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;

    let nodeIndex = 0;
    let childPos = cPos.start;
    for (let i = 0; i < editable.childNodes.length; i++) {
      const node = editable.childNodes[i];
      // div can contain text and span for example
      // <div>Hello <span>World</span> coders!</div>
      if (childPos <= (node.textContent as string).length) {
        nodeIndex = i;
        break;
      }
      childPos -= (node.textContent as string).length;
    }

    const range = document.createRange();
    const sel = window.getSelection() as Selection;
    try {
      range.setStart(editable.childNodes[nodeIndex], childPos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (ex) {
      console.log('error setting caret position', ex);
    }
  };

  const compactEditableNodes = () => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    // Compact nodes, Concatenate all adjacent Text Node
    const nodes : ChildNode[] = [];
    const childNodes = Array.from(editable.childNodes);
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];

      if (node.nodeName === 'SPAN') {
        nodes.push(node);
        continue;
      } else if (node.nodeName === 'DIV') {
        // TODO: document.execCommand is DEPRECATED
        // In the future, manually add them, because in normal behavior
        // browser ad <div><br></div> for new line
        // use it with keyup event
        // nodes.push(document.createElement('br'));
        // nodes.push(document.createElement('br'));
      } else if (node.nodeName === 'BR') {
        nodes.push(document.createElement('br'));
        continue;
      } else if (node.nodeName === '#text') {
        // on empty text node
        if (node.textContent === '') {
          // remove first empty string
          if (i === 0) {
            continue;
          }
          // if last pushed node is SPAN then keep last empty text node
          if (
            nodes[nodes.length - 1] &&
            nodes[nodes.length - 1].nodeName === 'SPAN' &&
            i === childNodes.length - 1
          ) {
            nodes.push(node);
            continue;
          }
        }

        // concatenate Text Node with previous Text Node
        if (
          nodes[i - 1] &&
          nodes[i - 1].nodeName === '#text'
        ) {
          // concatenate
          (nodes[i - 1].textContent as string) += node.textContent;
          continue;
        }

        nodes.push(node);
      }
    }

    editable.innerHTML = '';
    nodes.forEach((node, index) => {
      if (node.nodeName === 'SPAN') {
        editable.append(node);
        // if last node is a SPAN, add an empty text after it
        if (index === nodes.length - 1) {
          editable.append('');
        }
      } else if (node.nodeName === 'BR') {
        // do not add br if only 1 <br> tag is at the end
        // do not count last BR tag cause browser add 2 <br>
        // when pressing enter for new line if it's at the end
        // <div>Hello <span>Keitel</span><br><br></div>
        if (index !== nodes.length - 1) {
          editable.append(node);
        }
      } else if (node.nodeName === '#text') {
        // if it's text, if text node after is a BR, convert spaces to NBSP
        let convertTrailingSpace = false;
        const nextNode = nodes[index + 1];
        if (nextNode && nextNode.nodeName === 'BR') {
          convertTrailingSpace = true;
        }

        // if it's the last node, convert space to NBSP
        if (index === nodes.length - 1) {
          convertTrailingSpace = true;
        }

        const cnt = node.textContent as string;
        if (convertTrailingSpace) {
          editable.append(cnt.replace(/\s+$/, NBSP));
        } else {
          editable.append(cnt);
        }
      } else {
        console.log('Compacting: we did not expect this browser behavior on contenteditable DIV for the node:', node);
      }
    });
  };

  const getNodeIndexAndChildPos = (match? : string) => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    const crt = getCaretPosition();
    let childPos = crt.start;
    let nodeIndex = 0;

    for (let i = 0; i < editable.childNodes.length; i++) {
      const node = editable.childNodes[i];
      // div can contain text and span for example
      // <div>Hello <span>World</span> coders!</div>

      // if there is a match, then automatically use current positions
      if (
        node.nodeName === '#text' &&
        match &&
        (node.textContent as string).includes(match)
      ) {
        nodeIndex = i;
        break;
      }

      if (childPos <= (node.textContent as string).length) {
        nodeIndex = i;
        break;
      }
      childPos -= (node.textContent as string).length;
    }

    return [nodeIndex, childPos];
  };

  const getMentionedIds = () : (number | string)[] => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    let ids : number[] = [];
    Array.from(editable.childNodes).forEach((node : ChildNode) => {
      if (node.nodeName === 'SPAN') {
        const nodeElem = (node as HTMLSpanElement);
        const id = Number(nodeElem.getAttribute('data-id'));
        ids.push(id);
      }
    });
    return ids;
  };

  const getContent = () : string => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    const contents = Array.from(editable.childNodes).map((node : ChildNode, index) => {
      if (node.nodeName === 'SPAN') {
        const nodeElem = (node as HTMLSpanElement);
        const id = nodeElem.getAttribute('data-id') as string;
        return mentionToString(id);
      } else if (node.nodeName === 'BR') {
        // do not count last BR tag cause browser add 2 <br>
        // when pressing enter for new line if it's at the end
        // <div>Hello <span>Keitel</span><br><br></div>
        if (index !== editable.childNodes.length - 1) {
          return '\n';
        }
      } else if ((node.textContent as string).includes(NBSP)) {
        return (node.textContent as string)?.split(NBSP).join(' ');
      }
      return node.textContent
    });

    return contents.join('');
  };

  React.useEffect(() => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    if (initialValue && initialValue.length) {
      const parts : ContentPart[] = helper.formatContent(
        initialValue,
        initialMentionedUsers,
        mentionParseRegex,
        parseMentionId
      );

      parts.forEach((part : ContentPart) => {
        if (part.type === 'text') {
          // check for new line
          const textContent : string = part.data as string;
          const lines : string[] = textContent.split(/\r\n|\r|\n/);
          lines.forEach((line: string, ind: number) => {
            const text = document.createTextNode(line);
            editable.append(text);

            // add BR tag if not the last line
            if (ind !== lines.length - 1) {
              const br = document.createElement('br');
              editable.append(br);
            }
          })

        } else if (part.type === 'mention') {
          const usr: User = part.data as User;
          const tag = createMentionTag(usr);
          editable.append(tag);
        }
      });

      // update content
      handleContentChange();
    }
  }, []);

  React.useEffect(() => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    // EVENT LISTENERS ARE SET ONLY ONCE
    if (!initialized) {
      // plaintext-only browser support: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable
      // editable.setAttribute('contenteditable', 'plaintext-only');
      editable.setAttribute('contenteditable', 'true');
      editable.addEventListener('focus', function () {
        this.style.outline = '0px solid transparent';
      });

      // ON KEYDOWN ------------------------------
      const onKeydown = (event: KeyboardEvent) => {
        const editable: HTMLDivElement = ref.current as HTMLDivElement;
        // trap the return key being pressed
        if (event.key === 'Enter') {
          document.execCommand('insertLineBreak');
          event.preventDefault();
        }

        if (event.key === 'Backspace') {
          // allow delete after reaching limit
          return true;
        }

        const val = (event.target as HTMLDivElement).textContent;
        if (val && maxLength > 0 && val.length === maxLength) {
          // BREAK AND STOP
          event.preventDefault();
          return false;
        }
      };
      editable.addEventListener('keydown', onKeydown);

      // ON CLICK ----
      const onClick = () => {
        const crt = getCaretPosition();
        setCaretValue(crt);
      };
      editable.addEventListener('click', onClick);

      // ON INPUT ----
      const onInput = (event: Event) => {
        const val = (event.target as HTMLDivElement).textContent as string;
        handleContentChange();

        const crt = getCaretPosition();

        const mentionedIds = getMentionedIds();

        // 1- CHECK if SPAN mention tag is edited. If yes, delete it
        var sel = window.getSelection();
        if (sel && sel.anchorNode && mentionedIds.length) {
          // verify if caret is in position inside span mention
          let [nodeIndex,] = getNodeIndexAndChildPos();
          if (editable.childNodes[nodeIndex].nodeName === 'SPAN') {
            const span = editable.childNodes[nodeIndex] as HTMLSpanElement;
            if (span.getAttribute('data-id')) {
              // span mention has been edited, then delete it
              let length = (span.textContent as string).length;
              editable.removeChild(span);
              // compact to avoid browser engine to create
              // a FONT tag in place of deleted SPAN tag
              compactEditableNodes();

              const newCrt = {
                start: crt.start - length,
                end: crt.start - length,
              };
              setCaretPosition(newCrt);
              setCaretValue(newCrt);

              const ids = getMentionedIds();
              onMentionedUsersUpdate(ids);
              handleContentChange();
              return;
            }
          }
        }

        // 2- CHECK ANOMALITIES
        // FONT anomaly: after mention is deleted, next input creates a FONT tag by browser engine
        const nodes : ChildNode[] = [];
        const childNodes = Array.from(editable.childNodes);
        let anomalies = 0;
        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i];
          if (node.nodeName === 'FONT') {
            anomalies += 1;
            // replace font by node text
            nodes.push(document.createTextNode(node.textContent as string));
          } else {
            nodes.push(node);
          }
        }

        if (anomalies) {
          editable.innerHTML = '';
          for (let i = 0; i < nodes.length; i++) {
            editable.append(nodes[i]);
          }

          // put caret back if that happens
          const savedCrt = getCaretValue();
          const newCrt = {
            start: savedCrt.start + 1,
            end: savedCrt.end + 1,
          }
          setCaretPosition(newCrt);
          setCaretValue(newCrt);
        } else {
          // if no anomality detected, save the caret value
          setCaretValue(crt);
        }

        // 3- CHECK MENTION
        if (mentionsLimit > 0 && mentionedIds.length === mentionsLimit) {
          // Skip after mentions limit
          return;
        }

        // typing match for mentioning user
        const matches = val.match(/@[a-zA-Z0-9-.]+/gm);
        if (matches) {
          if ((matches || []).length !== 1) {
            onMentionMatch([]);
            return;
          }

          const mentionTexting = matches[0].split('@').join('');
          // filter users for tag
          const filtered = users.filter(user => {
            // compare name by removing space
            const name = user.name.split(' ').join('').toLowerCase();
            return (
              name.startsWith(mentionTexting.toLowerCase()) &&
              !mentionedIds.includes(user.id)
            );
          });

          onMentionMatch(filtered);
        } else {
          onMentionMatch([]);
        }
      };
      editable.addEventListener('input', onInput);

      // Initialize it avoid code to repeat twice and more
      setInitialized(true);
    }
  }, [
    initialized,
    users,
    getCaretPosition,
    compactEditableNodes,
  ]);

  React.useEffect(() => {
    /*
    https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart

    If the startNode is a Node of type Text, Comment, or CDataSection, then startOffset is the number of characters from the start of startNode. For other Node types, startOffset is the number of child nodes between the start of the startNode.
    */
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    if (mentionedUser) {
      editable.focus();

      const mentionedIds = getMentionedIds();
      if (mentionsLimit > 0 && mentionedIds.length >= mentionsLimit) {
        // Skip after mentions limit
        return;
      }

      // if there is no child node while inserting element,
      // append empty string to create new node for range
      if (!editable.childNodes.length) {
        editable.append('');
      }

      // put caret back
      const caret = getCaretValue();
      if (caret) {
        setCaretPosition(caret);
      }

      // insert mentioned user
      const content = editable.textContent as string;
      // const matches = content.match(/@[\w-]+/gm);
      const matches = content.match(/@[a-zA-Z0-9-.]+/gm);
      const match = (matches || [])[0] as string;

      // 1- Create tag span HTML
      // let tag = document.createElement('span');
      const tag = createMentionTag(mentionedUser);

      let rg = document.createRange();
      let sel = window.getSelection() as Selection;
      rg.collapse(true);

      // if the first node is span and caret position is zero
      // then add an empty text node at the beginning to insert element
      const crt = getCaretPosition();
      if (
        crt.start === 0 &&
        editable.childNodes[0] &&
        editable.childNodes[0].nodeName === 'SPAN'
      ) {
        editable.prepend('');
      }

      let [nodeIndex, childPos] = getNodeIndexAndChildPos(match);

      if (match) {
        // handle match with range on start and end of matching string
        let textNode = editable.childNodes[nodeIndex];
        let val = textNode.textContent as string;
        rg.setStart(textNode, val.indexOf(match));
        rg.setEnd(textNode, val.indexOf(match) + match.length);
        sel.removeAllRanges();
        sel.addRange(rg);
        rg.deleteContents();
        rg.insertNode(tag);
      } else {
        rg.setStart(editable.childNodes[nodeIndex], childPos);
        rg.setEnd(editable.childNodes[nodeIndex], childPos);
        sel.removeAllRanges();
        sel.addRange(rg);
        rg.insertNode(tag);
      }

      // Concatenate all adjacent Text Node
      compactEditableNodes();

      try {
        // IMPORTANT: When inserting a Tag after a TextNode,
        // there will be 2 nodes ahead to place the cursor
        // Example:
        // - Current: [span, text] => [span, ' and ']
        //   (we insert from nodeIndex 1)
        // - Inserted : [span, text, span, text] => [span, ' and ', span, '']
        //   (we must find the nodeIndex + 2 node to insert the space
        let newIndex;
        if (editable.childNodes[nodeIndex].nodeName === '#text') {
          // from text node, go to nodeIndex + 2
          newIndex = nodeIndex + 2;
        } else {
          newIndex = nodeIndex + 1;
        }

        if (editable.childNodes[newIndex]) {
          const node = editable.childNodes[newIndex];
          if (node.nodeName === '#text' && (node.textContent as string)[0] !== ' ') {
            // add no-break space before text content
            const nbspContent = NBSP + node.textContent;
            node.textContent = nbspContent;
          }

          // Now put Caret position in its new tracked place.
          // Caret remains at the same position as above
          // PLUS (+) the new element text length + 1
          // (MINUS (-) the match text length if there was a match)
          rg.setStart(node, 1);
          rg.setEnd(node, 1);
          sel.removeAllRanges();
          sel.addRange(rg);
        }

      } catch (ex) {
        console.log('error inserting mentioned user', ex);
      }

      onMentionMatch([]);
      const ids = getMentionedIds();
      onMentionedUserSet();
      onMentionedUsersUpdate(ids);

      const newCrt = getCaretPosition();
      setCaretValue(newCrt);

      // update content
      handleContentChange();
    }
  }, [mentionedUser]);

  React.useEffect(() => {
    const editable: HTMLDivElement = ref.current as HTMLDivElement;
    if (emoji) {
      editable.focus();
      // if there is no child node while inserting element,
      // append empty string to create new node for range
      if (!editable.childNodes.length) {
        editable.append('');
      }
      // put caret back
      const caret = getCaretValue();
      if (caret) {
        setCaretPosition(caret);
      }

      let rg = document.createRange();
      let sel = window.getSelection() as Selection;
      rg.collapse(true);

      // if the first node is span and caret position is zero
      // then add an empty text node at the beginning to insert element
      const crt = getCaretPosition();
      if (
        crt.start === 0 &&
        editable.childNodes[0] &&
        editable.childNodes[0].nodeType === 1
      ) {
        editable.prepend('');
      }

      let [nodeIndex, childPos] = getNodeIndexAndChildPos();

      const element = document.createTextNode(emoji);

      rg.setStart(editable.childNodes[nodeIndex], childPos);
      rg.setEnd(editable.childNodes[nodeIndex], childPos);
      sel.removeAllRanges();
      sel.addRange(rg);
      rg.insertNode(element);

      // Concatenate all adjacent Text Node
      compactEditableNodes();

      try {
        // now put Caret position in its tracked place
        rg.setStart(editable.childNodes[nodeIndex], childPos + emoji.length);
        rg.setEnd(editable.childNodes[nodeIndex], childPos + emoji.length);
        sel.removeAllRanges();
        sel.addRange(rg);
      } catch (ex) {
        console.log('error inserting emoji', ex);
      }
      onEmojiSet();
      const newCrt = getCaretPosition();
      setCaretValue(newCrt);

      // update content
      handleContentChange();
    }
  }, [emoji]);

  useEffect(() => {
    if (sending) {
      const cnt = getContent();
      onSend(cnt);
    }
  }, [sending]);

  return (
    <div
      data-testid="core-input-container"
      data-class="editableContainer"
      className={classes.editableContainer}
      style={{ borderBottomColor: lineColor }}
    >
      <div
        ref={ref}
        role="textbox"
        aria-label="advanced comment input"
        aria-readonly="false"
        tabIndex={0}
        data-caretstart="0"
        data-caretend="0"
        data-class="input"
        className={classes.input}
      />
    </div>
  );
}
