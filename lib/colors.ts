export const badgeVariantColors = {
  // Status Colors
  success: {
    bg: 'bg-[hsl(var(--success))]',
    text: 'text-[hsl(var(--success-foreground))]',
  },
  muted: {
    bg: 'bg-[hsl(var(--muted))]',
    text: 'text-[hsl(var(--muted-foreground))]',
  },
  primary: {
    bg: 'bg-[hsl(var(--primary))]',
    text: 'text-[hsl(var(--primary-foreground))]',
  },
  primaryActive: {
    bg: 'bg-[hsl(var(--primaryActive))]',
    text: 'text-[hsl(var(--primary-foreground))]',
  },
  destructive: {
    bg: 'bg-[hsl(var(--destructive))]',
    text: 'text-[hsl(var(--destructive-foreground))]',
  },
  secondary: {
    bg: 'bg-[hsl(var(--secondary))]',
    text: 'text-[hsl(var(--secondary-foreground))]',
  },
} as const

export type BadgeVariant = keyof typeof badgeVariantColors

export const getBadgeVariantColors = (variant: BadgeVariant) => {
  return badgeVariantColors[variant]
}
