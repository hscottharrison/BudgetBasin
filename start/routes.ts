/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const TransactionsController = () => import('#controllers/transactions_controller')
const BucketsController = () => import('#controllers/buckets_controller')
const BalancesController = () => import('#controllers/balances_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const AuthController = () => import('#controllers/auth_controller')
const ViewsController = () => import('#controllers/views_controller')
const BudgetController = () => import('#controllers/budget_controller')

// Views
router.get('/', [ViewsController, 'home'])
router.get('/register', [ViewsController, 'register'])
router.get('/login', [ViewsController, 'login'])
router.get('/user-home', [ViewsController, 'userHome']).use(middleware.auth())
router.get('/monthly-budget', [ViewsController, 'monthlyBudget']).use(middleware.auth())

// AUTH
router.post('/api/register', [AuthController, 'register'])
router.post('/api/login', [AuthController, 'login'])
router.post('/api/logout', [AuthController, 'logout'])

// Accounts
router.post('/api/accounts', [AccountsController, 'create']).use(middleware.auth())
router.delete('/api/accounts/:id', [AccountsController, 'delete']).use(middleware.auth())

// Balances
router.post('/api/balances', [BalancesController, 'create']).use(middleware.auth())

// Buckets
router.post('/api/buckets', [BucketsController, 'create']).use(middleware.auth())
router.delete('/api/buckets/:id', [BucketsController, 'delete']).use(middleware.auth())

// Allocations
router.post('/api/transactions', [TransactionsController, 'create']).use(middleware.auth())

// Budget
router.post('/api/budget/setup', [BudgetController, 'createFullSetup']).use(middleware.auth())
router.post('/api/budget/categories', [BudgetController, 'createCategory']).use(middleware.auth())
router.post('/api/budget/periods', [BudgetController, 'createPeriod']).use(middleware.auth())
router.post('/api/budget/entries', [BudgetController, 'createEntry']).use(middleware.auth())
router.delete('/api/budget/all', [BudgetController, 'deleteAll']).use(middleware.auth())
router.delete('/api/budget/periods/:id', [BudgetController, 'deletePeriod']).use(middleware.auth())
