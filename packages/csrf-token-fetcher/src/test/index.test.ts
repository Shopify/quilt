import getCSRFToken, {clearCSRFToken} from '..';

describe('csrf-token-fetcher', () => {
  const originalDom = document.body.innerHTML;

  afterEach(() => clearCSRFToken());

  it('gets CSRF token', () => {
    const rootNode = '<meta name="csrf-token" content="ACTUAL_TOKEN">';
    document.body.innerHTML = rootNode;

    expect(getCSRFToken()).toStrictEqual('ACTUAL_TOKEN');
    expect(getCSRFToken(document)).toStrictEqual('ACTUAL_TOKEN');

    document.body.innerHTML = originalDom;
  });

  it('returns empty string if meta element not found', () => {
    expect(getCSRFToken()).toStrictEqual('');
  });

  it('returns empty string if meta element has no content attribute', () => {
    const rootNode = '<meta name="csrf-token">';
    document.body.innerHTML = rootNode;

    expect(getCSRFToken()).toStrictEqual('');

    document.body.innerHTML = originalDom;
  });
});
