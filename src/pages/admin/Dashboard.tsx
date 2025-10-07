import React, { useEffect, useState } from 'react';
import {
  Users,
  FolderOpen,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getDashboardStats, subscribeToProjects } from '../../lib/database';
import { Card } from '../../components/UI/Card';
import { StatusBadge } from '../../components/UI/StatusBadge';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { formatCurrency, formatDate, getDaysUntil } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    const channel = subscribeToProjects(() => {
      loadDashboardData();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardStats(true);
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {stats?.recentProjects?.length > 0 ? (
              stats.recentProjects.map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.client?.user?.full_name}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <StatusBadge status={project.status} />
                      <div className="mt-2 w-32">
                        <ProgressBar percentage={project.progress_percentage} showLabel={false} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent projects</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {stats?.recentInvoices?.length > 0 ? (
              stats.recentInvoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{invoice.invoice_number}</h3>
                    <p className="text-sm text-gray-600">{invoice.client?.user?.full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent invoices</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};