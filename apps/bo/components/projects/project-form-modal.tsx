"use client";

import { AlertMessage } from "@/components/ui/alert-message";
import { I18nFields } from "@/components/ui/i18n-fields";
import { Modal } from "@/components/ui/modal";
import { SelectField } from "@/components/ui/select-field";
import { projectsApi } from "@/lib/api/projects";
import {
  formToProjectPayload,
  projectSchema,
  projectToForm,
  type ProjectFormValues,
} from "@/lib/schemas/project.schema";
import { PROJECT_STATUSES, PROJECT_TYPES } from "@/lib/types/common";
import type { Project } from "@/lib/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@repo/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type ProjectFormModalProps = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
};

export function ProjectFormModal({
  open,
  project,
  onClose,
}: ProjectFormModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      type: "personal",
      status: "completed",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        project
          ? projectToForm(project)
          : {
              titleVi: "",
              titleEn: "",
              type: "personal",
              status: "completed",
              isFeatured: false,
              sortOrder: 0,
              techStack: "",
            },
      );
    }
  }, [open, project, reset]);

  const mutation = useMutation({
    mutationFn: (values: ProjectFormValues) => {
      const payload = formToProjectPayload(values);
      return isEdit
        ? projectsApi.update(project!.id, payload)
        : projectsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit project" : "New project"}
      onClose={onClose}
      size="xl"
    >
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-4 pr-1 pb-1"
      >
        <I18nFields
          label="Title"
          viKey="titleVi"
          enKey="titleEn"
          register={register}
          errors={errors}
        />
        <I18nFields
          label="Summary"
          viKey="summaryVi"
          enKey="summaryEn"
          register={register}
          errors={errors}
          multiline
        />
        <I18nFields
          label="Description"
          viKey="descriptionVi"
          enKey="descriptionEn"
          register={register}
          errors={errors}
          multiline
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Type"
            options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
            error={errors.type?.message}
            {...register("type")}
          />
          <SelectField
            label="Status"
            options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
            error={errors.status?.message}
            {...register("status")}
          />
          <Input
            label="Sort order"
            type="number"
            error={errors.sortOrder?.message}
            {...register("sortOrder", { valueAsNumber: true })}
          />
          <Input
            label="Tech stack (comma separated)"
            {...register("techStack")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GitHub URL"
            error={errors.githubUrl?.message}
            {...register("githubUrl")}
          />
          <Input
            label="Demo URL"
            error={errors.demoUrl?.message}
            {...register("demoUrl")}
          />
          <Input
            label="Thumbnail URL"
            error={errors.thumbnailUrl?.message}
            {...register("thumbnailUrl")}
          />
          <Input
            label="App Store URL"
            error={errors.appStoreUrl?.message}
            {...register("appStoreUrl")}
          />
          <Input label="Start date" type="date" {...register("startDate")} />
          <Input label="End date" type="date" {...register("endDate")} />
        </div>

        <label className="label cursor-pointer justify-start gap-3 w-fit">
          <input
            type="checkbox"
            className="checkbox"
            {...register("isFeatured")}
          />
          <span className="label-text">Featured project</span>
        </label>

        {mutation.error && <AlertMessage message={mutation.error.message} />}

        <div className="flex justify-end gap-2 sticky bottom-0 bg-base-100 pt-4 border-t border-base-300 -mx-1 px-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
