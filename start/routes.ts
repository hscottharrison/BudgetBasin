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
const SubscriptionController = () => import('#controllers/subscription_controller')

// Views
router.get('/', [ViewsController, 'landing'])
router.get('/register', [ViewsController, 'register'])
router.get('/login', [ViewsController, 'login'])

// Subscription pages (auth required, no subscription check)
router.get('/subscription', [ViewsController, 'subscription']).use(middleware.auth())
router.get('/subscription/success', [ViewsController, 'subscriptionSuccess']).use(middleware.auth())

// Protected pages (auth + subscription required)
router
  .get('/user-home', [ViewsController, 'userHome'])
  .use([middleware.auth(), middleware.subscription()])
router
  .get('/monthly-budget', [ViewsController, 'monthlyBudget'])
  .use([middleware.auth(), middleware.subscription()])

// AUTH
router.post('/api/register', [AuthController, 'register'])
router.post('/api/login', [AuthController, 'login'])
router.post('/api/logout', [AuthController, 'logout'])

// Subscription API (auth required, no subscription check)
router
  .post('/api/subscription/checkout', [SubscriptionController, 'createCheckout'])
  .use(middleware.auth())
router
  .post('/api/subscription/portal', [SubscriptionController, 'createPortal'])
  .use(middleware.auth())
router.get('/api/subscription/status', [SubscriptionController, 'getStatus']).use(middleware.auth())

// Stripe webhook (no auth - Stripe calls this)
router.post('/api/webhooks/stripe', [SubscriptionController, 'handleWebhook'])

// Protected API routes (auth + subscription required)
// Accounts
router
  .post('/api/accounts', [AccountsController, 'create'])
  .use([middleware.auth(), middleware.subscription()])
router
  .delete('/api/accounts/:id', [AccountsController, 'delete'])
  .use([middleware.auth(), middleware.subscription()])

// Balances
router
  .post('/api/balances', [BalancesController, 'create'])
  .use([middleware.auth(), middleware.subscription()])

// Buckets
router
  .post('/api/buckets', [BucketsController, 'create'])
  .use([middleware.auth(), middleware.subscription()])
router
  .delete('/api/buckets/:id', [BucketsController, 'delete'])
  .use([middleware.auth(), middleware.subscription()])

// Allocations
router
  .post('/api/transactions', [TransactionsController, 'create'])
  .use([middleware.auth(), middleware.subscription()])

// Budget
router
  .post('/api/budget/setup', [BudgetController, 'createFullSetup'])
  .use([middleware.auth(), middleware.subscription()])
router
  .post('/api/budget/categories', [BudgetController, 'createCategory'])
  .use([middleware.auth(), middleware.subscription()])
router
  .post('/api/budget/periods', [BudgetController, 'createPeriod'])
  .use([middleware.auth(), middleware.subscription()])
router
  .post('/api/budget/entries', [BudgetController, 'createEntry'])
  .use([middleware.auth(), middleware.subscription()])
router
  .delete('/api/budget/all', [BudgetController, 'deleteAll'])
  .use([middleware.auth(), middleware.subscription()])
router
  .delete('/api/budget/periods/:id', [BudgetController, 'deletePeriod'])
  .use([middleware.auth(), middleware.subscription()])
