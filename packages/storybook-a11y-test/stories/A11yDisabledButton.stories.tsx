import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Button} from './Button';

export default {
  title: 'A11yDisabled/Button',
  component: Button,
  parameters: {
    a11y: {
      disable: true,
    },
  },
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const A11yDisabledPrimary = Template.bind({});
A11yDisabledPrimary.args = {
  label: 'Button',
};
