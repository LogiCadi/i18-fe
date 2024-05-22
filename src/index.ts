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

    console.log(this);

    if (this.replace) this.DOMreplace();
  }

  DOMreplace() {
    // text
    const textDOM = document.querySelectorAll("[i18-text]");
    console.log(textDOM);
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
    window.location.reload();
  }

  getLocale() {
    const params = window.location.href.split("?")[1];
    const locale =
      parse(params)?.[this.localeField] ||
      localStorage.getItem(this.localeField) ||
      this.defaultLocale;

    return locale;
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
