
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getLeaveStatistics } from '@/services/leaveService';
import type { LeaveStatistics } from '@/services/leaveService';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LeaveStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getLeaveStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching leave statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">View and manage your profile details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.role}</p>
                {user?.department && (
                  <p className="text-sm text-muted-foreground">{user.department}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Entitlement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-medium">{stats?.totalDays || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">{stats?.usedDays || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Approval</span>
                  <span className="font-medium">{stats?.pendingDays || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-medium text-primary">{stats?.availableDays || 0} days</span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Balance Used</span>
                    <span>
                      {stats && stats.totalDays > 0
                        ? Math.round(((stats.totalDays - stats.availableDays) / stats.totalDays) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${
                          stats && stats.totalDays > 0
                            ? ((stats.totalDays - stats.availableDays) / stats.totalDays) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
