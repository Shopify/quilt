import {UAParser} from 'ua-parser-js';

const MOBILE_DEVICE_TYPES = ['mobile', 'tablet'];

export interface Options {
  userAgent: string;
  supported?: boolean;
  bypass?: boolean;
}

export class Browser {
  userAgent: string;
  supported: boolean;
  private ua: UAParser;

  get name() {
    return this.ua.getBrowser().name || '';
  }

  get version() {
    return this.ua.getBrowser().version || '';
  }

  get majorVersion() {
    const {version} = this;

    if (version === '') {
      return undefined;
    }

    const majorVersion = parseInt(version.split('.')[0], 10);
    return Number.isNaN(majorVersion) ? undefined : majorVersion;
  }

  get unknown() {
    return this.name === '';
  }

  get isMobile() {
    return MOBILE_DEVICE_TYPES.includes(this.ua.getDevice().type);
  }

  get isDesktop() {
    return !this.isMobile;
  }

  get isNativeApp() {
    return this.ua.getUA().includes('Shopify Mobile/', 0);
  }

  get os() {
    return this.ua.getOS().name || '';
  }

  get isWindows() {
    return this.os.includes('Windows');
  }

  get isMac() {
    return this.os.includes('Mac OS');
  }

  get isSafari() {
    return this.name.includes('Safari');
  }

  get isChrome() {
    return this.name.includes('Chrome');
  }

  get isAndroidChrome() {
    return this.ua.getUA().includes('Android') && this.name.includes('Chrome');
  }

  get isFirefox() {
    return this.name === 'Firefox';
  }

  get isIE() {
    return this.name.includes('IE');
  }

  get isEdge() {
    return this.name === 'Edge';
  }

  get isIOS() {
    const os = this.ua.getOS();
    const isStandardiOS = os.name && os.name.includes('iOS');
    const isShopifyiOS =
      /Shopify Mobile|Shopify POS|Shopify Ping/.test(this.userAgent) &&
      this.userAgent.includes('iOS');
    return isStandardiOS || isShopifyiOS;
  }

  constructor({userAgent, supported = true}: Options) {
    this.userAgent = userAgent;
    this.supported = supported;
    this.ua = new UAParser(userAgent);
  }
}

export function asPlainObject(browser?: Browser) {
  if (browser == null) {
    return {};
  }

  return {
    name: browser.name,
    version: browser.version,
    isMobile: browser.isMobile,
    isNativeApp: browser.isNativeApp,
    isDesktop: browser.isDesktop,
  };
}
