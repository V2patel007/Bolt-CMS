import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Building,
  FileText,
  Eye,
  Check,
  X
} from 'lucide-react';
import { getProjectRequests, updateProjectRequest, createProject, subscribeToProjectRequests } from '../../lib/database';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/UI/Card';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import { StatusBadge } from '../../components/UI/StatusBadge';
import { formatCurrency, formatDate, formatDateTime, getPriorityColor } from '../../lib/utils';
import { toast } from 'react-toastify';

export const RequestsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [requestToReject, setRequestToReject] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();

    const channel = subscribeToProjectRequests(() => {
      loadRequests();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getProjectRequests();
      setRequests(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    filterStatus === 'all' || request.status === filterStatus
  );

  const handleApproveRequest = async (requestId: string) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Create project from request
      const projectData = {
        client_id: request.client_id,
        title: request.title,
        description: request.description,
        category_id: request.category_id,
        priority: request.priority_level,
        status: 'pending_approval',
        budget: request.budget_range_max || request.budget_range_min,
        due_date: request.preferred_deadline,
        created_by: user?.id
      };

      const project = await createProject(projectData);

      // Update request status
      await updateProjectRequest(requestId, {
        status: 'converted',
        project_id: project.id,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
        admin_notes: 'Request approved and project created.'
      });

      toast.success('Request approved and project created!');
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      await updateProjectRequest(requestId, {
        status: 'rejected',
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id
      });

      toast.success('Request rejected');
      setShowRejectModal(false);
      setRequestToReject(null);
      setRejectionReason('');
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const openRejectModal = (requestId: string) => {
    setRequestToReject(requestId);
    setShowRejectModal(true);
  };

  const statusCounts = {
    all: requests.length,
    submitted: requests.filter(r => r.status === 'submitted').length,
    under_review: requests.filter(r => r.status === 'under_review').length,
    approved: requests.filter(r => r.status === 'approved' || r.status === 'converted').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage incoming project requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.all}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Requests</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.submitted}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.under_review}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'submitted', label: 'New' },
              { key: 'under_review', label: 'Under Review' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({statusCounts[filter.key as keyof typeof statusCounts]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority_level)}`}></div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.client?.user?.full_name}</p>
                      <p className="text-xs text-gray-600">{request.client?.user?.email}</p>
                    </div>
                  </div>
                  {request.client?.user?.company_name && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{request.client.user.company_name}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {formatDate(request.submitted_at)}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{request.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">{request.category?.name || 'Uncategorized'}</span>
                  {request.preferred_deadline && (
                    <span>Deadline: {formatDate(request.preferred_deadline)}</span>
                  )}
                  {request.budget_range_min && request.budget_range_max && (
                    <span>Budget: {formatCurrency(request.budget_range_min)} - {formatCurrency(request.budget_range_max)}</span>
                  )}
                  <span className="capitalize">Priority: {request.priority_level}</span>
                </div>

                {request.admin_notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800"><strong>Admin Notes:</strong> {request.admin_notes}</p>
                  </div>
                )}

                {request.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800"><strong>Rejection Reason:</strong> {request.rejection_reason}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {request.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Approve and create project"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openRejectModal(request.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Reject request"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showRejectModal && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setRequestToReject(null);
            setRejectionReason('');
          }}
          title="Reject Project Request"
        >
          <div className="space-y-4">
            <p className="text-gray-600">Please provide a reason for rejecting this request:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRequestToReject(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (requestToReject) {
                    handleRejectRequest(requestToReject, rejectionReason || 'Request does not meet current requirements.');
                  }
                }}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};