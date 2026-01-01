import { Flex, ScrollArea } from '@radix-ui/themes'
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
  onAddEntry: (entry: CreateBudgetEntryDTO) => Promise<void>
  onAddCategory: (category: CreateBudgetCategoryDTO) => Promise<void>
}

export default function BudgetActionsBar({ onAddEntry, onAddCategory }: BudgetActionsBarProps) {
  const { incomeCategories, expenseCategories, hasSetup } = useMonthlyBudget()

  const addIncomeConfig: FormModalProps<CreateBudgetEntryDTO> = {
    actionLabel: 'Add Income',
    title: 'Record Income',
    description: 'Add income you received this month',
    submitButtonLabel: 'Add',
    onSubmit: onAddEntry,
    formElements: [
      {
        name: 'budgetCategoryId',
        label: 'Category',
        type: 'select',
        options: incomeCategories.map((c) => ({ label: c.name, value: `${c.id}` })),
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

  const addExpenseConfig: FormModalProps<CreateBudgetEntryDTO> = {
    actionLabel: 'Add Expense',
    title: 'Record Expense',
    description: 'Add an expense for this month',
    submitButtonLabel: 'Add',
    onSubmit: onAddEntry,
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
    <ScrollArea type="auto" scrollbars="horizontal" style={{ width: '100%', paddingBottom: '1rem' }}>
      <Flex gap="2">
        {hasSetup && (
          <>
            <FormModal<CreateBudgetEntryDTO> {...addIncomeConfig} />
            <FormModal<CreateBudgetEntryDTO> {...addExpenseConfig} />
          </>
        )}
        <FormModal<CreateBudgetCategoryDTO> {...addIncomeCategoryConfig} />
        <FormModal<CreateBudgetCategoryDTO> {...addExpenseCategoryConfig} />
      </Flex>
    </ScrollArea>
  )
}



