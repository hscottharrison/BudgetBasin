# BudgetBasin Anti-Patterns and Technical Debt

This document identifies code issues, anti-patterns, and areas that need improvement in the BudgetBasin codebase.

---

## Table of Contents

1. [Critical Issues](#critical-issues)
2. [Moderate Issues](#moderate-issues)
3. [Minor Issues](#minor-issues)
4. [Testing Gaps](#testing-gaps)
5. [Priority Matrix](#priority-matrix)

---

## Critical Issues

### 1. Direct State Mutation in React Context

**Location:** `inertia/context/UserHomeContext.tsx:62-66`

**Current Code:**
```typescript
const updateAccountBalance = (balance: BalanceDTO) => {
  const index = accounts.findIndex((acc) => acc.id === balance.bankAccountId);
  accounts[index]?.balances.push(balance);  // MUTATES STATE DIRECTLY
  setAccounts([...accounts]);
}
```

**Problem:**
The `accounts` array is mutated directly before calling `setAccounts`. React's state should be treated as immutable. While the spread operator creates a new array reference, the nested `balances` array has already been mutated in place. This can cause:
- Unpredictable re-renders
- Stale closure issues
- Difficult-to-debug state inconsistencies

**Similar Issue at Line 72-79:**
```typescript
const updateTransactionsForBucket = (allocation: TransactionDTO) => {
  const index = buckets.findIndex((bucket) => bucket.id === allocation.bucketId);
  const bucketToUpdate = buckets[index];
  buckets[index] = {  // Mutating buckets array
    ...bucketToUpdate,
    transactions: [...bucketToUpdate.transactions, allocation],
  };
  setBuckets([...buckets]);
};
```

**Recommended Fix:**
```typescript
const updateAccountBalance = (balance: BalanceDTO) => {
  setAccounts(prevAccounts =>
    prevAccounts.map(acc =>
      acc.id === balance.bankAccountId
        ? { ...acc, balances: [...acc.balances, balance] }
        : acc
    )
  )
}

const updateTransactionsForBucket = (allocation: TransactionDTO) => {
  setBuckets(prevBuckets =>
    prevBuckets.map(bucket =>
      bucket.id === allocation.bucketId
        ? { ...bucket, transactions: [...bucket.transactions, allocation] }
        : bucket
    )
  )
}
```

---

### 2. Monkey-Patching window.fetch Without Cleanup

**Location:** `inertia/context/LoadingContext.tsx:14-27`

**Current Code:**
```typescript
useEffect(() => {
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    setIsLoading(true);
    try {
      const response = await originalFetch(input, init);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };
}, [])  // NO CLEANUP FUNCTION
```

**Problems:**
1. **No cleanup:** The original `fetch` is never restored when the component unmounts
2. **Concurrent requests:** If multiple requests are in flight, `isLoading` flickers between true/false
3. **Global side effect:** Modifying `window.fetch` affects all code, including third-party libraries
4. **Memory leak potential:** Stale references if component remounts

**Recommended Fix - Option A (Request Counter):**
```typescript
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0)
  const isLoading = activeRequests > 0

  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async function (input, init) {
      setActiveRequests(prev => prev + 1)
      try {
        return await originalFetch(input, init)
      } finally {
        setActiveRequests(prev => prev - 1)
      }
    }

    return () => {
      window.fetch = originalFetch  // Cleanup!
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
```

**Recommended Fix - Option B (Per-operation loading state):**
Consider using a library like `react-query`, `swr`, or `tanstack-query` which provides loading states per-query without global fetch interception.

---

### 3. DOM Access Instead of React Patterns

**Location:** `inertia/pages/Login/login.tsx:36-46`

**Current Code:**
```typescript
async function handleSubmit(event: FormEvent) {
  event.preventDefault()
  const email = document.getElementById('email') as HTMLInputElement
  const password = document.getElementById('password') as HTMLInputElement

  const payload: LoginDTO = {
    email: email.value,
    password: password.value,
  }

  await login(payload)
}
```

**Problem:**
Using `document.getElementById` bypasses React's declarative model:
- IDs must be unique across the entire DOM
- No type safety for element existence
- Breaks component encapsulation
- Won't work with SSR

**Recommended Fix - Option A (useRef):**
```typescript
export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload: LoginDTO = {
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    }
    await login(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input ref={emailRef} label="Email" name="email" type="email" />
      <Input ref={passwordRef} label="Password" name="password" type="password" />
      <Button type="submit">Sign In</Button>
    </form>
  )
}
```

**Recommended Fix - Option B (Controlled Inputs):**
```typescript
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Sign In</Button>
    </form>
  )
}
```

---

## Moderate Issues

### 4. Console Logs in Production Code

**Locations:**

**Backend:**
- `app/controllers/auth_controller.ts:8` - `console.log(data)`
- `app/controllers/auth_controller.ts:19` - `console.log('hit /api/login', request.body())`

**Frontend:**
- `inertia/services/budget_service.ts:42,45,53,57,62,65` - Multiple debug logs
- `inertia/services/budget_service.ts:143,145,149,153,156,158` - More debug logs

**Problem:**
Debug statements pollute production logs and may expose sensitive data.

**Recommended Fix:**
1. Remove all `console.log` statements
2. Use AdonisJS Logger for backend logging with appropriate levels:
```typescript
import logger from '@adonisjs/core/services/logger'

logger.debug('hit /api/login', { email: request.input('email') })
```
3. For frontend, use environment-based logging:
```typescript
const isDev = import.meta.env.DEV
if (isDev) console.log('debug info')
```

---

### 5. No Input Validation on Backend

**Location:** `app/controllers/auth_controller.ts:5-14`

**Current Code:**
```typescript
async register({ auth, request, response }: HttpContext) {
  try {
    const data = request.all()  // No validation!
    const user = await User.create(data)
    // ...
  }
}
```

**Problem:**
User input is passed directly to the database without validation. This can lead to:
- Invalid data in database
- Potential SQL injection (though Lucid mitigates this)
- Mass assignment vulnerabilities
- Poor error messages for users

**Recommended Fix:**
```typescript
// app/validators/auth_validator.ts
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(1).maxLength(100),
    lastName: vine.string().trim().minLength(1).maxLength(100),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
  })
)

// In controller:
async register({ auth, request, response }: HttpContext) {
  const data = await request.validateUsing(registerValidator)
  const user = await User.create(data)
  // ...
}
```

---

### 6. Sequential Database Operations

**Location:** `app/services/budget_service.ts:97-112`

**Current Code:**
```typescript
async createManyCategories(
  userId: number,
  categories: { name: string; type: 'income' | 'expense' }[]
): Promise<BudgetCategoryDTO[]> {
  const created: BudgetCategoryDTO[] = []
  for (let i = 0; i < categories.length; i++) {
    const cat = await this.createCategory({  // N round-trips!
      userId,
      name: categories[i].name,
      type: categories[i].type,
      sortOrder: i,
    })
    created.push(cat)
  }
  return created
}
```

**Problem:**
Creates records one-by-one, causing N database round-trips. This is slow and inefficient.

**Recommended Fix:**
```typescript
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
```

**Similar issues at:**
- `app/services/budget_service.ts:177-188` (`addManyTemplateItems`)
- `app/services/budget_service.ts:334-342` (expense categories in `createFullBudgetSetup`)
- `app/services/budget_service.ts:360-366` (template items in `createFullBudgetSetup`)

---

### 7. Missing Database Transactions

**Location:** `app/services/budget_service.ts:279-387` (`createFullBudgetSetup`)

**Problem:**
The `createFullBudgetSetup` method creates multiple related records:
1. Checking account
2. Balance record
3. Income category
4. Expense categories (multiple)
5. Budget template
6. Template items (multiple)
7. Budget period

If any step fails, partial data remains in the database, creating an inconsistent state.

**Recommended Fix:**
```typescript
import db from '@adonisjs/lucid/services/db'

async createFullBudgetSetup(userId: number, data: {...}): Promise<{...}> {
  return await db.transaction(async (trx) => {
    // 1. Create checking account
    const account = await BankAccount.create({
      userId,
      name: 'Checking',
      accountType: 'checking',
    }, { client: trx })

    // 2. Create balance
    await Balance.create({
      bankAccountId: account.id,
      amount: data.startingBalance,
    }, { client: trx })

    // ... continue with all other operations using { client: trx }

    return result
  })
}
```

---

### 8. Nullable Return Types Without Null Checks

**Various Locations**

**Example:**
```typescript
// Service returns nullable
async getActiveTemplateForUser(userId: number): Promise<BudgetTemplateDTO | null>

// Controller uses without check
const template = await this.budgetService.getActiveTemplateForUser(userId)
return inertia.render('page', { template })  // Could be null
```

**Problem:**
Functions that can return `null` are used without explicit null handling, which can cause runtime errors or unexpected behavior.

**Recommended Fix:**
1. Add explicit null checks where needed
2. Use `assertExists()` utility when null is an error condition
3. Document nullability in JSDoc comments

---

## Minor Issues

### 9. Inconsistent Error Handling

**Backend:**
- Some controllers use try-catch blocks
- Others rely entirely on the global exception handler
- Error responses have inconsistent formats

**Frontend:**
- Some components have local error state
- Others have no error handling
- No global error boundary

**Recommendation:**
1. Create custom exception classes for different error types
2. Standardize error response format: `{ error: string, code?: string, details?: object }`
3. Add React Error Boundary component
4. Implement global toast notifications for errors

---

### 10. Duplicate DTO Type Definitions

**Backend:** DTOs defined in `app/models/*.ts`
**Frontend:** Types defined in `inertia/types/*.ts`

**Problem:**
Changes to data structures require updates in two places, leading to potential drift.

**Recommendation Options:**
1. Generate types from a single source (OpenAPI spec)
2. Share types via a common package
3. Use code generation tools

---

### 11. Hard-coded Strings

**Locations:**
- `app/services/budget_service.ts:298-299` - `'Checking'`, `'Primary checking account'`
- `app/services/budget_service.ts:325-328` - `'Income'`
- Various places use `'checking'`, `'savings'` account types

**Recommendation:**
Create constants or enums:
```typescript
// app/constants/account.ts
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
} as const

export const DEFAULT_ACCOUNT_NAMES = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
}

export const DEFAULT_CATEGORIES = {
  INCOME: 'Income',
}
```

---

### 12. Missing Loading States

Some async operations lack loading indicators:
- Register form submission
- Some budget operations

**Recommendation:**
Add loading states to all buttons that trigger async operations:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

async function handleSubmit() {
  setIsSubmitting(true)
  try {
    await doAsyncWork()
  } finally {
    setIsSubmitting(false)
  }
}

<Button disabled={isSubmitting}>
  {isSubmitting ? <Spinner /> : 'Submit'}
</Button>
```

---

### 13. No Optimistic Updates

All mutations wait for server response before updating UI, causing perceived slowness.

**Recommendation:**
For better UX, implement optimistic updates with rollback:
```typescript
async function addEntry(entry: BudgetEntryDTO) {
  // Optimistic update
  const prevEntries = entries
  setEntries([...entries, { ...entry, id: 'temp-' + Date.now() }])

  try {
    const result = await createBudgetEntry(entry)
    // Replace temp entry with real one
    setEntries(prev => prev.map(e =>
      e.id === entry.tempId ? result.entry : e
    ))
  } catch (error) {
    // Rollback on error
    setEntries(prevEntries)
    throw error
  }
}
```

---

## Testing Gaps

### 14. No Tests for Backend Services

**Current State:** No unit tests for service methods in `app/services/`

**Impact:** Business logic changes can introduce bugs without detection.

**Recommendation:**
```typescript
// tests/unit/services/budget_service.spec.ts
import { test } from '@japa/runner'
import BudgetService from '#services/budget_service'

test.group('BudgetService', () => {
  test('getCategoriesForUser returns empty array for new user', async ({ assert }) => {
    const service = new BudgetService()
    const categories = await service.getCategoriesForUser(999999)
    assert.deepEqual(categories, [])
  })

  test('createCategory creates category with correct data', async ({ assert }) => {
    // ...
  })
})
```

---

### 15. No Component Tests

**Current State:** No React component tests

**Recommendation:** Use React Testing Library:
```typescript
// __tests__/components/CategoryList.test.tsx
import { render, screen } from '@testing-library/react'
import CategoryList from '~/components/MonthlyBudget/CategoryList'

describe('CategoryList', () => {
  it('renders income categories', () => {
    const categories = [
      { id: 1, name: 'Salary', type: 'income', sortOrder: 0 }
    ]

    render(<CategoryList type="income" categories={categories} />)

    expect(screen.getByText('Salary')).toBeInTheDocument()
  })
})
```

---

## Priority Matrix

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| **High** | Direct state mutation | Data inconsistency, bugs | Low |
| **High** | No input validation | Security vulnerability | Medium |
| **High** | Missing transactions | Data integrity | Medium |
| **Medium** | Monkey-patching fetch | Fragile loading state | Medium |
| **Medium** | Console logs | Log pollution | Low |
| **Medium** | Sequential DB ops | Performance | Low |
| **Medium** | No backend tests | Quality assurance | High |
| **Low** | DOM access in React | Code quality | Low |
| **Low** | Duplicate types | Maintainability | High |
| **Low** | Hard-coded strings | Maintainability | Low |
| **Low** | Missing loading states | UX | Low |

---

## Recommended Action Plan

### Phase 1: Critical Fixes (Immediate)
1. Fix state mutations in UserHomeContext
2. Add input validation to auth endpoints
3. Remove console.log statements

### Phase 2: Data Integrity (Short-term)
4. Add database transactions to multi-record operations
5. Fix LoadingContext fetch interception
6. Convert DOM access to React patterns

### Phase 3: Performance & Quality (Medium-term)
7. Convert sequential DB operations to bulk operations
8. Add backend service tests
9. Add frontend component tests

### Phase 4: Maintainability (Long-term)
10. Extract constants for hard-coded values
11. Unify DTO definitions
12. Standardize error handling patterns
13. Add loading states and optimistic updates
