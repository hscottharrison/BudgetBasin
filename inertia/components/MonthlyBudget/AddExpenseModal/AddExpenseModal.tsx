import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'
import { CreateBudgetEntryDTO } from '#models/budget_entry'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'

type AddExpenseModalProps = {
  isOpen: boolean;
  handleClose: () => void;
}

export default function AddExpenseModal({ isOpen, handleClose }: AddExpenseModalProps) {
  const { addEntry, expenseCategories } = useMonthlyBudget()

  const addExpenseConfig: FormModalProps<CreateBudgetEntryDTO> = {
    actionLabel: 'Add Expense',
    title: 'Record Expense',
    description: 'Add an expense for this month',
    submitButtonLabel: 'Add',
    onSubmit: addEntry,
    formElements: [
      {
        name: 'budgetCategoryId',
        label: 'Category',
        type: 'select',
        options: expenseCategories.map((c) => ({ label: c.name, value: `${c.id}` })),
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        step: '0.01',
      },
      {
        name: 'note',
        label: 'Note (optional)',
      },
    ],
  }

  return (
    <FormModal<CreateBudgetEntryDTO>
      handleClose={handleClose}
      isOpen={isOpen}
      controlled={true}
      {...addExpenseConfig} />
  )
}
