import {Avatar, Box, Flex, Grid, Heading} from "@radix-ui/themes";
import {useMemo, useState} from "react";
import {UserHomeDTO} from "#models/user_home_dto";
import {BankAccountDTO} from "#models/bank_account";
import TotalBalance from "~/components/TotalBalance/totalBalance";
import AccountsTable from "~/components/AccountsTable/accountsTable";
import ActionsBar from "~/components/ActionsBar/ActionsBar";
import {formatCurrency, getLatestBalance, sumAllocations} from "~/services/utils_service";
import {BucketDTO} from "#models/bucket";
import BucketsList from "~/components/BucketsList/BucketsList";
import {AllocationDTO} from "#models/allocation";

export default function UserHome({ userBuckets, user, userAccounts }: UserHomeDTO) {
  const [accounts, setAccounts] = useState<BankAccountDTO[]>(userAccounts);
  const [buckets, setBuckets] = useState<BucketDTO[]>(userBuckets);

  const balance = useMemo(() => {
    const amount = accounts.reduce((acc: number, account: BankAccountDTO) => {
      const latestBalance = getLatestBalance(account.balances)
      if (!latestBalance) return acc
      return acc += latestBalance.amount
    }, 0)

    return formatCurrency(amount)
  }, [accounts])

  const totalAllocations = useMemo(() => {
    const amount = buckets.reduce((acc: number, bucket: BucketDTO) => {
      return acc += sumAllocations(bucket.allocations)
    }, 0)
    return formatCurrency(amount)
  }, [buckets])

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
      <Flex align="center" gap="2">
        <Avatar fallback={user?.firstName?.[0] ?? ""} radius="full" />
        <Heading as="h1" size="3">
          Hello, {user?.firstName} {user?.lastName}
        </Heading>
      </Flex>

      <Box style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, marginTop: '1rem', gap: '1rem' }}>
        <Grid columns={{ sm: "1", lg: "2" }}>
          <TotalBalance balance={balance} allocations={totalAllocations} />
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
          updateAccount={updateAccount}
          accounts={accounts}
        />

        {/* BucketsList gets remaining space and becomes scrollable */}
        <Box style={{ flex: 1, minHeight: 0 }}>
          <BucketsList
            buckets={buckets}
            updateBuckets={updateBuckets}/>
        </Box>
      </Box>
    </Box>
  )


  /**
   * STATE MANAGEMENT
   */
  // ACCOUNTS
  function updateAccounts(accounts: BankAccountDTO[]) {
    setAccounts(accounts)
  }

  function updateAccount(account: BankAccountDTO) {
    const index = accounts.findIndex((acc: BankAccountDTO) => acc.id === account.id)
    accounts[index] = account
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
    buckets[index].allocations.push(allocation)
    setBuckets([...buckets])
  }
}
