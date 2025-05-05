import { useState } from 'react';

export default function Step2_AddExpenses({ members, expenses, setExpenses, onBack, onNext }) {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitBetween, setSplitBetween] = useState([]);

  const handleAddExpense = () => {
    if (!expenseName || !amount || !payer || splitBetween.length < 2) return; // Validation

    const newExpense = {
      name: expenseName,
      amount: parseFloat(amount),
      payer,
      splitBetween,
    };

    setExpenses([...expenses, newExpense]);
    resetForm();
  };

  const resetForm = () => {
    setExpenseName('');
    setAmount('');
    setPayer('');
    setSplitBetween([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Step 2: Add Expense</h2>
        <button onClick={onBack} className="text-sm text-blue-600 underline">← Back to Members</button>
      </div>

      {/* Expense Form */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto">
        <div>
          <label className="block font-semibold">Expense Name</label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            placeholder="Enter expense name"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
            <label>
                <span class="text-sm font-medium text-gray-700"> Paid By </span>
                <select
  value={payer}
  onChange={(e) => setPayer(e.target.value)}
  className="w-full border p-2 pr-10 rounded border-gray-300 shadow-sm sm:text-sm"
>
  <option value="">Select Payer</option>
  {members.map((member) => (
    <option key={member} value={member}>{member}</option>
  ))}
</select>


            </label>
          
        </div>

        <div>
  <label className="block font-semibold mb-1">Split Between</label>
  <div className="flex flex-wrap gap-2 border p-3 rounded bg-white">
    {members.map((member) => (
      <label key={member} className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          value={member}
          checked={splitBetween.includes(member)}
          onChange={() => {
            setSplitBetween((prev) =>
              prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
            );
          }}
        />
        <span>{member}</span>
      </label>
    ))}
  </div>
</div>



        <button
          onClick={handleAddExpense}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </div>

      {/* Show Expenses for the Payer */}
      <div className="space-y-4">
        {members.map((member) => {
          const memberExpenses = expenses.filter(expense => expense.payer === member);
          return memberExpenses.length > 0 && (
            <div key={member} className="border border-gray-400 bg-gray-100 p-2 rounded-sm">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium py-1">{member}'s Expenses</h3>
              </div>
              <ul className="space-y-2">
                {memberExpenses.map((expense, idx) => (
                <div className="block h-full rounded-lg border  bg-white border-gray-400 px-4 py-2 hover:border-gray-600">
                    <div className="flex justify-between">
                        <li key={idx}>
                            <strong >{expense.name}</strong>
                            <div className='text-xs font-medium text-gray-800'>Split: {expense.splitBetween.join(', ')}</div>
                        </li>
                        <span className="text-lg font-medium">${expense.amount}</span>
                    </div>
                    
                </div>
                  
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      
      <button
        onClick={onNext}
        disabled={expenses.length === 0}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        Proceed to Settle Up
      </button>
    </div>
  );
}
