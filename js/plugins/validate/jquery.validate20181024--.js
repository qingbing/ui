(function ($) {
    $.fn.validator = {
        helper: {
            pattern: function (val, pattern) {
                return pattern.test(val);
            },
            toPattern: function (op) {
                if (H.isEmpty(op.pattern)) {
                    $.alert("验证规则为空", 'warning');
                    return false;
                }
                op.pattern = H.toJson(op.pattern);
                if (!H.isObject(op.pattern)) {
                    $.alert("不是合法的正则表达式", 'warning');
                    return false;
                }
                return true;
            }
        },
        config: {
            choice: {
                max: false,
                min: 1
            },
            checked: {
                allowEmpty: false
            },
            file: {
                allowEmpty: true,
                exts: false
            },
            required: {},
            preg: {
                allowEmpty: true,
                pattern: ''
            },
            password: {
                allowEmpty: false,
                pattern: '/^.{6,18}$/'
            },
            compare: {
                target: undefined
            },
            greaterThan: {
                compareTarget: undefined
            },
            lessThan: {
                compareTarget: undefined
            }
        },
        messages: {
            choice: {
                placeholder: "请选择选项",
                message: " * 请选择 * ",
                length: '请选中 %s 个选项',
                less: '请至少选中 %s 个选项',
                more: '最多只能选中 %s 个选项',
                between: '请选择 %s 至 %s 个选项'
            },
            checked: {
                placeholder: "请勾选",
                message: "请勾选"
            },
            file: {
                placeholder: "请选择有效的文件",
                message: "请选择有效的文件",
                extMessage: "仅支持 %s 类型的文件",
            },
            required: {
                placeholder: "必填",
                message: " * 必填 * "
            },
            preg: {
                placeholder: "请输入",
                message: "输入不合法"
            },
            password: {
                placeholder: "请输入密码",
                message: "密码输入格式不正确"
            },
            compare: {
                placeholder: "请输入确认信息",
                message: "信息确认不一致"
            },
            greaterThan: {
                placeholder: "请输入信息",
                message: "信息输入不合法"
            },
            lessThan: {
                placeholder: "请输入信息",
                message: "信息输入不合法"
            }
        },
        rules: {}
    };
    // 选项规则，用于 select:multiple 和 input:checkbox-group
    $.fn.validator.rules.choice = function ($field, op, init) {
        if (true === init) {
            if (op.max > 0) {
                if (op.min > 0) {
                    if (op.max === op.min) {
                        op.message = H.replace(op.length, op.max);
                    } else {
                        op.message = H.replace(op.between, [op.min, op.max]);
                    }
                } else {
                    op.message = H.replace(op.more, op.max);
                }
            } else if (op.min > 0) {
                op.message = H.replace(op.less, op.min);
            }
            return op;
        }
        let selectLen;
        if ('SELECT' === $field.get(0).tagName) {
            selectLen = $field.find('option:selected').length;
        } else {
            selectLen = $field.filter(':checked').length;
        }
        if (op.min > 0 && selectLen < op.min) {
            return op.message;
        }
        if (op.max > 0 && selectLen > op.max) {
            return op.message;
        }
        return true;
    };
    // 是否有选择，主要用于 input:checkbox 和 input:radio-group， 也可以用于input:checkbox-group
    $.fn.validator.rules.checked = function ($field, op, init) {
        if (true === init) {
            return op;
        }
        if (op.allowEmpty) {
            return true;
        }
        if (0 === $field.filter(':checked').length) {
            return op.message;
        }
        return true;
    };
    // 仅适用于 input:file
    $.fn.validator.rules.file = function ($field, op, init) {
        if (true === init) {
            if (H.isArray(op.exts)) {
                op.extMessage = H.replace(op.extMessage, op.exts.join(','))
            }
            return op;
        }
        let val = $field.val();
        if (op.allowEmpty && H.isEmpty(val)) {
            return true;
        }
        if (H.isEmpty(val)) {
            return op.message;
        }
        if (!H.isEmpty(op.exts)) {
            if (-1 === $.inArray(val.substring(val.lastIndexOf('.') + 1), op.exts)) {
                return op.extMessage;
            }
        }
        return true;
    };
    // 自定义正则验证
    $.fn.validator.rules.preg = function ($field, op, init) {
        if (true === init) {
            console.log(op)
            if (false === $.fn.validator.helper.toPattern(op)) {
                return false;
            }
            console.log(op)
            return op;
        }
        let val = $field.val();
        if (op.allowEmpty && H.isEmpty(val)) {
            return true;
        }
        if (H.isEmpty(val)) {
            return op.message;
        }
        if (!$.fn.validator.helper.pattern(val, op.pattern)) {
            return op.message;
        }
        return true;
    };
    // 必填项规则, 可以用于 select
    $.fn.validator.rules.required = function ($field, op, init) {
        if (true === init) {
            return op;
        }
        let val = $field.val().trim();
        if (val.length > 0) {
            return true;
        }
        return op.message;
    };
    // 密码验证规则
    $.fn.validator.rules.password = function ($field, op, init) {
        if (true === init) {
            if (false === $.fn.validator.helper.toPattern(op)) {
                return false;
            }
            return op;
        }
        if (op === false) {
            return "代码参数有误";
        }
        let val = $field.val();
        if (op.allowEmpty && H.isEmpty(val)) {
            return true;
        }
        if (H.isEmpty(val)) {
            return op.message;
        }
        if (!$.fn.validator.helper.pattern(val, op.pattern)) {
            return op.message;
        }
        return true;
    };
    // 同另一个元素比较，字符串相等
    $.fn.validator.rules.compare = function ($field, op, init) {
        if (true === init) {
            op.$target = $(op.target);
            if (op.$target.length !== 1) {
                $.alert("必须设置一个对比的元素", 'warning');
                return false;
            }
            return op;
        }
        if (op === false) {
            return "代码参数有误";
        }
        if ($field.val() !== op.$target.val()) {
            return op.message;
        }
        return true;
    };
    // 同另一个元素比较，数字大于等于
    $.fn.validator.rules.greaterThan = function ($field, op, init) {
        if (true === init) {
            op.$compareTarget = $(op.compareTarget);
            if (op.$compareTarget.length !== 1) {
                $.alert("必须设置一个对比的元素", 'warning');
                return false;
            }
            return op;
        }
        if (op === false) {
            return "代码参数有误";
        }
        if ($field.val() !== op.$compareTarget.val()) {
            return op.message;
        }
        return true;
    };
    // 同另一个元素比较，数字小于等于
    $.fn.validator.rules.lessThan = function ($field, op, init) {
        if (true === init) {
            op.$compareTarget = $(op.compareTarget);
            if (op.$compareTarget.length !== 1) {
                $.alert("必须设置一个对比的元素", 'warning');
                return false;
            }
            return op;
        }
        if (op === false) {
            return "代码参数有误";
        }
        if ($field.val() !== op.$compareTarget.val()) {
            return op.message;
        }
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
                successMsg: '验证成功',
                failMsg: '没有全部通过验证',
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
                let fieldOps = {
                    validType: {},
                    placeholder: undefined,
                    $group: $field.closest('.form-group').addClass('has-feedback')
                };
                H.each(validType, function (type, param) {
                    if ('placeholder' === type) {
                        fieldOps.placeholder = param;
                        return true;
                    }
                    if (!$.fn.validator.rules[type]) {
                        $.alert(H.replace('不存在的验证规则 "%s"', type));
                        return true;
                    }
                    fieldOps.validType[type] = $.fn.validator.rules[type](undefined, $.extend(true, {}, $.fn.validator.config[type], $.fn.validator.messages[type], param), true);
                    if (!fieldOps.placeholder && fieldOps.validType[type].placeholder) {
                        fieldOps.placeholder = fieldOps.validType[type].placeholder;
                    }
                });
                // 处理默认显示
                let tagName = $field.get(0).tagName;
                let _triggerEvent = 'blur';
                let $help, $feedback, inputType, helpCheck = false;

                if ("INPUT" === tagName) {
                    inputType = $field.attr('type');
                    if ('checkbox' === inputType || 'radio' === inputType) {
                        let $box;
                        helpCheck = true;
                        if ('checkbox' === inputType) {
                            $box = $field.closest('.checkbox').parent();
                        } else {
                            $box = $field.closest('.radio').parent();
                        }

                        $feedback = $box.children('.form-control-feedback');
                        if ($feedback.length < 1) {
                            $feedback = $('<i class="form-control-feedback fa"></i>').appendTo($box);
                        }
                        $help = $field.children('.help-block');
                        if ($help.length < 1) {
                            $help = $('<div class="help-block">' + fieldOps.placeholder + '</div>').appendTo($box);
                        }
                        // 因为 input-radio 和 input-checkbox 是组的概念，将同组都设置为触发器
                        $field = $box.find('[name="' + $field.attr('name') + '"]');
                    }
                }

                if (!helpCheck) {
                    $feedback = $field.siblings('.form-control-feedback');
                    if ($feedback.length < 1) {
                        $feedback = $('<i class="form-control-feedback fa"></i>').insertAfter($field);
                    }
                    $help = $field.siblings('.help-block');
                    if ($help.length < 1) {
                        $help = $('<div class="help-block">' + fieldOps.placeholder + '</div>').insertAfter($feedback);
                    }
                    $field.attr('placeholder', fieldOps.placeholder);
                }

                if ('checkbox' === inputType || 'radio' === inputType) {
                    _triggerEvent = 'click';
                } else if ('file' === inputType) {
                    _triggerEvent = 'change';
                } else if ('SELECT' === tagName) {
                    _triggerEvent = 'change';
                }

                // 将参数绑定到元素上
                fieldOps.$feedback = $feedback;
                fieldOps.$help = $help.hide();
                fieldOps.$field = $field;
                L.func.setOption($field, fieldOps);
                // 为元素绑定触发事件
                if ('blur' === _triggerEvent) { // input:text, textarea
                    $field.on('focus', L.events.fieldFocus);
                }
                $field.on(_triggerEvent, L.events.fieldValid);
            }
            op.$validFields = $validFields;
            //  组件事件绑定
            op.isSubmit = false;
            op.callback = H.toJson(op.callback);
            PM.setOption($form, op);
            PM.addTrigger($form);
            return op;
        },
        run: function ($form, op) {
            if (false === op) {
                return false;
            }
            return true;
        },
        func: {
        },
        events: {
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