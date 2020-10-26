export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Head = 'HEAD',
  Options = 'OPTIONS',
  Connect = 'CONNECT',
}

export enum StatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  RequestEntityTooLarge = 413,
  RequestUriTooLong = 414,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
}

export enum Header {
  Accept = 'Accept',
  ContentType = 'Content-Type',
  ContentDisposition = 'Content-Disposition',
  UserAgent = 'User-Agent',
  XhrRedirectedTo = 'X-XHR-Redirected-To',
  XhrReferer = 'X-XHR-Referer',
  ContentSecurityPolicy = 'Content-Security-Policy',
  ContentSecurityPolicyReportOnly = 'Content-Security-Policy-Report-Only',
  Forwarded = 'Forwarded',
  ForwardedFor = 'X-Forwarded-For',
  ForwardedHost = 'X-Forwarded-Host',
  ForwardedProtocol = 'X-Forwarded-Proto',
  AccessControlAllowCredentials = 'Access-Control-Allow-Credentials',
  AccessControlAllowHeaders = 'Access-Control-Allow-Headers',
  AccessControlAllowMethods = 'Access-Control-Allow-Methods',
  AccessControlAllowOrigin = 'Access-Control-Allow-Origin',
  AccessControlExposeHeaders = 'Access-Control-Expose-Headers',
  AccessControlMaxAge = 'Access-Control-Max-Age',
  AccessControlRequestHeaders = 'Access-Control-Request-Headers',
  AccessControlRequestMethod = 'Access-Control-Request-Method',
  CacheControl = 'Cache-Control',
  AcceptLanguage = 'Accept-Language',
  XssProtecton = 'X-XSS-Protection',
  FrameOptions = 'X-Frame-Options',
  DownloadOptions = 'X-Download-Options',
  ContentTypeOptions = 'X-Content-Type-Options',
  StrictTransportSecurity = 'Strict-Transport-Security',
  ReferrerPolicy = 'Referrer-Policy',
}

export enum CspDirective {
  // Fetch directives
  ChildSrc = 'child-src',
  ConnectSrc = 'connect-src',
  DefaultSrc = 'default-src',
  FontSrc = 'font-src',
  FrameSrc = 'frame-src',
  ImgSrc = 'img-src',
  ManifestSrc = 'manifest-src',
  MediaSrc = 'media-src',
  ObjectSrc = 'object-src',
  PrefetchSrc = 'prefetch-src',
  ScriptSrc = 'script-src',
  StyleSrc = 'style-src',
  WebrtcSrc = 'webrtc-src',
  WorkerSrc = 'worker-src',

  // Document directives
  BaseUri = 'base-uri',
  PluginTypes = 'plugin-types',
  Sandbox = 'sandbox',

  // Navigation directives
  FormAction = 'form-action',
  FrameAncestors = 'frame-ancestors',

  // Reporting directives
  ReportUri = 'report-uri',

  // Other directives
  BlockAllMixedContent = 'block-all-mixed-content',
  RequireSriFor = 'require-sri-for',
  UpgradeInsecureRequests = 'upgrade-insecure-requests',
}

export enum CspSandboxAllow {
  Forms = 'allow-forms',
  SameOrigin = 'allow-same-origin',
  Scripts = 'allow-scripts',
  Popups = 'allow-popups',
  Modals = 'allow-modals',
  OrientationLock = 'allow-orientation-lock',
  PointerLock = 'allow-pointer-lock',
  Presentation = 'allow-presentation',
  PopupsToEscapeSandbox = 'allow-popups-to-escape-sandbox',
  TopNavigation = 'allow-top-navigation',
}

export enum SpecialSource {
  Any = '*',
  Self = "'self'",
  UnsafeInline = "'unsafe-inline'",
  UnsafeEval = "'unsafe-eval'",
  None = "'none'",
  StrictDynamic = "'strict-dynamic'",
  ReportSample = "'report-sample'",
  Data = 'data:',
  Blob = 'blob:',
  FileSystem = 'filesystem:',
}

export enum SriAsset {
  Script = 'script',
  Style = 'style',
}

export enum HashAlgorithm {
  Sha256 = 'sha256',
  Sha384 = 'sha384',
  Sha512 = 'sha512',
}

export enum ResponseType {
  Informational = '1xx',
  Success = '2xx',
  Redirection = '3xx',
  ClientError = '4xx',
  ServerError = '5xx',
  Unknown = 'Unknown',
}

export function getResponseType(status: number | StatusCode) {
  if (status >= 100 && status < 200) {
    return ResponseType.Informational;
  } else if (status >= 200 && status < 300) {
    return ResponseType.Success;
  } else if (status >= 300 && status < 400) {
    return ResponseType.Redirection;
  } else if (status >= 400 && status < 500) {
    return ResponseType.ClientError;
  } else if (status >= 500 && status < 600) {
    return ResponseType.ServerError;
  } else {
    return ResponseType.Unknown;
  }
}

export function nonceSource(nonce: string) {
  return `'nonce-${nonce}'`;
}

export function hashSource(hashAlgorithm: HashAlgorithm, value: string) {
  return `'${hashAlgorithm}-${value}'`;
}

export enum CacheControl {
  NoCache = 'no-cache',
  NoStore = 'no-store',
  MustRevalidate = 'must-revalidate',
  MaxAge = 'max-age',
}

export const noCache = `${CacheControl.NoCache},${CacheControl.NoStore},${CacheControl.MustRevalidate},${CacheControl.MaxAge}=0`;
