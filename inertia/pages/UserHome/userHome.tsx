import {useEffect, useMemo, useState} from "react";
import { Box, Grid } from "@radix-ui/themes";

import TotalBalance from "~/components/TotalBalance/totalBalance";
import AccountsTable from "~/components/AccountsTable/accountsTable";
import ActionsBar from "~/components/ActionsBar/ActionsBar";
import BucketsList from "~/components/BucketsList/BucketsList";

import { getLatestBalance, sumAllocations} from "~/services/utils_service";

import {AllocationDTO} from "#models/allocation";
import {BucketDTO} from "#models/bucket";
import {UserHomeDTO} from "#models/user_home_dto";
import {BankAccountDTO} from "#models/bank_account";
import {BalanceDTO} from "#models/balance";

export default function UserHome({ userBuckets, userAccounts }: UserHomeDTO) {
  /**
   * STATE
   */
  const [accounts, setAccounts] = useState<BankAccountDTO[]>(userAccounts);
  const [bucketBreakdown, setBucketBreakdown] = useState<{name: string, amount: number}[]>([])
  const [buckets, setBuckets] = useState<BucketDTO[]>(userBuckets);
  const [totalAllocations, setTotalAllocations] = useState<number>(0)

  /**
   * MEMOS
   */
  const totalBalance = useMemo(calculateTotalBalance, [accounts])

  /**
   * EFFECTS
   */
  useEffect(parseBucketData, [buckets])

  return (
    <Box
      style={{
        width: '100%',
        maxWidth: 1120,
        marginInline: "auto",
        padding: "2rem 1rem",
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, marginTop: '1rem', gap: '1rem' }}>
        <Grid columns={{ sm: "1", lg: "2" }}>
          <TotalBalance totalAllocations={totalAllocations} totalBalance={totalBalance} bucketBreakdown={bucketBreakdown} />
        </Grid>

        <Box style={{ flex: '0 0 auto', minHeight: '0' }}>
          <ActionsBar
            updateAccounts={updateAccounts}
            addBucketState={addBucket}
            buckets={buckets}
            updateAllocationsForBucket={updateAllocationsForBucket}
          />
        </Box>

        <AccountsTable
          updateAccounts={updateAccounts}
          updateAccountBalance={updateAccountBalance}
          accounts={accounts}
        />

        <Box style={{ flex: 1, minHeight: 0 }}>
          <BucketsList
            buckets={buckets}
            updateBuckets={updateBuckets}/>
        </Box>
      </Box>
    </Box>
  )

  // region STATE MANAGEMENT
  // ACCOUNTS
  function updateAccounts(accounts: BankAccountDTO[]) {
    setAccounts(accounts)
  }

  // function updateAccount(account: BankAccountDTO) {
  //   const index = accounts.findIndex((acc: BankAccountDTO) => acc.id == Number(account.id))
  //   accounts[index] = account
  //   setAccounts([...accounts])
  // }

  function updateAccountBalance(balance: BalanceDTO) {
    const index = accounts.findIndex((acc: BankAccountDTO) => acc.id == balance.bankAccountId)
    accounts[index]?.balances.push(balance)
    setAccounts([...accounts])
  }

  // BUCKETS
  function addBucket(bucket: BucketDTO) {
    setBuckets([...buckets, bucket])
  }

  function updateBuckets(buckets: BucketDTO[]){
    setBuckets(buckets)
  }

  function updateAllocationsForBucket(allocation: AllocationDTO) {
    const index = buckets.findIndex((bucket) => bucket.id == allocation.bucketId)
    const bucketToUpdate = buckets[index];
    buckets[index] = {
      ...bucketToUpdate,
      allocations: [...bucketToUpdate.allocations, allocation]
    }
    setBuckets([...buckets])
  }
  // endregion

  // region MEMO METHODS
  function calculateTotalBalance() {
    return accounts.reduce((acc: number, account: BankAccountDTO) => {
      const latestBalance = getLatestBalance(account.balances)
      if (!latestBalance) return acc
      return acc += latestBalance.amount
    }, 0)
  }
  // endregion

  //region EFFECT METHODS
  function parseBucketData(){
    const breakdownArr: {name: string, amount: number}[] = []
    const amount = buckets.reduce((acc: number, bucket: BucketDTO) => {
      const sum = sumAllocations(bucket.allocations)
      breakdownArr.push({name: bucket.name, amount: sum})
      return acc += sum
    }, 0)
    setTotalAllocations(amount)
    setBucketBreakdown(breakdownArr)
  }
  //endregion
}
