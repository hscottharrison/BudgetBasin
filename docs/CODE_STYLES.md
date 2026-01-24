# BudgetBasin Code Styles and Patterns

This document outlines the coding conventions, architectural patterns, and standards used throughout the BudgetBasin codebase.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Backend Patterns](#backend-patterns)
3. [Frontend Patterns](#frontend-patterns)
4. [Naming Conventions](#naming-conventions)
5. [TypeScript Usage](#typescript-usage)
6. [Styling Approach](#styling-approach)
7. [Authentication](#authentication)
8. [Data Flow](#data-flow)

---

## Project Structure

```
BudgetBasin/
├── app/                          # Backend application code
│   ├── controllers/              # HTTP request handlers
│   ├── models/                   # Lucid ORM models + DTOs
│   ├── services/                 # Business logic layer
│   ├── middleware/               # HTTP middleware
│   └── exceptions/               # Custom error handlers
├── inertia/                      # Frontend application code
│   ├── app/                      # React app entry point
│   ├── pages/                    # Inertia page components
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # ShadCN UI base components
│   │   ├── CommonComponents/     # Shared form/layout components
│   │   └── [Feature]/            # Feature-specific components
│   ├── context/                  # React Context providers
│   ├── services/                 # API client layer
│   ├── types/                    # TypeScript type definitions
│   ├── lib/                      # Utility functions
│   └── css/                      # Global styles
├── config/                       # AdonisJS configuration files
├── database/                     # Database layer
│   └── migrations/               # Schema migrations
├── start/                        # Application bootstrap
│   ├── routes.ts                 # Route definitions
│   ├── kernel.ts                 # Middleware registration
│   └── env.ts                    # Environment validation
├── resources/views/              # Edge templates
└── tests/                        # Test suites
```

---

## Backend Patterns

### Controller Pattern

Controllers handle HTTP requests and delegate business logic to services. They use dependency injection via the `@inject()` decorator.

```typescript
// app/controllers/views_controller.ts
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ViewsController {
  constructor(
    private accountService: AccountsService,
    private bucketsService: BucketsService,
    private budgetService: BudgetService
  ) {}

  async userHome({ inertia, auth }: HttpContext) {
    const userId = auth?.user?.id ?? 0
    const accounts = await this.accountService.GetSavingsAccountsForUser(userId)
    const buckets = await this.bucketsService.GetAllBucketsForUser(userId)

    return inertia.render('UserHome/userHome', { accounts, buckets })
  }
}
```

**Key Points:**
- Services are injected via constructor
- Destructure `HttpContext` to access `request`, `response`, `auth`, `inertia`
- Return `inertia.render()` for page views, `response.json()` for API endpoints

### Service Layer

Business logic is encapsulated in service classes under `app/services/`. Services return DTOs (Data Transfer Objects), not raw Lucid models.

```typescript
// app/services/budget_service.ts
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

  // ==================== TEMPLATES ====================

  async getActiveTemplateForUser(userId: number): Promise<BudgetTemplateDTO | null> {
    // ...
  }
}
```

**Key Points:**
- Organize methods with section comments: `// ==================== SECTION ====================`
- Return typed DTOs, not raw models
- Keep services focused on single domain areas

### Model Definitions

Models use Lucid ORM decorators with co-located DTO type definitions.

```typescript
// app/models/budget_category.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

export default class BudgetCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare type: 'income' | 'expense'

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

// Co-located DTOs
export type BudgetCategoryDTO = {
  id: number
  name: string
  type: 'income' | 'expense'
  sortOrder: number
}

export type CreateBudgetCategoryDTO = {
  userId?: number
  name: string
  type: 'income' | 'expense'
  sortOrder?: number
}
```

### Routing

Routes are defined in `start/routes.ts` with clear separation between view routes and API routes.

```typescript
// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Lazy-load controllers
const ViewsController = () => import('#controllers/views_controller')
const BudgetController = () => import('#controllers/budget_controller')

// View routes (Inertia pages)
router.get('/', [ViewsController, 'home'])
router.get('/login', [ViewsController, 'login'])
router.get('/user-home', [ViewsController, 'userHome']).use(middleware.auth())
router.get('/monthly-budget', [ViewsController, 'monthlyBudget']).use(middleware.auth())

// API routes (JSON responses)
router.post('/api/budget/setup', [BudgetController, 'createFullSetup']).use(middleware.auth())
router.post('/api/budget/entries', [BudgetController, 'createEntry']).use(middleware.auth())
router.delete('/api/budget/periods/:id', [BudgetController, 'deletePeriod']).use(middleware.auth())
```

**Key Points:**
- Lazy-load controllers with `() => import()`
- Apply middleware with `.use(middleware.auth())`
- API routes prefixed with `/api/`

### Path Aliases

Node.js subpath imports are configured in `package.json`:

```json
{
  "imports": {
    "#controllers/*": "./app/controllers/*.js",
    "#models/*": "./app/models/*.js",
    "#services/*": "./app/services/*.js",
    "#middleware/*": "./app/middleware/*.js"
  }
}
```

---

## Frontend Patterns

### Component Organization

Components are organized by feature rather than by type:

```
components/
├── ui/                     # ShadCN base components (Button, Card, Input, etc.)
├── CommonComponents/       # Shared reusable components
│   ├── FormModal/          # Generic form modal
│   └── Input/              # Extended input component
├── MonthlyBudget/          # Budget feature components
│   ├── CategoryList.tsx
│   ├── CreateBudgetForm/
│   └── EntryItem.tsx
├── BucketsList/            # Bucket management components
├── AccountsTable/          # Account display components
├── SideMenu/               # Navigation
└── AppBar/                 # Header
```

### State Management

Uses React Context API with custom hooks for state management:

```typescript
// inertia/context/MonthlyBudgetContext.tsx
interface MonthlyBudgetContextProps {
  categories: BudgetCategoryDTO[]
  template: BudgetTemplateDTO | null
  currentPeriod: BudgetPeriodDTO | null
  addEntry: (entry: BudgetEntryDTO) => void
  updateCategories: (categories: BudgetCategoryDTO[]) => void
}

const MonthlyBudgetContext = createContext<MonthlyBudgetContextProps | undefined>(undefined)

export const MonthlyBudgetProvider: React.FC<{...}> = ({ children, ...props }) => {
  const [categories, setCategories] = useState(props.initialCategories)
  // ... state and methods

  return (
    <MonthlyBudgetContext.Provider value={value}>
      {children}
    </MonthlyBudgetContext.Provider>
  )
}

export const useMonthlyBudget = () => {
  const context = useContext(MonthlyBudgetContext)
  if (!context) {
    throw new Error('useMonthlyBudget must be used within MonthlyBudgetProvider')
  }
  return context
}
```

**Usage in pages:**

```typescript
// inertia/pages/MonthlyBudget/monthlyBudget.tsx
export default function MonthlyBudget({ categories, template, currentPeriod }: Props) {
  return (
    <MonthlyBudgetProvider
      initialCategories={categories}
      initialTemplate={template}
      initialPeriod={currentPeriod}
    >
      <MonthlyBudgetPage />
    </MonthlyBudgetProvider>
  )
}

function MonthlyBudgetPage() {
  const { categories, addEntry } = useMonthlyBudget()
  // Component logic using context
}
```

### API Service Layer

Frontend services encapsulate API calls with typed request/response interfaces:

```typescript
// inertia/services/budget_service.ts
export interface CreateEntryPayload {
  budgetPeriodId: number
  budgetCategoryId: number
  amount: number
  note?: string
}

export interface CreateEntryResponse {
  entry: BudgetEntryDTO
  newBalance: number | null
}

export async function createBudgetEntry(
  payload: CreateEntryPayload
): Promise<CreateEntryResponse> {
  const res = await fetch('/api/budget/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create entry')
  }

  return res.json()
}
```

### Generic Components

Reusable components use TypeScript generics for type safety:

```typescript
// inertia/components/CommonComponents/FormModal/formModal.tsx
type FieldConfig<K extends string> = {
  name: K
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  options?: { label: string; value: string }[]
}

export default function FormModal<T extends Record<string, unknown>>({
  title,
  formElements,
  onSubmit,
}: {
  title: string
  formElements: FieldConfig<Extract<keyof T, string>>[]
  onSubmit: (payload: T) => Promise<void>
}) {
  // Component implementation
}
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Controllers | snake_case filename, PascalCase class | `budget_controller.ts`, `BudgetController` |
| Models | PascalCase | `BudgetCategory` |
| Services | PascalCase with "Service" suffix | `BudgetService` |
| DTOs | PascalCase with "DTO" suffix | `BudgetCategoryDTO`, `CreateBudgetCategoryDTO` |
| React Components | PascalCase | `MonthlyBudgetPage`, `CategoryList` |
| Context | Provider/Hook pattern | `MonthlyBudgetProvider`, `useMonthlyBudget` |
| Frontend Services | snake_case filename | `budget_service.ts` |
| API Routes | `/api/resource/action` | `/api/budget/entries` |
| CSS Files | lowercase | `app.css`, `style.css` |

---

## TypeScript Usage

### Backend Types

DTOs are co-located with models in `app/models/`:

```typescript
// Response DTOs use read-only fields
export type BudgetEntryDTO = {
  id: number
  budgetPeriodId: number
  budgetCategoryId: number
  category: BudgetCategoryDTO
  amount: number
  note: string | null
  createdAt: string | null
}

// Create DTOs use optional fields for defaults
export type CreateBudgetEntryDTO = {
  budgetPeriodId: number
  budgetCategoryId: number
  amount: number
  note?: string
}
```

### Frontend Types

Frontend-specific types are in `inertia/types/`:

```typescript
// inertia/types/budget.ts
export type BudgetCategoryType = 'income' | 'expense'

export interface BudgetCategoryDTO {
  id: number
  name: string
  type: BudgetCategoryType
  sortOrder: number
}

export interface MonthlyBudgetPageDTO {
  user: { firstName: string; lastName: string }
  categories: BudgetCategoryDTO[]
  template: BudgetTemplateDTO | null
  currentPeriod: BudgetPeriodDTO | null
  checkingAccount: BankAccountDTO | null
}
```

---

## Styling Approach

### Tailwind CSS

Configuration in `tailwind.config.js` uses CSS variables for theming:

```javascript
export default {
  darkMode: ["class"],
  content: ["./inertia/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        destructive: "hsl(var(--destructive))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### CSS Variables

Defined in `inertia/css/app.css`:

```css
:root {
  --primary: 173 80% 40%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --primary: 173 80% 40%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... dark mode overrides */
}
```

### ShadCN UI Components

Located in `inertia/components/ui/`, these use class-variance-authority (CVA) for variants:

```typescript
// inertia/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

### Class Merging Utility

```typescript
// inertia/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Authentication

### Session-Based Auth

Configured in `config/auth.ts`:

```typescript
const authConfig = defineConfig({
  default: 'web',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),
  },
})
```

### Password Hashing

User model uses `withAuthFinder` mixin with Scrypt:

```typescript
// app/models/user.ts
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ serializeAs: null })  // Excluded from JSON
  declare password: string
}
```

### Middleware

Protected routes use auth middleware:

```typescript
// app/middleware/auth_middleware.ts
export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn, options = {}) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}
```

### Sharing User Data with Frontend

User data is shared via Inertia middleware:

```typescript
// app/middleware/inertia_middleware.ts
export default class InertiaShareMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const user = ctx.auth?.use('web')?.user

    ctx.inertia.share({
      user: user ? { firstName: user.firstName, lastName: user.lastName } : null,
    })

    await next()
  }
}
```

---

## Data Flow

### Backend to Frontend (Page Load)

```
1. User requests /monthly-budget
2. Route matches → ViewsController.monthlyBudget()
3. Controller calls BudgetService methods
4. Service queries database, returns DTOs
5. Controller passes DTOs to inertia.render()
6. React page receives props from Inertia
7. Page wraps content in Context Provider
8. Child components use useContext hooks
```

### Frontend to Backend (API Call)

```
1. User action triggers handler in component
2. Component calls frontend service function
3. Service makes fetch() request to /api/*
4. Backend controller receives request
5. Controller validates, calls backend service
6. Service performs business logic, returns result
7. Controller sends JSON response
8. Frontend service returns typed response
9. Component updates context/local state
10. React re-renders with new data
```

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| `adonisrc.ts` | AdonisJS app configuration, providers, preloads |
| `config/auth.ts` | Authentication guards and providers |
| `config/database.ts` | Database connection settings |
| `config/inertia.ts` | Inertia configuration |
| `config/vite.ts` | Vite build settings |
| `vite.config.ts` | Vite plugins and aliases |
| `tailwind.config.js` | Tailwind CSS configuration |
| `tsconfig.json` | Backend TypeScript settings |
| `inertia/tsconfig.json` | Frontend TypeScript settings |
