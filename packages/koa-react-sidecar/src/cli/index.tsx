import React from 'react';
import minimist from 'minimist';
import {createServer} from '../server';
import {Logger} from '../logger';

(async () => {
  const logger = new Logger();
  const {port = 4444, app = '../../example/App.tsx'} = minimist(
    process.argv.slice(2),
  );

  let AppComponent;

  if (app) {
    try {
      AppComponent = await import(app);
    } catch (error) {
      logger.error(`App not found. Are you sure ${app} exists?`);
      return;
    }
  }

  createServer({port, render: ctx => <AppComponent {...ctx} />});
})();
