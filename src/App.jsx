import './App.css';
/* import GroupList from './components/GroupList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SettleUp from './components/SettleUp';

function App() {
  const groups = [
    { id: 1, name: "Bali Trip", total: 340, balance: -30 },
    { id: 2, name: "Roommates", total: 1220, balance: 75 },
  ];

  const expenses = [
    { title: "Lunch", amount: 45, payer: "Alice" },
    { title: "Taxi", amount: 30, payer: "Bob" },
  ];

  const settlements = [
    { from: "Alice", to: "Bob", amount: 15 },
    { from: "Charlie", to: "Alice", amount: 20 },
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    alert("Expense added! (wire this to state later)");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">💸OweMe</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Your Groups</h2>
        <GroupList groups={groups} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Add Expense</h2>
        <ExpenseForm onSubmit={handleAddExpense} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Expenses</h2>
        <ExpenseList expenses={expenses} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Settle Up</h2>
        <SettleUp settlements={settlements} />
      </section>
    </div>
  );
}

export default App;
 */

import { useState } from 'react';
import Step1_AddMembers from './components/Step1_AddMembers';
import Step2_AddExpenses from './components/Step2_AddExpenses';
import Step3_SettleUp from './components/Step3_SettleUp';

function App() {
  const [step, setStep] = useState(1);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">💸 OweMe</h1>

      {step === 1 && (
        <Step1_AddMembers
          members={members}
          setMembers={setMembers}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2_AddExpenses
          members={members}
          expenses={expenses}
          setExpenses={setExpenses}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3_SettleUp
          members={members}
          expenses={expenses}
          onBack={() => setStep(2)}
        />
      )}


    </div>
  );
}

export default App;
