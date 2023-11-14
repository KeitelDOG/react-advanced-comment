export type User = {
  id: number,
  name: string,
  image?: string,
};

export type MentionsProps = {
  users: User[],
  renderCloseIcon?: React.ReactNode,
  onClose?() : void,
  onMentionSelected(user: User) : void,
  moduleClasses?: { [key : string] : any }
};

export type RenderMentionsProps = {
  users: User[],
  onMentionSelected(user: User) : void,
  onClose() : void
};
