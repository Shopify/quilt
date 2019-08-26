import React from 'react';
import {useSerialized} from '@shopify/react-html';
import {CsrfTokenContext} from './context';

interface Props {
  token?: string;
  children?: React.ReactNode;
}

export function CsrfSelfSerializer({
  token: explicitCsrfToken,
  children,
}: Props) {
  const [csrfToken = explicitCsrfToken, Serialize] = useSerialized<string>(
    'csrf-token',
  );

  if (csrfToken == null) {
    throw new Error(
      'You must provide a CSRF token, or have one previously serialized.',
    );
  }

  return (
    <>
      <CsrfTokenContext.Provider value={csrfToken}>
        {children}
      </CsrfTokenContext.Provider>
      <Serialize data={() => csrfToken} />
    </>
  );
}
