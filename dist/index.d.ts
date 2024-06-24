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
    constructor(props?: I18Props<T>);
    DOMreplace(): void;
    /** 设置语言 */
    setLocale(locale: GetLocaleKeys<T>): void;
    /** 获取语言 */
    getLocale(basis?: boolean): string;
    /** 翻译 */
    t(key: keyof T, params?: Record<string, any>): string;
    translate: (key: keyof T, params?: Record<string, any>) => string;
    unpack(): Record<GetLocaleKeys<T>, Record<keyof T, string>>;
}
export type GetLocaleKeys<T> = T extends Record<string, infer R> ? R extends Record<infer L, string> ? L : never : never;
