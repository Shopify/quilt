export const hasOperationName = (req, operationName) => {
  const {body} = req;
  return (
    /* eslint-disable-next-line no-prototype-builtins */
    body.hasOwnProperty('operationName') && body.operationName === operationName
  );
};
