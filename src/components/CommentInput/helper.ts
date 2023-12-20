import { User } from '../Mentions/Mentions';
import { ContentPart } from './CoreInput';

export type ParseMention = (stringWithId: string) => number | string;

export const defaultMentionRegex = /{{[0-9]*}}/m;

export const defaultMentionToString = (id: number | string) : string => {
  return `{{${id}}}`;
}

export const defaultParseMention: ParseMention = (stringWithID: string) : number | string => {
  const id : string = stringWithID.slice(2, -2);
  return isNaN(parseInt(id)) ? id : Number(id);
}

const generateTextParts = (text: string): ContentPart[] => {
  let textParts: ContentPart[] = [];
  const lines = text.split(/\r\n|\r|\n/);
  lines.forEach((line: string, ind: number) => {
    if (line.length > 0) {
      textParts.push({ type: 'text', data: line });
    }

    // add new line if not the last line
    if (ind !== lines.length - 1) {
      textParts.push({ type: 'newline', data: '\n' })
    }
  });
  return textParts;
}

export const formatContent = (
  ctnt : string,
  mentions : User[],
  mentionRegex: RegExp,
  parseMention : ParseMention,
) : ContentPart[] => {
  // Mention
  const mentionMatches = ctnt.match(mentionRegex);

  if (mentionMatches && mentionMatches.index) {
    const index = mentionMatches.index;
    const uId = parseMention(mentionMatches[0]);
    const firstContent = ctnt.slice(0, index);

    // create first content parts
    const firstParts: ContentPart[] = generateTextParts(firstContent);

    const usr = (mentions).filter(u => u.id === uId)[0];
    let part : ContentPart;
    if (usr) {
      part = { type: 'mention', data: usr };
    } else {
      part = { type: 'mention', data: { id: uId, name: `User@${uId}` } };
    }

    // add mention part to first content parts
    firstParts.push(part);

    // put the rest content as new content to continue
    const newContent : string = ctnt.slice(index + mentionMatches[0].length);
    return firstParts.concat(formatContent(newContent, mentions, mentionRegex, parseMention));
  }

  // New Line and Text
  return generateTextParts(ctnt);
};
