(function(window, undefined){

    // 插件初始化入口函数
    window.Asc.plugin.init = function() {
        // 插件初始化完成，向外部发送消息通知
        // 这样外部页面就知道插件已经准备好接收命令了
        // 参考文章中的做法：使用 window.parent.Common.Gateway.sendInfo 发送信息
        // 外部页面可以通过监听 'message' 事件或 docEditor.onInfo 来接收
        if (window.parent && window.parent.Common && window.parent.Common.Gateway) {
            window.parent.Common.Gateway.sendInfo({
                command: 'pluginInitialized',
                data: { 
                    status: 200,
                    message: 'onlyoffice-editor-search-plugin initialized'
                }
            });
        }

        // 监听来自外部的 'internalcommand' 事件
        // 当外部前端调用 docEditor.serviceCommand("editor-search-plugin", { ... }) 时触发
        window.parent.Common.Gateway.on('internalcommand', function(data){
            // data.command 对应 serviceCommand 的第一个参数 ("editor-search-plugin")
            // data.data 对应 serviceCommand 的第二个参数 (JSON对象)
            
            // 打印日志以便调试
            console.log("onlyoffice-editor-search-plugin received command:", data.command, "data:", data.data);

            // 检查命令是否是我们期望的 "editor-search-plugin"
            if (data.command === "editor-search-plugin") {
                // 解析传入的参数
                // 预期格式: { keyword: "搜索内容" }
                var params = data.data;
                
                // 如果参数不是对象或为空，尝试解析（虽然通常已经是对象）
                if (typeof params === 'string') {
                    try {
                        params = JSON.parse(params);
                    } catch (e) {
                        console.error("onlyoffice-editor-search-plugin: Failed to parse parameters", e);
                        // 如果解析失败，假设是直接传入的关键词（兼容旧版本）
                        params = { keyword: params };
                    }
                }

                if (!params || !params.keyword) {
                    console.warn("onlyoffice-editor-search-plugin: No keyword provided");
                    return;
                }

                // 将参数传递给 Global Scope
                Asc.scope.keyword = params.keyword;
                
                // 为了实现“不修改文档”的搜索标记，使用 Select 方法选中搜索结果。
                // 连续搜索相同关键词时，跳转到下一个匹配项。
                
                // 在插件外层保存搜索状态（当前关键词和索引）
                if (typeof window.Asc.plugin.searchState === 'undefined') {
                    window.Asc.plugin.searchState = {
                        keyword: '',
                        index: 0
                    };
                }
                
                // 更新搜索状态：新关键词重置索引，相同关键词索引递增
                if (params.keyword !== window.Asc.plugin.searchState.keyword) {
                    window.Asc.plugin.searchState.keyword = params.keyword;
                    window.Asc.plugin.searchState.index = 0;
                } else {
                    window.Asc.plugin.searchState.index++;
                }
                
                // 将索引传递给 callCommand
                Asc.scope.searchIndex = window.Asc.plugin.searchState.index;

                window.Asc.plugin.callCommand(function() {
                    var oDocument = Api.GetDocument();
                    var sKeyword = Asc.scope.keyword;
                    var nIndex = Asc.scope.searchIndex || 0;
                    
                    var aSearch = oDocument.Search(sKeyword, false); // 不区分大小写
                    
                    if (aSearch && aSearch.length > 0) {
                        var nRealIndex = nIndex % aSearch.length;
                        aSearch[nRealIndex].Select();
                        return { index: nRealIndex, count: aSearch.length };
                    } else {
                        return { found: false };
                    }
                }, false, true, function(result) {
                    if (result && result.found === false) {
                         // 尝试向父级发送消息，让父级处理（推荐）
                         if (window.parent && window.parent.Common && window.parent.Common.Gateway) {
                             window.parent.Common.Gateway.sendInfo({
                                 command: 'onSearchNotFound',
                                 data: { 
                                     keyword: params.keyword
                                 }
                             });
                         }
                    }
                });
            }
        });
    };

    // 插件按钮点击事件（如果有按钮的话）
    // 对于这种后台服务型插件，通常不需要按钮操作，但保留此函数是好习惯
    window.Asc.plugin.button = function(id) {
        this.executeCommand("close", "");
    };

})(window, undefined);