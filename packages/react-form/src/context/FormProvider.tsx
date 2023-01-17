import React, {createContext, useContext} from 'react';

import {FieldBag, Form} from '../types';

export const FormContext = createContext<FieldBag | null>(null);

interface FormProviderProps<T extends FieldBag = FieldBag> {
  form: Form<T>;
  children: React.ReactNode;
}

export const FormProvider = <T extends FieldBag = FieldBag>({
  children,
  form,
}: FormProviderProps<T>) => {
  return (
    <FormContext.Provider value={form as unknown as FieldBag}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = <T extends FieldBag>(): Form<T> =>
  useContext(FormContext) as unknown as Form<T>;
