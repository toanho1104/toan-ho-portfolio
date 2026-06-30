"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@repo/ui";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
};

const sizeClass = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const noopSubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  size = "lg",
}: ModalProps) {
  const mounted = useIsClient();

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop — separate layer, always behind panel */}
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel — solid background, above backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bo-modal-title"
        className={`bo-modal-panel relative z-10 flex w-full flex-col ${sizeClass[size]} max-h-[min(90vh,900px)] overflow-hidden rounded-2xl border border-base-300 shadow-2xl`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="bo-modal-panel flex shrink-0 items-center justify-between border-b border-base-300 px-6 py-4">
          <h3 id="bo-modal-title" className="text-lg font-bold">
            {title}
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="bo-modal-panel min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
