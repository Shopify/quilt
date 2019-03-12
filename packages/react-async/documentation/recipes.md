# `@shopify/react-async` recipes

This document covers a few common scenarios where `@shopify/react-async` and related packages can help improve the user experience of an application.

## Table of contents

1. [Index pages with empty states](#index-pages-with-empty-states)

## Index pages with empty states

Index pages often show a full-screen [empty state](https://polaris.shopify.com/components/structure/empty-state) when no resources exist. However, we don’t know if we can show this empty state until we receive a response from the API. This can result in a loading state that quickly flips to an empty state, which can appear visually broken to a user.

The basic pattern for solving this is to have your component run two GraphQL queries; one which makes the smallest possible query to determine if the page will show an empty state, and the other for the "full" query.

To start, let’s write our queries. We’ll use Shopify’s admin API in this example, and we’ll be querying for orders. The "full" query might resemble this:

```graphql
query OrderList(
  $ordersFirst: Int
  $ordersLast: Int
  $before: String
  $after: String
  $sortKey: OrderSortKeys
  $reverse: Boolean
  $query: String
  $savedSearchId: ID
  $locationId: ID
  $skipCustomer: Boolean!
) {
  location(id: $locationId) {
    name
  }
  orders(
    first: $ordersFirst
    after: $after
    last: $ordersLast
    before: $before
    sortKey: $sortKey
    reverse: $reverse
    query: $query
    savedSearchId: $savedSearchId
  ) {
    edges {
      cursor
      node {
        id
        name
        note
        closed
        cancelledAt
        processedAt
        hasPurchasedShippingLabels
        hasTimelineComment
        displayFinancialStatus
        displayFulfillmentStatus
        customer @skip(if: $skipCustomer) {
          id
          firstName
          lastName
          email
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

This query is very expensive to run. Let’s construct the minimal query that allows us to determine which UI we will render:

```graphql
query OrderListEmptyState {
  orders(first: 1) {
    edges {
      node {
        id
      }
    }
  }
}
```

No field exists explicitly for this purpose, but we can query the first order and, if there are no orders, we will be able to see an empty list in its place.

Now, we want to use this query during the initial load to bail out of "full" rendering early and render the empty state if our smaller query resolves to an empty array. We’ll use [`@shopify/react-graphql`](https://github.com/Shopify/quilt/tree/master/packages/react-graphql) to create these GraphQL queries as asynchronous components (more on that in a second).

```ts
// in /app/sections/Orders/OrderList/components/OrderListQuery.tsx

import {createAsyncQueryComponent} from '@shopify/react-graphql';

export default createAsyncQueryComponent({
  load: () => import('./graphql/OrderListQuery.graphql'),
});

// in /app/sections/Orders/OrderList/components/OrderListEmptyStateQuery.tsx

import {createAsyncQueryComponent} from '@shopify/react-graphql';

export default createAsyncQueryComponent({
  load: () => import('./graphql/OrderListEmptyStateQuery.graphql'),
});
```

Next, we will render both queries in our component. If we detect from the outer query that we have no orders, we’ll return our empty state UI. Otherwise, we’ll return the UI based on the "full" query result.

```tsx
import * as React from 'react';
import {EmptyState} from '@shopify/polaris';
import {SkeletonIndex} from 'components';
import {OrderListEmptyStateQuery, OrderListQuery} from './components';

export default function OrderList() {
  return (
    <OrderListEmptyStateQuery>
      {({data, error}) => {
        if (error != null) {
          throw error;
        }

        if (data == null || data.orders == null) {
          return <SkeletonIndex />;
        }

        if (data.orders.length === 0) {
          return <EmptyState />;
        }

        return (
          <OrderListQuery>
            {({data, error}) => {
              if (error != null) {
                throw error;
              }

              if (data == null || data.orders == null) {
                return <SkeletonIndex />;
              }

              /* render your "real" UI here */
            }}
          </OrderListQuery>
        );
      }}
    </OrderListEmptyStateQuery>
  );
}
```

We’ve now done most of the necessary work. However, we still have a problem. When this component is initially mounted, it will still have a loading state, because the query only starts running on mount. We can’t create a guaranteed fix to this problem, but we can use [`@shopify/react-async`’s prefetching](https://github.com/Shopify/quilt/tree/master/packages/react-async#prefetchroute-and-prefetcher) to use the delay when a user is hovering over their destination to start running our GraphQL queries early. Given the small query we’ve built, there is a high likelihood that it will resolve before the user actually navigates.

First, we create the async component for our order list. This component will prefetch both GraphQL queries.

```tsx
// in /app/sections/Orders/OrderList/index.tsx

import * as React from 'react';
import {createAsyncComponent} from '@shopify/react-async';
import {SkeletonIndex} from 'components';
import {OrderListEmptyStateQuery, OrderListQuery} from './components';

export default createAsyncComponent({
  load: () => import('./OrderList'),
  renderLoading: () => <SkeletonIndex />,
  renderPrefetch: () => (
    <>
      <OrderListEmptyStateQuery.Prefetch />
      <OrderListQuery.Prefetch />
    </>
  ),
  renderPreload: () => (
    <>
      <OrderListEmptyStateQuery.Preload />
      <OrderListQuery.Preload />
    </>
  ),
  renderKeepFresh: () => (
    <>
      <OrderListEmptyStateQuery.KeepFresh />
      <OrderListQuery.KeepFresh />
    </>
  ),
});
```

Finally, follow the [`@shopify/react-async` route prefetching guide](https://github.com/Shopify/quilt/tree/master/packages/react-async#prefetchroute-and-prefetcher) to register this asynchronous component for a URL, or render the `OrderList.Prefetch` component manually before you expect the user to navigate to a page where this component is rendered.
