import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { Box, Flex, Theme } from '@radix-ui/themes'

import AppBar from '~/components/AppBar/appBar'
import SideMenu from '~/components/SideMenu/SideMenu'

import '@radix-ui/themes/styles.css'
import '../css/app.css';
import { LoadingProvider } from '~/context/LoadingContext'

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
    const isAuthenticated = !!(props.initialPage.props as any)?.user
    const currentUrl = props.initialPage.url

    hydrateRoot(el,
      <LoadingProvider>
        <Theme accentColor="teal">
          <AppBar {...props.initialPage.props}></AppBar>
          <Flex style={{ maxHeight: 'calc(100vh - 3rem)', height: 'calc(100vh - 3rem)', minHeight: 0 }}>
            <SideMenu isAuthenticated={isAuthenticated} currentUrl={currentUrl} />
            <Box style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: 'var(--accent-2)'}}>
              <App {...props} />
            </Box>
          </Flex>
        </Theme>
      </LoadingProvider>)
  },
});
