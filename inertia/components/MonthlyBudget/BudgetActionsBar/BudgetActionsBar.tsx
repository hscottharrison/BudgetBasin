import FormModal, { FormModalProps } from '~/components/CommonComponents/FormModal/formModal'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'

interface CreateBudgetEntryDTO {
  budgetCategoryId: number
  amount: number
  note?: string
}

interface CreateBudgetCategoryDTO {
  name: string
  type: 'income' | 'expense'
}

interface BudgetActionsBarProps {
  onAddCategory: (category: CreateBudgetCategoryDTO) => Promise<void>
}

export default function BudgetActionsBar({ onAddCategory }: BudgetActionsBarProps) {
  const { incomeCategories, expenseCategories, hasSetup } = useMonthlyBudget()



  const addIncomeCategoryConfig: FormModalProps<CreateBudgetCategoryDTO> = {
    actionLabel: 'Add Income Category',
    title: 'New Income Category',
    description: 'Create a new income source category',
    submitButtonLabel: 'Create',
    onSubmit: async (data) => onAddCategory({ ...data, type: 'income' }),
    formElements: [
      {
        name: 'name',
        label: 'Category Name',
      },
      {
        name: 'type',
        type: 'hidden',
        value: 'income',
      },
    ],
  }

  const addExpenseCategoryConfig: FormModalProps<CreateBudgetCategoryDTO> = {
    actionLabel: 'Add Expense Category',
    title: 'New Expense Category',
    description: 'Create a new expense category',
    submitButtonLabel: 'Create',
    onSubmit: async (data) => onAddCategory({ ...data, type: 'expense' }),
    formElements: [
      {
        name: 'name',
        label: 'Category Name',
      },
      {
        name: 'type',
        type: 'hidden',
        value: 'expense',
      },
    ],
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {hasSetup && (
        <>
          {/*<FormModal<CreateBudgetEntryDTO> {...addIncomeConfig} />*/}
          {/*<FormModal<CreateBudgetEntryDTO> {...addExpenseConfig} />*/}
        </>
      )}
      <FormModal<CreateBudgetCategoryDTO> {...addIncomeCategoryConfig} />
      <FormModal<CreateBudgetCategoryDTO> {...addExpenseCategoryConfig} />
    </div>
  )
}
