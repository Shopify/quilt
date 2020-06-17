import React from 'react';
import {Router} from '@shopify/react-router';
import {usePerformanceReport} from '@shopify/react-performance';

import {I18n} from './I18n';
import {Polaris} from './Polaris';
import {Routes} from './Routes';

export function App({url}: {url: URL}) {
  usePerformanceReport('/performance_report');

  return (
    <I18n>
      <Polaris>
        <Router location={url}>
          <Routes />
        </Router>
      </Polaris>
    </I18n>
  );
}
