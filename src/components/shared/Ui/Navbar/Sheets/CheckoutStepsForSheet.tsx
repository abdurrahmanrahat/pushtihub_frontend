type TCheckoutStepsForSheetProps = { currentStep: 1 | 2 | 3 };

export const CheckoutStepsForSheet = ({
  currentStep,
}: TCheckoutStepsForSheetProps) => {
  const steps = [
    { number: 1, label: "Cart" },
    { number: 2, label: "Checkout" },
    { number: 3, label: "Confirmation" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          {/* Step Icon + Label */}
          <div className="flex items-center gap-1">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full font-semibold text-xs transition-colors
                ${
                  step.number === currentStep
                    ? "bg-primary text-white"
                    : step.number < currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
            >
              {step.number}
            </div>

            <span
              className={`text-[11px] font-medium
                ${step.number === currentStep ? "text-primary" : ""}
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Line Divider */}
          {index < steps.length - 1 && (
            <div
              className={`h-[1.5px] w-8 transition-colors
                ${
                  step.number < currentStep
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
