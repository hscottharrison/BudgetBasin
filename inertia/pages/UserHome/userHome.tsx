import {Avatar, Container, Flex, Heading} from "@radix-ui/themes";
import {useMemo, useState} from "react";
import {BalanceDTO} from "#models/balance";
import {UserHomeDTO} from "#models/user_home_dto";
import {BankAccountDTO} from "#models/bank_account";
import TotalBalance from "~/components/TotalBalance/totalBalance";
import AccountsTable from "~/components/AccountsTable/accountsTable";
import ActionsBar from "~/components/ActionsBar/ActionsBar";

export default function UserHome({ user, userAccounts }: UserHomeDTO) {
  const [accounts, setAccounts] = useState<BankAccountDTO[]>(userAccounts);

  const balance = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const amount = accounts.reduce((acc: number, account: BankAccountDTO) => {
      return acc += account.balances.reduce((acc: number, balance: BalanceDTO) => acc += balance.amount, 0)
    }, 0)

    return formatter.format(amount);
  }, [accounts])

  return (
    <Container py='6' px='4'>
      <Flex align='center' gap='2'>
        <Avatar fallback={user?.firstName[0] ?? ''} radius='full' />
        <Heading as='h1' size='3'>Hello, {user?.firstName} {user?.lastName}</Heading>
      </Flex>
      <Flex direction='column' gap='4'>
        <TotalBalance balance={balance} />
        <ActionsBar updateAccounts={updateAccounts} />
        <AccountsTable updateAccounts={updateAccounts} accounts={accounts} />
      </Flex>
    </Container>
  )

  function updateAccounts(accounts: BankAccountDTO[]) {
    setAccounts(accounts)
  }
}
