
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/auth/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Change Avatar
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" defaultValue={user?.company} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="EST (UTC-5)" />
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Address</CardTitle>
              <CardDescription>Your business shipping address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" />
                </div>
              </div>
              <Button variant="outline">
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
