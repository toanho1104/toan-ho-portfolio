"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@repo/ui";
import { profileApi } from "@/lib/api/profile";
import { queryKeys } from "@/lib/query-keys";
import {
  formToProfilePayload,
  profileSchema,
  profileToForm,
  type ProfileFormValues,
} from "@/lib/schemas/profile.schema";
import { I18nFields } from "@/components/ui/i18n-fields";
import { AlertMessage } from "@/components/ui/alert-message";
import { LoadingState } from "@/components/ui/loading-state";
import { ResumeSection } from "@/components/profile/resume-section";
import { AvatarSection } from "@/components/profile/avatar-section";

export function ProfileForm() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileApi.get,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) reset(profileToForm(profile));
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });

  if (isLoading) return <LoadingState />;
  if (error) return <AlertMessage message={error.message} />;
  if (!profile)
    return (
      <AlertMessage message="Profile not found. Run seed first." type="info" />
    );

  return (
    <div className="space-y-6 max-w-3xl">
      <form
        onSubmit={handleSubmit((values) =>
          mutation.mutate(formToProfilePayload(values)),
        )}
        className="card bg-base-100 shadow"
      >
        <div className="card-body gap-4">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register("name")}
          />

          <I18nFields
            label="Title"
            viKey="titleVi"
            enKey="titleEn"
            register={register}
            errors={errors}
          />

          <I18nFields
            label="Bio"
            viKey="bioVi"
            enKey="bioEn"
            register={register}
            errors={errors}
            multiline
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Location" {...register("location")} />
            <Input label="Phone" {...register("phone")} />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="External avatar URL (optional)"
              error={errors.avatarUrl?.message}
              {...register("avatarUrl")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              error={errors.githubUrl?.message}
              {...register("githubUrl")}
            />
            <Input
              label="LinkedIn URL"
              error={errors.linkedinUrl?.message}
              {...register("linkedinUrl")}
            />
            <Input
              label="Website URL"
              error={errors.websiteUrl?.message}
              {...register("websiteUrl")}
            />
            <Input
              label="External resume URL"
              error={errors.resumeUrl?.message}
              {...register("resumeUrl")}
            />
          </div>

          <label className="label cursor-pointer justify-start gap-3 w-fit">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("isAvailable")}
            />
            <span className="label-text">Available for work</span>
          </label>

          {mutation.error && <AlertMessage message={mutation.error.message} />}
          {mutation.isSuccess && (
            <AlertMessage message="Profile saved successfully" type="success" />
          )}

          <div className="card-actions justify-end">
            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={!isDirty && !mutation.isPending}
            >
              Save profile
            </Button>
          </div>
        </div>
      </form>

      <AvatarSection />
      <ResumeSection />
    </div>
  );
}
