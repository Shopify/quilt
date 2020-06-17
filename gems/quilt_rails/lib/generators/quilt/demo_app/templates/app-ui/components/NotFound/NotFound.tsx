import React from 'react';
import {Page, EmptyState} from '@shopify/polaris';
import {Status, StatusCode} from '@shopify/react-network';

import {emptyStateIllustration} from './illustrations';

export function NotFound() {
  return (
    <>
      <Status code={StatusCode.NotFound} />
      <Page title="">
        <EmptyState
          heading="The page you’re looking for couldn’t be found"
          image={emptyStateIllustration}
          action={{
            content: 'Go to home',
            url: '/',
          }}
        >
          <p>
            Check the web address and try again, or try navigating to the page
            from home.
          </p>
        </EmptyState>
      </Page>
    </>
  );
}
