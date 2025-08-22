import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import {Box, Theme} from '@radix-ui/themes'

import AppBar from '~/components/AppBar/appBar'

import '@radix-ui/themes/styles.css'
import '../css/app.css';


const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

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
