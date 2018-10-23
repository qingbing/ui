(function ($) {
    $.fn.validator = {
        config: {
            compare: {compareTarget: "#xxx"},
        },
        messages: {
            required: {message: " * 必填 * "},
            compare: {message: ""},
        },
        rules: {},
    };
    $.fn.validator.rules.required = function (op, init) {
        if (true === init) {
            return op;
        }
        return true;
    };
    $.fn.validator.rules.url = function (op, init) {
        console.log(op);
        return true;
    };

    let PM = new ParamsManager('validate');
    let L = {
        config: {
            ops: {
                validateBtn: '#validateBtn',
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
            // 验证字段检验并绑定
            let $validFields = $form.find('[data-valid]');
            for (let i = 0; i < $validFields.length; i++) {
                let $field = $validFields.eq(i);
                let validType = H.toJson($field.data('valid'));
                let valids = {};
                H.each(validType, function (type, param) {
                    if (!$.fn.validator.rules[type]) {
                        $.alert(H.replace('不存在的验证规则 "%s"', type));
                        return true;
                    }
                    valids[type] = $.fn.validator.rules[type]($.extend(true, $.fn.validator.config[type], $.fn.validator.messages[type], param), true);
                });
                // 处理默认显示
                let tagName = $field.get(0).tagName;
                let _triggerEvent = 'blur';
                let $help, $feedback;
                if ('CHECKBOX' === tagName || 'RADIO' === tagName) {
                    let $box;
                    if ('CHECKBOX' === tagName) {
                        $box = $field.closest('.checkbox').parent() || $field.closest('.checkbox-inline').parent();
                    } else {
                        $box = $field.closest('.radio').parent();
                    }
                    console.log(23456)
                    $feedback = $box.children('.form-control-feedback');
                    if ($feedback.length < 1) {
                        // $feedback = $('<i class="form-control-feedback fa"></i>').appendTo($box);
                    }
                    $help = $field.children('.help-block');
                    if ($help.length < 1) {
                        // $help = $('<div class="help-block">this is error.</div>').appendTo($box);
                    }
                } else {
                    $feedback = $field.siblings('.form-control-feedback');
                    if ($feedback.length < 1) {
                        $feedback = $('<i class="form-control-feedback fa"></i>').insertAfter($field);
                    }
                    $help = $field.siblings('.help-block');
                    if ($help.length < 1) {
                        $help = $('<div class="help-block">this is error.</div>').insertAfter($feedback);
                    }
                }


                // <i class="form-control-feedback fa fa-check"></i>
                //         <div class="help-block">this is error.</div>


                if ('CHECKBOX' === tagName || 'RADIO' === tagName) {
                    _triggerEvent = 'click';
                } else if ('SELECT' === tagName) {
                    _triggerEvent = 'change';
                } else if ('INPUT' === tagName) {
                    let iType = $field.attr(('type'));
                    if ('FILE' === iType.toUpperCase()) {
                        _triggerEvent = 'change';
                    }
                }

                if ('blur' === _triggerEvent) { // input:text, textarea
                    $field.on('focus', L.events.fieldFocus);
                }
                $field.on(_triggerEvent, L.events.fieldValid);
            }
            op.$validFields = $validFields;
            //  组件事件绑定
            PM.setOption($form, op);
            PM.addTrigger($form);
            return op;
        },
        run: function ($form, op) {
            if (false === op) {
                return false;
            }
            // reset form
            let $resetBtn = $(op.resetBtn);
            if ($resetBtn.length > 0) {
                $resetBtn.on('click', {$form: $form}, L.events.formReset);
            }
            // Validate the form box.
            let $validateBtn = $(op.validateBtn);
            if (0 !== $validateBtn.length) {
                $validateBtn.on('click', {$form: $form}, L.events.formValidate);
            }
            // Validate and submit the form box.
            let $submitBtn = $(op.submitBtn);
            if ($submitBtn.length > 0) {
                $submitBtn.on('click', {$form: $form}, L.events.formSubmit);
            }
            return true;
        },
        func: {
            setOption: function ($field, op) {
                $field.data("__valid_data", op);
            },
            getOption: function ($field) {
                return $field.data("__valid_data");
            }
        },
        events: {
            fieldFocus: function (e) {
                console.log(e);
            },
            fieldValid: function (e) {

            },
            formReset: function (e) {
                console.log(e.data);
            },
            formValidate: function (e) {
                console.log(e.data);
            },
            formSubmit: function (e) {
                console.log(e.data);
            }
        }
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
