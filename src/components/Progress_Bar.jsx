export default function ProgressSteps({ currentStep = 1 }) {
    const steps = [
      { label: 'Add Members', number: 1 },
      { label: 'Add Expense', number: 2 },
      { label: 'Settle Up', number: 3 },
    ];
  
    return (
      <div className="space-y-4">
        
  
        <div>
          <h2 className="sr-only">Steps</h2>
          <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-200">
            <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
              {steps.map((step) => (
                <li key={step.number} className="flex items-center gap-2 bg-gray-100 p-2">
                  <span
                    className={`size-6 rounded-full text-center text-[10px]/6 font-bold ${
                      step.number === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="hidden sm:block">{step.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }
  