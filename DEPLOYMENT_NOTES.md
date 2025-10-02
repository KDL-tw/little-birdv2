# Deployment Troubleshooting Notes

## ESLint Empty Interface Fix

**Problem**: ESLint error "An interface declaring no members is equivalent to its supertype"

**Solution**: Change from empty interface to type alias:

```typescript
// ❌ This causes ESLint error:
export interface ComponentProps extends SomeType {}

// ✅ Fix with type alias:
export type ComponentProps = SomeType
```

**Example**: Fixed `TextareaProps` in `/src/components/ui/textarea.tsx`

## Common Deployment Issues

1. **Unused imports**: Remove unused imports from components
2. **Unused parameters**: Remove unused `index` parameters in map functions  
3. **Empty interfaces**: Use type aliases instead of empty interfaces
4. **Missing imports**: Ensure all used components are properly imported

## Data Connection Notes

- Bills data will come from internal simple database, not API calls
- Users can search the internal database directly
- No external API integration needed for core functionality
