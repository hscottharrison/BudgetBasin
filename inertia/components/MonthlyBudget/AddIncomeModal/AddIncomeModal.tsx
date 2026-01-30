import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'
import { CreateBudgetEntryDTO } from '#models/budget_entry'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'

type AddIncomeModalProps = {
  isOpen: boolean;
  handleClose: () => void;
}

export default function AddIncomeModal({ isOpen, handleClose }: AddIncomeModalProps) {
  const { addEntry } = useMonthlyBudget()

  const addIncomeConfig: FormModalProps<CreateBudgetEntryDTO> = {
    actionLabel: 'Add Income',
    title: 'Record Income',
    description: 'Add income you received this month',
    submitButtonLabel: 'Add',
    onSubmit: addEntry,
    formElements: [
      // {
      //   name: 'budgetCategoryId',
      //   label: 'Category',
      //   type: 'select',
      //   options: incomeCategories.map((c) => ({ label: c.name, value: `${c.id}` })),
      // },
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
      {...addIncomeConfig} />
  )
}
