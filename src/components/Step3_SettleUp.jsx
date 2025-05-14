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
	expenses.forEach(({ payer, amount, splitBetween, splitType, customAmounts }) => {
		totals[payer] += amount;

		if (splitType === 'custom' && customAmounts) {
			Object.entries(customAmounts).forEach(([person, val]) => {
				const share = parseFloat(val);
				if (!isNaN(share)) {
					shares[person] += share;
				}
			});
		} else {
			const sharePerPerson = amount / splitBetween.length;
			splitBetween.forEach((person) => {
				shares[person] += sharePerPerson;
			});
		}
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

	const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

	return (
		<div className="space-y-6">
			{/* Summary Table */}
			<h2 className="text-2xl font-semibold text-center">Step 3: Settle Up</h2>
			<div className="rounded p-3 bg-gray-50">
				<div>
					<strong class="block text-sm font-medium text-gray-500"> Total Expenses </strong>

					<p>
						<span class="text-2xl font-medium text-gray-900"> ${totalExpense.toFixed(2)} </span>
					</p>
				</div>
			</div>
			<div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
				<table className="w-full divide-y-2 bg-white divide-gray-200">
					<thead className="ltr:text-left rtl:text-right">
						<tr className="*:font-medium *:text-gray-900">
							<th className="px-3 py-2 whitespace-nowrap">Member</th>
							<th className="px-3 py-2 whitespace-nowrap">Paid</th>
							<th className="px-3 py-2 whitespace-nowrap">Share</th>
							<th className="px-3 py-2 whitespace-nowrap">Balance</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
						{members.map((m) => (
							<tr key={m} className=" *:first:font-medium">
								<td className="px-3 py-2 whitespace-nowrap">{m}</td>
								<td className="px-3 py-2 whitespace-nowrap">${totals[m].toFixed(2)}</td>
								<td className="px-3 py-2 whitespace-nowrap">${shares[m].toFixed(2)}</td>
								<td className={`px-3 py-2 whitespace-nowrap font-semibold ${balances[m] > 0 ? 'text-green-600' : balances[m] < 0 ? 'text-red-500' : ''}`}>
									{balances[m] > 0 && '+'}
									{balances[m] < 0 && '-'}${Math.abs(balances[m]).toFixed(2)}
								</td>

							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Transaction Summary */}
			{/* <div className="bg-white p-4 rounded-xl shadow space-y-2"> */}
				{/* <h3 className="text-lg font-medium">Who Pays Whom</h3> */}
				{transactions.length === 0 ? (
					<p className="text-gray-500">Everyone is settled up ✅</p>
				) : (
					<ul className="space-y-2">
						{transactions.map(({ from, to, amount }, idx) => (
							<li key={idx} className="flex items-center justify-between border-b border-gray-400 py-1 px-3">
								<div className="">
									<strong className="text-sm font-medium text-gray-800">{from}</strong>
									<p>
									  <div className="block text-xs text-gray-500"> pays </div>
									</p>
									
									<span className="text-sm font-medium text-gray-800">{to}</span>
								</div>
								<span className="text-blue-600 font-semibold">${amount.toFixed(2)}</span>
							</li>
						))}
					</ul>
				)}
			{/* </div> */}
			<div className="flex gap-4">
				<button
					onClick={onBack}
					className="w-full border border-blue-800 text-blue-800 py-2 rounded hover:bg-blue-200 transition"
				>
					Go Back
				</button>

				<button
					className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
				>
					Done
				</button>
			</div>
		</div>
	);
}
