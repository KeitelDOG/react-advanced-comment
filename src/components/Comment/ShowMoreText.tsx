import React, { CSSProperties } from 'react';
import { User } from '../Mentions/Mentions';
import defaultClasses from './ShowMoreText.module.css';
import { combineClasses } from '../helpers/combineClasses';

export type ShowMoreTextProps = {
  /** Children containing simple Text or Rich text with mentions. The display must be `inline` to work normally. */
  children?: React.ReactNode,

  /** Content expansion by defaut, false makes better sense.
   * @default false
   */
  expanded: boolean,

  /** Maximum lines to display before expanding */
  numberOfLines: number,

  /** Render the a Show More component. */
  renderShowMore?: string | React.ReactNode,

  /** Render the a Show Less component. */
  renderShowLess?: string | React.ReactNode,

  /** A Class Module to provide to override some classes of the default Class Modules.
   *  classes: `content, mention`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },

  /** Provide a Component that accept a User prop to render the mentioned User. A default is used inside this component. */
  ShowComponent?: (props: { user: User, [key: string]: any }) => React.JSX.Element,
};

/** This Show More Text is based on CSS, `-webkit-line-clamp` and `-webkit-box` display, supported by recent version all browsers and and based on heigh which keeps the Mentioned tags intact on the comment display. */
export default function ShowMoreText(props : ShowMoreTextProps) {
  const {
    children,
    numberOfLines,
    expanded = false,
    renderShowMore = 'Show More',
    renderShowLess = 'Show Less',
    moduleClasses,
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);
  const [full, setFull] = React.useState<boolean>(expanded);
  const [showAnchor, setShowAnchor] = React.useState<boolean>(false);

  const trimmedRef = React.useRef(null);
  const fullRef = React.useRef(null);

  React.useEffect(() => {
    if (trimmedRef.current && fullRef.current) {
      const trimmedCont = trimmedRef.current as HTMLDivElement;
      const fullCont = fullRef.current as HTMLDivElement;
      if (trimmedCont.offsetHeight < fullCont.offsetHeight) {
        setShowAnchor(true);
      }
    }
  }, []);

  let showMoreView: React.ReactNode;
  if (typeof renderShowMore === 'string') {
    showMoreView = (
      <span role="button" className={classes.anchor}>{renderShowMore}</span>
    );
  } else {
    showMoreView = renderShowMore;
  }

  let showLessView: React.ReactNode;
  if (typeof renderShowLess === 'string') {
    showLessView = (
      <span role="button" className={classes.anchor}>{renderShowLess}</span>
    );
  } else {
    showLessView = renderShowLess;
  }

  const renderFooter = () => {
    if (showAnchor) {
      if (full) {
        return (
          <div
            className={classes.anchorWrapper}
            onClick={() => setFull(false)}
          >
            {showLessView}
          </div>
        );
       } else {
        return (
          <div
            className={classes.anchorWrapper}
            onClick={() => setFull(true)}
          >
            {showMoreView}
          </div>
        );
      };
    }

    return null;
  }

  const contentClassName = full ? 'fullContent' : 'clampedContent';
  let contentStyle: CSSProperties = {};
  if (!full) {
    // clamp content if not full display
    contentStyle = { WebkitLineClamp: numberOfLines } as CSSProperties
  }

  return (
    <div data-class="showMoreTextWrapper" className={classes.showMoreTextWrapper}>
      <div
        ref={trimmedRef}
        data-class="fullContent clampedContent"
        className={classes[contentClassName]}
        style={contentStyle}
      >
        <span
          ref={fullRef}
          data-class="contentWrapper"
          className={classes.contentWrapper}
        >
          {children}
        </span>
      </div>
      {renderFooter()}
    </div>
  );
}
