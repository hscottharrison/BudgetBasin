import { CalendarIcon, PiggyBankIcon } from 'lucide-react'

export type MenuItem = {
  id: string
  label: string
  href?: string
  icon?: React.ElementType
  children?: MenuItem[]
}

export function getMenuConfig(budgetItems: MenuItem[]) {
  const menu = [
    {
      id: 'savings',
      label: 'Savings',
      href: '/user-home',
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
