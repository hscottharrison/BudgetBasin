# ShadCN Component Reference

Quick reference for using your new ShadCN UI components.

## Button

```tsx
import { Button } from '~/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// With Icons
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add Item
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

## Input

```tsx
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

// Basic
<Input type="text" placeholder="Enter text..." />

// With Label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@example.com" />
</div>

// Enhanced Input (with label, errors, masking)
import Input from '~/components/CommonComponents/Input/input'

<Input 
  label="Amount" 
  name="amount" 
  type="number"
  step="0.01"
  error="Must be greater than 0"
/>

// With USD Mask
<Input 
  label="Price" 
  maskType="USD"
  onChange={(raw, formatted) => {
    // raw: "1234.56"
    // formatted: "$1,234.56"
  }}
/>
```

## Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>

// Enhanced Select (with label, errors)
import SelectInput from '~/components/CommonComponents/Select/select'

<SelectInput
  label="Category"
  name="category"
  options={[
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
  ]}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  error="Please select a category"
/>
```

## Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description text</DialogDescription>
    </DialogHeader>
    <div>
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <Button type="button" variant="outline">Cancel</Button>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled Dialog
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  {/* ... */}
</Dialog>
```

## Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'

// Single (only one open at a time)
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      Content for section 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>
      Content for section 2
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple (multiple can be open)
<Accordion type="multiple">
  {/* ... */}
</Accordion>
```

## Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Popover Title</h4>
      <p className="text-sm text-muted-foreground">Popover content</p>
    </div>
  </PopoverContent>
</Popover>
```

## Separator

```tsx
import { Separator } from '~/components/ui/separator'

// Horizontal
<div>
  <p>Content above</p>
  <Separator className="my-4" />
  <p>Content below</p>
</div>

// Vertical
<div className="flex h-5 items-center space-x-4">
  <span>Item 1</span>
  <Separator orientation="vertical" />
  <span>Item 2</span>
</div>
```

## Spinner (Loading)

```tsx
import { Spinner } from '~/components/ui/spinner'

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

## LoadingButton

```tsx
import LoadingButton from '~/components/CommonComponents/LoadingButton/loadingButton'

<LoadingButton 
  type="submit" 
  label="Save Changes"
  variant="default"
/>

// The button will show a spinner when isLoading from LoadingContext is true
```

## FormModal (Reusable Form Dialog)

```tsx
import FormModal from '~/components/CommonComponents/FormModal/formModal'

<FormModal
  actionLabel="Add User"
  actionLabelIcon={<PlusIcon />}
  title="Create New User"
  description="Enter user details below"
  submitButtonLabel="Create"
  closeButtonLabel="Cancel"
  onSubmit={async (data) => {
    // Handle form submission
    console.log(data) // { name: "...", email: "..." }
  }}
  formElements={[
    {
      name: 'name',
      label: 'Full Name',
      type: 'text'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    },
    {
      name: 'amount',
      label: 'Budget',
      type: 'number',
      step: '0.01'
    },
    {
      name: 'userId',
      type: 'hidden',
      value: '123'
    }
  ]}
/>
```

## ConfirmationModal

```tsx
import ConfirmationModal from '~/components/CommonComponents/ConfirmationModal/confirmationModal'

<ConfirmationModal
  title="Delete Account"
  description="This action cannot be undone. Are you sure?"
  buttonText="Delete"
  buttonVariant="destructive"
  onConfirm={async () => {
    // Handle deletion
  }}
/>
```

## Common Layouts

### Centered Container
```tsx
<div className="container mx-auto max-w-4xl p-8">
  {/* Content */}
</div>
```

### Two Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Flex with Space Between
```tsx
<div className="flex items-center justify-between">
  <h2 className="text-2xl font-bold">Title</h2>
  <Button>Action</Button>
</div>
```

### Vertical Stack with Spacing
```tsx
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Horizontal Stack with Spacing
```tsx
<div className="flex gap-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

## Responsive Design

```tsx
// Mobile first approach
<div className="
  p-4           // padding on mobile
  md:p-8        // padding on tablet+
  lg:p-12       // padding on desktop+
  
  text-sm       // small text on mobile
  md:text-base  // normal text on tablet+
  
  grid 
  grid-cols-1   // 1 column on mobile
  md:grid-cols-2 // 2 columns on tablet+
  lg:grid-cols-3 // 3 columns on desktop+
">
  {/* Content */}
</div>
```

## Conditional Styling with cn()

```tsx
import { cn } from '~/lib/utils'

<Button 
  className={cn(
    "w-full",                           // Base classes
    isActive && "bg-primary",           // Conditional
    isDisabled && "opacity-50 cursor-not-allowed", // Multiple conditions
    size === "large" && "text-lg p-6"   // Size variants
  )}
>
  Click Me
</Button>
```

## Color Classes

```tsx
// Text colors
<p className="text-foreground">Default text</p>
<p className="text-muted-foreground">Muted text</p>
<p className="text-primary">Primary color</p>
<p className="text-destructive">Error/danger text</p>

// Background colors
<div className="bg-background">Default background</div>
<div className="bg-card">Card background</div>
<div className="bg-primary">Primary background</div>
<div className="bg-muted">Muted background</div>
<div className="bg-accent">Accent background</div>

// Border colors
<div className="border border-border">Default border</div>
<div className="border border-input">Input border</div>
```

## Common Text Styles

```tsx
// Headings
<h1 className="text-4xl font-bold">Heading 1</h1>
<h2 className="text-3xl font-bold">Heading 2</h2>
<h3 className="text-2xl font-semibold">Heading 3</h3>

// Body text
<p className="text-base">Normal text</p>
<p className="text-sm text-muted-foreground">Small muted text</p>
<p className="text-xs">Extra small text</p>

// Links
<a href="#" className="text-primary hover:underline">Link</a>
```

## Tips

1. **Always use `cn()` for conditional classes** - It handles merging and deduplication
2. **Use semantic colors** - `text-primary`, `text-destructive` instead of `text-red-500`
3. **Mobile-first** - Start with mobile styles, then add responsive breakpoints
4. **Use spacing utilities** - `space-y-4`, `gap-4` instead of margins on individual elements
5. **Prefer composition** - Combine simple components to build complex UIs
