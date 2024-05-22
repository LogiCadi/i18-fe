import { stringify, parse } from "query-string";

export default class I18<T> {
  /** 语言包 */
  pack;
  /** 语言字段 */
  localeField;
  /** 开启替换模式来替换原生DOM中的文字 */
  replace;
  /** 默认语言 */
  defaultLocale;

  constructor(options: {
    pack: T;
    localeField?: string;
    replace?: boolean;
    defaultLocale?: string;
  }) {
    this.pack = options.pack;
    this.localeField = options.localeField || "locale";
    this.replace = options.replace || false;
    this.defaultLocale = options.defaultLocale || "zh";

    if (this.replace) this.DOMreplace();
  }

  DOMreplace() {
    const contentHandler = (content: string) => {
      return (
        this.t(content as keyof T) ||
        content.replace(/{locale}/g, this.getLocale())
      );
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

  setLocale(locale: string) {
    const url = window.location.href.split("?")[0];
    const params = window.location.href.split("?")[1];

    const newParams = stringify({
      ...parse(params),
      [this.localeField]: locale,
    });

    window.location.href = `${url}?${newParams}`;
    localStorage.setItem(this.localeField, locale);

    if (window.location.href.indexOf("#") !== -1) {
      window.location.reload();
    }
  }

  getLocale() {
    const params = window.location.href.split("?")[1];
    const locale =
      parse(params)?.[this.localeField] ||
      localStorage.getItem(this.localeField) ||
      this.defaultLocale;

    return locale as string;
  }

  /** 翻译 */
  t(key: keyof T, params?: any) {
    const locale = this.getLocale();
    // @ts-ignore
    let result = this.pack[key]?.[locale];

    if (params) {
      Object.keys(params).forEach((paramsKey) => {
        result = result.replace(`{${paramsKey}}`, params[paramsKey]);
      });
    }

    return result;
  }
}
