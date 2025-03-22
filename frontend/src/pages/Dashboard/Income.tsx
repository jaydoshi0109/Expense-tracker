import { useEffect, useState } from "react";
import { useTransaction } from "../../context/TransactionContext";
import { API_PATHS } from "../../utils/apiPath";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";

const Income = () => {
  const { state, addTransaction, deleteTransaction } = useTransaction();
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        await axios.get(API_PATHS.TRANSACTIONS.INCOME, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        setError("Error fetching incomes");
        console.error("Error fetching incomes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchIncomes();
    }
  }, [token]);

  const handleAdd = async () => {
    if (amount <= 0 || description.trim() === "" || isAdding) return;
    setIsAdding(true);

    const newTransaction = {
      type: "income" as const,
      amount,
      description,
      date: new Date().toISOString(),
    };

    try {
      await addTransaction(newTransaction);
      setAmount(0);
      setDescription("");
    } catch (err) {
      console.error("Error adding income:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id, "income");
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

  const incomes = state.transactions.filter((tx) => tx.type === "income");

  const graphData = incomes.map((tx) => ({
    date: new Date(tx.date).toLocaleDateString(),
    amount: tx.amount,
  }));

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-green-50 min-h-screen space-y-6">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 tracking-wide">Income Tracker</h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 transition-transform transform hover:scale-102">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Income</h2>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow text-lg"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow text-lg"
        />

        <button
          onClick={handleAdd}
          className={`w-full py-4 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:bg-gradient-to-l transition-colors text-lg font-semibold ${isAdding ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : ''}`}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Income'}
        </button>
      </div>

      {loading && <p className="text-gray-600 text-lg">Loading...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Income Graph</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#34D399" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Incomes</h2>
        {incomes.length === 0 && <p className="text-gray-600 text-lg">No incomes added yet.</p>}
        {incomes.map((tx) => (
          <div key={tx._id} className="flex justify-between items-center border-b py-5">
            <div>
              <p className="font-medium text-gray-800 text-lg">{tx.description}</p>
              <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-green-600 font-semibold text-lg">+${tx.amount}</p>
              <button onClick={() => handleDelete(tx._id)} className="text-red-500 hover:underline text-lg">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;