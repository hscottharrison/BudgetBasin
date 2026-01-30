import CategoryList from '~/components/MonthlyBudget/CategoryList/CategoryList'
import { Columns2, Table as TableIcon, TrendingDown } from 'lucide-react'
import {
  Button,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from '~/components/ui'
import { useState } from 'react'
import { useMonthlyBudget } from '~/context/MonthlyBudgetContext'
import { formatCurrency, formatDate } from '~/services/utils_service'
import { BudgetCategoryTypes } from '~/types/enums'

export default function BudgetViewToggle() {
  const [activeView, setActiveView] = useState('list');
  const {currentPeriod} = useMonthlyBudget()
  return (
    <>
      <div className="w-full flex justify-end mb-4">
        {/*<ButtonGroup*/}
          <Button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 hover:bg-primary hover:text-primary-foreground ${activeView === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
            variant="outline">
            <Columns2 />
          </Button>
          <Button
            onClick={() => setActiveView('table')}
            className={`px-4 py-2 hover:bg-primary hover:text-primary-foreground ${activeView === 'table' ? 'bg-primary text-primary-foreground' : ''}`}
            variant="outline">
            <TableIcon />
          </Button>
        {/*</ButtonGroup>*/}
      </div>
      {activeView === 'list' && (
        <div className="flex-1 min-h-0 flex gap-6">
          {/* Expenses - Scrollable */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <CategoryList
              type="expense"
              title="Expenses"
              icon={<TrendingDown size={16} className="text-red-600" />}
              scrollable
            />
          </div>
        </div>
      )}
      {activeView === 'table' && (
        <div className="flex-1 min-h-0 flex">
          <Table className='overflow-auto'>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPeriod?.entries
                .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
                .map((entry) => (
                  <TableRow>
                    <TableCell>
                      {entry.category.type === BudgetCategoryTypes.INCOME ? 'Income' : 'Expense'}
                    </TableCell>
                    <TableCell>
                      {entry.category.name}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      {entry.note}
                    </TableCell>
                    <TableCell>
                      {formatDate(entry.createdAt ?? '')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
