export interface Business {
  id: string;
  name: string;
  description: string;
  industry: string;
  avatar_url: string;
  website: string;
  is_featured: boolean;
  is_public: boolean;
  health_score: number;
  category: string;
  like_count?: number;
  comment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  business_id: string;
  content: string;
  created_at: string;
  user?: {
    email: string;
  };
}

export interface ChatMessage {
  id: string;
  user_id: string;
  business_id?: string;
  message: string;
  created_at: string;
  user?: {
    email: string;
  };
}

const API_BASE_URL = "http://localhost:8080";

// Helper for authenticated requests
async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response;
}

// fetch all businesses
export async function fetchBusinesses(
  limit: number,
  offset: number,
): Promise<Business[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/businesses?limit=${limit}&offset=${offset}`,
    );
    if (!response.ok) {
      throw new Error(`Error fetching businesses: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch businesses:", error);
    throw error;
  }
}

// fetch business by id
export async function fetchBusiness(id: string): Promise<Business> {
  const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
  if (!response.ok) throw new Error("Failed to fetch business");
  return response.json();
}

export async function trackView(id: string): Promise<void> {
  await fetch(`${API_BASE_URL}/businesses/${id}/view`, {
    method: "POST",
  });
}

export async function trackConversion(id: string): Promise<void> {
  await fetch(`${API_BASE_URL}/businesses/${id}/conversion`, {
    method: "POST",
  });
}

export async function submitPlatformInquiry(data: any): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/platform-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send inquiry");
}

export async function fetchComments(businessId: string): Promise<Comment[]> {
  const response = await fetch(
    `${API_BASE_URL}/businesses/${businessId}/comments`,
  );
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

export async function addComment(
  businessId: string,
  content: string,
): Promise<void> {
  await authFetch(`${API_BASE_URL}/businesses/${businessId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function likeBusiness(businessId: string): Promise<void> {
  await authFetch(`${API_BASE_URL}/businesses/${businessId}/like`, {
    method: "POST",
  });
}

export async function submitInquiry(
  businessId: string,
  subject: string,
  message: string,
): Promise<void> {
  await authFetch(`${API_BASE_URL}/businesses/${businessId}/inquiry`, {
    method: "POST",
    body: JSON.stringify({ subject, message }),
  });
}

export async function updateInquiryStatus(
  id: string,
  status: string,
): Promise<void> {
  await authFetch(`${API_BASE_URL}/inquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function fetchNetworkFeed(): Promise<ChatMessage[]> {
  const response = await fetch(`${API_BASE_URL}/network/feed`);
  if (!response.ok) throw new Error("Failed to fetch feed");
  return response.json();
}

export async function sendChatMessage(
  message: string,
  businessId?: string,
): Promise<ChatMessage> {
  const response = await authFetch(`${API_BASE_URL}/network/chat`, {
    method: "POST",
    body: JSON.stringify({ message, business_id: businessId }),
  });
  return response.json();
}

export async function subscribeNewsletter(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to subscribe to newsletter");
  }
}

// create business
export async function createBusiness(
  data: Omit<Business, "id" | "created_at" | "updated_at">,
): Promise<{ business: Business; token: string; role: string }> {
  const response = await authFetch(`${API_BASE_URL}/businesses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

// update business
export async function updateBusiness(
  id: string,
  data: Partial<Business>,
): Promise<Business> {
  const response = await authFetch(`${API_BASE_URL}/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

// delete business
export async function deleteBusiness(id: string): Promise<void> {
  await authFetch(`${API_BASE_URL}/businesses/${id}`, {
    method: "DELETE",
  });
}

export interface Stats {
  startup?: number;
  innovator?: number;
  mentor?: number;
}

// fetch stats
export async function fetchStats(): Promise<Stats> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
}

export interface Activity {
  id: string;
  type: string; // view, conversion, inquiry, health_eval
  entity_type: string;
  value: number;
  metadata?: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_link?: string;
  user?: {
    name: string;
    email: string;
  };
}

// fetch dashboard data
export interface DashboardData {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  role: string; // admin, owner, viewer, privileged
  has_business?: boolean;
  business?: Business;
  stats: {
    // Owner stats
    health_score?: number;
    profile_views?: number;
    active_inquiries?: number;
    conversions?: number;
    likes?: number;

    // Admin stats
    total_users?: number;
    total_businesses?: number;
    total_inquiries?: number;
    total_views?: number;
    server_load?: string;
    total_revenue?: number;
  };
  system_health?: {
    uptime: string;
    status: string;
    active_goroutines?: number;
  };
  pipeline?: any[];
  activities?: Activity[];
  meetings?: Meeting[];
  message?: string;
}

// fetch dashboard data
export async function fetchDashboardMe(): Promise<DashboardData> {
  const response = await authFetch(`${API_BASE_URL}/dashboard/me`);
  return response.json();
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  organizer?: string;
  location: string;
  is_virtual: boolean;
  start_date: string;
  end_date?: string;
  link?: string;
  image_url?: string;
  tags?: string;
}

// fetch events
export async function fetchEvents(): Promise<AppEvent[]> {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}

export interface AppNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author?: string;
  category: string;
  source: string;
  source_url: string;
  image_url?: string;
  tags?: string;
  published_at: string;
  created_at: string;
}

// fetch news articles
export async function fetchNews(): Promise<AppNews[]> {
  const response = await fetch(`${API_BASE_URL}/news`);
  if (!response.ok) throw new Error("Failed to fetch news");
  return response.json();
}

// fetch single news article by slug
export async function fetchNewsArticle(slug: string): Promise<AppNews> {
  const response = await fetch(`${API_BASE_URL}/news/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch news article");
  return response.json();
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const response = await authFetch(`${API_BASE_URL}/notifications`);
  return response.json();
}

export async function markNotificationRead(id: string): Promise<void> {
  await authFetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await authFetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
  });
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  created_at: string;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
}

export async function fetchPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
}
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export async function fetchBlogs(): Promise<Blog[]> {
  const response = await fetch(`${API_BASE_URL}/blogs`);
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
}

export async function fetchBlog(slug: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch blog");
  return response.json();
}

export async function createBlog(data: Partial<Blog>): Promise<Blog> {
  const response = await authFetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateBlog(
  slug: string,
  data: Partial<Blog>,
): Promise<Blog> {
  const response = await authFetch(`${API_BASE_URL}/blogs/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteBlog(slug: string): Promise<void> {
  await authFetch(`${API_BASE_URL}/blogs/${slug}`, {
    method: "DELETE",
  });
}
