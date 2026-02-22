# onlyoffice-editor-search-plugin

[English](README_EN.md) | [简体中文](README.md)

这是一个基于 OnlyOffice DocumentServer 的插件，允许通过前端页面（如集成 OnlyOffice 的 Vue/React/Angular 应用）向编辑器发送搜索命令，实现文档内容的自动搜索、选中定位和循环查找。

**作者**: wukai (wukai123123123@126.com)

## 插件用途与效果

本插件主要解决在集成 OnlyOffice 时，需要通过外部业务系统（非编辑器内部工具栏）控制文档搜索的需求。例如：
- 业务系统侧边栏有一个搜索框，用户输入关键词后，文档编辑器自动跳转到对应位置。
- 点击业务系统中的某个“引用链接”，文档自动定位到该引用的具体段落。

**实现效果**:
1. **外部控制**: 前端页面调用 `docEditor.serviceCommand` API 发送关键词。
2. **自动定位**: 文档编辑器自动滚动并选中（Select）第一个匹配的关键词。
3. **循环查找**: 连续发送相同的关键词，插件会自动跳转到下一个匹配项（类似“查找下一个”功能）。
4. **无痕操作**: 插件仅使用“选中”状态来标记结果，不会修改文档内容或样式，不会留下永久高亮，用户点击其他地方即可取消选中。
5. **错误提示**: 如果未找到内容，会弹出 OnlyOffice 风格的提示框（支持自定义提示语）。

## 目录结构

```
onlyoffice-editor-search-plugin/ (项目根目录)
├── config.json      # 插件配置文件
├── index.html       # 插件入口页面
├── code.js          # 插件核心逻辑代码
├── translations/    # 国际化翻译文件
├── resources/       # 资源文件（图标）
├── LICENSE          # MIT 开源协议
├── README.md        # 中文说明文档
└── README_EN.md     # 英文说明文档
```

## 安装部署

1. **复制插件文件**:
   将整个 `onlyoffice-editor-search-plugin` 文件夹复制到 OnlyOffice DocumentServer 的插件目录中。
   - Linux (Docker/Debian/Ubuntu): `/var/www/onlyoffice/documentserver/sdkjs-plugins/`
   - Windows: `%ProgramFiles%\ONLYOFFICE\DocumentServer\sdkjs-plugins\`

2. **重启服务** (可选):
   通常 OnlyOffice 会自动检测新插件，如果未生效，尝试重启 OnlyOffice 服务或清除浏览器缓存。

## 前端调用示例

在集成 OnlyOffice 的前端页面中，使用 `docEditor` 对象调用插件功能。

```javascript
// 假设 docEditor 是初始化后的文档编辑器实例
// var docEditor = new DocsAPI.DocEditor("placeholder", config);

// 搜索配置对象
var searchConfig = {
    "keyword": "搜索关键词"       // 必填：需要查找的内容
};

// 发送命令给插件
// 参数1: "editor-search-plugin" - 对应插件中监听的 command ID
// 参数2: JSON 对象 - 包含搜索配置
docEditor.serviceCommand("editor-search-plugin", searchConfig);

// 监听未找到消息（可选）
var onAppReady = function() {
    docEditor.attachEvent("onInfo", function(event) {
        // 监听插件发送的消息
        if (event && event.data && event.data.command === "onSearchNotFound") {
            console.log("Search not found:", event.data.data.keyword);
            // 这里可以实现自定义的业务逻辑，例如前端弹出自己的提示框
            // alert("未找到内容");
        }
    });
};
```

## 注意事项

- **插件初始化**: 插件加载需要一定时间。在调用 `serviceCommand` 之前，请确保插件已加载完成。
  - 插件内部会发送 `pluginInitialized` 消息，前端可以通过监听 `onInfo` 或 `message` 事件来确认。
- **浏览器兼容性**: 请确保使用的浏览器支持 OnlyOffice 插件运行环境。
- **版本要求**: 该插件基于 OnlyOffice API 开发，适用于 7.0+ 版本（参考文章中提到 8.2.2 测试通过）。

## 参考资料

- [CSDN 博客文章](https://blog.csdn.net/luckyboyguo/article/details/144839652)
- [OnlyOffice Plugin API 文档](https://api.onlyoffice.com/plugin/basic)

## 开源协议

本项目基于 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件。
