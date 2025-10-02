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
5. **Missing object properties**: When using dynamic object access, ensure all possible keys exist in the object

## TypeScript Index Error Fix

**Problem**: `Element implicitly has an 'any' type because expression of type 'X' can't be used to index type 'Y'`

**Solution**: Add missing properties to the object being indexed:

```typescript
// ❌ This causes TypeScript error:
const colors = { red: "red", blue: "blue" };
const color = colors[someVariable]; // Error if someVariable could be "green"

// ✅ Fix by adding all possible keys:
const colors = { red: "red", blue: "blue", green: "green" };
const color = colors[someVariable]; // Now works for all possible values
```

**Example**: Fixed `partyColors` object in legislator-profile-modal.tsx by adding `swing` property

## TypeScript Select Component Error Fix

**Problem**: `Type 'Dispatch<SetStateAction<"X" | "Y" | "Z">>' is not assignable to type '(value: string) => void'`

**Solution**: Use type assertion in the onValueChange handler:

```typescript
// ❌ This causes TypeScript error:
<Select value={state} onValueChange={setState}>

// ✅ Fix with type assertion:
<Select value={state} onValueChange={(value) => setState(value as 'X' | 'Y' | 'Z')}>
```

**Example**: Fixed Select components in legislator-profile-modal.tsx for userPriority and userRelationship

## Data Connection Notes

- Bills data will come from internal simple database, not API calls
- Users can search the internal database directly
- No external API integration needed for core functionality
