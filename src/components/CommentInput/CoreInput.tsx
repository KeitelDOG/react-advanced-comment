import React, { ForwardedRef, useEffect } from 'react';
import { User } from '../Mentions/index.types';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './CoreInput.module.css';

export type CoreInputProps = {
  /** Array of users to match against @ mention and filter while typing */
  users?: User[],
  /** Minimum characters allowing to send the comment. Default is 0. */
  minLength?: number,
  /** Maximum characters before blocking the input. Default is 0 for no limit */
  maxLength?: number,
  /** How many users can be mentioned in the comments, default is 2. 0 is for no limit  */
  mentionsLimit?: number,
  /** Bottom line color for personalisation to match the Application theme */
  lineColor?: string,
  /** Color to highlight the tag for mentioned users */
  tagColor?: string,
  /** Pass an Emoji string here to be added in the current carret position. It will call the onEmojiSet callback. */
  emoji?: string,
  /** Pass a User here to be added as mentioned User in the current carret position. It will call the onMentionedUserSet callback */
  mentionedUser?: User,
  /** A Class Module to provide to override some classes of the default Class Modules */
  moduleClasses?: { [key : string] : any },
  /** Tell the input to transform and send the content back via onSend callback */
  sending: boolean,
  /** Callback when the passed Emoji string has been inserted */
  onEmojiSet: Function,
  /** Callback when the passed User has been inserted for mention */
  onMentionedUserSet() : void,
  /** Callback when the @ typing is matching some users */
  onMentionMatch?(users: User[]) : void,
  /** Callback when the mentioned Users list is changed in the input */
  onMentionedUsersUpdate(ids: number[]) : void,
  /**  Callback with true when content is between minLength and maxLength, and with false when content is out of range */
  onValidationChange?(isValid: boolean) : void,
  /** Callback on each input and change to track the length of comment outside the component */
  onLengthChange?(length: number) : void,
  /** Callback on each input and change to track the whole content outside the component. Might be heavy if text in huge. */
  onContentChange?(content: string) : void,
  /** Callback on sending the Content back to parent */
  onSend(content: string) : void,
};

type Caret = {
  start: number,
  end: number,
};

// No-Break Space (unicode character, equivalent to &nbsp; in HTML)
const NBSP = '\u00A0';

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
    mentionsLimit = 2,
    lineColor,
    tagColor = '#358856',
    emoji,
    mentionedUser,
    moduleClasses,
    sending = false,
    onEmojiSet,
    onMentionedUserSet,
    onMentionMatch = () => {},
    onMentionedUsersUpdate,
    onValidationChange = () => {},
    onLengthChange,
    onContentChange,
    onSend,
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  // Save caret Position because we lose it when using Emoji and Mention selectors
  const [caret, setCaret] = React.useState<Caret>();
  // set editable
  const [initialized, setInitialized] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  const handleContentChange = (content: string) : void => {
    if (onLengthChange) {
      onLengthChange(content.length);
    }
    if (onContentChange) {
      onContentChange(content);
    }
  }

  const getCaretPosition = () : Caret => {
    const editable = ref.current as HTMLDivElement;
    /*
    Note: Anchor and focus should not be confused with the start and end positions of a selection. The anchor can be placed before the focus or vice versa, depending on the direction you made your selection.
    https://developer.mozilla.org/en-US/docs/Web/API/Selection
    */

    // get window selection object
    const sel = window.getSelection();
    const cPos = { start: 0, end: 0 };

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
    const editable = ref.current as HTMLDivElement;

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
    const editable = ref.current as HTMLDivElement;
    // Compact nodes, Concatenate all adjacent Text Node
    const nodes : ChildNode[] = [];
    const childNodes = Array.from(editable.childNodes);
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];

      // node of type  now () ----
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
          // if last pushed node is object then keep last empty text node
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

  const getNodeIndexAndChildPos = React.useCallback(
    (match? : string) => {
      const editable = ref.current as HTMLDivElement;
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
    },
    [getCaretPosition],
  );

  const getMentionedIds = () : number[] => {
    const editable = ref.current as HTMLDivElement;
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
    const editable = ref.current as HTMLDivElement;
    const contents = Array.from(editable.childNodes).map((node : ChildNode, index) => {
      if (node.nodeName === 'SPAN') {
        const nodeElem = (node as HTMLSpanElement);
        return `{{${nodeElem.getAttribute('data-id')}}}`;
      } else if (node.nodeName === 'BR') {
        // do not count last BR tag cause browser add 2 <br>
        // when pressing enter for new line if it's at the end
        // <div>Hello <span>Keitel</span><br><br></div>
        if (index !== editable.childNodes.length - 1) {
          return '\n';
        }
      }
      return node.textContent;
    });

    return contents.join('');
  };

  React.useEffect(() => {
    const editable = ref.current as HTMLDivElement;
    // EVENT LISTENERS ARE SET ONLY ONCE
    if (!initialized && editable) {
      // plaintext-only browser support: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable
      // editable.setAttribute('contenteditable', 'plaintext-only');
      editable.setAttribute('contenteditable', 'true');
      editable.addEventListener('focus', function () {
        this.style.outline = '0px solid transparent';
      });

      // ON KEYDOWN ------------------------------
      const onKeydown = (event: KeyboardEvent) => {
        const editable = ref.current as HTMLDivElement;
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
        if (val && maxLength > 0 && val.length > maxLength) {
          // BREAK AND STOP
          event.preventDefault();
          return false;
        }
      };
      editable.addEventListener('keydown', onKeydown);

      // ON CLICK ------------------------------
      const onClick = () => {
        const crt = getCaretPosition();
        setCaret(crt);
      };
      editable.addEventListener('click', onClick);

      // ON INPUT ----------------------------------
      const onInput = (event: Event) => {
        // console.log('input event textContent', event.target.textContent);

        const val = (event.target as HTMLDivElement).textContent;
        const cnt = getContent();
        handleContentChange(cnt);

        if (val && val.length >= minLength) {
          onValidationChange(true);
        } else {
          onValidationChange(false);
        }

        const crt = getCaretPosition();
        setCaret(crt);

        // CHECK if SPAN mention tag is edited. If yes, delete it
        var sel = window.getSelection();
        if (
          sel &&
          sel.anchorNode &&
          sel.anchorNode.parentNode
        ) {
          const node = sel.anchorNode.parentNode as HTMLElement;
          if (node.hasAttribute('data-id')) {
            // anchor will be the Text Node inside ContentEditable SPAN
            // then anchor parent Node will be the ContentEditable SPAN
            // take the length of the Span to update caret

            let length = 0;
            if (sel.anchorNode.textContent) {
              length = sel.anchorNode.textContent.length;
            }
            const node = sel.anchorNode.parentNode;
            editable.removeChild(node);
            // compact to avoid browser engine to create
            // a FONT tag in place of deleted SPAN tag
            compactEditableNodes();

            setCaretPosition({
              start: crt.start - length,
              end: crt.start - length,
            });

            const ids = getMentionedIds();
            onMentionedUsersUpdate(ids);
          }
        }

        if (!val) {
          return;
        }

        // MENTION -------------
        const mentionedIds = getMentionedIds();
        if (mentionsLimit > 0 && mentionedIds.length >= mentionsLimit) {
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
    const editable = ref.current as HTMLDivElement;

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
      if (caret) {
        setCaretPosition(caret);
      }

      // insert mentioned user
      const content = editable.textContent as string;
      // const matches = content.match(/@[\w-]+/gm);
      const matches = content.match(/@[a-zA-Z0-9-.]+/gm);
      const match = (matches || [])[0] as string;

      // 1- Create tag span HTML
      const tag = document.createElement('span');

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
        rg.surroundContents(tag);
      } else {
        rg.setStart(editable.childNodes[nodeIndex], childPos);
        rg.setEnd(editable.childNodes[nodeIndex], childPos);
        sel.removeAllRanges();
        sel.addRange(rg);
        rg.insertNode(tag);
      }

      // add element attribute after (For some reason, range adds it with no text content)
      // Android chrome browser cannot delete SPAN when contenteditable is set to false
      // tag.setAttribute('contenteditable', false);
      // add data-id to tagged user
      tag.setAttribute('data-id', mentionedUser.id.toString());
      tag.style.color = tagColor;
      tag.style.fontWeight = 'bold';
      tag.textContent = mentionedUser.name;

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
      setCaret(newCrt);

      // update length
      const cnt = getContent();
      handleContentChange(cnt);
    }
  }, [
    mentionedUser,
    getCaretPosition,
    getNodeIndexAndChildPos,
    compactEditableNodes,
    caret,
    setCaretPosition,
  ]);

  React.useEffect(() => {
    const editable = ref.current as HTMLDivElement;
    if (emoji) {
      editable.focus();
      // if there is no child node while inserting element,
      // append empty string to create new node for range
      if (!editable.childNodes.length) {
        editable.append('');
      }
      // put caret back
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
      setCaret(newCrt);

      // update length
      const cnt = getContent();
      handleContentChange(cnt);
    }
  }, [
    emoji,
    setCaretPosition,
    caret,
    getCaretPosition,
    getNodeIndexAndChildPos,
    compactEditableNodes,
  ]);

  useEffect(() => {
    if (sending) {
      const cnt = getContent();
      onSend(cnt);
    }
  }, [sending]);

  return (
    <div id="core-input" className={classes.editableContainer} style={{ borderBottomColor: lineColor }}>
      <div data-test-id="text-input-web" ref={ref} className={classes.input} />
    </div>
  );
}
