(function ($) {
    let PM = new ParamsManager('select');
    let L = {
        config: {
            ops: {
                // select2 support data-*
                placeholder: null, // default = null
                width: '100%', // 宽度
                minimumInputLength: 1, // default=0
                allowClear: true, // default=false
                debug: false, // default = false
                closeOnSelect: true, // default = true

                // select2 not support data-*
                multiple: false, // default=false,如果为多选，select 建议添加 multiple="multiple"，另外，name的设置需要"[]"结尾
                disabled: false, // default = false, 是否禁用select
                selected: undefined, // 默认选择项目，必须为数组
                ajaxUrl: undefined,
                ajaxCache: undefined,
                data: null // default = null
            }
        },
        initOp: function ($trigger, op) {
            let tp = PM.getOption($trigger);
            if (H.isDefined(tp)) {
                return tp;
            }
            // multiple 处理
            if (true === op.multiple) {
                $trigger.attr('multiple', 'multiple');
            } else {
                $trigger.removeAttr('multiple');
            }
            // data 处理
            $trigger.data('data', H.toJson(op.data));
            // selected 规范
            if (op.selected) {
                let _selected = H.toJson(op.selected);
                op.selected = H.isArray(_selected) ? _selected : [op.selected];
            } else {
                delete op.selected;
            }
            // ajax 后台搜索
            if (H.isEmpty(op.ajaxUrl)) {
                delete op.ajaxUrl;
                delete op.ajaxCache;
            } else {
                op.ajax = {
                    type: 'POST',
                    url: op.ajaxUrl,
                    dataType: 'json',
                    data: function (params) {
                        return {
                            keyword: params.term,
                            // page: params.page,
                            _type: 'query'
                        };
                    },
                    processResults: function (rs, params) {
                        if (0 !== parseInt(rs.code)) {
                            $.alert("" + rs.code + " : " + rs.message, 'danger');
                        } else {
                            return {results: rs.data};
                        }
                    }
                };
            }
            PM.setOption($trigger, op);
            PM.addTrigger($trigger);
            return op;
        },
        run: function ($trigger, op) {
            if (false === op) {
                return false;
            }
            $trigger.select2(op);
            // 默认选择
            if (op.selected) {
                if (op.ajax) {
                    // 默认选择的显示来自于ajax后台调用
                    PF.ajax(op.ajaxUrl, {
                        ids: op.selected,
                        _type: 'init',
                    }, function (data) {
                        for (let i = 0; i < data.length; i++) {
                            let item = data[i];
                            let option = new Option(item.text, item.id, true, true);
                            $trigger.append(option);
                        }
                        $trigger.trigger('change');
                    });
                } else {
                    // 设置静态的默认选择
                    $trigger.val(op.selected).trigger('change');
                }
            }

        }
    };

    $.fn.extend({
        select: function (ops) {
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