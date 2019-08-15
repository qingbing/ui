(function ($) {
    let PM = new ParamsManager('hideShow');
    let L = {
        config: {
            ops: {
                target: undefined, // 控制的标签
                open: false, // 是否打开状态
                ajaxUrl: undefined, // 是否target内容需要ajax加载，如果需要，这里指定url
                postData: undefined, // ajax时的查询参数
                ajaxCallback: undefined, // ajax 回调后执行的方法
                openCache: true, // 如果定义ajaxUrl是否缓存
                openedLabel: '关闭', // 处于打开时显示标签
                closedLabel: '打开',// 处于关闭时显示标签
                beforeCallback: undefined, // 打开前执行方法
                showType: 'slideDown', // 展开的方式
                showTime: 750, // 展开的时间（毫秒）
                afterCallback: undefined, // 打开后执行方法
                hideType: 'slideUp', // 关闭的方式
                hideTime: 750, // 关闭的时间（毫秒）
                closeCallback: undefined // 关闭后执行方法
            },
            showTypes: ['show', 'slideDown', 'fadeIn'],
            hideTypes: ['hide', 'slideUp', 'fadeOut'],
        },
        initOp: function ($trigger, op) {
            let tp = PM.getOption($trigger);
            if (H.isDefined(tp)) {
                return tp;
            }

            let $target = op.$target = $(op.target);
            if ($trigger.is('input') || $trigger.is('button')) {
                op.labelMethod = 'val';
            } else {
                op.labelMethod = 'text';
            }

            if (0 === $target.length) {
                return false;
            }
            op.beforeCallback = H.toJson(op.beforeCallback);
            op.afterCallback = H.toJson(op.afterCallback);
            op.closeCallback = H.toJson(op.closeCallback);
            if (!H.inObject(op.showType, this.config.showTypes)) {
                op.showType = 'show';
            }
            if (!H.inObject(op.hideType, this.config.hideTypes)) {
                op.hideType = 'hide';
            }
            if (op.ajaxUrl) {
                op.ajaxCallback = H.toJson(op.ajaxCallback);
                op.postData = H.toJson(op.postData);
            }
            op.$trigger = $trigger;
            PM.setOption($trigger, op);
            PM.addTrigger($trigger);
            return op;
        },
        run: function ($trigger, op) {
            if (false === op) {
                return false;
            }
            if (op.open) {
                this.func.show(op);
            } else {
                this.func.hide(op, true);
            }
            // 事件绑定
            $trigger.on('click', L.events.triggerClick);
        },
        func: {
            show: function (op) {
                if (op.ajaxUrl) {
                    // 如果 openCache 未开启并且没有
                    if (!op.openCache || !op.isInit) {
                        // 请求数据，并装载
                        let content = PF.ajax(op.ajaxUrl, op.postData);
                        op.$target.html(content);
                        // ajax 装载后回调
                        if (H.isFunction(op.ajaxCallback)) {
                            op.ajaxCallback(op);
                        }
                        if (op.openCache) {
                            op.isInit = true;
                        }
                    }
                }
                // 展示前回调
                if (H.isFunction(op.beforeCallback)) {
                    if (true !== op.beforeCallback(op)) {
                        return false;
                    }
                }
                // 展示目标
                op.$target[op.showType](op.showTime);
                // 设置触发标签
                if (op.labelMethod === 'val') {
                    op.$trigger.val(op.openedLabel);
                } else {
                    op.$trigger.text(op.openedLabel);
                }
                // 运行完回调
                if (H.isFunction(op.afterCallback)) {
                    op.afterCallback(op);
                }
            },
            hide: function (op, init) {
                // 隐藏目标
                op.$target[op.hideType](op.hideTime);
                // 设置触发标签
                if (op.labelMethod === 'val') {
                    op.$trigger.val(op.closedLabel);
                } else {
                    op.$trigger.text(op.closedLabel);
                }
                if (init) {
                    return;
                }
                // 运行完回调
                if (H.isFunction(op.closeCallback)) {
                    op.closeCallback(op);
                }
            }
        },
        events: {
            triggerClick: function (e) {
                let $this = $(this);
                let op = PM.getOption($this);
                if (true === op.open) {
                    L.func.hide(op);
                    op.open = false;
                } else {
                    L.func.show(op);
                    op.open = true;
                }
            }
        }
    };

    /**
     */
    $.fn.extend({
        hideShow: function (ops) {
            ops = $.extend(true, {}, L.config.ops, ops);
            $(this).each(function () {
                let $this = $(this);
                // 扩展参数设置
                let data = $this.data();
                L.run($this, L.initOp($this, $.extend(true, {}, ops, data)));
            });
            return this;
        }
    });
})(jQuery);