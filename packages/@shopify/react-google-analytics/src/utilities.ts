// We want only the final segment of a domain, without any
// preceding subdomains. However, we do keep leading `.` when
// subdomains exist.
export function getRootDomain(domain: string) {
  const parts = domain.split('.');
  const baseDomainOnly = parts.slice(-2).join('.');

  return parts.length > 2 ? `.${baseDomainOnly}` : baseDomainOnly;
}

export function noop() {}
