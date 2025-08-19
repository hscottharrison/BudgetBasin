import {ChevronDownIcon, Flex, ScrollArea, Table} from '@radix-ui/themes'
import { Accordion } from 'radix-ui'
import './style.css'
import {DateTime} from "luxon";
import {BankAccountDTO} from "#models/bank_account";
import ConfirmationModal from "~/components/CommonComponents/ConfirmationModal/confirmationModal";
import {deleteAccount} from "~/services/account_service";

type AccountsTableProps = {
  accounts: BankAccountDTO[],
  updateAccounts: (accounts: BankAccountDTO[]) => void,
}

export default function AccountsTable({ accounts, updateAccounts }: AccountsTableProps) {
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
                {accounts.map((account) => (
                  <Table.Row key={account.id}>
                    <Table.RowHeaderCell className='no-wrap-cell'>{account.name}</Table.RowHeaderCell>
                    <Table.Cell>{account.balances[0].amount}</Table.Cell>
                    <Table.Cell className='no-wrap-cell'>
                      {account.updatedAt
                      ? DateTime.fromISO(account.updatedAt).toFormat('yyyy-MM-dd HH:mm')
                      : ''}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap='4'>
                        <ConfirmationModal
                          title='Delete Account'
                          description='This account and all balance/allocation information will be permanently deleted'
                          onConfirm={() => onDeleteConfirm(account.id)}/>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
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
}
