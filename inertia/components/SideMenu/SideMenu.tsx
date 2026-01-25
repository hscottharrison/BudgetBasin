import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { getMenuConfig, MenuItem } from './menu_config'
import { cn } from '~/lib/utils'
import { ActiveBudgetListItemDTO } from '#models/budget_template'
import { BudgetPeriodDTO } from '#models/budget_period'
import { formatBudgetMonth } from '~/services/utils_service'

type SideMenuProps = {
  isAuthenticated: boolean
  currentUrl: string
  budgetList: ActiveBudgetListItemDTO[]
}

/**
 * Finds the chain of menu item IDs that leads to the active route.
 * Example return: ['root', 'settings', 'settings.profile']
 */
function findActivePathIds(
  items: MenuItem[],
  isActiveHref: (href?: string) => boolean,
): string[] {
  for (const item of items) {
    const selfActive = isActiveHref(item.href)

    if (item.children?.length) {
      const childPath = findActivePathIds(item.children, isActiveHref)
      if (childPath.length > 0) return [item.id, ...childPath]
    }

    if (selfActive) return [item.id]
  }

  return []
}

export default function SideMenu({ isAuthenticated, currentUrl, budgetList }: SideMenuProps) {
  const [isCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sideMenuCollapsed')
      return saved === 'true'
    }
    return true
  })

  // Mobile drawer state (for small screens). On desktop, the sidebar is always present.
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sideMenuCollapsed', String(isCollapsed))
    }
  }, [isCollapsed])

  // Don't show a menu for unauthenticated users
  if (!isAuthenticated) {
    return null
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return currentUrl === href || currentUrl.startsWith(href + '/')
  }

  const menuConfig: MenuItem[] = useMemo(() => {
    const budgetListMenuItems = budgetList.map(item => {
      const menuItem: MenuItem = {
        id: `template - ${item.id}`,
        label: item.name,
        children: item.periods.map((period: BudgetPeriodDTO) => ({
          id: `period - ${period.id}`,
          label: formatBudgetMonth(period.month, period.year),
          href: `/monthly-budget/`
        }))
      }
     return menuItem;
    })
    return getMenuConfig(budgetListMenuItems)
  }, [budgetList])
  // Expand parents of active route by default (and when route changes).
  const activePathIds = useMemo(
    () => findActivePathIds(menuConfig, isActive),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUrl],
  )

  useEffect(() => {
    // If the user already expanded things manually, we still want to ensure
    // the active route is visible.
    setExpandedItems((prev) => {
      const next = new Set(prev)
      for (const id of activePathIds) next.add(id)
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePathIds.join('|')])

  // const toggleCollapse = () => {
  //   setIsCollapsed((v) => !v)
  //   // If collapsing sidebar, collapse all submenus for a clean compact state.
  //   if (!isCollapsed) {
  //     setExpandedItems(new Set())
  //   }
  // }

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const closeMobile = () => setIsMobileOpen(false)

  const NavItem = ({
                     item,
                     depth = 0,
                     inCollapsedRail = false,
                   }: {
    item: MenuItem
    depth?: number
    inCollapsedRail?: boolean
  }) => {
    const hasChildren = !!item.children?.length
    const expanded = expandedItems.has(item.id)
    const active = isActive(item.href)
    const Icon = item.icon

    const leftPadding = inCollapsedRail ? '' : `pl-${Math.min(12, 3 + depth * 2)}`

    // Base row styles (match ShadCN-ish look: subtle hover, rounded, muted text)
    const rowClasses = cn(
      'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      active && 'bg-accent text-accent-foreground',
      inCollapsedRail && 'justify-center px-2',
    )

    const iconWrap = cn(
      'flex h-8 w-8 items-center justify-center rounded-md',
      active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
    )

    // When sidebar is collapsed, we still show the icon and keep an accessible label via title.
    const title = item.label

    const content = (
      <>
        {Icon && (
          <span className={iconWrap} aria-hidden="true">
            <Icon size={18} />
          </span>
        )}

        {!inCollapsedRail && (
          <span className={cn('flex-1 truncate', active && 'font-medium')}>{item.label}</span>
        )}

        {!inCollapsedRail && hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleExpand(item.id)
            }}
            aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        )}
      </>
    )

    // If item has href, it’s navigable; otherwise it’s a button-like row.
    // If it has children + href, clicking the row navigates; the chevron toggles expansion.
    const Row = item.href ? (
      <a
        href={item.href}
        className={cn(rowClasses, leftPadding)}
        title={title}
        onClick={() => {
          // Close mobile drawer on navigation
          closeMobile()
        }}
      >
        {content}
      </a>
    ) : (
      <button
        type="button"
        className={cn(rowClasses, leftPadding, 'text-left')}
        title={title}
        onClick={() => {
          if (hasChildren) toggleExpand(item.id)
        }}
      >
        {content}
      </button>
    )

    return (
      <div className="w-full">
        {Row}

        {/* Submenu */}
        {hasChildren && !inCollapsedRail && (
          <div
            className={cn(
              'overflow-hidden transition-[max-height,opacity] duration-200',
              expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => (
                <NavItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const SidebarInner = ({ variant }: { variant: 'desktop' | 'mobile' }) => {
    const collapsedRail = isCollapsed && variant === 'desktop'

    return (
      <div
        className={cn(
          'h-full border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'flex flex-col',
          collapsedRail ? 'w-16' : 'w-72',
          'transition-[width] duration-200',
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center justify-between p-2', collapsedRail && 'justify-center')}>
          {variant === 'mobile' && (
            <div className="flex w-full items-center justify-between">
              <span className="px-2 text-sm font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <ChevronLeft size={18} />
              </Button>
            </div>
          )
          //   : (
          //   <Button
          //     variant="ghost"
          //     size="icon"
          //     onClick={toggleCollapse}
          //     aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          //     className="hover:bg-white hover:text-primary"
          //   >
          //     {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          //   </Button>
          // )
          }
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto px-2 pb-3">
          <div className="space-y-1">
            {menuConfig.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                inCollapsedRail={collapsedRail}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile top-left menu button (only visible on small screens) */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block h-full">
        <SidebarInner variant="desktop" />
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu overlay"
            onClick={closeMobile}
          />
          {/* Panel */}
          <div className="absolute inset-y-0 left-0">
            <SidebarInner variant="mobile" />
          </div>
        </div>
      )}
    </>
  )
}
