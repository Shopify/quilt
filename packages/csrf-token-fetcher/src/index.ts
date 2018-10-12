const CSRF_SELECTOR = 'meta[name=csrf-token]';
let token: string;

export default function getCSRFToken(scope = document) {
  if (token) {
    return token;
  }
  const tokenNode = scope.querySelector(CSRF_SELECTOR);
  if (tokenNode) {
    const content = tokenNode.getAttribute('content');
    if (content) {
      token = content;
      return token;
    }
  }
  return '';
}

export function clearCSRFToken() {
  token = '';
}
