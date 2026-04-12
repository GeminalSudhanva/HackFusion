const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const API = {
  // --- Authentication ---
  signup: async (data: any) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
    return res.json();
  },
  login: async (data: any) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    return res.json();
  },

  // --- Team Management ---
  createTeam: async (data: any) => {
    const res = await fetch(`${BASE_URL}/team/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to create team');
    return res.json();
  },
  joinTeamViaCode: async (data: any) => {
    const res = await fetch(`${BASE_URL}/team/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to join team via code');
    return res.json();
  },
  sendJoinRequest: async (data: any) => {
    const res = await fetch(`${BASE_URL}/team/request`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to send join request');
    return res.json();
  },
  respondToRequest: async (data: any) => {
    const res = await fetch(`${BASE_URL}/team/respond`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to respond to request');
    return res.json();
  },
  getMyTeam: async () => {
    const res = await fetch(`${BASE_URL}/team/my-team`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch team details');
    return res.json();
  },
  rollDice: async () => {
    const res = await fetch(`${BASE_URL}/team/roll-dice`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to roll dice');
    return res.json();
  },

  // --- Hackathon Registration ---
  registerTeam: async (data: any) => {
    const res = await fetch(`${BASE_URL}/registration/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to register team');
    return res.json();
  },
  getMyRegistration: async () => {
    const res = await fetch(`${BASE_URL}/registration/my-registration`, {
      method: 'GET',
      headers: getHeaders(),
    });
    // Normalizing a 404 response to just return null instead of throwing an error 
    // because a team might just legitimately not be registered yet.
    if (res.status === 404) return null; 
    
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch registration');
    return res.json();
  },

  // --- Admin ---
  adminFetchTeams: async () => {
    const res = await fetch(`${BASE_URL}/admin/teams`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Admin fetch failed');
    return res.json();
  },
  adminScanFood: async (teamId: string) => {
    const res = await fetch(`${BASE_URL}/admin/scan-food/${teamId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Admin scan failed');
    return res.json();
  },
  adminVerifyPayment: async (registrationId: string) => {
    const res = await fetch(`${BASE_URL}/admin/verify-payment/${registrationId}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Verify payment failed');
    return res.json();
  },
};
