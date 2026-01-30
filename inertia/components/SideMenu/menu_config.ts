import { CalendarIcon, HomeIcon, PiggyBankIcon } from 'lucide-react'

export type MenuItem = {
  id: string
  label: string
  href?: string
  icon?: React.ElementType
  children?: MenuItem[]
  isSubMenuItem?: boolean
}

export function getMenuConfig(budgetItems: MenuItem[]) {
  const menu = [
    {
      id: 'home',
      label: 'Dashboard',
      href: '/user-home',
      icon: HomeIcon,
    },
    {
      id: 'savings',
      label: 'Savings',
      href: '/savings',
      icon: PiggyBankIcon,
    },
    {
      id: 'monthly-budget',
      label: 'Monthly Budget',
      icon: CalendarIcon,
      href: '/monthly-budget',
      children: budgetItems,
    },
  ]
  return menu
}
