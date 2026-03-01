"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Adds a strength meter bar below (for signup forms) */
  showStrength?: boolean
  /** Additional className for the wrapper */
  wrapperClassName?: string
}

/** Compute password strength 0-4 */
function getPasswordStrength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const STRENGTH_CONFIG = [
  { label: "",            color: "bg-border",        textColor: "" },
  { label: "Muy débil",   color: "bg-destructive",   textColor: "text-destructive" },
  { label: "Débil",       color: "bg-orange-500",    textColor: "text-orange-500" },
  { label: "Aceptable",   color: "bg-yellow-500",    textColor: "text-yellow-600" },
  { label: "Fuerte",      color: "bg-emerald-500",   textColor: "text-emerald-600" },
]

/**
 * PasswordInput — Input para contraseñas con toggle show/hide y medidor de fortaleza opcional.
 *
 * @example
 * // Básico (login)
 * <PasswordInput id="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
 *
 * // Con medidor (signup)
 * <PasswordInput id="password" value={pwd} onChange={(e) => setPwd(e.target.value)} showStrength />
 */
export function PasswordInput({
  showStrength = false,
  wrapperClassName,
  className,
  value,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  const strength = showStrength ? getPasswordStrength(String(value ?? "")) : 0
  const config = STRENGTH_CONFIG[strength]

  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <div className="relative">
        <Input
          {...props}
          type={visible ? "text" : "password"}
          value={value}
          className={cn("pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden", className)}
          autoComplete={props.autoComplete ?? "current-password"}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground focus-visible:ring-inset"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {showStrength && value && String(value).length > 0 && (
        <div className="space-y-1" role="status" aria-live="polite" aria-label={`Fortaleza de contraseña: ${config.label}`}>
          <div className="flex gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  strength >= level ? config.color : "bg-border"
                )}
              />
            ))}
          </div>
          {config.label && (
            <p className={cn("text-xs font-medium", config.textColor)}>
              {config.label}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
