import { redirect } from 'next/navigation';

export default function GuestPage() {
  // Redirect to the menu page when accessing /guest directly
  redirect('/guest/menu');
}
