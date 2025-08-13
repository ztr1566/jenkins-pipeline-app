import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/* Sidebar Context */
type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  collapsedWidth?: number
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({
  children,
  collapsed: defaultCollapsed = false,
  collapsedWidth = 64,
}: {
  children: React.ReactNode
  collapsed?: boolean
  collapsedWidth?: number
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, collapsedWidth }}>
      {children}
    </SidebarContext.Provider>
  )
}

/* Sidebar Components */
export function Sidebar({
  className,
  children,
  collapsible = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  collapsible?: boolean
}) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroup({
  className,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [isOpen, setIsOpen] = React.useState(open ?? defaultOpen)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleToggle = () => {
    const newOpen = !isOpen
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div className={cn("mb-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar()

  if (collapsed) {
    return null
  }

  return (
    <div
      className={cn(
        "flex h-8 items-center px-3 text-xs font-medium uppercase text-sidebar-foreground/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1 px-2", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("relative", className)} {...props}>
      {children}
    </li>
  )
}

const menuButtonVariants = cva(
  "flex cursor-pointer w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-sidebar-foreground",
        active: "bg-sidebar-accent text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "active"
}

export function SidebarMenuButton({
  className,
  children,
  variant = "default",
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  return asChild ? (
    <div className={cn(menuButtonVariants({ variant }), className)}>
      {children}
    </div>
  ) : (
    <button
      className={cn(menuButtonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, setCollapsed } = useSidebar()
  
  return (
    <button
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-primary",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "transition-transform",
          collapsed ? "rotate-180" : "rotate-0"
        )}
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  )
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex items-center border-t border-sidebar-border p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}