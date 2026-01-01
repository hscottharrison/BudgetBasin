import { useState, useEffect } from 'react'
import { Box, Flex, Text, IconButton } from '@radix-ui/themes'
import { ChevronRightIcon, ChevronLeftIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { menuConfig, MenuItem } from './menu_config'
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
      <Box key={item.id} className="side-menu-item-wrapper">
        {item.href && !hasChildren ? (
          <a href={item.href} className="side-menu-link">
            <Flex
              className={`side-menu-item ${active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
              align="center"
              gap="3"
              style={{ paddingLeft: isCollapsed ? undefined : `${12 + depth * 16}px` }}
            >
              {Icon && (
                <Box className="side-menu-icon">
                  <Icon size={18} />
                </Box>
              )}
              {!isCollapsed && (
                <Text size="2" weight={active ? 'medium' : 'regular'}>
                  {item.label}
                </Text>
              )}
            </Flex>
          </a>
        ) : (
          <Flex
            className={`side-menu-item has-children ${isExpanded ? 'expanded' : ''} ${isCollapsed ? 'collapsed' : ''}`}
            align="center"
            justify="between"
            onClick={() => !isCollapsed && toggleExpand(item.id)}
            style={{ 
              paddingLeft: isCollapsed ? undefined : `${12 + depth * 16}px`,
              cursor: hasChildren ? 'pointer' : 'default'
            }}
          >
            <Flex align="center" gap="3">
              {Icon && (
                <Box className="side-menu-icon">
                  <Icon size={18} />
                </Box>
              )}
              {!isCollapsed && (
                <Text size="2">{item.label}</Text>
              )}
            </Flex>
            {!isCollapsed && hasChildren && (
              <Box className={`side-menu-chevron ${isExpanded ? 'expanded' : ''}`}>
                <ChevronRightIcon />
              </Box>
            )}
          </Flex>
        )}

        {/* Submenu */}
        {hasChildren && !isCollapsed && (
          <Box className={`side-menu-submenu ${isExpanded ? 'expanded' : ''}`}>
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box className={`side-menu ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <Flex className="side-menu-header" align="center" justify={isCollapsed ? 'center' : 'end'}>
        <IconButton
          variant="ghost"
          size="2"
          onClick={toggleCollapse}
          className="side-menu-toggle"
        >
          {isCollapsed ? <HamburgerMenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Flex>

      {/* Menu Items */}
      <Flex direction="column" className="side-menu-items">
        {menuConfig.map((item) => renderMenuItem(item))}
      </Flex>
    </Box>
  )
}
