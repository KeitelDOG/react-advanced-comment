import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import ShowMoreText from './ShowMoreText';

export default {
  title: 'React Advanced Comment/Comment/ShowMoreText',
  component: ShowMoreText,
  tags: ['autodocs'],
};

const Template: StoryFn<typeof ShowMoreText> = (args) => {

  const longContent = (
    <p role="paragraph" style={{ display: 'inline' }}>
      Earum velit et ut veniam
      <span role="mark" aria-label="Julio Fils mentioned" style={{ margin: '0 2px', color: '#358856', fontWeight: 'bold' }}>Julio Fils</span>
      accusantium ea excepturi modi quidem. Sapiente eum repudiandae iste ut sed et et quis illo. A consequatur esse et. Tempore atque neque 🤷 est. Sapiente explicabo rerum dolorem. Natus 😢 minima doloribus voluptas. Nihil aspernatur mollitia et voluptates reprehenderit dolorem quibusdam aliquid culpa.
      <br/>
      Officia eum et et molestiae accusantium suscipit itaque aliquam id. Omnis ea quis. Eum tempora nisi qui illo in aliquid exercitationem quaerat nostrum.
    </p>
  );

  return (
    <div style={{ padding: 10, maxWidth: 480, fontFamily: 'Nunito Sans' }}>
      <ShowMoreText {...args}>{longContent}</ShowMoreText>
    </div>
  );
};

export const MainShowMoreText: Meta<typeof ShowMoreText> = Template.bind({});

MainShowMoreText.args = {
  numberOfLines: 4,
  expanded: false,
  renderShowMore: 'View More',
  renderShowLess: 'View Less',
};
