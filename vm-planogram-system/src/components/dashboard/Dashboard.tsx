import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Store, Planogram } from '../../types';
import { storeService } from '../../services/store.service';
import { planogramService } from '../../services/planogram.service';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  Store as StoreIcon,
  FileText,
  BarChart3,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

interface DashboardStats {
  totalStores: number;
  activePlanograms: number;
  pendingTasks: number;
  completedResets: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    activePlanograms: 0,
    pendingTasks: 0,
    completedResets: 0
  });
  const [recentStores, setRecentStores] = useState<Store[]>([]);
  const [recentPlanograms, setRecentPlanograms] = useState<Planogram[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [storesResponse] = await Promise.all([
        storeService.getStores()
      ]);

      const stores = storesResponse.data;
      setRecentStores(stores.slice(0, 5));

      setStats({
        totalStores: stores.length,
        activePlanograms: 0,
        pendingTasks: 0,
        completedResets: 0
      });

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error Loading Dashboard</h3>
          <p className="mt-1">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-2 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.email}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your planograms today.
          </p>
        </div>
        <Link
          to="/stores"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Store
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <StoreIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Planograms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePlanograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Resets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedResets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Stores</h2>
              <Link
                to="/stores"
                className="text-sm text-primary hover:text-primary/80"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentStores.length === 0 ? (
              <div className="text-center py-8">
                <StoreIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No stores yet</p>
                <Link
                  to="/stores"
                  className="mt-2 inline-flex items-center text-primary hover:text-primary/80"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create your first store
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentStores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.address}</p>
                    </div>
                    <Link
                      to={`/stores/${store.id}/planogram`}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Planograms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Planograms</h2>
              <Link
                to="/stores"
                className="text-sm text-primary hover:text-primary/80"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentPlanograms.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No planograms yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create a store first, then generate planograms
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPlanograms.map((planogram) => (
                  <div key={planogram.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{planogram.name}</h3>
                      <p className="text-sm text-gray-500">Version {planogram.version}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      planogram.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      planogram.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      planogram.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {planogram.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/stores"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <StoreIcon className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Stores</h3>
                <p className="text-sm text-gray-500">Create and configure store layouts</p>
              </div>
            </Link>

            <Link
              to="/fixtures"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Browse Fixtures</h3>
                <p className="text-sm text-gray-500">Explore Uline fixture catalog</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Analytics Parser</h3>
                <p className="text-sm text-gray-500">Parse insights into planograms</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;