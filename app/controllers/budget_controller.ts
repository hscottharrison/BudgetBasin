import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import BudgetService from '#services/budget_service'

@inject()
export default class BudgetController {
  constructor(private budgetService: BudgetService) {}

  /**
   * POST /api/budget/setup
   * Create a complete budget setup (categories, template, period)
   */
  async createFullSetup({ request, auth, response }: HttpContext) {
    console.log('POST /api/budget/setup - createFullSetup called')
    const userId = auth.user?.id
    console.log('User ID:', userId)
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    const data = request.only(['budgetName', 'income', 'startingBalance', 'expenses'])
    console.log('Request data:', data)

    try {
      const result = await this.budgetService.createFullBudgetSetup(userId, {
        budgetName: data.budgetName,
        income: Number(data.income),
        startingBalance: data.startingBalance ? Number(data.startingBalance) : undefined,
        expenses: data.expenses || [],
      })
      console.log('Budget setup created successfully:', result)

      return response.created(result)
    } catch (error) {
      console.error('Budget setup error:', error)
      return response.badRequest({ error: 'Failed to create budget setup' })
    }
  }

  /**
   * POST /api/budget/categories
   * Create a new budget category
   */
  async createCategory({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    const { name, type, sortOrder } = request.only(['name', 'type', 'sortOrder'])

    try {
      const category = await this.budgetService.createCategory({
        userId,
        name,
        type,
        sortOrder,
      })
      return response.created(category)
    } catch (error) {
      console.error('Create category error:', error)
      return response.badRequest({ error: 'Failed to create category' })
    }
  }

  /**
   * POST /api/budget/periods
   * Create a new budget period for the current month
   */
  async createPeriod({ auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    try {
      // Get active template
      const template = await this.budgetService.getActiveTemplateForUser(userId)

      const now = new Date()
      const period = await this.budgetService.createPeriod({
        userId,
        budgetTemplateId: template?.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        status: 'active',
      })

      return response.created(period)
    } catch (error) {
      console.error('Create period error:', error)
      return response.badRequest({ error: 'Failed to create period' })
    }
  }

  /**
   * POST /api/budget/entries
   * Create a new budget entry and update checking account balance
   */
  async createEntry({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    const { budgetPeriodId, budgetCategoryId, amount, note } = request.only([
      'budgetPeriodId',
      'budgetCategoryId',
      'amount',
      'note',
    ])

    try {
      const result = await this.budgetService.createEntry(
        {
          budgetPeriodId,
          budgetCategoryId,
          amount: Number(amount),
          note,
        },
        userId
      )
      return response.created(result)
    } catch (error) {
      console.error('Create entry error:', error)
      return response.badRequest({ error: 'Failed to create entry' })
    }
  }

  /**
   * DELETE /api/budget/all
   * Delete all budget data for the current user (start fresh)
   */
  async deleteAll({ auth, response }: HttpContext) {
    console.log('DELETE /api/budget/all - deleteAll called')
    const userId = auth.user?.id
    console.log('User ID:', userId)
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    try {
      await this.budgetService.deleteAllBudgetData(userId)
      console.log('All budget data deleted successfully')
      return response.ok({ success: true, message: 'All budget data deleted' })
    } catch (error) {
      console.error('Delete all budget data error:', error)
      return response.badRequest({ error: 'Failed to delete budget data' })
    }
  }

  /**
   * DELETE /api/budget/periods/:id
   * Delete a specific budget period
   */
  async deletePeriod({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    try {
      await this.budgetService.deletePeriod(userId, params.id)
      return response.ok({ success: true, message: 'Budget period deleted' })
    } catch (error) {
      console.error('Delete period error:', error)
      return response.badRequest({ error: 'Failed to delete period' })
    }
  }
}
