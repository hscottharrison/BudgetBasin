import { UserHomeProvider } from '../../context/UserHomeContext'

import TotalBalance from '~/components/TotalBalance/totalBalance'
import { UserHomeDTO } from '#models/user_home_dto'
import ActionsBar from '~/components/ActionsBar/ActionsBar'
import AccountsTable from '~/components/AccountsTable/accountsTable'
import BucketsList from '~/components/BucketsList/BucketsList'

export default function UserHome({ userBuckets, userAccounts, transactionTypes }: UserHomeDTO) {
  return (
    <UserHomeProvider
      userBuckets={userBuckets}
      userAccounts={userAccounts}
      transactionTypes={transactionTypes}
    >
      <UserHomePage />
    </UserHomeProvider>
  )
}

function UserHomePage() {
  return (
    <div className="w-full max-w-[1120px] mx-auto p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Summary - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <TotalBalance />
      </div>

      {/* Actions Bar - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <ActionsBar />
      </div>

      {/* Accounts Table - Collapsible */}
      <div className="flex-shrink-0 mb-4">
        <AccountsTable />
      </div>

      {/* Buckets - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <BucketsList />
      </div>
    </div>
  )
}
