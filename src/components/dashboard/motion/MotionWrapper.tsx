// MotionWrapper.tsx - Wrapper reutilizable para animaciones con Motion
"use client";

import { useRef } from "react";
import { motion, useInView, type TargetAndTransition, type Transition } from "motion/react";

// ========== TIPOS ==========
type AnimationType = 
  | "fadeInUp" 
  | "fadeInDown" 
  | "fadeInLeft" 
  | "fadeInRight"
  | "fadeIn" 
  | "slideIn" 
  | "scaleIn"
  | "bounceIn"
  | "staggerItem";

interface AnimationVariant {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
}

interface MotionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  type?: AnimationType;
  once?: boolean;
  className?: string;
  /** Para animaciones que deben esperar a estar en viewport */
  inView?: boolean;
}

// ========== VARIANTES DE ANIMACIÓN ==========
const animationVariants: Record<AnimationType, AnimationVariant> = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideIn: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
  },
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

// ========== COMPONENTE PRINCIPAL ==========
export function MotionWrapper({
  children,
  delay = 0,
  duration = 0.4,
  type = "fadeInUp",
  once = true,
  className = "",
  inView = false,
}: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const variant = animationVariants[type];
  const shouldAnimate = inView ? isInView : true;

  const transition: Transition = {
    duration,
    delay,
    ease: type === "bounceIn" ? [0.34, 1.56, 0.64, 1] : [0.25, 0.46, 0.45, 0.94],
  };

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={shouldAnimate ? variant.animate : variant.initial}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ========== COMPONENTE PARA LISTAS CON STAGGER ==========
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  inView?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  inView = false,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldAnimate = inView ? isInView : true;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ========== PRESETS PARA FORMULARIOS ==========
export const formAnimationPresets = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  field: (index: number) => ({
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, delay: 0.1 + index * 0.05 },
  }),
  button: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay: 0.3 },
  },
};

// ========== HOOK PARA ANIMACIONES EN VISTA ==========
export function useMotionInView(options?: { once?: boolean; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: options?.once ?? true, 
    amount: options?.amount ?? 0.3
  });

  return { ref, isInView };
}
