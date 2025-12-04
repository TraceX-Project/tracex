import UserProfile from '@/modules/auth/user-profile';
import SiteHeader from '@/modules/sidebar/site-header';

export default function AccountPage() {
  return (
    <>
      <SiteHeader title="Account" />
      <div className="container mx-auto p-5 pt-20">
        <UserProfile />
      </div>
    </>
  );
}
