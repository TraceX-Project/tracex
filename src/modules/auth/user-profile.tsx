import React from 'react';
import { getUserProfile } from './_service/users.service';
import UserAvatar from '@/shared/components/user-avatar';
import { upgradeGoogleAvatar } from './_utils/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';

const UserProfile = async () => {
  const user = await getUserProfile();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="p-6 sm:p-8">
        {/* Header: Avatar + Name + Email */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <UserAvatar
            firstname={user.firstname}
            lastname={user.lastname}
            picture={upgradeGoogleAvatar(user.picture)}
            size={128}
            alt={`@${user.firstname}`}
            className="h-[128px] w-[128px] rounded-full"
          />
          <div className="mt-4 sm:mt-0">
            <h2 className="text-2xl font-semibold">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </CardHeader>

        <Separator />

        {/* Personal Information */}
        <CardContent className="p-0">
          <CardTitle className="mb-1 text-lg">Personal Information</CardTitle>
          <CardDescription className="text-muted-foreground mb-4 text-sm">
            This information is synced from your Google Account
          </CardDescription>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Firstname</Label>
              <p className="font-medium">{user.firstname}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">Lastname</Label>
              <p className="font-medium">{user.lastname}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium break-words">{user.email}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground">Role</Label>
              <p className="font-medium">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
