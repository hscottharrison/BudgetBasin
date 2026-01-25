import { Pencil, Building2 } from 'lucide-react'
import { DateTime } from 'luxon'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import ConfirmationModal from '~/components/CommonComponents/ConfirmationModal/confirmationModal'
import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'

import { createBalance } from '~/services/balance_service'
import { formatCurrency, getLatestBalance } from '~/services/utils_service'
import { deleteAccount } from '~/services/account_service'

import { BalanceDTO, CreateBalanceDTO } from '#models/balance'
import { useUserHome } from '~/context/SavingsContext'

export default function AccountsTable() {
  const { accounts, updateAccounts, updateAccountBalance } = useUserHome()

  return (
    <div className="border border-border bg-card">
      <Accordion type="single" collapsible>
        <AccordionItem value="accounts" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-muted-foreground" />
              <span className="text-sm font-semibold uppercase tracking-wide">Accounts</span>
              <span className="text-xs text-muted-foreground">({accounts.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="border-t border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-wider font-medium">Name</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-medium">Balance</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-medium">Updated</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => {
                    const latestBalance = getLatestBalance(account.balances)
                    return (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium text-sm whitespace-nowrap">
                          {account.name}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums whitespace-nowrap">
                          {formatCurrency(latestBalance?.amount ?? 0)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {latestBalance?.createdAt
                            ? DateTime.fromISO(latestBalance.createdAt).toFormat('MMM d, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
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
    </div>
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
