import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import AppBar from '~/components/AppBar/appBar'
import SideMenu from '~/components/SideMenu/SideMenu'

import '../css/app.css'
import { LoadingProvider } from '~/context/LoadingContext'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: () => `Budget Basin`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  async setup({ el, App, props }) {
    const isAuthenticated = !!(props.initialPage.props as any)?.user
    const currentUrl = props.initialPage.url
    let budgetList = [];

    const budgets = async function() {
      const response = await fetch('/api/budget/list')
      return response.json()
    }
    console.log('PROPS', props)

    if (isAuthenticated) {
      budgetList = await budgets()
      console.log('BUDGETS', budgetList)
    }

    hydrateRoot(
      el,
      <LoadingProvider>
        <div className="h-screen w-screen flex flex-col">
          <AppBar {...props.initialPage.props} />
          <div className="flex flex-1 overflow-hidden">
            <SideMenu isAuthenticated={isAuthenticated} currentUrl={currentUrl} budgetList={budgetList} />
            <main className="flex-1 overflow-hidden flex flex-col bg-accent/20">
              <App {...props} />
            </main>
          </div>
        </div>
      </LoadingProvider>
    )
  },
})
