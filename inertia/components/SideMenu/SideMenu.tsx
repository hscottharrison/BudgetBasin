import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { ChevronRight, ChevronLeft, Menu } from 'lucide-react'
import { menuConfig, MenuItem } from './menu_config'
import { cn } from '~/lib/utils'
import './style.css'

type SideMenuProps = {
  isAuthenticated: boolean
  currentUrl: string
}

export default function SideMenu({ isAuthenticated, currentUrl }: SideMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sideMenuCollapsed')
      return saved === 'true'
    }
    return false
  })

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    localStorage.setItem('sideMenuCollapsed', String(isCollapsed))
  }, [isCollapsed])

  // Don't show menu for unauthenticated users
  if (!isAuthenticated) {
    return null
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      // Collapse all submenus when collapsing sidebar
      setExpandedItems(new Set())
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return currentUrl === href || currentUrl.startsWith(href + '/')
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <div key={item.id} className="side-menu-item-wrapper">
        {item.href && !hasChildren ? (
          <a href={item.href} className="side-menu-link">
            <div
              className={cn(
                'side-menu-item',
                active && 'active',
                isCollapsed && 'collapsed'
              )}
              style={{ paddingLeft: isCollapsed ? undefined : `${12 + depth * 16}px` }}
            >
              {Icon && (
                <div className="side-menu-icon">
                  <Icon size={18} />
                </div>
              )}
              {!isCollapsed && (
                <span className={cn('text-sm', active && 'font-medium')}>{item.label}</span>
              )}
            </div>
          </a>
        ) : (
          <div
            className={cn(
              'side-menu-item has-children',
              isExpanded && 'expanded',
              isCollapsed && 'collapsed'
            )}
            onClick={() => !isCollapsed && toggleExpand(item.id)}
            style={{
              paddingLeft: isCollapsed ? undefined : `${12 + depth * 16}px`,
              cursor: hasChildren ? 'pointer' : 'default',
            }}
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="side-menu-icon">
                  <Icon size={18} />
                </div>
              )}
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </div>
            {!isCollapsed && hasChildren && (
              <div className={cn('side-menu-chevron', isExpanded && 'expanded')}>
                <ChevronRight size={16} />
              </div>
            )}
          </div>
        )}

        {/* Submenu */}
        {hasChildren && !isCollapsed && (
          <div className={cn('side-menu-submenu', isExpanded && 'expanded')}>
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('side-menu', isCollapsed && 'collapsed')}>
      {/* Toggle Button */}
      <div className={cn('side-menu-header', isCollapsed ? 'justify-center' : 'justify-end')}>
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="side-menu-toggle">
          {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="side-menu-items">
        {menuConfig.map((item) => renderMenuItem(item))}
      </div>
    </div>
  )
}
