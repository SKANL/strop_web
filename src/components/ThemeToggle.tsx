"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeAnimation } from "@space-man/react-theme-animation";
import { Button } from "@/components/ui/button";
import { themeAtom } from "@/store/ui";

export function ThemeToggle() {
  const { toggleTheme } = useThemeAnimation();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Observer for class changes to update state icon
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    const nextTheme = isDark ? "light" : "dark";
    themeAtom.set(nextTheme);
    toggleTheme();
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
