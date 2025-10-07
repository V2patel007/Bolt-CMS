import { supabase } from './supabase';

export const getProjects = async (clientId?: string) => {
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:clients(*, user:profiles(*)),
      category:project_categories(*),
      creator:profiles!projects_created_by_fkey(*),
      milestones:project_milestones(*)
    `)
    .order('created_at', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients(*, user:profiles(*)),
      category:project_categories(*),
      creator:profiles!projects_created_by_fkey(*),
      milestones:project_milestones(*),
      files:project_files(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createProject = async (projectData: any) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProject = async (projectId: string, updates: any) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getProjectRequests = async (status?: string) => {
  let query = supabase
    .from('project_requests')
    .select(`
      *,
      client:clients(*, user:profiles(*)),
      category:project_categories(*)
    `)
    .order('submitted_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createProjectRequest = async (requestData: any) => {
  const { data, error } = await supabase
    .from('project_requests')
    .insert([requestData])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProjectRequest = async (requestId: string, updates: any) => {
  const { data, error } = await supabase
    .from('project_requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*, user:profiles(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getClientById = async (id: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*, user:profiles(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateClient = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getInvoices = async (clientId?: string) => {
  let query = supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*, user:profiles(*)),
      project:projects(*),
      items:invoice_items(*)
    `)
    .order('created_at', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createInvoice = async (invoiceData: any, items: any[]) => {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([invoiceData])
    .select()
    .maybeSingle();

  if (invoiceError) throw invoiceError;

  if (invoice && items.length > 0) {
    const itemsWithInvoiceId = items.map((item, index) => ({
      ...item,
      invoice_id: invoice.id,
      order_index: index
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) throw itemsError;
  }

  return invoice;
};

export const getProjectCategories = async () => {
  const { data, error } = await supabase
    .from('project_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
};

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const getDashboardStats = async (isAdmin: boolean, userId?: string) => {
  if (isAdmin) {
    const [
      { count: totalClients },
      { count: activeProjects },
      { count: pendingRequests },
      { data: recentProjects },
      { data: recentInvoices }
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['in_progress', 'review']),
      supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
      supabase.from('projects').select('*, client:clients(*, user:profiles(*))').order('created_at', { ascending: false }).limit(5),
      supabase.from('invoices').select('*, client:clients(*, user:profiles(*))').order('created_at', { ascending: false }).limit(5)
    ]);

    const { data: paidInvoices } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('status', 'paid');

    const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0) || 0;

    return {
      totalClients: totalClients || 0,
      activeProjects: activeProjects || 0,
      pendingRequests: pendingRequests || 0,
      totalRevenue,
      recentProjects: recentProjects || [],
      recentInvoices: recentInvoices || []
    };
  } else {
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!clientData) return null;

    const [
      { count: totalProjects },
      { count: activeProjects },
      { count: completedProjects },
      { data: myProjects },
      { data: myInvoices }
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).in('status', ['in_progress', 'review']),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', clientData.id).eq('status', 'completed'),
      supabase.from('projects').select('*, category:project_categories(*)').eq('client_id', clientData.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('invoices').select('*').eq('client_id', clientData.id).order('created_at', { ascending: false }).limit(5)
    ]);

    return {
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      completedProjects: completedProjects || 0,
      myProjects: myProjects || [],
      myInvoices: myInvoices || []
    };
  }
};

export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('projects-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('notifications-channel')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToProjectRequests = (callback: (payload: any) => void) => {
  return supabase
    .channel('project-requests-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'project_requests' },
      callback
    )
    .subscribe();
};
