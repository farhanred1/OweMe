

export default function Step3_SettleUp({ members, expenses, onBack }) {
  const totals = {};
  const shares = {};
  const balances = {};

  // Initialize each member's paid & share
  members.forEach((m) => {
    totals[m] = 0;
    shares[m] = 0;
  });

  // Aggregate paid and shares
  expenses.forEach(({ payer, amount, splitBetween }) => {
    totals[payer] += amount;
    const sharePerPerson = amount / splitBetween.length;
    splitBetween.forEach((person) => {
      shares[person] += sharePerPerson;
    });
  });

  // Compute balances
  members.forEach((m) => {
    balances[m] = parseFloat((totals[m] - shares[m]).toFixed(2));
  });

  // Generate transactions (greedy settle up)
  const transactions = [];
  const creditors = Object.entries(balances).filter(([_, b]) => b > 0).sort((a, b) => b[1] - a[1]);
  const debtors = Object.entries(balances).filter(([_, b]) => b < 0).sort((a, b) => a[1] - b[1]);

  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const [creditor, creditAmt] = creditors[i];
    const [debtor, debtAmt] = debtors[j];

    const amount = Math.min(creditAmt, -debtAmt);
    transactions.push({ from: debtor, to: creditor, amount: parseFloat(amount.toFixed(2)) });

    creditors[i][1] -= amount;
    debtors[j][1] += amount;

    if (creditors[i][1] < 0.01) i++;
    if (debtors[j][1] > -0.01) j++;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Step 3: Settle Up</h2>
        <button onClick={onBack} className="text-sm text-blue-600 underline">← Back to Expenses</button>
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-right">Paid</th>
              <th className="p-3 text-right">Share</th>
              <th className="p-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m} className="border-t">
                <td className="p-3">{m}</td>
                <td className="p-3 text-right">${totals[m].toFixed(2)}</td>
                <td className="p-3 text-right">${shares[m].toFixed(2)}</td>
                <td
                  className={`p-3 text-right font-semibold ${
                    balances[m] > 0 ? 'text-green-600' : balances[m] < 0 ? 'text-red-500' : ''
                  }`}
                >
                  {balances[m] >= 0 ? '+' : ''}${balances[m].toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 className="text-lg font-medium">Who Pays Whom</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Everyone is settled up ✅</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map(({ from, to, amount }, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{from}</span>
                  {/* <ArrowRight className="w-4 h-4 text-gray-400" /> */}
                  <span className="mx-2">→</span>
                  <span className="font-medium">{to}</span>
                </span>
                <span className="text-blue-600 font-semibold">${amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
