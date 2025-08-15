/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import '@radix-ui/themes/styles.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import {Box, Theme} from '@radix-ui/themes'
import AppBar from "~/components/AppBar/appBar";


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
      <Theme accentColor="amber" radius="small">
        <AppBar {...props.initialPage.props}></AppBar>
        <Box style={{ height: 'calc(100vh - 5rem)'}}>
          <App {...props} />
        </Box>
      </Theme>)

  },
});
