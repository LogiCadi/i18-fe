export default class I18<T> {
    /** 语言包 */
    pack: T;
    /** 语言字段 */
    localeField: string;
    /** 开启替换模式来替换原生DOM中的文字 */
    replace: boolean;
    /** 默认语言 */
    defaultLocale: string;
    constructor(options: {
        pack: T;
        localeField?: string;
        replace?: boolean;
        defaultLocale?: string;
    });
    DOMreplace(): void;
    setLocale(locale: string): void;
    getLocale(): string;
    /** 翻译 */
    t(key: keyof T, params?: any): any;
}
