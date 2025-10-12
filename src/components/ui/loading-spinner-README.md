# Loading Spinner Component

A comprehensive, reusable loading spinner component system for the HealthCave application.

## Components

### 1. LoadingSpinner (Base Component)
The main component with full customization options.

```jsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

<LoadingSpinner 
  size="default"        // sm, default, lg, xl
  variant="primary"     // default, primary, white, success, warning, danger
  text="Loading..."     // Optional text
  className="my-4"      // Additional CSS classes
/>
```

### 2. ButtonSpinner
Pre-configured for button loading states.

```jsx
import { ButtonSpinner } from "@/components/ui/loading-spinner";

<button disabled={isLoading}>
  {isLoading ? <ButtonSpinner text="Saving..." /> : "Save"}
</button>
```

### 3. PageSpinner
For loading entire page sections.

```jsx
import { PageSpinner } from "@/components/ui/loading-spinner";

{loading ? <PageSpinner text="Loading appointments..." /> : <Content />}
```

### 4. FullPageSpinner
Modal-style full-screen loading overlay.

```jsx
import { FullPageSpinner } from "@/components/ui/loading-spinner";

{isNavigating && <FullPageSpinner text="Loading..." />}
```

### 5. InlineSpinner
Small spinner for inline use.

```jsx
import { InlineSpinner } from "@/components/ui/loading-spinner";

<div className="flex items-center space-x-2">
  <span>Refreshing</span>
  <InlineSpinner />
</div>
```

## Props

### LoadingSpinner Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | string | "default" | Size of spinner: "sm", "default", "lg", "xl" |
| variant | string | "default" | Color variant: "default", "primary", "white", "success", "warning", "danger" |
| text | string | "" | Optional text to display next to spinner |
| className | string | "" | Additional CSS classes |

### Preset Component Props
| Component | Props | Description |
|-----------|-------|-------------|
| ButtonSpinner | text, variant | For button loading states |
| PageSpinner | text | For page section loading |
| FullPageSpinner | text | For full-page overlays |
| InlineSpinner | text, size | For inline loading indicators |

## Usage Examples

### Form Submission
```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await submitForm();
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <Button disabled={isSubmitting}>
    {isSubmitting ? <ButtonSpinner text="Creating appointment..." /> : "Book Appointment"}
  </Button>
);
```

### Data Fetching
```jsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().finally(() => setLoading(false));
}, []);

if (loading) {
  return <PageSpinner text="Loading appointments..." />;
}
```

### API Calls with Inline Loading
```jsx
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await fetchLatestData();
  setRefreshing(false);
};

return (
  <div className="flex items-center space-x-2">
    <button onClick={handleRefresh}>Refresh</button>
    {refreshing && <InlineSpinner />}
  </div>
);
```

### Payment Processing
```jsx
const [paymentLoading, setPaymentLoading] = useState(false);

return (
  <button disabled={paymentLoading}>
    {paymentLoading ? (
      <ButtonSpinner text="Processing payment..." />
    ) : (
      "Pay Now"
    )}
  </button>
);
```

## Color Variants

- **default**: Gray color for neutral states
- **primary**: Brand blue (#435ba1) for primary actions
- **white**: White color for dark backgrounds
- **success**: Green for success states
- **warning**: Yellow for warning states
- **danger**: Red for error states

## Size Guide

- **sm**: 16x16px - For small buttons and inline use
- **default**: 24x24px - Standard size for most use cases
- **lg**: 32x32px - For larger buttons and page sections
- **xl**: 48x48px - For full-page loading states

## Best Practices

1. **Use appropriate sizes**: Match spinner size to the context
2. **Provide meaningful text**: Help users understand what's loading
3. **Disable interactions**: Always disable buttons/forms during loading
4. **Use consistent variants**: Stick to brand colors (primary variant)
5. **Avoid overuse**: Don't show spinners for very fast operations (<200ms)

## Integration

The component is already integrated in:
- Login page (ButtonSpinner for form submission and OAuth)
- Appointment confirmation page (ButtonSpinner for payment processing)

To use in other components, simply import the needed variant and use it in your loading states.