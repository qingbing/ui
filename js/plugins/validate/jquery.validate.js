(function ($) {
    $.fn.validator = {
        messages: {
            required: " * 必填 * ",
            maxLength : ""

        },
        rules: {}
    };
    $.fn.validator.rules.required = function (val, op) {
        if (H.isEmpty(val)) {
            return op.messages.required;
        }
        return true;
    };

    let PM = new ParamsManager('validate');
    let L = {
        config: {
            ops: {
                validateBtn: '#validBtn',
                submitBtn: '#submitBtn',
                resetBtn: '#resetBtn',
                subMsg: '该表单您已经提交过啦',
                callback: undefined,
                allowEmptyField: false
            }
        },
        initOp: function ($form, op) {
            let tp = PM.getOption($form);
            if (H.isDefined(tp)) {
                return tp;
            }

            let $validFields = $form.find('[data-valid-type]');
            for (let i = 0; i < $validFields.length; i++) {
                let $field = $validFields.eq(i);
                let validType = H.toJson($field.data('validType'));
                let validMessage = $.extend(true, $.fn.validator.messages, H.toJson($field.data('validMessage')));
                let valid = {};
                H.each(validType, function (i, type) {
                    console.log(55555)
                    if(!$.fn.validator.rules){
                        return false;
                    }
                    console.log(1111,i, type);
                    return false;
                });

                console.log($.fn.validator.rules)
                // console.log($.fn.validator.messages)
                // console.log(H.toJson($field.data('validMessage')))
                // console.log(validMessage)


            }

            op.$validFields = $validFields;
            PM.setOption($form, op);
            PM.addTrigger($form);
            return op;
        },
        run: function ($form, op) {
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

    $.fn.extend({
        validate: function (settings) {
            H.isObject(settings) || (settings = {});
            $.extend($.fn.validator.messages, settings.messages ? settings.messages : {});
            $.extend($.fn.validator.rules, settings.rules ? settings.rules : {});

            $(this).each(function () {
                let $this = $(this);
                // 扩展参数设置
                let data = $this.data();
                L.run($this, L.initOp($this, $.extend(true, {}, L.config.ops, data)));
            });
            return this;
        }
    });
})(jQuery);
