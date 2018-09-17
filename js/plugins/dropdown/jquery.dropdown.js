(function ($) {
    var PM = new ParamsManager('dropdown');
    var L = {
        config: {
            ops: {
                targetClose: true
            }
        },
        initOp: function ($trigger, op) {
            var tp = PM.getOption($trigger);
            if (H.isDefined(tp)) {
                return tp;
            }
            var $target;
            if (!H.isEmpty(op.target)) {
                $target = $(op.target);
                if ($target) {
                    op.$target = $target;
                }
            }
            if (!H.isDefined(op.$target)) {
                $target = $trigger.next('.w-dropdown-menu');
                if ($target) {
                    op.$target = $target;
                } else {
                    return false;
                }
            }
            PM.setOption($trigger, op);
            PM.addTrigger($trigger);
            $trigger.on('click', L.events.triggerClick);
            return op;
        },
        run: function ($trigger, op) {
        },
        func: {
            show: function (op) {
                op.$target.show();
            },
            hide: function (op) {
                op.$target.hide();
            }
        },
        events: {
            triggerClick: function (e) {
                var $curTrigger = $(this);
                PM.each(function ($trigger) {
                    var op = PM.getOption($trigger);
                    if ($trigger.is($curTrigger)) {
                        L.func.show(op);
                        PM.setCurrentTrigger($curTrigger);
                    } else if ($trigger) {
                        L.func.hide(op);
                    }
                });
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
            }
        }
    };
    /**
     * 文档点击事件
     */
    $(document).on('click', function (e) {
        var op = PM.getOption();
        if (!op) {
            return;
        }
        PM.setCurrentTrigger(undefined);
        if (!op.$target.is(':visible')) {
            return;
        }
        if (0 === $(e.target).closest(op.$target).length) {
            L.func.hide(op);
        } else if (true === op.targetClose) {
            L.func.hide(op);
        }
    });

    /**
     * w-target : #id, .class
     * w-target-close : false : 点击到显示目标是是否关闭，默认关闭
     */
    $.fn.extend({
        dropdown: function (ops) {
            ops = $.extend({}, L.config.ops, ops);
            $(this).each(function () {
                var $this = $(this);
                // 扩展参数设置
                L.run($this, L.initOp($this, $.extend({}, ops, $this.data())));
            });
            return this;
        }
    });
})(jQuery);