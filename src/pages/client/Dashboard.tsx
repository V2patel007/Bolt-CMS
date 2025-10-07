import React, { useEffect, useState } from 'react';
import {
  FolderOpen,
  Clock,
  CheckCircle,
  DollarSign,
  MessageSquare,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getDashboardStats } from '../../lib/database';
import { Card } from '../../components/UI/Card';
import { StatusBadge } from '../../components/UI/StatusBadge';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { formatCurrency, formatDate } from '../../lib/utils';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardStats(false, user?.id);
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
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      description: 'All time',
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      description: 'Currently in progress',
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Projects',
      value: stats?.completedProjects || 0,
      description: 'Successfully delivered',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Recent Invoices',
      value: stats?.myInvoices?.length || 0,
      description: 'Total invoices',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your projects</p>
        </div>
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
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Projects</h2>
          <div className="space-y-4">
            {stats?.myProjects?.length > 0 ? (
              stats.myProjects.map((project: any) => (
                <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <ProgressBar percentage={project.progress_percentage} size="sm" />
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    <span>Due: {project.due_date ? formatDate(project.due_date) : 'Not set'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {stats?.myInvoices?.length > 0 ? (
              stats.myInvoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{invoice.invoice_number}</h3>
                    <p className="text-sm text-gray-600">Due: {formatDate(invoice.due_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};