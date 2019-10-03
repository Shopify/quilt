import {UAParser} from 'ua-parser-js';

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
    return this.ua.getDevice().type === 'mobile';
  }

  get isDesktop() {
    return !this.isMobile;
  }

  get isShopifyMobile() {
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

  get isIOS9() {
    const os = this.ua.getOS();
    const isStandardiOS9 =
      os.name &&
      os.name.search('iOS') !== -1 &&
      os.version &&
      os.version.search(/^9(\.\d+)(\.\d+){0,1}$/) !== -1;
    const isShopifyiOS9 =
      this.userAgent.search(/Shopify Mobile|Shopify POS|Shopify Ping/g) !==
        -1 &&
      this.userAgent.search('iOS') !== -1 &&
      this.userAgent.search(/\D9(\.\d+)(\.\d+){0,1}(;|\))/g) !== -1;
    return isStandardiOS9 || isShopifyiOS9;
  }

  constructor({userAgent, supported = true}: Options) {
    this.userAgent = userAgent;
    this.supported = supported;
    this.ua = new UAParser(userAgent);
  }

  asPlainObject() {
    return {
      name: this.name,
      version: this.version,
      isMobile: this.isMobile,
      isShopifyMobile: this.isShopifyMobile,
      isDesktop: this.isDesktop,
    };
  }
}
