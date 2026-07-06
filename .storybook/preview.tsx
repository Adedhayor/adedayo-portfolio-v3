import type { Preview } from '@storybook/react-vite'
import { Agentation } from 'agentation'
import { useEffect } from 'react'
// Optimus design foundation — tokens, fonts, base, sharp-edge system.
import '../src/index.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Welcome',
          'Foundations',
          ['Colour', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Motion', 'Glass'],
          'Atoms',
          [
            'Button', 'Icon Button', 'Input', 'Select', 'Checkbox', 'Switch', 'Slider',
            'Badge', 'Tag', 'Tooltip', 'Avatar', 'Kbd', 'Breadcrumb', 'Divider',
            'Progress', 'Segmented Control', 'Skeleton',
          ],
          'Molecules',
          [
            'Form Field', 'Dialog', 'Confirmation Dialog', 'Empty State',
            'Popover', 'Menu', 'Toast', 'Stepper', 'Banner',
          ],
          'Blocks',
          [
            'Nav', 'Hero', 'Projects', 'ClientLogos', 'Services',
            'TestimonialBand', 'Contact', 'Footer', 'Full Page (composed)',
          ],
        ],
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
    backgrounds: { disable: true }, // theme toolbar drives the canvas instead
    // Responsive toolbar — switch any story across Optimus breakpoints.
    viewport: {
      options: {
        mobile: { name: 'Mobile · 375', styles: { width: '375px', height: '780px' } },
        tablet: { name: 'Tablet · 768', styles: { width: '768px', height: '1024px' } },
        laptop: { name: 'Laptop · 1024', styles: { width: '1024px', height: '720px' } },
        desktop: { name: 'Desktop · 1440', styles: { width: '1440px', height: '900px' } },
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Theme · light vs dark (semantic tokens re-point)',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    agentation: {
      description: 'Agentation · annotation toolbar',
      defaultValue: 'on',
      toolbar: {
        title: 'Annotate',
        icon: 'comment',
        items: [
          { value: 'on', title: 'Annotate on', icon: 'comment' },
          { value: 'off', title: 'Annotate off', icon: 'commentadd' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      const annotate = (context.globals.agentation ?? 'on') !== 'off'
      useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark')
        // paint the Storybook canvas to match the active surface
        document.body.style.background = 'var(--opt-surface-base)'
      }, [theme])
      return (
        <>
          <Story />
          {annotate && <Agentation />}
        </>
      )
    },
  ],
}

export default preview
