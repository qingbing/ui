(function ($) {
    var PM = new ParamsManager('validate');
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


            console.log('validate params initial');

            // todo
            // todo coding to initial the config


            PM.setOption($trigger, op);
            PM.addTrigger($trigger);
            return op;
        },
        run: function ($trigger, op) {
            if (false === op) {
                return false;
            }

            // todo
            // todo coding to initial the config
            console.log('validate running');
        },
        func: {},
        events: {}
    };
    /**
     * 文档点击事件
     */
    $(document).on('click', function (e) {
        var op = PM.getOption();
        // todo coding
        console.log('validate document click');
    });

    /**
     */
    $.fn.extend({
        validate: function (ops) {
            ops = $.extend(true, {}, L.config.ops, ops);
            $(this).each(function () {
                var $this = $(this);
                // 扩展参数设置
                var data = $this.data();
                L.run($this, L.initOp($this, $.extend(true, {}, ops, data)));
            });
            return this;
        }
    });
})(jQuery);