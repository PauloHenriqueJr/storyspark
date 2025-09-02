import { supabase } from "@/lib/supabase";

export interface EmailList {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  user_id: string;
  status: "active" | "inactive" | "archived";
  subscribers_count: number;
  growth_rate: number;
  double_opt_in: boolean;
  auto_responder: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface EmailContact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  status: "subscribed" | "unsubscribed" | "bounced" | "complained";
  tags?: string[];
  custom_fields?: any;
  workspace_id: string;
  source?: string;
  subscribed_at: string;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  html_content: string;
  text_content?: string;
  workspace_id: string;
  user_id: string;
  template_id?: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";
  send_type: "immediate" | "scheduled" | "recurring";
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  tags?: string[];
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaignStats {
  id: string;
  campaign_id: string;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opens: number;
  unique_opens: number;
  total_clicks: number;
  unique_clicks: number;
  unsubscribes: number;
  complaints: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  last_updated: string;
  created_at: string;
}

export interface EmailEvent {
  id: string;
  campaign_id: string;
  contact_id: string;
  event_type:
    | "sent"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "unsubscribed"
    | "complained";
  event_data?: any;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

// Email Lists
export const getEmailLists = async (): Promise<EmailList[]> => {
  const { data, error } = await supabase
    .from("email_lists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createEmailList = async (
  list: Omit<EmailList, "id" | "created_at" | "updated_at">
): Promise<EmailList> => {
  const { data, error } = await supabase
    .from("email_lists")
    .insert(list)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEmailList = async (
  id: string,
  updates: Partial<EmailList>
): Promise<EmailList> => {
  const { data, error } = await supabase
    .from("email_lists")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmailList = async (id: string): Promise<void> => {
  const { error } = await supabase.from("email_lists").delete().eq("id", id);

  if (error) throw error;
};

// Email Contacts
export const getEmailContacts = async (
  listId?: string
): Promise<EmailContact[]> => {
  if (listId) {
    const { data, error } = await supabase
      .from("email_contacts")
      .select(
        `
        *,
        email_list_contacts!inner(list_id)
      `
      )
      .eq("email_list_contacts.list_id", listId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  const { data, error } = await supabase
    .from("email_contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createEmailContact = async (
  contact: Omit<EmailContact, "id" | "created_at" | "updated_at">
): Promise<EmailContact> => {
  const { data, error } = await supabase
    .from("email_contacts")
    .insert(contact)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEmailContact = async (
  id: string,
  updates: Partial<EmailContact>
): Promise<EmailContact> => {
  const { data, error } = await supabase
    .from("email_contacts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmailContact = async (id: string): Promise<void> => {
  const { error } = await supabase.from("email_contacts").delete().eq("id", id);

  if (error) throw error;
};

// Email Campaigns
export const getEmailCampaigns = async (): Promise<EmailCampaign[]> => {
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createEmailCampaign = async (
  campaign: Omit<EmailCampaign, "id" | "created_at" | "updated_at">
): Promise<EmailCampaign> => {
  const { data, error } = await supabase
    .from("email_campaigns")
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEmailCampaign = async (
  id: string,
  updates: Partial<EmailCampaign>
): Promise<EmailCampaign> => {
  const { data, error } = await supabase
    .from("email_campaigns")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmailCampaign = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("email_campaigns")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// Email Campaign Stats
export const getCampaignStats = async (
  campaignId?: string
): Promise<EmailCampaignStats[]> => {
  let query = supabase.from("email_campaign_stats").select("*");

  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Email Events
export const getEmailEvents = async (
  campaignId?: string
): Promise<EmailEvent[]> => {
  let query = supabase.from("email_events").select("*");

  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) throw error;
  return data || [];
};

// Analytics functions
export const getEmailAnalytics = async () => {
  // Get overall stats
  const { data: campaignStats, error: statsError } = await supabase
    .from("email_campaign_stats")
    .select("*");

  if (statsError) throw statsError;

  // Calculate totals
  const totalSent =
    campaignStats?.reduce((sum, stat) => sum + stat.total_sent, 0) || 0;
  const totalDelivered =
    campaignStats?.reduce((sum, stat) => sum + stat.total_delivered, 0) || 0;
  const totalOpens =
    campaignStats?.reduce((sum, stat) => sum + stat.unique_opens, 0) || 0;
  const totalClicks =
    campaignStats?.reduce((sum, stat) => sum + stat.unique_clicks, 0) || 0;

  const avgOpenRate = campaignStats?.length
    ? campaignStats.reduce((sum, stat) => sum + stat.open_rate, 0) /
      campaignStats.length
    : 0;

  const avgClickRate = campaignStats?.length
    ? campaignStats.reduce((sum, stat) => sum + stat.click_rate, 0) /
      campaignStats.length
    : 0;

  return {
    totalSent,
    totalDelivered,
    totalOpens,
    totalClicks,
    avgOpenRate,
    avgClickRate,
    campaignStats: campaignStats || [],
  };
};

// List-Contact Relationships
export interface EmailListContact {
  id: string;
  list_id: string;
  contact_id: string;
  added_at: string;
}

export const addContactToList = async (
  listId: string,
  contactId: string
): Promise<EmailListContact> => {
  const { data, error } = await supabase
    .from("email_list_contacts")
    .insert({
      list_id: listId,
      contact_id: contactId,
      added_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeContactFromList = async (
  listId: string,
  contactId: string
): Promise<void> => {
  const { error } = await supabase
    .from("email_list_contacts")
    .delete()
    .eq("list_id", listId)
    .eq("contact_id", contactId);

  if (error) throw error;
};

export const getListContacts = async (
  listId: string
): Promise<EmailContact[]> => {
  const { data, error } = await supabase
    .from("email_contacts")
    .select(
      `
      *,
      email_list_contacts!inner(added_at)
    `
    )
    .eq("email_list_contacts.list_id", listId)
    .order("email_list_contacts.added_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getContactLists = async (
  contactId: string
): Promise<EmailList[]> => {
  const { data, error } = await supabase
    .from("email_lists")
    .select(
      `
      *,
      email_list_contacts!inner(added_at)
    `
    )
    .eq("email_list_contacts.contact_id", contactId)
    .order("email_list_contacts.added_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
