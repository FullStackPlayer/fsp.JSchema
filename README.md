fsp.JSchema 说明文档
---

# 目的

解决 `“泛JS”` 生态下对 JSON 数据的格式校验问题，如以下场景：

- 服务端接收客户端 post 来的数据，在处理之前需要先验证其是否符合 API 文档要求的规范，手写代码来检测是完全不可以接受的！
- 前端拿到后端返回的数据，在进行 UI 渲染之前也需要检验是否符合预期，同样不能接受手写代码进行检测的方式。

它是用 TypeScript 写就的，优先适配 Deno 运行时，当然也可以编译成 JS，因此在 Nodejs 和 Web 前端环境下都可以完美运行。

你可能已经知道 `JSON Schema` 以及它的 JS 实现，如 `ajv` 和 `djv` 这些，的确 Deno.JSchema 解决的是一样的问题，但是这绝不是重复造轮子，其优势如下：

# 优点

- 纯 TypeScript 开发，原生适配 Deno 运行时
- 同时编译成 JS 版本进行发布，WEB 和 Nodejs 全支持
- 轻量级、零依赖，拷贝即安装
- 语义化强，好学好用

# 用法（TBD）