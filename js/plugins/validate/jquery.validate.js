(function ($) {
    $.fn.validator = {
        config: {
            choice: {
                max: false,
                min: 1
            },
            checked: {
                allowEmpty: false
            },
            compare: {
                compareTarget: "#xxx"
            }
        },
        messages: {
            choice: {
                message: " * 请选择 * ",
                length: '请选中 %s 个选项',
                less: '请至少选中 %s 个选项',
                more: '最多只能选中 %s 个选项',
                between: '请选择 %s 至 %s 个选项'
            },
            checked: {
                message: "请勾选"
            },
            required: {
                message: " * 必填 * "
            },
            compare: {
                message: ""
            }
        },
        rules: {}
    };
    // 选项规则，用于 select 和 input:checkbox-group
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
        if (!op.allowEmpty && 0 === $field.filter(':checked').length) {
            return op.message;
        }
        return true;
    };
    // 必填项规则, 可以用于 select, input:file
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
    $.fn.validator.rules.compare = function ($field, op, init) {
        if (true === init) {
            // todo  doing
            return op;
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
                    tipMsg: undefined,
                    $group: $field.closest('.form-group').addClass('has-feedback')
                };
                H.each(validType, function (type, param) {
                    if ('tipMsg' === type) {
                        fieldOps.tipMsg = param;
                        return true;
                    }
                    if (!$.fn.validator.rules[type]) {
                        $.alert(H.replace('不存在的验证规则 "%s"', type));
                        return true;
                    }
                    fieldOps.validType[type] = $.fn.validator.rules[type](undefined, $.extend(true, {}, $.fn.validator.config[type], $.fn.validator.messages[type], param), true);
                    if (!fieldOps.tipMsg && fieldOps.validType[type].message) {
                        fieldOps.tipMsg = fieldOps.validType[type].message;
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
                            $help = $('<div class="help-block">' + fieldOps.tipMsg + '</div>').appendTo($box);
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
                        $help = $('<div class="help-block">' + fieldOps.tipMsg + '</div>').insertAfter($feedback);
                    }
                    $field.attr('placeholder', fieldOps.tipMsg);
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
            },
            showTip: function ($field, reset) {
                let fop = L.func.getOption($field);
                fop.$group.removeClass('has-success has-error');
                fop.$feedback.removeClass('fa-check fa-close');
                if (true === reset) {
                    fop.$help.hide();
                } else {
                    fop.$help.html(fop.tipMsg).show();
                }
            },
            showError: function ($field, msg) {
                let fop = L.func.getOption($field);
                fop.$group.removeClass('has-success').addClass('has-error');
                fop.$feedback.removeClass('fa-check').addClass('fa-close');
                fop.$help.html(msg).show();
            },
            showSuccess: function ($field) {
                let fop = L.func.getOption($field);
                fop.$group.removeClass('has-error').addClass('has-success');
                fop.$feedback.removeClass('fa-close').addClass('fa-check');
                fop.$help.hide();
            },
            checkField: function ($field) {
                let fop = L.func.getOption($field);
                var isSuccess = true;
                H.each(fop.validType, function (type, param) {
                    let message = $.fn.validator.rules[type](fop.$field, param);
                    if (true === message) {
                        return true;
                    }
                    isSuccess = false;
                    L.func.showError($field, message);
                    return false;
                });
                if (isSuccess) {
                    L.func.showSuccess($field);
                }
                return isSuccess;
            },
            validForm: function ($form) {
                let ops = PM.getOption($form);
                var isSuccess = true;
                ops.$validFields.each(function () {
                    if (true !== L.func.checkField($(this))) {
                        isSuccess = false;
                    }
                });
                if (true === isSuccess && H.isFunction(ops.callback)) {
                    isSuccess = ops.callback(ops);
                }
                return isSuccess;
            }
        },
        events: {
            fieldFocus: function (e) {
                L.func.showTip($(this));
            },
            fieldValid: function (e) {
                L.func.checkField($(this));
            },
            formReset: function (e) {
                let ops = PM.getOption(e.data.$form);
                ops.$validFields.each(function () {
                    L.func.showTip($(this), true);
                });

                let $btn = $(this);
                if ($btn.is(':reset')) {
                    return true;
                } else {
                    e.data.$form.get(0).reset();
                    return false;
                }
            },
            formValidate: function (e) {
                let isSuccess = L.func.validForm(e.data.$form);
                let ops = PM.getOption(e.data.$form);
                if (true === isSuccess) {
                    $.alert(ops.successMsg, 'success');
                } else {
                    $.alert(ops.failMsg, 'danger');
                }
            },
            formSubmit: function (e) {
                let ops = PM.getOption(e.data.$form);
                if (true === ops.isSubmit) {
                    $.alert(ops.subMsg, 'warning');
                } else {
                    let $btn = $(this);
                    let isSuccess = L.func.validForm(e.data.$form);
                    if (true === isSuccess) {
                        ops.isSubmit = true;
                        if ($btn.is(':submit')) {
                            return true;
                        } else {
                            e.data.$form.get(0).submit();
                            return false;
                        }
                    } else {
                        ops.isSubmit = false;
                    }
                }
                return false;
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