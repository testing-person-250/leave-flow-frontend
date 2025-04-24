
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLeaveStatistics } from '@/services/leaveService';
import type { LeaveStatistics } from '@/services/leaveService';

const Dashboard = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Here's your leave management dashboard.
          </p>
        </div>
        <Button asChild>
          <Link to="/leave-requests/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Leave Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-8 items-center">
                <div className="h-2 w-24 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.availableDays || 0} days
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Used Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-8 items-center">
                <div className="h-2 w-24 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.usedDays || 0} days
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-8 items-center">
                <div className="h-2 w-24 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.pendingDays || 0} days
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Allowance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-8 items-center">
                <div className="h-2 w-24 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalDays || 0} days
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20">
                <Link to="/leave-requests/new" className="flex flex-col items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>New Request</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20">
                <Link to="/leave-requests" className="flex flex-col items-center justify-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>My Requests</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-2 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-2 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-2 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Annual Leave</span>
                  <span>
                    <span className="font-medium text-primary">
                      {stats?.availableDays || 0}
                    </span>{" "}
                    / {stats?.totalDays || 0} days
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-2 rounded-full bg-primary" 
                    style={{ 
                      width: `${stats ? 
                        ((stats.totalDays - stats.availableDays) / stats.totalDays) * 100 : 0
                      }%` 
                    }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
