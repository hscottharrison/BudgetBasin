import { UserHomeDTO } from '#models/user_home_dto'
import { UserHomeProvider } from '~/context/UserHomeContext'
import DashboardStats from '~/components/DashboardStats/DashboardStats'

export default function UserHome({ categories, currentPeriod, userAccounts }: UserHomeDTO) {
  return (
    <UserHomeProvider categories={categories} userAccounts={userAccounts} currentPeriod={currentPeriod}>
      <UserHomePage />
    </UserHomeProvider>
  )
}

function UserHomePage() {
  return (
    <DashboardStats />
  )
}
