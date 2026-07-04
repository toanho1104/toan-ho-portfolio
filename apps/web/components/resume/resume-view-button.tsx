"use client";

import { Download, FileText, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { portfolioApi } from "@/lib/api/portfolio";

type ResumeViewButtonProps = {
  downloadUrl: string;
  fileName?: string | null;
  label: string;
  className?: string;
  animated?: boolean;
  reduceMotion?: boolean | null;
};

export function ResumeViewButton({
  downloadUrl,
  fileName,
  label,
  className = "btn btn-ghost btn-sm gap-2",
  animated = false,
  reduceMotion = false,
}: ResumeViewButtonProps) {
  const t = useTranslations("resume");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    setViewUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  const openModal = useCallback(async () => {
    setLoading(true);
    setError(null);
    setViewUrl(null);
    dialogRef.current?.showModal();

    try {
      const data = await portfolioApi.getResumeViewUrl();
      setViewUrl(data.url);
    } catch {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const button = (
    <button type="button" onClick={openModal} className={className}>
      <FileText className="size-4" />
      {label}
    </button>
  );

  return (
    <>
      {animated && !reduceMotion ? (
        <motion.div
          className="inline-flex"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {button}
        </motion.div>
      ) : (
        button
      )}

      <dialog ref={dialogRef} className="modal" onClose={closeModal}>
        <div className="modal-box flex h-[min(90vh,820px)] max-h-[90vh] w-11/12 max-w-5xl flex-col gap-0 overflow-hidden p-0">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-base-300 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <h2 className="truncate font-semibold text-base-content">
                {t("title")}
              </h2>
              {fileName && (
                <p className="truncate text-xs text-base-content/50">
                  {fileName}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={downloadUrl}
                className="btn btn-neutral btn-sm gap-2"
                download={fileName ?? undefined}
              >
                <Download className="size-4" />
                {t("download")}
              </a>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                aria-label={t("close")}
                onClick={closeModal}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 bg-base-200/40">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-base-content/60">
                <Loader2 className="size-8 animate-spin" />
                <p className="text-sm">{t("loading")}</p>
              </div>
            )}

            {error && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-base-content/70">{error}</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={openModal}
                >
                  {t("retry")}
                </button>
              </div>
            )}

            {viewUrl && !loading && !error && (
              <iframe
                src={viewUrl}
                title={t("title")}
                className="size-full border-0"
              />
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="submit" aria-label={t("close")}>
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
