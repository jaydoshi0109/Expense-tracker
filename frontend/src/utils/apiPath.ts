// apiPaths.ts

export const API_BASE = "http://localhost:5000/api";
export const API_PATHS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/signup`,
  },
  TRANSACTIONS: {
    EXPENSES: `${API_BASE}/expenses`,
    INCOME: `${API_BASE}/incomes`,
  },
};