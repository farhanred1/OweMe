import { useState } from 'react';

export default function Step2_AddExpenses({ members = [], expenses = [], setExpenses, onBack, onNext }) {
	const [expenseName, setExpenseName] = useState('');
	const [amount, setAmount] = useState('');
	const [payer, setPayer] = useState('');
	const [splitType, setSplitType] = useState('even'); // 'even' or 'custom'
	const [splitBetween, setSplitBetween] = useState([]);
	const [customAmounts, setCustomAmounts] = useState({});

	const handleAddExpense = () => {
		if (!expenseName || !payer || splitBetween.length < 1) return;
		if (splitType === 'even' && !amount) return;
		let finalAmount = 0;
		if (splitType === 'even') {
			finalAmount = parseFloat(amount);
			if (isNaN(finalAmount)) return;
		} else {
			const total = Object.values(customAmounts).reduce((sum, val) => {
				const num = parseFloat(val);
				return sum + (isNaN(num) ? 0 : num);
			}, 0);
			if (total === 0) return;
			finalAmount = total;
		}


		const newExpense = {
			name: expenseName,
			amount: finalAmount,
			payer,
			splitBetween,
			splitType,
			customAmounts: splitType === 'custom' ? customAmounts : null
		};

		setExpenses([...expenses, newExpense]);
		resetForm();
	};

	const resetForm = () => {
		setExpenseName('');
		setAmount('');
		setPayer('');
		setSplitBetween([]);
		setSplitType('even');
		setCustomAmounts({});
	};

	const totalCustomAmount = Object.values(customAmounts).reduce((sum, val) => sum + parseFloat(val || 0), 0);

	return (
		<div className="space-y-6">

			{/* Expense Form */}
			<div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto">
				<h2 className="text-2xl font-semibold text-center">Step 2: Add Expense</h2>
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
					<label className="block font-semibold">Paid By</label>
					<select
						value={payer}
						onChange={(e) => setPayer(e.target.value)}
						className="w-full border p-2 rounded"
					>
						<option value="">Select Payer</option>
						{members.map((member) => (
							<option key={member} value={member}>{member}</option>
						))}
					</select>
				</div>

				<div>
					<label className="block font-semibold">Split Type</label>
					<select
						value={splitType}
						onChange={(e) => setSplitType(e.target.value)}
						className="w-full border p-2 rounded"
					>
						<option value="even">Evenly</option>
						<option value="custom">Custom</option>
					</select>
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
										if (customAmounts[member]) {
											const updated = { ...customAmounts };
											delete updated[member];
											setCustomAmounts(updated);
										}
									}}
								/>
								<span>{member}</span>
							</label>
						))}
					</div>
				</div>

				{splitType === 'even' ? (
					<div>
						<label className="block font-semibold">Total Amount</label>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter total amount"
							className="w-full border p-2 rounded"
						/>
					</div>
				) : (
					<div className="space-y-2">
						<p className="font-semibold">Enter individual amounts:</p>
						{splitBetween.map((member) => (
							<div key={member} className="flex justify-between items-center">
								<label>{member}</label>
								<input
									type="number"
									value={customAmounts[member] || ''}
									onChange={(e) => setCustomAmounts({ ...customAmounts, [member]: e.target.value })}
									className="w-24 border p-1 rounded"
								/>
							</div>
						))}
						<div className="text-right text-sm font-medium text-gray-700">Total: ${totalCustomAmount.toFixed(2)}</div>
					</div>
				)}

				<button
					onClick={handleAddExpense}
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Add Expense
				</button>
			</div>

{/* Show Expenses */}
<div className="space-y-1">
  {members.map((member) => {
    const memberExpenses = (expenses || []).filter(expense => expense.payer === member);
    return memberExpenses.length > 0 && (
      <div key={member} className="border-b border-gray-400 bg-gray-50 p-2">
        <div className="flex items-center gap-4">
          <img
            alt=""
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(member)}`}
            className="size-10 rounded-full object-cover"
          />
          <h3 className="text-lg font-medium py-1">{member}'s Expenses</h3>
        </div>

        <ul className="space-y-2">
          {memberExpenses.map((expense, idx) => (
            <div key={idx} className="block h-full rounded-lg border bg-white border-gray-400 px-4 py-2 hover:border-gray-600">
              <div className="flex justify-between items-start">
                <li className="flex-1">
                  <strong>{expense.name}</strong>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {expense.splitType === 'even' ? (
                      expense.splitBetween.map((member) => (
                        <span
                          key={member}
                          className="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium"
                        >
                          {member}
                        </span>
                      ))
                    ) : (
                      Object.entries(expense.customAmounts).map(([member, val]) => (
                        <span
                          key={member}
                          className="inline-flex items-center rounded-md bg-purple-100 text-purple-800 px-3 py-1 text-xs font-medium"
                        >
                          {member}: ${parseFloat(val).toFixed(2)}
                        </span>
                      ))
                    )}
                  </div>
                </li>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-medium">${expense.amount}</span>
                  <button
                    onClick={() => {
                      const updatedExpenses = expenses.filter((e, i) => i !== expenses.indexOf(expense));
                      setExpenses(updatedExpenses);
                    }}
                    className="text-gray-600 transition hover:text-red-600"
                  >
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    );
  })}
</div>

			<div className="flex gap-4">
				<button
					onClick={onBack}
					className="w-full border border-blue-800 text-blue-800 py-2 rounded hover:bg-blue-200 transition"
				>
					Go Back
				</button>

				<button
					onClick={onNext}
					disabled={!Array.isArray(expenses) || expenses.length === 0}
					className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
				>
					Proceed to Settle Up
				</button>
			</div>


		</div>
	);
}
