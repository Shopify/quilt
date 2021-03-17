import {useState, useCallback} from 'react';

export function useSteps(steps: number, initialStep = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  return {
    currentStep,
    nextStep: useCallback(() => {
      if (currentStep < steps) {
        setCurrentStep(currentStep + 1);
      }
    }, [currentStep, steps]),
    previousStep: useCallback(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }, [currentStep]),
  };
}
