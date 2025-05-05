import { useState } from 'react';

export default function Step1_AddMembers({ members, setMembers, onNext }) {
  const [name, setName] = useState('');

  const addMember = () => {
    const trimmed = name.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setName('');
    }
  };

  const removeMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMember();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-center">Step 1: Add Members</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter member name"
          className="flex-1 border p-2 rounded"
        />
        <button
          type="button"
          onClick={addMember}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {members.map((member, idx) => (
          <li key={idx} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
            <span>{member}</span>
            <button
              onClick={() => removeMember(idx)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={onNext}
        disabled={members.length < 2}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        Confirm Group
      </button>
    </div>
  );
}
