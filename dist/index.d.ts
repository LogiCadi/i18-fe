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
export default class I18<T> {
    [x: string]: any;
    constructor(props?: I18Props<T>);
    DOMreplace(): void;
    /** 设置语言 */
    setLocale(locale: string): void;
    initLocale(): void;
    /** 获取语言 */
    getLocale(basis?: boolean): string;
    /** 翻译 */
    t(key: keyof T, params?: any): any;
}
