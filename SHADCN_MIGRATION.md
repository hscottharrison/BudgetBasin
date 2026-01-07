# ShadCN UI Migration - Complete

This project has been successfully migrated from Radix UI Themes to ShadCN UI with Tailwind CSS.

## What Changed

### UI Framework
- **Before**: Radix UI Themes (`@radix-ui/themes`)
- **After**: ShadCN UI components with Tailwind CSS
- **Kept**: Radix UI Primitives (used internally by ShadCN)

### Key Benefits
1. **Better Scalability**: ShadCN components are fully customizable and owned by your project
2. **Tailwind Integration**: First-class Tailwind CSS support with utility classes
3. **TypeScript Support**: Full type safety and autocomplete
4. **Component Library**: All components live in `inertia/components/ui/`
5. **Easy Customization**: Modify components directly without fighting a theme system

## Project Structure

```
inertia/
├── components/
│   ├── ui/                          # ShadCN UI components (fully customizable)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── accordion.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── label.tsx
│   │   ├── spinner.tsx
│   │   └── index.ts               # Barrel export for easier imports
│   ├── CommonComponents/           # Your reusable components
│   │   ├── FormModal/              # Enhanced dialog-based form
│   │   ├── Input/                  # Input with masking support
│   │   ├── Select/                 # Select with error states
│   │   ├── LoadingButton/          # Button with loading state
│   │   └── ConfirmationModal/      # Confirmation dialog
│   └── [other components]/
├── lib/
│   └── utils.ts                    # cn() helper for className merging
└── css/
    └── app.css                     # Tailwind + CSS variables for theming
```

## CSS Variables & Theming

All colors are defined using CSS variables in `inertia/css/app.css`. You can easily customize the theme by modifying these values:

```css
:root {
  --primary: 173 80% 40%;        /* Teal accent */
  --secondary: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}
```

### Dark Mode Ready
Dark mode classes are already defined. To enable dark mode, add the `dark` class to your HTML/body element.

## Component Usage

### Basic Components

```tsx
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

// Usage
<Card>
  <CardHeader>
    <CardTitle>Hello World</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter text..." />
    <Button>Submit</Button>
  </CardContent>
</Card>
```

### Using Variant Props

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Your Enhanced Components

```tsx
import Input from '~/components/CommonComponents/Input/input'
import SelectInput from '~/components/CommonComponents/Select/select'
import LoadingButton from '~/components/CommonComponents/LoadingButton/loadingButton'
import FormModal from '~/components/CommonComponents/FormModal/formModal'

// Input with label and error state
<Input 
  label="Email" 
  name="email" 
  type="email" 
  error="Invalid email"
/>

// Select with label
<SelectInput
  label="Category"
  name="category"
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]}
/>

// Button with loading state
<LoadingButton label="Save" type="submit" />

// Reusable form modal
<FormModal
  title="Create Item"
  description="Fill out the form"
  actionLabel="Add Item"
  submitButtonLabel="Create"
  onSubmit={handleSubmit}
  formElements={[
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'amount', label: 'Amount', type: 'number', step: '0.01' }
  ]}
/>
```

## Styling Guidelines

### Use Tailwind Utilities
```tsx
// Good ✅
<div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card">

// Avoid ❌
<div style={{ display: 'flex', padding: '1rem' }}>
```

### Use cn() for Conditional Classes
```tsx
import { cn } from '~/lib/utils'

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  error && "error-classes"
)} />
```

### Component Variants
Use `class-variance-authority` (already installed) for creating variants:

```tsx
import { cva } from "class-variance-authority"

const variants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      primary: "primary-classes"
    },
    size: {
      sm: "small-classes",
      lg: "large-classes"
    }
  }
})
```

## Configuration Files

### `tailwind.config.js`
- Defines Tailwind configuration
- Sets up CSS variables for colors
- Configures animations and plugins

### `postcss.config.js`
- PostCSS configuration for Tailwind

### `vite.config.ts`
- No changes needed (already configured)

## Adding New ShadCN Components

To add more ShadCN components from their documentation:

1. Copy the component code from [ui.shadcn.com](https://ui.shadcn.com)
2. Place it in `inertia/components/ui/`
3. Install any required dependencies
4. Export from `inertia/components/ui/index.ts`

Example components you might want to add:
- `badge.tsx` - Status badges
- `dropdown-menu.tsx` - Dropdown menus
- `toast.tsx` - Toast notifications
- `tabs.tsx` - Tab navigation
- `alert.tsx` - Alert boxes

## Common Patterns

### Form with Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Form</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Form Title</DialogTitle>
      <DialogDescription>Description here</DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input label="Name" name="name" />
        <Input label="Email" name="email" type="email" />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

### Card with Table
```tsx
<Card>
  <CardHeader>
    <CardTitle>Data Table</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Item 1</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

## Best Practices

1. **Keep Components Clean**: Let Tailwind handle styling instead of inline styles
2. **Use Semantic HTML**: Even with Tailwind, proper HTML structure matters
3. **Leverage TypeScript**: All components are fully typed
4. **Customize Freely**: Components in `ui/` folder are yours to modify
5. **Stay Consistent**: Use the design tokens (colors, spacing) defined in CSS variables
6. **Responsive Design**: Use Tailwind's responsive prefixes (`md:`, `lg:`, etc.)

## Resources

- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Radix UI Primitives](https://www.radix-ui.com) (used internally)
- [class-variance-authority](https://cva.style/docs)

## Need Help?

All your original components have been migrated to use ShadCN. If you see any issues:
1. Check the browser console for errors
2. Verify all imports are correct
3. Make sure Tailwind classes are being applied
4. Check CSS variables in `app.css`

Happy building! 🎉
