import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useState, useMemo } from 'react';
import axios, { AxiosResponse } from 'axios';
import { API_PATHS } from '../utils/apiPath';

export type Transaction = {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
};

type State = {
  transactions: Transaction[];
};

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const TransactionContext = createContext<{
  state: State;
  addTransaction: (tx: Omit<Transaction, '_id'>) => Promise<void>;
  deleteTransaction: (id: string, type: 'income' | 'expense') => Promise<void>;
}>({
  state: { transactions: [] },
  addTransaction: async () => { },
  deleteTransaction: async () => { },
});

const transactionReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return {
        transactions: state.transactions.filter((tx) => tx._id !== action.payload),
      };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(transactionReducer, { transactions: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [incomesData, setIncomesData] = useState<Transaction[]>([]);
  const [expensesData, setExpensesData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setError("No authentication token found.");
          return;
        }

        const [incomesRes, expensesRes] = await Promise.all([
          axios.get(API_PATHS.TRANSACTIONS.INCOME, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_PATHS.TRANSACTIONS.EXPENSES, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("Fetched Incomes:", incomesRes.data);
        console.log("Fetched Expenses:", expensesRes.data);
        setIncomesData(incomesRes.data);
        setExpensesData(expensesRes.data);
        setError(null);

      } catch (error) {
        console.error('Error fetching transactions', error);
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("Failed to fetch transactions");
        }
      }
    };
    fetchTransactions();
  }, []);

  const uniqueTransactions = useMemo(() => {
    const merged = [...incomesData, ...expensesData];
    const unique = merged.filter((tx, index, self) =>
      index === self.findIndex((t) => t._id === tx._id)
    );
    console.log("Unique Transactions:", unique);
    return unique;
  }, [incomesData, expensesData]);

  useEffect(() => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: uniqueTransactions });
  }, [uniqueTransactions]);


  const addTransaction = useCallback(async (tx: Omit<Transaction, '_id'>) => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let res: AxiosResponse<Transaction> | undefined; // Make it undefined initially
      if (tx.type === 'income') {
        res = await axios.post(API_PATHS.TRANSACTIONS.INCOME, tx, config);
        setIncomesData(prev => {
          const updated = [...prev, res!.data]; // Use definite assignment assertion here
          console.log("Updated Incomes Data after add:", updated);
          return updated;
        });
      } else if (tx.type === 'expense') {
        res = await axios.post(API_PATHS.TRANSACTIONS.EXPENSES, tx, config);
        setExpensesData(prev => {
          const updated = [...prev, res!.data];  // And here
          console.log("Updated Expenses Data after add:", updated);
          return updated;
        });
      }

      if (res) {
        dispatch({ type: 'ADD_TRANSACTION', payload: res.data });
        console.log('Transaction added successfully', res.data);
      } else {
        setError("Failed to determine transaction type (income or expense)");
      }

    } catch (error) {
      console.error('Error adding transaction', error);
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("Failed to add transaction");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const deleteTransaction = useCallback(async (id: string, type: 'income' | 'expense') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found.");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (type === 'income') {
        await axios.delete(`${API_PATHS.TRANSACTIONS.INCOME}/${id}`, config);
        setIncomesData(prev => {
          const updated = prev.filter(t => t._id !== id);
          console.log("Updated Incomes Data after delete:", updated);
          return updated;
        });
      } else {
        await axios.delete(`${API_PATHS.TRANSACTIONS.EXPENSES}/${id}`, config);
        setExpensesData(prev => {
          const updated = prev.filter(t => t._id !== id);
          console.log("Updated Expenses Data after delete:", updated);
          return updated;
        });
      }

      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      console.log('Transaction deleted successfully', id, type);
    } catch (error) {
      console.error('Error deleting transaction', error);
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("Failed to delete transaction");
      }
    }
  }, []);

  return (
    <TransactionContext.Provider value={{ state, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);

