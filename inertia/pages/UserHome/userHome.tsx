import { UserHomeDTO } from '#models/user_home_dto'
import { UserHomeProvider } from '~/context/UserHomeContext'
import DashboardStats from '~/components/DashboardStats/DashboardStats'

export default function UserHome({ categories, currentPeriod, userAccounts, template }: UserHomeDTO) {
  return (
    <UserHomeProvider categories={categories} userAccounts={userAccounts} currentPeriod={currentPeriod} template={template}>
      <UserHomePage />
    </UserHomeProvider>
  )
}

function UserHomePage() {
  return (
    <div className="w-full max-w-[1120px] mx-auto p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
      <DashboardStats />
    </div>
  )
}
