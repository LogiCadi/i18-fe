import { stringify, parse } from "query-string";

export type GetKeys<T> = T extends Record<string, infer R>
  ? R extends Record<infer L, string>
    ? L
    : never
  : never;

export type I18Props<T> = {
  /** 语言包 */
  pack?: T;
  /** 语言字段，默认：locale */
  localeField?: string;
  /** 默认语言，默认：zh */
  defaultLocale?: string;
  /** 开启替换模式来替换原生DOM中的文字，默认：false */
  replace?: boolean;
  debug?: boolean;
};

export default class I18<T extends Record<string, Record<string, string>>> {
  [x: string]: any;

  constructor(props: I18Props<T> = {}) {
    this.pack = props.pack || {};
    this.localeField = props.localeField || "locale";
    this.defaultLocale = props.defaultLocale || "zh";
    this.replace = props.replace || false;
    this.debug = props.debug || false;
    this.locale = this.getLocale(true);

    if (this.replace) this.DOMreplace();
    if (this.debug) console.log("I18初始化", this);
  }

  DOMreplace() {
    const contentHandler = (content: string) => {
      if (content.search(/{locale}/) !== -1) {
        return content.replace(/{locale}/g, this.getLocale());
      }
      return this.t(content as keyof T);
    };
    // 常规元素的children
    const commonDOM = document.querySelectorAll("[i18-children]");
    for (let i = 0; i < commonDOM.length; i++) {
      const content = commonDOM[i].getAttribute("i18-children");
      commonDOM[i].innerHTML = contentHandler(content as string);
    }
    // 输入框的placeholder
    const inputDOM = document.querySelectorAll("[i18-placeholder]");
    for (let i = 0; i < inputDOM.length; i++) {
      const content = inputDOM[i].getAttribute("i18-placeholder");
      inputDOM[i].setAttribute(
        "placeholder",
        contentHandler(content as string)
      );
    }
    // 图片的src
    const srcDOM = document.querySelectorAll("[i18-src]");
    for (let i = 0; i < srcDOM.length; i++) {
      const content = srcDOM[i].getAttribute("i18-src");
      srcDOM[i].setAttribute("src", contentHandler(content as string));
    }
  }

  /** 设置语言 */
  setLocale(locale: GetKeys<T>) {
    // set storage locale
    localStorage.setItem(this.localeField, locale);

    // set url locale
    const url = window.location.href.split("?")[0];
    const params = window.location.href.split("?")[1];
    const newParams = stringify({
      ...parse(params),
      [this.localeField]: locale,
    });
    window.location.href = `${url}?${newParams}`;
    if (window.location.href.indexOf("#") !== -1) {
      window.location.reload();
    }
  }

  /** 获取语言 */
  getLocale(basis = false): string {
    if (basis) {
      const params = window.location.href.split("?")[1];
      const urlLocale = parse(params)?.[this.localeField] as string;

      const storageLocale = localStorage.getItem(this.localeField);

      const navigatorLocale = navigator.language?.split("-")[0];

      return urlLocale || storageLocale || navigatorLocale;
    } else {
      return this.locale;
    }
  }

  /** 翻译 */
  t(key: keyof T, params?: Record<string, any>): string {
    const locale = this.getLocale();
    let result =
      // @ts-ignore
      this.pack[key]?.[locale] || this.pack[key]?.[this.defaultLocale];

    if (params) {
      Object.keys(params).forEach((paramsKey) => {
        result = result.replace(`{${paramsKey}}`, params[paramsKey]);
      });
    }

    if (!result)
      console.warn(
        `[i18][WARN]请确认 key = ${key as string}, locale = ${locale} 是否正确`
      );

    return result;
  }

  translate = this.t;

  static packFmt = <L extends Record<string, Record<string, string>>>(
    pack: L
  ) => {
    const res = {} as Record<GetKeys<L>, Record<keyof L, string>>;
    Object.keys(pack).forEach((locale) => {
      Object.keys(pack[locale]).forEach((key) => {
        if (!res[key as GetKeys<L>])
          res[key as GetKeys<L>] = {} as Record<keyof L, string>;

        res[key as GetKeys<L>][locale as keyof L] = pack[locale][key];
      });
    });

    return res;
  };
}
