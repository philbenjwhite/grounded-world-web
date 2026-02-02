# Designer Quick Start Cheat Sheet 📋

One-page reference for creating components with AI.

## The 5-Step Workflow

```
1. CREATE BRANCH → 2. PROMPT AI → 3. PREVIEW → 4. PUSH → 5. CREATE PR
```

---

## 1. Create Branch

**In GitHub Desktop:**
- Current Branch → New Branch
- Name: `design/component-name-description`
- Example: `design/card-product-preview`

---

## 2. Prompt AI

**Copy & fill this template:**

```
Create a [ComponentName] component in src/components/[ComponentName]/ with:

COMPONENT SPECS:
- Purpose: [What it does]
- Visual style: [Colors, spacing, layout]
- Variants: [List versions]
- Interactive: [Hover, click, animations]

PROPS:
- [propName]: [type] - [description]
- [propName]?: [type] (optional) - [description]

TECHNICAL:
- Use Tailwind CSS
- Use design tokens: bg-primary, bg-primary-hover
- TypeScript with prop types
- Default export

FILE STRUCTURE:
src/components/[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
└── index.ts

STORIES:
- Default
- All variants
- Edge cases (long text, empty, loading)

Follow src/components/Button/ pattern
```

---

## 3. Preview in Storybook

```bash
npm run storybook
```

**Check:**
- ✅ Component shows in sidebar
- ✅ All variants display
- ✅ Controls work
- ✅ Looks good on mobile/desktop
- ✅ Interactions work

---

## 4. Push Branch

**In GitHub Desktop:**

1. Write commit message:
   ```
   Add [ComponentName] component

   - Feature 1
   - Feature 2
   - Includes [list variants]
   ```

2. Commit to branch
3. Push origin

---

## 5. Create Pull Request

**On GitHub.com:**

**Title:** `Add [ComponentName] component`

**Description:**
```markdown
## What does this add?
[Component] for [purpose]

## Features
- Feature 1
- Feature 2

## Variants
- Variant 1 - [description]
- Variant 2 - [description]

## Preview
View in Storybook at: `/storybook`
```

**Then:** Request reviewers → Add labels → Create PR

---

## Design Tokens (Always Use These!)

```tsx
// Colors
bg-primary          // #CA7436
bg-primary-hover    // #EB7F31
bg-primary-active   // #F39552

// Usage
<button className="bg-primary hover:bg-primary-hover">
```

---

## Component Structure

```
src/components/ProductCard/
├── ProductCard.tsx          ← Default export
├── ProductCard.stories.tsx  ← All variants
└── index.ts                 ← Export file
```

**Component Pattern:**
```tsx
interface ProductCardProps {
  title: string;
  price: number;
  variant?: 'default' | 'featured';
}

const ProductCard = ({ title, price, variant = 'default' }: ProductCardProps) => {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
};

export default ProductCard;
```

---

## Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Component | PascalCase | `ProductCard`, `SearchInput` |
| Branch | kebab-case | `design/product-card` |
| Props | camelCase | `onClick`, `isDisabled` |
| Boolean props | is/has prefix | `isOpen`, `hasError` |
| Callbacks | on prefix | `onClick`, `onChange` |

---

## Common Tailwind Classes

```tsx
// Spacing
p-4, m-4          // Padding, margin (1rem)
gap-4             // Grid/flex gap
space-y-4         // Vertical spacing between children

// Layout
flex, grid        // Display types
justify-between   // Horizontal alignment
items-center      // Vertical alignment

// Sizing
w-full, h-full    // 100% width/height
max-w-sm          // Max width (small)

// Text
text-sm           // Small text
font-medium       // Medium weight
text-center       // Center align

// Colors
bg-primary        // Background
text-white        // Text color
border-gray-200   // Border color

// Effects
rounded-lg        // Rounded corners
shadow-md         // Drop shadow
hover:scale-105   // Hover effect
transition-all    // Smooth transitions

// Responsive
sm:p-6            // Padding on small screens+
md:grid-cols-2    // 2 columns on medium+
lg:text-xl        // Large text on large+
```

---

## Pre-Commit Checklist

- [ ] Component in `src/components/[Name]/`
- [ ] Uses default export
- [ ] Has TypeScript types
- [ ] Uses design tokens
- [ ] Has Storybook stories
- [ ] Tested in Storybook
- [ ] Looks good on mobile
- [ ] Branch pushed
- [ ] PR created

---

## Useful Commands

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Stop running process
Ctrl + C
```

---

## Quick Fixes

| Problem | Solution |
|---------|----------|
| Component not in Storybook | Restart Storybook (Ctrl+C, then `npm run storybook`) |
| TypeScript errors | Ask AI: "Fix these TypeScript errors" |
| Wrong colors | Use design tokens: `bg-primary` not `bg-orange-500` |
| Not responsive | Add: `sm:`, `md:`, `lg:` prefixes |

---

## Need Help?

**Ask in:**
- Slack: `#design-system`
- GitHub: Comment on your PR

**Full Guide:** See [DESIGNER_GUIDE.md](./DESIGNER_GUIDE.md) for detailed instructions

---

**Remember:** It's okay to ask questions! Everyone is learning. 🎨✨
