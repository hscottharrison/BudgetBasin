import { SavingsProvider } from '../../context/SavingsContext'

import TotalBalance from '~/components/TotalBalance/totalBalance'
import { SavingsDTO } from '#models/savings_dto'
import ActionsBar from '~/components/ActionsBar/ActionsBar'
import AccountsTable from '~/components/AccountsTable/accountsTable'
import BucketsList from '~/components/BucketsList/BucketsList'

export default function Savings({ userBuckets, userAccounts, transactionTypes }: SavingsDTO) {
  return (
    <SavingsProvider
      userBuckets={userBuckets}
      userAccounts={userAccounts}
      transactionTypes={transactionTypes}
    >
      <SavingsPage />
    </SavingsProvider>
  )
}

function SavingsPage() {
  return (
    <>
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
    </>
  )
}
