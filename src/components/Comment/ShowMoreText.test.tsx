import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ShowMoreText from './ShowMoreText';
import users from '../../data/users';

const longContent = (
  <p role="paragraph" style={{ display: 'inline' }}>
    Earum velit et ut veniam
    <span role="mark" aria-label="Julio Fils mentioned">Julio Fils</span>
    accusantium ea excepturi modi quidem. Sapiente eum repudiandae iste ut sed et et quis illo. A consequatur esse et. Tempore atque neque 🤷 est. Sapiente explicabo rerum dolorem. Natus 😢 minima doloribus voluptas. Nihil aspernatur mollitia et voluptates reprehenderit dolorem quibusdam aliquid culpa.
    <br/>
    Officia eum et et molestiae accusantium suscipit itaque aliquam id. Omnis ea quis. Eum tempora nisi qui illo in aliquid exercitationem quaerat nostrum.
  </p>
);

const shortContent = (
  <p role="paragraph" style={{ display: 'inline' }}>
    Earum velit et ut veniam
    <span role="mark" aria-label="Julio Fils mentioned">Julio Fils</span>
    accusantium ea excepturi modi quidem. Tempore atque neque 🤷 est. Sapiente explicabo rerum dolorem.
  </p>
);

/*
const originalOffsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetHeight'
) as PropertyDescriptor;
*/

const setTrimmedHeight = (height: number) => {
  Object.defineProperty(HTMLDivElement.prototype, 'offsetHeight', {
    configurable: true,
    value: height,
  });
};
const setContentHeight = (height: number) => {
  Object.defineProperty(HTMLSpanElement.prototype, 'offsetHeight', {
    configurable: true,
    value: height,
  });
};

describe('CommentHeader', () => {

  test('should render short content with no Anchor, with custom classes', () => {
    // if trimmed content <div> is greater than full internal content
    // content is normal and no Anchor is displayed
    setTrimmedHeight(100);
    setContentHeight(80);

    render(
      <div style={{ width: 360 }}>
        <ShowMoreText
          numberOfLines={4}
          expanded={false}
          moduleClasses={{ showMoreTextWrapper: 'hashclass' }}
        >
          {shortContent}
        </ShowMoreText>
      </div>
    );

    const trimmed = screen.getByTestId('trimmed-content');
    expect(trimmed.getAttribute('data-status')).toBe('normal');

    const anchor = screen.queryByRole('button', { name: 'Show More' });
    expect(anchor).toBe(null);
  });

  test('should render long content with Anchor with passed text', () => {
    // if trimmed content <div> is less than full internal content
    // content is trimmed and a ShowMore Anchor is displayed
    setTrimmedHeight(100);
    setContentHeight(150);

    render(
      <div style={{ width: 360 }}>
        <ShowMoreText
          numberOfLines={4}
          expanded={false}
          renderShowMore="Expand"
          renderShowLess="Collapse"
        >
          {longContent}
        </ShowMoreText>
      </div>
    );

    const trimmed = screen.getByTestId('trimmed-content');
    expect(trimmed.getAttribute('data-status')).toBe('trimmed');

    // clicking anchor should expand it
    const anchor = screen.getByRole('button', { name: 'Expand' });
    fireEvent.click(anchor);
    expect(trimmed.getAttribute('data-status')).toBe('expanded');
    expect(anchor.textContent).toBe('Collapse');

    // clicking anchor again should trim it
    fireEvent.click(anchor);
    expect(trimmed.getAttribute('data-status')).toBe('trimmed');
    expect(anchor.textContent).toBe('Expand');
  });

  test('should render custom Show More and Show Less view', () => {
    setTrimmedHeight(100);
    setContentHeight(150);

    render(
      <div style={{ width: 360 }}>
        <ShowMoreText
          numberOfLines={4}
          expanded={false}
          renderShowMore={<button>View More</button>}
          renderShowLess={<button>View Less</button>}
        >
          {longContent}
        </ShowMoreText>
      </div>
    );

    // clicking anchor should expand it
    const anchor = screen.getByRole('button', { name: 'View More' });
    fireEvent.click(anchor);

    screen.getByRole('button', { name: 'View Less' });
  });

  test('should force expand to true', () => {
    setTrimmedHeight(100);
    setContentHeight(150);

    render(
      <div style={{ width: 360 }}>
        <ShowMoreText
          numberOfLines={4}
          expanded={true}
        >
          {longContent}
        </ShowMoreText>
      </div>
    );

    screen.getByRole('button', { name: 'Show Less' });
  });
});
