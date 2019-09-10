import {Statement, isStatement} from '@babel/types';
import template from '@babel/template';

export function astFrom(code: string): Statement | undefined {
  const result = template.statement.ast(code, {
    plugins: ['typescript', 'jsx'],
  });

  if (!isStatement(result)) {
    return;
  }

  return result;
}

export function compose(...visitors: any[]) {
  const visitor = visitors.reduce((combinedVisitors, currentVisitor) => {
    return {...combinedVisitors, ...currentVisitor};
  }, {});

  return [
    (function combinedVisitor() {
      return function() {
        return {
          visitor,
        };
      };
    })(),
  ];
}
