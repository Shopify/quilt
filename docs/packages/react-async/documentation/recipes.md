# `@shopify/react-async` recipes

This document covers a few common scenarios where `@shopify/react-async` and related packages can help improve the user experience of an application.

## Table of contents

1. [Index pages with empty states](#index-pages-with-empty-states)
1. [UI that is initially hidden](#ui-that-is-initially-hidden)
1. [Below-the-fold content](#below-the-fold-content)

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
import React from 'react';
import {EmptyState} from '@shopify/polaris';
import {useQuery} from '@shopify/react-graphql';

import {SkeletonIndex} from 'components';
import {OrderListEmptyStateQuery, OrderListQuery} from './components';

export default function OrderList() {
  const {data: emptyStateData, error: emptyStateError} = useQuery(
    OrderListEmptyStateQuery,
  );

  const {data, error} = useQuery(OrderListQuery);

  if (error || emptyStateError) {
    throw error || emptyStateError;
  }

  if (
    emptyStateData != null &&
    emptyStateData.orders != null &&
    emptyStateData.orders.edges.length === 0
  ) {
    return <EmptyState />;
  }

  /* render your "real" UI here */
}
```

We’ve now done most of the necessary work. However, we still have a problem. When this component is initially mounted, it will still have a loading state, because the query only starts running on mount. We can’t create a guaranteed fix to this problem, but we can use [`@shopify/react-async`’s prefetching](https://github.com/Shopify/quilt/tree/master/packages/react-async#prefetchroute-and-prefetcher) to use the delay when a user is hovering over their destination to start running our GraphQL queries early. Given the small query we’ve built, there is a high likelihood that it will resolve before the user actually navigates.

First, we create the async component for our order list. This component will prefetch both GraphQL queries.

```tsx
// in /app/sections/Orders/OrderList/index.tsx

import {
  createAsyncComponent,
  usePreload,
  usePrefetch,
  useKeepFresh,
} from '@shopify/react-async';
import {SkeletonIndex} from 'components';
import {OrderListEmptyStateQuery, OrderListQuery} from './components';

export default createAsyncComponent({
  load: () => import('./OrderList'),
  renderLoading: () => <SkeletonIndex />,
  usePreload: () => {
    const preloadEmptyStateQuery = usePreload(OrderListEmptyStateQuery);
    const preloadQuery = usePreload(OrderListQuery);
    return () => {
      preloadEmptyStateQuery();
      preloadQuery();
    };
  },
  usePrefetch: () => {
    const prefetchEmptyStateQuery = usePrefetch(OrderListEmptyStateQuery);
    const prefetchQuery = usePrefetch(OrderListQuery);
    return () => {
      prefetchEmptyStateQuery();
      prefetchQuery();
    };
  },
  useKeepFresh: () => {
    const keepEmptyStateQueryFresh = useKeepFresh(OrderListEmptyStateQuery);
    const keepQueryFresh = useKeepFresh(OrderListQuery);
    return () => {
      keepEmptyStateQueryFresh();
      keepQueryFresh();
    };
  },
});
```

Finally, follow the [`@shopify/react-async` route prefetching guide](https://github.com/Shopify/quilt/tree/master/packages/react-async#prefetchroute-and-prefetcher) to register this asynchronous component for a URL, or render the `OrderList.Prefetch` component manually before you expect the user to navigate to a page where this component is rendered, or use `usePrefetch(OrderList)` to get a function that will preload the scripts and data on demand.

## UI that is initially hidden

A significant amount of UI is often hidden until interacted with. This is particularly common for modals and popovers. These elements of the UI are often complex, and can sometimes have dedicated GraphQL queries. This makes them an ideal candidate for deferring and prefetching.

In order to solve this, we can turn the modal or popover into an async component. We can then stop that component from loading until it is about to open (driven by an `open` prop, like the Polaris `Modal` component). Finally, we’ll make the component prefetch its GraphQL query, and we will force the component to prefetch when an action that shows the modal is hovered.

Assuming the GraphQL query for a component has been constructed with `createAsyncQueryComponent` (as demonstrated in the example above), we can make the modal component async as follows:

```tsx
// in /app/sections/Orders/OdersList/components/CustomerOrdersModal/CustomerOrdersModal/index.tsx

import {
  createAsyncComponent,
  usePreload,
  usePrefetch,
  useKeepFresh,
} from '@shopify/react-async';
import {SkeletonIndex} from 'components';
import {CustomerOrdersModalQuery} from './components';

export default createAsyncComponent({
  load: () => import('./CustomerModal'),
  defer: ({open}) => open,
  usePreload: () => usePreload(CustomerOrdersModalQuery),
  usePrefetch: () => usePrefetch(CustomerOrdersModalQuery),
  useKeepFresh: () => useKeepFresh(CustomerOrdersModalQuery),
});
```

The `defer` option can accept a function, which should return `true` when the component should begin to load. As noted in the previous example, this has a problem: there will be a delay after the user tries to open a modal before it is available to render, and an even longer delay until its GraphQL query has resolved. To fix this, we will preload the scripts for the component on mount, and we will prefetch the GraphQL query when the user hovers or starts touching the action that triggers the modal.

```tsx
// in /app/sections/Orders/OrderList/OrderList.tsx

import React from 'react';
import {usePrefetch} from '@shopify/react-async';
import {CustomerOrdersModal} from './components';

export default function CustomerOrdersModal() {
  const [showModal, setShowModal] = useState(false);
  const prefetch = usePrefetch(CustomerOrdersModal);

  return (
    <>
      <CustomerOrdersModal.Preload />
      <CustomerOrdersModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <button
        type="button"
        onClick={() => setShowModal(true)}
        onMouseEnter={prefetch}
        onTouchStart={prefetch}
      >
        View customer
      </button>
    </>
  );
}
```

And that’s it! The modal’s scripts will download when the browser has time thanks to `CustomerOrdersModal.Preload`, and its GraphQL query will start running in the background when the user shows intent to activate the modal.

## Below-the-fold content

On pages with consistent structure and content, it can be a safe assumption that a particular component will not be in the viewport on load, even for the largest screens. We could defer the entire component until is in view, but in some cases, doing so could result in significant changes to layout that make the UI feel "janky". You can use a technique called "progressive hydration" in these cases: the content gets rendered on the server, but its scripts are not downloaded until a later time, while leaving the server-rendered markup in place.

Using this technique is easy with `@shopify/react-async`. Create an async component using `createAsyncComponent`, and set the `deferHydration` option. In the case of content that is below-the-fold, you can use the `InViewport` defer timing to wait until the server-rendered UI is scrolled into view before loading its scripts.

```tsx
// in /app/sections/Orders/components/ExpensiveComponent/ExpensiveComponent/index.tsx

import {createAsyncComponent, DeferTiming} from '@shopify/react-async';

export default createAsyncComponent({
  load: () => import('./ExpensiveComponent'),
  deferHydration: DeferTiming.InViewport,
});
```
