# Designer's Guide to Creating Components with AI

This guide helps designers create React components using AI tools (like Claude, ChatGPT, or Cursor) and contribute them to the design system via Storybook.

## 🎯 Quick Start

### What You'll Be Creating

You'll use AI to generate:
1. **React components** - UI elements built with Tailwind CSS
2. **Storybook stories** - Interactive documentation showing all component variants
3. **TypeScript types** - Definitions that ensure components are used correctly

### Your Workflow (5 Steps)

1. **Create a branch** in GitHub Desktop
2. **Prompt AI** to generate your component
3. **Preview** in Storybook locally
4. **Push** your branch to GitHub
5. **Create a Pull Request** for review

---

## 📋 Before You Start

### Tools You'll Need

- **GitHub Desktop** - For managing code versions ([Download here](https://desktop.github.com/))
- **VS Code** or **Cursor** - Code editor with AI built-in ([VS Code](https://code.visualstudio.com/) | [Cursor](https://cursor.sh/))
- **Node.js** - To run the development server ([Download here](https://nodejs.org/))

### One-Time Setup

1. **Clone the repository** in GitHub Desktop
   - File → Clone Repository → Choose `grounded-world-web`
   - Remember where you save it (e.g., `Documents/grounded-world-web`)

2. **Install dependencies** (first time only)
   - Open Terminal (Mac) or Command Prompt (Windows)
   - Navigate to the project: `cd path/to/grounded-world-web`
   - Run: `npm install`
   - Wait for it to finish (this takes a few minutes)

3. **Test that Storybook works**
   - Run: `npm run storybook`
   - Your browser should open to `http://localhost:6006`
   - You should see the Button component with examples
   - Press `Ctrl+C` to stop Storybook when done

---

## 🌿 Step 1: Create a Branch

**Why?** Branches let you work on new components without affecting the main codebase.

### In GitHub Desktop:

1. Click **Current Branch** dropdown at the top
2. Click **New Branch**
3. Name your branch using this format:
   ```
   design/component-name-description
   ```
   **Examples:**
   - `design/card-product-preview`
   - `design/modal-confirmation-dialog`
   - `design/input-search-with-filters`

4. Click **Create Branch**

✅ You're now working on your own branch!

---

## 🤖 Step 2: Prompt AI to Generate Your Component

### Component Naming Rules

- **Use PascalCase**: `ProductCard`, not `product-card` or `productCard`
- **Be descriptive**: `SearchInput` not just `Input`
- **Avoid generic names**: `PrimaryButton` not just `Button`

### The Perfect Prompt Template

Copy this template and fill in the blanks:

```
Create a [ComponentName] component in src/components/[ComponentName]/ with:

COMPONENT SPECS:
- Purpose: [What does this component do?]
- Visual style: [Describe the look - colors, spacing, layout]
- Variants: [List different versions - e.g., "small, medium, large" or "default, error, success"]
- Interactive elements: [Buttons, hover states, animations]

TECHNICAL REQUIREMENTS:
- Use Tailwind CSS utility classes
- Use our design tokens: bg-primary, bg-primary-hover, bg-primary-active
- TypeScript with proper prop types
- Default export
- Include proper TypeScript documentation comments

FILE STRUCTURE:
src/components/[ComponentName]/
├── [ComponentName].tsx          # Component implementation
├── [ComponentName].stories.tsx  # Storybook stories
└── index.ts                     # Exports

STORYBOOK STORIES:
Create stories for each variant showing:
- Default state
- All visual variants (colors, sizes)
- Interactive states (hover, active, disabled)
- Edge cases (long text, empty state, loading)

Follow the same pattern as src/components/Button/
```

### Example Prompts

<details>
<summary><strong>Example 1: Product Card</strong></summary>

```
Create a ProductCard component in src/components/ProductCard/ with:

COMPONENT SPECS:
- Purpose: Display product information in a grid layout
- Visual style: White background, rounded corners (rounded-lg), subtle shadow, hover effect that lifts the card
- Variants:
  * default - standard product card
  * featured - has a "Featured" badge in top-right corner
  * sale - shows strikethrough price and sale price in red
- Interactive elements:
  * Entire card is clickable
  * Image zoom on hover
  * "Add to Cart" button with hover state

REQUIRED PROPS:
- title: string
- price: number
- image: string (image URL)
- description?: string (optional)
- onAddToCart?: () => void
- variant?: 'default' | 'featured' | 'sale'
- salePrice?: number (for sale variant)

TECHNICAL REQUIREMENTS:
- Use Tailwind CSS utility classes
- Use our design tokens: bg-primary, text-primary for accents
- TypeScript with proper prop types
- Default export
- Include proper TypeScript documentation comments

FILE STRUCTURE:
src/components/ProductCard/
├── ProductCard.tsx
├── ProductCard.stories.tsx
└── index.ts

STORYBOOK STORIES:
- Default
- Featured
- On Sale
- Long Title (edge case)
- No Description (edge case)
- With Add to Cart button
- Without Add to Cart button

Follow the same pattern as src/components/Button/
```
</details>

<details>
<summary><strong>Example 2: Search Input</strong></summary>

```
Create a SearchInput component in src/components/SearchInput/ with:

COMPONENT SPECS:
- Purpose: Search bar with icon, placeholder, and clear button
- Visual style:
  * White background with border
  * Rounded corners (rounded-full for pill shape)
  * Search icon on left
  * Clear button (X) appears on right when text is entered
  * Focus state: border changes to primary color
- Variants:
  * default - medium size
  * large - bigger for hero sections
  * compact - smaller for toolbars
- Interactive elements:
  * Clear button appears/disappears based on input
  * Focus ring animation
  * Search icon can be clicked to submit

REQUIRED PROPS:
- placeholder?: string
- value?: string
- onChange?: (value: string) => void
- onSearch?: (value: string) => void
- onClear?: () => void
- size?: 'compact' | 'default' | 'large'
- disabled?: boolean

TECHNICAL REQUIREMENTS:
- Use Tailwind CSS utility classes
- Use our design tokens for colors
- Include search icon (you can use an SVG or Heroicons)
- TypeScript with proper prop types
- Default export
- Include proper TypeScript documentation comments

FILE STRUCTURE:
src/components/SearchInput/
├── SearchInput.tsx
├── SearchInput.stories.tsx
└── index.ts

STORYBOOK STORIES:
- Default (empty)
- With Placeholder
- With Text (shows clear button)
- Large variant
- Compact variant
- Disabled state
- Focus state

Follow the same pattern as src/components/Button/
```
</details>

### Where to Paste Your Prompt

**In Cursor or Claude:**
1. Open your code editor
2. Paste the entire prompt
3. Review the generated code
4. Save all files

**Important:** AI will create the files, but you need to save them in the correct location!

---

## 👀 Step 3: Preview in Storybook

### Start Storybook

```bash
npm run storybook
```

This opens `http://localhost:6006` in your browser.

### What to Check

- [ ] **Component appears** in the left sidebar under "Components"
- [ ] **All variants** show up as separate stories
- [ ] **Controls panel** (bottom) lets you change props interactively
- [ ] **Docs tab** shows proper documentation
- [ ] **Component looks correct** at different screen sizes
- [ ] **Hover states work** (if applicable)
- [ ] **Click interactions work** (if applicable)

### Common Issues and Fixes

| Problem | Solution |
|---------|----------|
| Component not showing | Restart Storybook (`Ctrl+C` then `npm run storybook`) |
| Styles look wrong | Check that you're using Tailwind classes correctly |
| TypeScript errors | Ask AI to fix the type errors |
| Stories not updating | Clear browser cache and refresh |

---

## 📤 Step 4: Push Your Branch

### In GitHub Desktop:

1. **Review your changes**
   - Look at the "Changes" tab
   - You should see your new component files listed

2. **Write a commit message**
   ```
   Add [ComponentName] component

   - Created component with [list main features]
   - Added Storybook stories for all variants
   - Includes [list variants]
   ```

   **Example:**
   ```
   Add ProductCard component

   - Created card component with image, title, price, description
   - Added Storybook stories for default, featured, and sale variants
   - Includes hover effects and Add to Cart button
   ```

3. **Commit to your branch**
   - Click **Commit to [your-branch-name]**

4. **Push to GitHub**
   - Click **Push origin** (top right)
   - Wait for the upload to complete

✅ Your code is now on GitHub!

---

## 🎉 Step 5: Create a Pull Request

### In GitHub Desktop:

1. Click **Branch** menu → **Create Pull Request**
   - This opens GitHub in your browser

### On GitHub.com:

2. **Fill out the PR template:**

   **Title:** Follow this format:
   ```
   Add [ComponentName] component
   ```

   **Description:** Use this template:
   ```markdown
   ## What does this add?

   New [ComponentName] component for [describe purpose]

   ## Component Features

   - Feature 1
   - Feature 2
   - Feature 3

   ## Variants

   - Variant 1 - [description]
   - Variant 2 - [description]

   ## Storybook Preview

   View all variants in Storybook at: `/storybook`

   ## Design Specs

   - Follows design system tokens
   - Uses Tailwind CSS utility classes
   - Responsive design
   - Accessible (WCAG compliant)

   ## Screenshots (optional)

   [Paste screenshots of the component if you'd like]
   ```

3. **Request reviewers**
   - Click the gear icon next to "Reviewers"
   - Select developers who should review your component

4. **Add labels** (if available)
   - `design`
   - `component`
   - `needs-review`

5. **Click "Create Pull Request"**

✅ Done! Your component is now ready for review.

---

## 🎨 Design System Guidelines

### Using Design Tokens

**Always use these design tokens instead of hardcoded colors:**

```tsx
// ✅ GOOD - Uses design tokens
<button className="bg-primary hover:bg-primary-hover">
  Click me
</button>

// ❌ BAD - Hardcoded colors
<button className="bg-orange-500 hover:bg-orange-600">
  Click me
</button>
```

**Available tokens:**
- `bg-primary` - Primary brand color (#CA7436)
- `bg-primary-hover` - Hover state (#EB7F31)
- `bg-primary-active` - Active/pressed state (#F39552)
- `text-primary` - Primary text color
- `bg-background` - Page background
- `text-foreground` - Default text color

### Component Design Principles

1. **Mobile-First**
   - Design for mobile screens first
   - Use responsive Tailwind classes: `sm:`, `md:`, `lg:`
   ```tsx
   <div className="p-4 md:p-6 lg:p-8">
     {/* Padding grows on larger screens */}
   </div>
   ```

2. **Accessibility**
   - Every interactive element needs clear hover/focus states
   - Use semantic HTML (`<button>` not `<div onClick>`)
   - Include aria-labels for icon-only buttons
   ```tsx
   <button aria-label="Close modal" className="...">
     <XIcon />
   </button>
   ```

3. **Consistent Spacing**
   - Use Tailwind's spacing scale: 0, 1, 2, 3, 4, 6, 8, 12, 16, 24
   - Example: `p-4` (padding 1rem), `gap-6` (gap 1.5rem)

4. **Typography**
   - Use Tailwind's type scale: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
   - Line heights: `leading-tight`, `leading-normal`, `leading-relaxed`

### Component Variants Best Practices

**Size variants:**
```tsx
// Define size variants consistently
size?: 'sm' | 'md' | 'lg'

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

**Visual variants:**
```tsx
// Use meaningful names
variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success'

// Not generic names like "type1", "style2"
```

**State variants:**
```tsx
// Common states to support
disabled?: boolean
loading?: boolean
error?: boolean
success?: boolean
```

---

## 📝 Writing Good Props

### Required vs Optional Props

```tsx
interface CardProps {
  // Required props (no ?)
  title: string;

  // Optional props (with ?)
  description?: string;

  // Optional with default value
  variant?: 'default' | 'featured';
}
```

### Naming Conventions

| Prop Type | Naming | Example |
|-----------|--------|---------|
| Boolean | `is` or `has` prefix | `isOpen`, `hasError`, `disabled` |
| Event handlers | `on` prefix | `onClick`, `onChange`, `onSubmit` |
| Content | descriptive noun | `title`, `description`, `label` |
| Styling | ends with `ClassName` | `buttonClassName`, `containerClassName` |

### Good Prop Documentation

```tsx
export interface ProductCardProps {
  /**
   * Product title (displayed in heading)
   */
  title: string;

  /**
   * Product price in dollars
   * @example 29.99
   */
  price: number;

  /**
   * Optional product description
   * Will be truncated after 2 lines
   */
  description?: string;

  /**
   * Callback when "Add to Cart" button is clicked
   */
  onAddToCart?: () => void;
}
```

---

## 🐛 Common Mistakes to Avoid

### ❌ Don't hardcode colors
```tsx
// Bad
<div className="bg-orange-500">

// Good
<div className="bg-primary">
```

### ❌ Don't use inline styles
```tsx
// Bad
<div style={{ backgroundColor: '#CA7436' }}>

// Good
<div className="bg-primary">
```

### ❌ Don't forget responsive design
```tsx
// Bad - same size on all screens
<div className="p-4">

// Good - adapts to screen size
<div className="p-4 md:p-6 lg:p-8">
```

### ❌ Don't skip TypeScript types
```tsx
// Bad - no type safety
const Button = ({ children, onClick }) => {

// Good - proper types
const Button = ({
  children,
  onClick
}: ButtonProps) => {
```

### ❌ Don't use generic names
```tsx
// Bad
<Card1 />
<Input2 />

// Good
<ProductCard />
<SearchInput />
```

---

## 💡 Pro Tips

### 1. Test Edge Cases

Always create stories for:
- **Empty states** - No data to display
- **Loading states** - Component is fetching data
- **Error states** - Something went wrong
- **Long content** - Text overflow handling
- **No content** - All optional props omitted

### 2. Use Storybook Controls

In your stories, define controls for interactive testing:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'featured', 'sale'],
  },
  disabled: {
    control: 'boolean',
  },
  title: {
    control: 'text',
  },
},
```

This lets reviewers play with your component in Storybook!

### 3. Ask AI to Refine

If something doesn't look right, ask AI:

```
The hover effect on my ProductCard is too subtle.
Can you make it more pronounced?
Maybe add a slight lift/shadow effect.
```

### 4. Reference Existing Components

When creating similar components:

```
Create a TagInput component similar to the SearchInput component,
but for entering multiple tags with a pill-style display.
```

---

## 🆘 Getting Help

### Questions to Ask

- **"Why isn't my component showing in Storybook?"**
- **"How do I make this responsive?"**
- **"What design token should I use for [color/spacing]?"**
- **"Can you review my component structure?"**

### Where to Ask

- **Slack:** `#design-system` channel
- **GitHub:** Comment on your Pull Request
- **In-person:** Pair with a developer

### Useful Commands

```bash
# Start Storybook
npm run storybook

# Build Storybook (test production build)
npm run build-storybook

# Check for TypeScript errors
npm run type-check

# Format code (if available)
npm run format
```

---

## ✅ Pre-Submit Checklist

Before creating your Pull Request, verify:

- [ ] Component file is in correct location: `src/components/[Name]/[Name].tsx`
- [ ] Stories file is collocated: `src/components/[Name]/[Name].stories.tsx`
- [ ] Index file exports component: `src/components/[Name]/index.ts`
- [ ] Uses default export, not named export
- [ ] All props have TypeScript types
- [ ] Uses design tokens (not hardcoded colors)
- [ ] Includes all requested variants
- [ ] Tested in Storybook locally
- [ ] Responsive (looks good on mobile, tablet, desktop)
- [ ] No TypeScript errors
- [ ] Branch pushed to GitHub
- [ ] Pull Request created with good description

---

## 🎓 Learning Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Look up utility classes
- [Storybook Documentation](https://storybook.js.org/docs) - Learn advanced story techniques
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Understand types
- [React Documentation](https://react.dev/) - Learn React fundamentals

---

## 🌟 Success Stories

**Example PRs to reference:**
- [Button component](https://github.com/visualboston/grounded-world-web/commit/cb1fc7f) - Basic component structure
- _(More will be added as they're created!)_

---

**Questions?** Reach out in Slack or comment on your PR!

Happy designing! 🎨✨
