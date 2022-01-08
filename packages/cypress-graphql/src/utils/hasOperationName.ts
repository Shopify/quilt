/* eslint-disable no-prototype-builtins */

export const hasOperationName = (req, operationName) => {
  const {body} = req;
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  );
};
