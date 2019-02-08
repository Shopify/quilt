import React from 'react';
import {withI18n} from '@shopify/react-i18n';

function MyComponent({i18n}) {
  return i18n.translate('key');
}

export default withI18n()(MyComponent);
