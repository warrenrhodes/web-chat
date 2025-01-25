import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password',
  description: 'Set your new password',
};

export default function NewPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  return <NewPasswordForm token={params.token} />;
}
