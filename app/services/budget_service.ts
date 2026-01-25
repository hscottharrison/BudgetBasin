import BudgetCategory, { BudgetCategoryDTO, CreateBudgetCategoryDTO } from '#models/budget_category'
import BudgetTemplate, {
  ActiveBudgetListItemDTO,
  BudgetTemplateDTO,
  CreateBudgetTemplateDTO,
} from '#models/budget_template'
import BudgetTemplateItem, { CreateBudgetTemplateItemDTO } from '#models/budget_template_item'
import BudgetPeriod, { BudgetPeriodDTO, CreateBudgetPeriodDTO } from '#models/budget_period'
import BudgetEntry, { BudgetEntryDTO, CreateBudgetEntryDTO } from '#models/budget_entry'
import BankAccount, { BankAccountDTO } from '#models/bank_account'
import Balance from '#models/balance'
import db from '@adonisjs/lucid/services/db'

export default class BudgetService {
  // ==================== CHECKING ACCOUNT ====================

  /**
   * Get the user's checking account with current balance
   */
  async getCheckingAccountForUser(userId: number): Promise<BankAccountDTO | null> {
    const account = await BankAccount.query()
      .where('userId', userId)
      .where('accountType', 'checking')
      .preload('balances', (query) => {
        query.orderBy('createdAt', 'desc').limit(1)
      })
      .first()

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      accountType: account.accountType,
      balances: account.balances.map((b) => ({
        id: b.id,
        amount: Number(b.amount),
        bankAccountId: b.bankAccountId,
        createdAt: b.createdAt?.toISO() ?? null,
      })),
      createdAt: account.createdAt?.toISO() ?? null,
    }
  }

  /**
   * Update the checking account balance by adding/subtracting an amount
   * @param userId - The user's ID
   * @param delta - Positive for income, negative for expense
   */
  async updateCheckingAccountBalance(userId: number, delta: number): Promise<number | null> {
    const account = await BankAccount.query()
      .where('userId', userId)
      .where('accountType', 'checking')
      .preload('balances', (query) => {
        query.orderBy('createdAt', 'desc').limit(1)
      })
      .first()

    if (!account || account.balances.length === 0) return null

    const currentBalance = account.balances[0]
    const newAmount = Number(currentBalance.amount) + delta

    // Update the existing balance record
    currentBalance.amount = newAmount
    await currentBalance.save()

    return newAmount
  }

  // ==================== CATEGORIES ====================

  async getCategoriesForUser(userId: number): Promise<BudgetCategoryDTO[]> {
    const categories = await BudgetCategory.query()
      .where('userId', userId)
      .orderBy('sortOrder', 'asc')

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      sortOrder: c.sortOrder,
    }))
  }

  async createCategory(dto: CreateBudgetCategoryDTO): Promise<BudgetCategoryDTO> {
    const category = await BudgetCategory.create({
      userId: dto.userId,
      name: dto.name,
      type: dto.type,
      sortOrder: dto.sortOrder ?? 0,
    })

    return {
      id: category.id,
      name: category.name,
      type: category.type,
      sortOrder: category.sortOrder,
    }
  }

  async createManyCategories(
    userId: number,
    categories: { name: string; type: 'income' | 'expense' }[]
  ): Promise<BudgetCategoryDTO[]> {
    const records = categories.map((cat, i) => ({
      userId,
      name: cat.name,
      type: cat.type,
      sortOrder: i,
    }))

    const created = await BudgetCategory.createMany(records)

    return created.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      sortOrder: c.sortOrder,
    }))
  }

  // ==================== TEMPLATES ====================

  async getActiveTemplateForUser(userId: number): Promise<BudgetTemplateDTO | null> {
    const template = await BudgetTemplate.query()
      .where('userId', userId)
      .where('isActive', true)
      .preload('items', (query) => {
        query.preload('category')
      })
      .first()

    if (!template) return null

    return {
      id: template.id,
      name: template.name,
      isActive: template.isActive,
      items: template.items.map((item) => ({
        id: item.id,
        budgetTemplateId: item.budgetTemplateId,
        budgetCategoryId: item.budgetCategoryId,
        category: {
          id: item.category.id,
          name: item.category.name,
          type: item.category.type,
          sortOrder: item.category.sortOrder,
        },
        amount: Number(item.amount),
      })),
    }
  }

  async createTemplate(dto: CreateBudgetTemplateDTO): Promise<BudgetTemplateDTO> {
    // Deactivate any existing active templates for this user
    if (dto.isActive !== false) {
      await BudgetTemplate.query()
        .where('userId', dto.userId!)
        .where('isActive', true)
        .update({ isActive: false })
    }

    const template = await BudgetTemplate.create({
      userId: dto.userId,
      name: dto.name,
      isActive: dto.isActive ?? true,
    })

    return {
      id: template.id,
      name: template.name,
      isActive: template.isActive,
      items: [],
    }
  }

  async addTemplateItem(dto: CreateBudgetTemplateItemDTO): Promise<void> {
    await BudgetTemplateItem.create({
      budgetTemplateId: dto.budgetTemplateId,
      budgetCategoryId: dto.budgetCategoryId,
      amount: dto.amount,
    })
  }

  async addManyTemplateItems(
    templateId: number,
    items: { categoryId: number; amount: number }[]
  ): Promise<void> {
    const records = items.map((item) => ({
      budgetTemplateId: templateId,
      budgetCategoryId: item.categoryId,
      amount: item.amount,
    }))

    await BudgetTemplateItem.createMany(records)
  }

  // ==================== PERIODS ====================

  async getPeriodById(periodId: number): Promise<BudgetPeriodDTO | null> {
    const period = await BudgetPeriod.query()
      .where('id', periodId)
      .preload('entries', (query) => {
        query.preload('category')
      })
      .first()
    if (!period) return null
    return this.periodToDTO(period)
  }
  async getCurrentPeriodForUser(userId: number): Promise<BudgetPeriodDTO | null> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    const period = await BudgetPeriod.query()
      .where('userId', userId)
      .where('year', year)
      .where('month', month)
      .preload('entries', (query) => {
        query.preload('category')
      })
      .first()

    if (!period) return null

    return this.periodToDTO(period)
  }

  async createPeriod(dto: CreateBudgetPeriodDTO): Promise<BudgetPeriodDTO> {
    const period = await BudgetPeriod.create({
      userId: dto.userId,
      budgetTemplateId: dto.budgetTemplateId,
      year: dto.year,
      month: dto.month,
      status: dto.status ?? 'active',
    })

    await period.load('entries')

    return this.periodToDTO(period)
  }

  // ==================== ENTRIES ====================

  /**
   * Create a budget entry and update the checking account balance accordingly
   * Income entries increase the balance, expense entries decrease it
   */
  async createEntry(
    dto: CreateBudgetEntryDTO,
    userId?: number
  ): Promise<{ entry: BudgetEntryDTO; newBalance: number | null }> {
    const entry = await BudgetEntry.create({
      budgetPeriodId: dto.budgetPeriodId,
      budgetCategoryId: dto.budgetCategoryId,
      amount: dto.amount,
      note: dto.note ?? null,
    })

    await entry.load('category')

    // Update checking account balance based on category type
    let newBalance: number | null = null
    if (userId) {
      const delta = entry.category.type === 'income' ? dto.amount : -dto.amount
      newBalance = await this.updateCheckingAccountBalance(userId, delta)
    }

    return {
      entry: {
        id: entry.id,
        budgetPeriodId: entry.budgetPeriodId,
        budgetCategoryId: entry.budgetCategoryId,
        category: {
          id: entry.category.id,
          name: entry.category.name,
          type: entry.category.type,
          sortOrder: entry.category.sortOrder,
        },
        amount: Number(entry.amount),
        note: entry.note,
        createdAt: entry.createdAt?.toISO() ?? null,
      },
      newBalance,
    }
  }

  // ==================== FULL SETUP ====================

  /**
   * Create a complete budget setup in one transaction:
   * - Create a checking account with starting balance (if provided)
   * - Create income and expense categories
   * - Create a budget template with target amounts
   * - Create a budget period for the current month
   */
  async createFullBudgetSetup(
    userId: number,
    data: {
      budgetName: string
      income: number
      startingBalance?: number
      expenses: { category: string; amount: number }[]
    }
  ): Promise<{
    categories: BudgetCategoryDTO[]
    template: BudgetTemplateDTO
    period: BudgetPeriodDTO
    checkingAccount: BankAccountDTO | null
  }> {
    return await db.transaction(async (trx) => {
      // 1. Create checking account with starting balance (if provided)
      let checkingAccount: BankAccountDTO | null = null
      if (data.startingBalance && data.startingBalance > 0) {
        const account = await BankAccount.create(
          {
            userId,
            name: 'Checking',
            description: 'Primary checking account',
            accountType: 'checking',
          },
          { client: trx }
        )

        await Balance.create(
          {
            bankAccountId: account.id,
            amount: data.startingBalance,
          },
          { client: trx }
        )

        // Reload with balances
        await account.load('balances')
        checkingAccount = {
          id: account.id,
          name: account.name,
          accountType: account.accountType,
          balances: account.balances.map((b) => ({
            id: b.id,
            amount: Number(b.amount),
            bankAccountId: b.bankAccountId,
            createdAt: b.createdAt?.toISO() ?? null,
          })),
          createdAt: account.createdAt?.toISO() ?? null,
        }
      }

      // 2. Create income category
      const incomeCategory = await BudgetCategory.create(
        {
          userId,
          name: 'Income',
          type: 'income',
          sortOrder: 0,
        },
        { client: trx }
      )

      // 3. Create expense categories using bulk insert
      const expenseCategoryRecords = data.expenses.map((expense, i) => ({
        userId,
        name: expense.category,
        type: 'expense' as const,
        sortOrder: i + 1,
      }))

      const expenseCategories = await BudgetCategory.createMany(expenseCategoryRecords, {
        client: trx,
      })

      const allCategories: BudgetCategoryDTO[] = [
        {
          id: incomeCategory.id,
          name: incomeCategory.name,
          type: incomeCategory.type,
          sortOrder: incomeCategory.sortOrder,
        },
        ...expenseCategories.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          sortOrder: c.sortOrder,
        })),
      ]

      // 4. Deactivate any existing active templates and create new one
      await BudgetTemplate.query({ client: trx })
        .where('userId', userId)
        .where('isActive', true)
        .update({ isActive: false })

      const template = await BudgetTemplate.create(
        {
          userId,
          name: data.budgetName,
          isActive: true,
        },
        { client: trx }
      )

      // 5. Add template items using bulk insert
      const templateItemRecords = [
        {
          budgetTemplateId: template.id,
          budgetCategoryId: incomeCategory.id,
          amount: data.income,
        },
        ...expenseCategories.map((cat, i) => ({
          budgetTemplateId: template.id,
          budgetCategoryId: cat.id,
          amount: data.expenses[i].amount,
        })),
      ]

      await BudgetTemplateItem.createMany(templateItemRecords, { client: trx })

      // 6. Create budget period for current month
      const now = new Date()
      const period = await BudgetPeriod.create(
        {
          userId,
          budgetTemplateId: template.id,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          status: 'active',
        },
        { client: trx }
      )

      // Re-fetch template with items for the response
      const fullTemplate = await BudgetTemplate.query({ client: trx })
        .where('id', template.id)
        .preload('items', (query) => {
          query.preload('category')
        })
        .firstOrFail()

      return {
        categories: allCategories,
        template: {
          id: fullTemplate.id,
          name: fullTemplate.name,
          isActive: fullTemplate.isActive,
          items: fullTemplate.items.map((item) => ({
            id: item.id,
            budgetTemplateId: item.budgetTemplateId,
            budgetCategoryId: item.budgetCategoryId,
            category: {
              id: item.category.id,
              name: item.category.name,
              type: item.category.type,
              sortOrder: item.category.sortOrder,
            },
            amount: Number(item.amount),
          })),
        },
        period: {
          id: period.id,
          year: period.year,
          month: period.month,
          status: period.status,
          entries: [],
        },
        checkingAccount,
      }
    })
  }

  async getBudgetListForUser(userId: number): Promise<ActiveBudgetListItemDTO[]> {
    const templates = await BudgetTemplate.query()
      .preload('periods')
      .where('userId', userId)
      .orderBy('isActive', 'desc')
      .orderBy('name', 'asc')
    return templates.map((t) => {
      const json = t.serialize()
      return {
        id: json.id,
        name: json.name,
        periods: json.periods ?? [],
      }
    })
  }

  // ==================== DELETE ====================

  /**
   * Delete all budget data for a user (categories, templates, periods, entries)
   * This allows starting fresh with a new budget setup
   */
  async deleteAllBudgetData(userId: number): Promise<void> {
    // Delete in order to respect foreign key constraints:
    // 1. Delete all budget entries (via periods cascade)
    // 2. Delete all budget periods
    // 3. Delete all template items (via templates cascade)
    // 4. Delete all budget templates
    // 5. Delete all budget categories

    // Delete budget periods (entries will cascade delete)
    await BudgetPeriod.query().where('userId', userId).delete()

    // Delete budget templates (template items will cascade delete)
    await BudgetTemplate.query().where('userId', userId).delete()

    // Delete budget categories
    await BudgetCategory.query().where('userId', userId).delete()
  }

  /**
   * Delete a specific budget period and its entries
   */
  async deletePeriod(userId: number, periodId: number): Promise<void> {
    await BudgetPeriod.query()
      .where('id', periodId)
      .where('userId', userId)
      .delete()
  }

  // ==================== HELPERS ====================

  private periodToDTO(period: BudgetPeriod): BudgetPeriodDTO {
    return {
      id: period.id,
      year: period.year,
      month: period.month,
      status: period.status,
      entries: period.entries.map((e) => ({
        id: e.id,
        budgetPeriodId: e.budgetPeriodId,
        budgetCategoryId: e.budgetCategoryId,
        category: {
          id: e.category.id,
          name: e.category.name,
          type: e.category.type,
          sortOrder: e.category.sortOrder,
        },
        amount: Number(e.amount),
        note: e.note,
        createdAt: e.createdAt?.toISO() ?? null,
      })),
    }
  }
}
