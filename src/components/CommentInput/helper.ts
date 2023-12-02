import { User } from "../Mentions/Mentions";

export type ContentPart = {
  type: string,
  data: User | string,
};

type ParseMention = (stringWithId: string) => number | string;

const formatContent = (
  ctnt : string,
  mentions : User[],
  mentionRegex: RegExp,
  parseMentionId : ParseMention,
) : ContentPart[] => {
  const mentionMatches = ctnt.match(mentionRegex);

  if (mentionMatches && mentionMatches.index) {
    const index = mentionMatches.index;
    const uId = parseMentionId(mentionMatches[0]);
    const firstContent = ctnt.slice(0, index);
    const usr = (mentions).filter(u => u.id === uId)[0];

    let part : ContentPart;
    if (usr) {
      part = { type: 'mention', data: usr };
    } else {
      part = { type: 'mention', data: { id: uId, name: `User@${uId}` } };
    }

    // put the rest content as new content to continue
    const newContent : string = ctnt.slice(index + mentionMatches[0].length);
    const firstPart : ContentPart = { type: 'text', data: firstContent };
    return [firstPart, part].concat(formatContent(newContent, mentions, mentionRegex, parseMentionId));
  }

  return [{ type: 'text', data: ctnt }];
};

const helper = {
  formatContent,
};

export default helper;
