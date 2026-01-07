# Area Chart Component

Beautiful gradient area chart component built with Recharts, styled with ShadCN patterns.

## Features

- ✨ **Gradient fills** - Smooth gradient transitions from top to bottom
- 📊 **Multiple series** - Support for multiple data categories with different colors
- 🎨 **Themed colors** - Uses CSS variables for consistent theming
- 📱 **Responsive** - Adapts to container size
- 🔧 **Customizable** - Many props for fine-tuning appearance
- 💬 **Interactive tooltips** - Shows values on hover with formatted display
- 🌓 **Dark mode ready** - Works with light and dark themes

## Usage

```tsx
import { AreaChart } from '~/components/ui/area-chart'

// Basic usage
<AreaChart
  data={chartData}
  index="date"
  categories={['Savings', 'Checking', 'Investment']}
  valueFormatter={(value) => `$${value.toLocaleString()}`}
/>

// Full configuration
<AreaChart
  data={chartData}
  index="date"
  categories={['Account 1', 'Account 2']}
  valueFormatter={(value) => `$${value.toFixed(2)}`}
  height={300}
  showXAxis={true}
  showYAxis={true}
  showGridLines={true}
  showTooltip={true}
  xAxisLabel="Date"
  yAxisLabel="Balance"
  className="my-custom-class"
  colors={[
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, any>[]` | `[]` | Array of data objects |
| `index` | `string` | Required | Key to use for X-axis values |
| `categories` | `string[]` | `[]` | Array of keys to plot as series |
| `valueFormatter` | `(value: number) => string` | `(v) => v.toString()` | Format values in tooltip and Y-axis |
| `showXAxis` | `boolean` | `true` | Show X-axis |
| `showYAxis` | `boolean` | `true` | Show Y-axis |
| `showGridLines` | `boolean` | `true` | Show grid lines |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `height` | `number` | `240` | Chart height in pixels |
| `className` | `string` | - | Additional CSS classes |
| `xAxisLabel` | `string` | - | Label for X-axis |
| `yAxisLabel` | `string` | - | Label for Y-axis |
| `colors` | `string[]` | Chart colors from theme | Custom colors for each series |
| `gradientStops` | `Array<{offset, stopColor, stopOpacity}>` | Default gradient | Custom gradient stops |

## Data Format

Your data should be an array of objects where:
- The `index` prop value exists as a key (for X-axis)
- Each `category` exists as a key with numeric values

```typescript
const chartData = [
  {
    date: '2024-01-01',
    'Savings Account': 5000,
    'Checking Account': 2000,
  },
  {
    date: '2024-01-02',
    'Savings Account': 5200,
    'Checking Account': 1800,
  },
  // ... more data points
]
```

## Colors

The chart uses predefined color variables from your theme:

```css
--chart-1: 173 80% 40%;  /* Primary teal */
--chart-2: 197 71% 52%;  /* Light blue */
--chart-3: 142 76% 36%;  /* Green */
--chart-4: 158 64% 52%;  /* Turquoise */
--chart-5: 160 60% 45%;  /* Teal-green */
```

You can customize these in `inertia/css/app.css` or pass custom colors via the `colors` prop.

## Custom Gradients

For custom gradient effects:

```tsx
<AreaChart
  data={data}
  index="date"
  categories={['Balance']}
  gradientStops={[
    { offset: '0%', stopColor: '#10b981', stopOpacity: 0.8 },
    { offset: '50%', stopColor: '#3b82f6', stopOpacity: 0.5 },
    { offset: '100%', stopColor: '#8b5cf6', stopOpacity: 0.1 },
  ]}
/>
```

## Styling

The component respects your theme's colors and works seamlessly with dark mode:

```tsx
// Light mode: Uses --background, --foreground, --muted
// Dark mode: Automatically switches to dark variants

// Customize via className
<AreaChart
  className="border rounded-lg p-4 bg-card"
  data={data}
  index="date"
  categories={['Value']}
/>
```

## Examples

### Financial Dashboard
```tsx
<AreaChart
  data={balanceHistory}
  index="date"
  categories={['Total Balance']}
  valueFormatter={(value) => `$${value.toLocaleString()}`}
  height={200}
  showYAxis={false}
  showGridLines={true}
/>
```

### Multi-Account Tracking
```tsx
<AreaChart
  data={accountData}
  index="month"
  categories={['Savings', 'Checking', 'Investment']}
  valueFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
  height={300}
  xAxisLabel="Month"
  yAxisLabel="Balance (thousands)"
/>
```

### Minimal Design
```tsx
<AreaChart
  data={data}
  index="date"
  categories={['Value']}
  showXAxis={false}
  showYAxis={false}
  showGridLines={false}
  height={120}
/>
```

## Tips

1. **Performance**: For large datasets, consider sampling or aggregating your data
2. **Formatting**: Use `valueFormatter` to show currency, percentages, or other units
3. **Height**: Adjust height based on your layout - 200-300px works well for dashboards
4. **Grid Lines**: Disable for cleaner look, enable for easier data reading
5. **Colors**: Stick to theme colors for consistency, or use custom colors for specific needs

## Integration with TotalBalance

The AreaChart is now used in the TotalBalance component on the savings page, showing account balance history with beautiful gradient fills!
