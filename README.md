# i18-fe

通用 web 国际化

## 适用

`react` `vue` `微前端` `iframe` `vanilla HTML + js` ...

## 使用

### 初始化

```js
import I18 from "i18-fe";

const i18 = new I18({
  pack: {
    你好: {
      zh: "你好",
      en: "hello",
    },
  },
});

export default i18;
```

### 设置语言

```js
i18.setLocale("en");
```

### 翻译

```js
i18.t("你好");
```
