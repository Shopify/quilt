/* eslint-disable react/jsx-no-bind*/
import * as React from 'react';
import AsyncChunk from '@shopify/async-chunks';

interface State {
  content: string;
}

function Loading() {
  return <div>Loading...</div>;
}

const HomeChunk = AsyncChunk({
  loader: () => import(/* webpackChunkName: 'homeChunk' */ 'sections/Home'),
  loading: Loading,
});

const ProductsChunk = AsyncChunk({
  loader: () =>
    import(/* webpackChunkName: 'productsChunk' */ 'sections/Products'),
  loading: Loading,
});

// eslint-disable-next-line
export default class MainIndex extends React.PureComponent<{}, State> {
  state: State = {
    content: 'Home',
  };

  render() {
    this.loadHome = this.loadHome.bind(this);
    this.loadProducts = this.loadProducts.bind(this);

    return (
      <div>
        <h2>SSR + Code splitting test app:</h2>
        <button type="button" onClick={this.loadHome}>
          Home
        </button>
        <button type="button" onClick={this.loadProducts}>
          Products
        </button>
        {this.content()}
      </div>
    );
  }

  content() {
    const {content} = this.state;
    if (content === 'Home') {
      return <HomeChunk />;
    }
    if (content === 'Products') {
      return <ProductsChunk />;
    }
    return null;
  }

  loadHome() {
    this.setState({content: 'Home'});
  }

  loadProducts() {
    this.setState({content: 'Products'});
  }
}
