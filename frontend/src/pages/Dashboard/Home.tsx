import { useState, useEffect } from 'react';
import { useTransaction } from '../../context/TransactionContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import Income from './Income';
import Expense from './Expense';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../../context/TransactionContext';

const Home = () => {
  const { state, addTransaction, deleteTransaction } = useTransaction();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'income' | 'expense'>('dashboard');
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expense: number }[]>([]);

  const incomeTransactions = state.transactions.filter((tx) => tx.type === 'income');
  const expenseTransactions = state.transactions.filter((tx) => tx.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
  ];

  const COLORS = ['#34D399', '#F87171'];



  useEffect(() => {
    const allTransactions = [...incomeTransactions, ...expenseTransactions];
    const sortedTransactions = allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentTransactions(sortedTransactions.slice(0, 5));

    // Calculate monthly data
    const monthlyTotals: { [month: string]: { income: number; expense: number } } = {};
    allTransactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        monthlyTotals[month].income += tx.amount;
      } else {
        monthlyTotals[month].expense += tx.amount;
      }
    });

    // Convert monthlyTotals to array for Recharts
    const monthlyArray = Object.entries(monthlyTotals).map(([month, totals]) => ({
      month,
      income: totals.income,
      expense: totals.expense,
    }));
    setMonthlyData(monthlyArray);
  }, [state.transactions]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-102">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Income</h2>
                  <p className="text-3xl font-bold text-green-500">${totalIncome}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-102">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Expense</h2>
                  <p className="text-3xl font-bold text-red-500">${totalExpense}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-102">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Balance</h2>
                  <p className="text-3xl font-bold text-indigo-500">${balance}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Income vs Expense</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Monthly Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#34D399" />
                    <Bar dataKey="expense" fill="#F87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Recent Transactions</h3>
              <ul className="space-y-4">
                {recentTransactions.map((tx) => (
                  <li key={tx._id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-800">{tx.description}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? `+ $${tx.amount}` : `- $${tx.amount}`}
                    </p>
                    <button
                      onClick={() => deleteTransaction(tx._id, tx.type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              {/* Commented out Add buttons */}
              {/* <div className="mt-4 flex gap-4">

                <button
                  onClick={() => addTransaction({ description: 'Test Income', amount: 200, type: 'income', date: new Date().toISOString() })}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Income
                </button>
                <button
                  onClick={() => addTransaction({ description: 'Test Expense', amount: 100, type: 'expense', date: new Date().toISOString() })}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Expense
                </button>
              </div> */}
            </div>
          </>
        );
      case 'income':
        return <Income />;
      case 'expense':
        return <Expense />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-5 rounded-xl text-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-full shadow p-2 space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-full text-lg font-medium ${activeTab === 'dashboard' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-5 py-3 rounded-full text-lg font-medium ${activeTab === 'income' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Income
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-5 py-3 rounded-full text-lg font-medium ${activeTab === 'expense' ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Expense
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Home;

