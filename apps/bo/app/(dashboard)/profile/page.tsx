import { ProfileForm } from '@/components/profile/profile-form'
import { PageHeader } from '@/components/ui/page-header'

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Edit your portfolio profile and upload CV" />
      <ProfileForm />
    </div>
  )
}
