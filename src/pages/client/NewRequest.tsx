import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Send,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Building,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';
import { createProjectRequest, getProjectCategories } from '../../lib/database';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

interface RequestForm {
  title: string;
  description: string;
  category_id: string;
  preferred_deadline?: string;
  budget_range_min?: number;
  budget_range_max?: number;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
}

export const NewRequestPage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestForm>({
    defaultValues: {
      priority_level: 'medium'
    }
  });

  useEffect(() => {
    loadCategories();
    loadClientId();
  }, [user]);

  const loadCategories = async () => {
    try {
      const data = await getProjectCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadClientId = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setClientId(data?.id || null);
    } catch (error) {
      console.error('Error loading client ID:', error);
    }
  };

  const onSubmit = async (data: RequestForm) => {
    if (!clientId) {
      toast.error('Unable to submit request. Please try again.');
      return;
    }

    setLoading(true);

    try {
      await createProjectRequest({
        ...data,
        client_id: clientId,
        status: 'submitted'
      });

      toast.success('Your project request has been submitted successfully!');
      setSubmitted(true);
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your project request. Our team will review it and get back to you within 24-48 hours.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Our team will review your requirements</li>
              <li>• We'll prepare a detailed proposal with timeline and pricing</li>
              <li>• You'll receive an email with next steps</li>
              <li>• We'll schedule a call to discuss your project in detail</li>
            </ul>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">New Project Request</h1>
        <p className="text-gray-600 mt-2">Tell us about your project and we'll get back to you with a proposal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                {...register('title', { required: 'Project title is required' })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., E-commerce Website Development"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Category *
              </label>
              <select
                {...register('category_id', { required: 'Please select a category' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                {...register('description', { required: 'Project description is required' })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Describe your project in detail. Include features, functionality, design preferences, target audience, and any specific requirements..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('preferred_deadline')}
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  {...register('priority_level')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="low">Low - No rush</option>
                  <option value="medium">Medium - Standard timeline</option>
                  <option value="high">High - Important project</option>
                  <option value="urgent">Urgent - ASAP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('budget_range_min', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Budget must be positive' }
                    })}
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Min budget"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('budget_range_max', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Budget must be positive' }
                    })}
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Max budget"
                  />
                </div>
              </div>
              {(errors.budget_range_min || errors.budget_range_max) && (
                <p className="mt-1 text-sm text-red-600">Please enter valid budget amounts</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('additional_notes')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Any additional information, special requirements, or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Project Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Submit Request</p>
                  <p className="text-xs text-gray-600">Fill out the form with your project details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Review Process</p>
                  <p className="text-xs text-gray-600">Our team reviews your requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Get Proposal</p>
                  <p className="text-xs text-gray-600">Receive detailed proposal with timeline</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Start Project</p>
                  <p className="text-xs text-gray-600">Approve and begin development</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Response Time</h4>
                <p className="text-sm text-blue-800">
                  We typically respond to project requests within 24-48 hours. For urgent requests, 
                  we'll get back to you within 4-6 hours during business days.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="font-medium text-gray-900 mb-3">Available Categories</h4>
            <div className="space-y-2">
              {categories.slice(0, 6).map(category => (
                <div key={category.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="text-xs text-gray-400">{category.base_price ? `From ${category.base_price}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};