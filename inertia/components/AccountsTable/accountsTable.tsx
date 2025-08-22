import { Accordion } from 'radix-ui'
import {ChevronDownIcon, Flex, ScrollArea, Table} from '@radix-ui/themes'
import {DateTime} from "luxon";

import ConfirmationModal from "~/components/CommonComponents/ConfirmationModal/confirmationModal";
import EditBalance from "~/components/EditBalance/editBalance";

import {createBalance} from "~/services/balance_service";
import {formatCurrency, getLatestBalance} from "~/services/utils_service";
import {deleteAccount} from "~/services/account_service";

import {BankAccountDTO} from "#models/bank_account";

import './style.css'

type AccountsTableProps = {
  accounts: BankAccountDTO[],
  updateAccounts: (accounts: BankAccountDTO[]) => void,
  updateAccount: (account: BankAccountDTO) => void,
}

export default function AccountsTable({ accounts, updateAccounts, updateAccount }: AccountsTableProps) {
  return (
    <Accordion.Root
      className='accordion-root'
      type='single'
      collapsible>
      <Accordion.Item value='item-1'>
        <Accordion.Trigger className='accordion-trigger'>
            Your Accounts ({accounts.length})
            <ChevronDownIcon className="AccordionChevron" aria-hidden />
        </Accordion.Trigger>
        <Accordion.Content>
          <ScrollArea type='auto' style={{ width: '100%'}}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Account Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Balance</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {accounts.map((account) => {
                  const latestBalance = getLatestBalance(account.balances)
                  return (
                  <Table.Row key={account.id}>
                    <Table.RowHeaderCell className='no-wrap-cell'>
                      <Flex align='center'>
                        {account.name}
                      </Flex>
                    </Table.RowHeaderCell>
                    <Table.Cell className='no-wrap-cell'>{formatCurrency(latestBalance?.amount ?? 0)}</Table.Cell>
                    <Table.Cell className='no-wrap-cell'>
                      {latestBalance?.createdAt
                      ? DateTime.fromISO(latestBalance.createdAt).toFormat('yyyy-MM-dd HH:mm')
                      : ''}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align='center' justify='start' gap='4'>
                        <EditBalance
                          metadata={account}
                          onSubmit={onEditBalance} />
                        <ConfirmationModal
                          title='Delete Account'
                          description='This account and all balance/allocation information will be permanently deleted'
                          onConfirm={() => onDeleteConfirm(account.id)}/>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )})}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )

  async function onDeleteConfirm(id: number){
    const accounts = await deleteAccount(id);
    updateAccounts(accounts)
  }

  async function onEditBalance(balance: string, id: number){
    const payload = {
      bankAccountId: id,
      amount: balance,
    }

    const response = await createBalance(payload)
    updateAccount(response)
  }
}
