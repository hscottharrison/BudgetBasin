# BudgetBasin Database Schema

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      BudgetBasin Schema                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐          ┌──────────────────────────┐
│         users            │          │    transaction_types     │
├──────────────────────────┤          ├──────────────────────────┤
│ id          PK  INTEGER  │          │ id          PK  INTEGER  │
│ first_name      VARCHAR  │          │ value           VARCHAR  │
│ last_name       VARCHAR  │          │ label           VARCHAR  │
│ email           VARCHAR  │          │ created_at      DATETIME │
│ password        VARCHAR  │          │ updated_at      DATETIME │
│ created_at      DATETIME │          └───────────┬──────────────┘
│ updated_at      DATETIME │                      │
└──────────┬───────────────┘                      │
           │                                      │
           │ 1:N                                  │ 1:N
           │                                      │
     ┌─────┴─────────────────┬────────────────────┘
     │                       │
     ▼                       ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      bank_accounts       │    │        buckets           │
├──────────────────────────┤    ├──────────────────────────┤
│ id          PK  INTEGER  │    │ id          PK  INTEGER  │
│ user_id     FK  INTEGER  │───▶│ user_id     FK  INTEGER  │───┐
│ name            VARCHAR  │    │ name            VARCHAR  │   │
│ description     VARCHAR  │    │ description     VARCHAR  │   │
│ created_at      DATETIME │    │ goal_amount     DECIMAL  │   │
│ updated_at      DATETIME │    │ created_at      DATETIME │   │
└──────────┬───────────────┘    │ updated_at      DATETIME │   │
           │                    └──────────┬───────────────┘   │
           │ 1:N                           │                   │
           ▼                               │ 1:N               │
┌──────────────────────────┐               ▼                   │
│        balances          │    ┌──────────────────────────┐   │
├──────────────────────────┤    │      transactions        │   │
│ id          PK  INTEGER  │    ├──────────────────────────┤   │
│ bank_account_id FK INT   │    │ id          PK  INTEGER  │   │
│ amount          DECIMAL  │    │ user_id     FK  INTEGER  │◀──┘
│ created_at      DATETIME │    │ bucket_id   FK  INTEGER  │
│ updated_at      DATETIME │    │ transaction_type_id FK   │
└──────────────────────────┘    │ amount          DECIMAL  │
                                │ created_at      DATETIME │
                                │ updated_at      DATETIME │
                                └──────────────────────────┘
```

---

## 📋 Table Details

### **users**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `first_name` | VARCHAR | |
| `last_name` | VARCHAR | |
| `email` | VARCHAR | UNIQUE |
| `password` | VARCHAR | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

### **bank_accounts**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `name` | VARCHAR | |
| `description` | VARCHAR | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

### **balances**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `bank_account_id` | INTEGER | FOREIGN KEY → bank_accounts.id |
| `amount` | DECIMAL | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

### **buckets**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `name` | VARCHAR | |
| `description` | VARCHAR | |
| `goal_amount` | DECIMAL | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

### **transactions**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `bucket_id` | INTEGER | FOREIGN KEY → buckets.id |
| `transaction_type_id` | INTEGER | FOREIGN KEY → transaction_types.id |
| `amount` | DECIMAL | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

### **transaction_types**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY |
| `value` | VARCHAR | |
| `label` | VARCHAR | |
| `created_at` | DATETIME | AUTO |
| `updated_at` | DATETIME | AUTO |

---

## 🔗 Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| `users` → `bank_accounts` | 1:N | A user can have many bank accounts |
| `users` → `buckets` | 1:N | A user can have many savings buckets |
| `users` → `transactions` | 1:N | A user can have many transactions |
| `bank_accounts` → `balances` | 1:N | A bank account has many balance snapshots |
| `buckets` → `transactions` | 1:N | A bucket can have many transactions |
| `transaction_types` → `transactions` | 1:N | A transaction type categorizes many transactions |

