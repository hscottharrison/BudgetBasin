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
    <div className="w-full max-w-[1120px] mx-auto p-8 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 mt-4 gap-4">
        <div className="mb-4 px-2">
          <TotalBalance />
        </div>

        <div className="flex-shrink-0 min-h-0">
          <ActionsBar />
        </div>

        <AccountsTable />

        <div className="flex-1 min-h-0">
          <BucketsList />
        </div>
      </div>
    </div>
  )
}
