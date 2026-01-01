import BudgetCategory, { BudgetCategoryDTO, CreateBudgetCategoryDTO } from '#models/budget_category'
import BudgetTemplate, { BudgetTemplateDTO, CreateBudgetTemplateDTO } from '#models/budget_template'
import BudgetTemplateItem, { CreateBudgetTemplateItemDTO } from '#models/budget_template_item'
import BudgetPeriod, { BudgetPeriodDTO, CreateBudgetPeriodDTO } from '#models/budget_period'
import BudgetEntry, { BudgetEntryDTO, CreateBudgetEntryDTO } from '#models/budget_entry'
import BankAccount, { BankAccountDTO } from '#models/bank_account'
import Balance from '#models/balance'

export default class BudgetService {
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
    const created: BudgetCategoryDTO[] = []
    for (let i = 0; i < categories.length; i++) {
      const cat = await this.createCategory({
        userId,
        name: categories[i].name,
        type: categories[i].type,
        sortOrder: i,
      })
      created.push(cat)
    }
    return created
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
    for (const item of items) {
      await this.addTemplateItem({
        budgetTemplateId: templateId,
        budgetCategoryId: item.categoryId,
        amount: item.amount,
      })
    }
  }

  // ==================== PERIODS ====================

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

  async createEntry(dto: CreateBudgetEntryDTO): Promise<BudgetEntryDTO> {
    const entry = await BudgetEntry.create({
      budgetPeriodId: dto.budgetPeriodId,
      budgetCategoryId: dto.budgetCategoryId,
      amount: dto.amount,
      note: dto.note ?? null,
    })

    await entry.load('category')

    return {
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
    // 1. Create checking account with starting balance (if provided)
    let checkingAccount: BankAccountDTO | null = null
    if (data.startingBalance && data.startingBalance > 0) {
      const account = await BankAccount.create({
        userId,
        name: 'Checking',
        description: 'Primary checking account',
        accountType: 'checking',
      })

      await Balance.create({
        bankAccountId: account.id,
        amount: data.startingBalance,
      })

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
    const incomeCategory = await this.createCategory({
      userId,
      name: 'Income',
      type: 'income',
      sortOrder: 0,
    })

    // 3. Create expense categories
    const expenseCategories: BudgetCategoryDTO[] = []
    for (let i = 0; i < data.expenses.length; i++) {
      const cat = await this.createCategory({
        userId,
        name: data.expenses[i].category,
        type: 'expense',
        sortOrder: i,
      })
      expenseCategories.push(cat)
    }

    const allCategories = [incomeCategory, ...expenseCategories]

    // 4. Create budget template
    const template = await this.createTemplate({
      userId,
      name: data.budgetName,
      isActive: true,
    })

    // 5. Add template items
    await this.addTemplateItem({
      budgetTemplateId: template.id,
      budgetCategoryId: incomeCategory.id,
      amount: data.income,
    })

    for (let i = 0; i < expenseCategories.length; i++) {
      await this.addTemplateItem({
        budgetTemplateId: template.id,
        budgetCategoryId: expenseCategories[i].id,
        amount: data.expenses[i].amount,
      })
    }

    // Re-fetch template with items
    const fullTemplate = await this.getActiveTemplateForUser(userId)

    // 6. Create budget period for current month
    const now = new Date()
    const period = await this.createPeriod({
      userId,
      budgetTemplateId: template.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      status: 'active',
    })

    return {
      categories: allCategories,
      template: fullTemplate!,
      period,
      checkingAccount,
    }
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
