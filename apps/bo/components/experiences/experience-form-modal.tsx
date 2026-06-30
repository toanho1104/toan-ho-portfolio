"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@repo/ui";
import { experiencesApi } from "@/lib/api/experiences";
import { queryKeys } from "@/lib/query-keys";
import type { Experience } from "@/lib/types/experience";
import {
  experienceSchema,
  experienceToForm,
  formToExperiencePayload,
  type ExperienceFormValues,
} from "@/lib/schemas/experience.schema";
import { Modal } from "@/components/ui/modal";
import { I18nFields } from "@/components/ui/i18n-fields";
import { AlertMessage } from "@/components/ui/alert-message";

type ExperienceFormModalProps = {
  open: boolean;
  experience: Experience | null;
  onClose: () => void;
};

export function ExperienceFormModal({
  open,
  experience,
  onClose,
}: ExperienceFormModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!experience;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { isCurrent: false, sortOrder: 0 },
  });

  const isCurrent = useWatch({ control, name: "isCurrent", defaultValue: false });

  useEffect(() => {
    if (open) {
      reset(
        experience
          ? experienceToForm(experience)
          : {
              company: "",
              positionVi: "",
              isCurrent: false,
              sortOrder: 0,
              startDate: "",
              techStack: "",
            },
      );
    }
  }, [open, experience, reset]);

  const mutation = useMutation({
    mutationFn: (values: ExperienceFormValues) => {
      const payload = formToExperiencePayload(values);
      return isEdit
        ? experiencesApi.update(experience!.id, payload)
        : experiencesApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit experience" : "New experience"}
      onClose={onClose}
      size="lg"
    >
      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="flex flex-col gap-4"
      >
        <Input
          label="Company"
          error={errors.company?.message}
          {...register("company")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company logo URL"
            error={errors.companyLogoUrl?.message}
            {...register("companyLogoUrl")}
          />
          <Input
            label="Company URL"
            error={errors.companyUrl?.message}
            {...register("companyUrl")}
          />
        </div>

        <I18nFields
          label="Position"
          viKey="positionVi"
          enKey="positionEn"
          register={register}
          errors={errors}
        />
        <I18nFields
          label="Description"
          viKey="descriptionVi"
          enKey="descriptionEn"
          register={register}
          errors={errors}
          multiline
        />

        <Input
          label="Tech stack (comma separated)"
          {...register("techStack")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <Input
            label="End date"
            type="date"
            disabled={isCurrent}
            {...register("endDate")}
          />
          <Input
            label="Sort order"
            type="number"
            error={errors.sortOrder?.message}
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>

        <label className="label cursor-pointer justify-start gap-3 w-fit">
          <input
            type="checkbox"
            className="checkbox"
            {...register("isCurrent")}
          />
          <span className="label-text">Currently working here</span>
        </label>

        {mutation.error && <AlertMessage message={mutation.error.message} />}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
