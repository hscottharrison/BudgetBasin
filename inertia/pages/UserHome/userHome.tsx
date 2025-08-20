import {Avatar, Container, Flex, Heading} from "@radix-ui/themes";
import {useMemo, useState} from "react";
import {UserHomeDTO} from "#models/user_home_dto";
import {BankAccountDTO} from "#models/bank_account";
import TotalBalance from "~/components/TotalBalance/totalBalance";
import AccountsTable from "~/components/AccountsTable/accountsTable";
import ActionsBar from "~/components/ActionsBar/ActionsBar";
import {getLatestBalance} from "~/services/utils_service";
import {BucketDTO} from "#models/bucket";
import BucketsList from "~/components/BucketsList";

export default function UserHome({ userBuckets, user, userAccounts }: UserHomeDTO) {
  const [accounts, setAccounts] = useState<BankAccountDTO[]>(userAccounts);
  const [buckets, setBuckets] = useState<BucketDTO[]>(userBuckets);

  const balance = useMemo(() => {
    console.log(buckets)
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const amount = accounts.reduce((acc: number, account: BankAccountDTO) => {
      const latestBalance = getLatestBalance(account.balances)
      if (!latestBalance) return acc
      return acc += latestBalance.amount
    }, 0)

    return formatter.format(amount);
  }, [accounts])

  return (
    <Container py='6' px='4' size='4'>
      <Flex align='center' gap='2'>
        <Avatar fallback={user?.firstName[0] ?? ''} radius='full' />
        <Heading as='h1' size='3'>Hello, {user?.firstName} {user?.lastName}</Heading>
      </Flex>
      <Flex direction='column' gap='4'>
        <TotalBalance balance={balance} />
        <ActionsBar updateAccounts={updateAccounts} updateBuckets={updateBuckets} />
        <AccountsTable updateAccounts={updateAccounts} accounts={accounts} />
        <BucketsList buckets={buckets} />
      </Flex>
    </Container>
  )

  function updateAccounts(accounts: BankAccountDTO[]) {
    setAccounts(accounts)
  }

  function updateBuckets(buckets: BucketDTO[]) {
    setBuckets(buckets)
  }
}
