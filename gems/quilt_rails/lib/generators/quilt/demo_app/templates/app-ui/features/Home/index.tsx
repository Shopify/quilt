import {createAsyncComponent} from '@shopify/react-async';

const Home = createAsyncComponent({
  load: () => import(/* webpackChunkName: 'Home' */ './Home'),
});

export default Home;
