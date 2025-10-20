import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import {Box, Theme} from '@radix-ui/themes'


import AppBar from '~/components/AppBar/appBar'

import '@radix-ui/themes/styles.css'
import '../css/app.css';

createInertiaApp({
  progress: { color: '#5468FF' },

  title: () => `Budget Basin`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {

    hydrateRoot(el,
      <Theme accentColor="teal" radius="full">
        <AppBar {...props.initialPage.props}></AppBar>
        <Box style={{ maxHeight: 'calc(100vh - 3rem)', overflow: 'hidden', height: 'calc(100vh - 3rem)', display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: 'var(--accent-2)'}}>
          <App {...props} />
        </Box>
      </Theme>)

  },
});
