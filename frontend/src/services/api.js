const API_BASE = '/api';

export const SSO_PROFILES = [
  {
    id: '26970004',
    name: 'Ilham Gumantung Gusti',
    role: 'Ketua Pengusul / UR. Pengembangan Produk TI Strategis',
    email: 'ilhamgg@telkomuniversity.ac.id',
    isAdmin: true,
  },
  {
    id: '22900021',
    name: 'Rio Guntur Utomo, S.T., M.T., Ph.D.',
    role: 'Pimpinan Fakultas / Direktorat',
    email: 'rioguntur@telkomuniversity.ac.id',
    isAdmin: true,
  },
  {
    id: '26980012',
    name: 'Riky Faza',
    role: 'Anggota Tim Inovasi / Developer TI',
    email: 'rikyfaza@telkomuniversity.ac.id',
    isAdmin: true,
  },
  {
    id: '1301223011',
    name: 'Nadia Putri Pratama',
    role: 'Mahasiswa S1 Informatika',
    email: 'nadiaputri@student.telkomuniversity.ac.id',
    isAdmin: false,
  },
  {
    id: '19880412',
    name: 'Dr. Hendra Kurniawan',
    role: 'Dosen Fakultas Informatika',
    email: 'hendrak@telkomuniversity.ac.id',
    isAdmin: false,
  },
];

export function getActiveSsoUser() {
  try {
    const saved = localStorage.getItem('senada_sso_user');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    return SSO_PROFILES[0];
  }
  return SSO_PROFILES[0];
}

export function setActiveSsoUser(profile) {
  localStorage.setItem('senada_sso_user', JSON.stringify(profile));
}

function getHeaders(apiKey = null) {
  const user = getActiveSsoUser();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-SSO-User-Id': user.id,
    'X-SSO-User-Name': user.name,
    'X-SSO-User-Role': user.role,
  };
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  return headers;
}

export async function fetchDashboardSummary(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, v);
    }
  });
  const res = await fetch(`${API_BASE}/dashboard/summary?${query.toString()}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal memuat ringkasan dashboard');
  }
  return res.json();
}

export async function fetchAppDetail(appId) {
  const res = await fetch(`${API_BASE}/dashboard/app/${appId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal memuat detail aplikasi');
  }
  return res.json();
}

export async function fetchApps() {
  const res = await fetch(`${API_BASE}/apps`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal memuat daftar aplikasi');
  }
  return res.json();
}

export async function createApp(payload) {
  const res = await fetch(`${API_BASE}/apps`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gagal mendaftarkan aplikasi');
  }
  return res.json();
}

export async function fetchSurveyQuestions() {
  const res = await fetch(`${API_BASE}/survey/questions`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal memuat pertanyaan survei');
  }
  return res.json();
}

export async function submitQuickFeedback(payload, apiKey = null) {
  const user = getActiveSsoUser();
  const res = await fetch(`${API_BASE}/feedback/quick`, {
    method: 'POST',
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      ...payload,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengirim quick feedback');
  }
  return data;
}

export async function submitExtendedSurvey(payload) {
  const user = getActiveSsoUser();
  const res = await fetch(`${API_BASE}/feedback/extended`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      ...payload,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengirim survei lanjutan');
  }
  return data;
}

export async function triggerEarlyWarningCheck() {
  const res = await fetch(`${API_BASE}/early-warning/check`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal menjalankan pemeriksaan Early Warning');
  }
  return res.json();
}
