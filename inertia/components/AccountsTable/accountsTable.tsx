import { Pencil } from 'lucide-react'
import { DateTime } from 'luxon'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import ConfirmationModal from '~/components/CommonComponents/ConfirmationModal/confirmationModal'
import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'

import { createBalance } from '~/services/balance_service'
import { formatCurrency, getLatestBalance } from '~/services/utils_service'
import { deleteAccount } from '~/services/account_service'

import { BalanceDTO, CreateBalanceDTO } from '#models/balance'

import './style.css'
import { useUserHome } from '~/context/UserHomeContext'

export default function AccountsTable() {
  const { accounts, updateAccounts, updateAccountBalance } = useUserHome()

  return (
    <Accordion type="single" collapsible className="accordion-root">
      <AccordionItem value="item-1">
        <AccordionTrigger className="accordion-trigger">
          Your Accounts ({accounts.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const latestBalance = getLatestBalance(account.balances)
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="no-wrap-cell">
                        <div className="flex items-center">{account.name}</div>
                      </TableCell>
                      <TableCell className="no-wrap-cell">
                        {formatCurrency(latestBalance?.amount ?? 0)}
                      </TableCell>
                      <TableCell className="no-wrap-cell">
                        {latestBalance?.createdAt
                          ? DateTime.fromISO(latestBalance.createdAt).toFormat('yyyy-MM-dd HH:mm')
                          : ''}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-start gap-4">
                          <FormModal {...getEditBalanceConfig(account.id)} />
                          <ConfirmationModal
                            title="Delete Account"
                            description="This account and all balance/allocation information will be permanently deleted"
                            onConfirm={() => onDeleteConfirm(account.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  async function onDeleteConfirm(id: number) {
    const accounts = await deleteAccount(id)
    updateAccounts(accounts)
  }

  async function onEditBalance(payload: CreateBalanceDTO) {
    const response: BalanceDTO = await createBalance(payload)
    updateAccountBalance(response)
  }

  function getEditBalanceConfig(id: number): FormModalProps<CreateBalanceDTO> {
    return {
      title: 'Edit Balance',
      description: 'Update the balance of your account',
      actionLabelIcon: <Pencil className="h-4 w-4" />,
      submitButtonLabel: 'Update',
      onSubmit: onEditBalance,
      formElements: [
        {
          name: 'bankAccountId',
          type: 'hidden',
          value: `${id}`,
        },
        {
          name: 'amount',
          label: 'Updated Balance',
          type: 'number',
          step: '0.01',
        },
      ],
    }
  }
}
