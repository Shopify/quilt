import React from 'react';
import {createServer} from '../dist/server';

function MockApp() {
  return <div>I am react</div>;
}

createServer({
  port: 4444,
  render: () => <MockApp />,
});
