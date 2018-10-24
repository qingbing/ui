(function ($) {
    let PM = new ParamsManager('validate');
    let L = {
        messages: {},
        validTypes: {
            required: {
                messages: {
                    tipMsg: '请输入有效信息',
                    emptyMsg: '信息不能为空'
                },
                fixed: {
                    allowEmpty: false
                },
                rules: {
                    postData: '',
                    ajaxUrl: '',
                    callback: ''
                }
            },
            email: {
                messages: {
                    tipMsg: '请输入有效邮箱',
                    emptyMsg: '邮箱不能为空',
                    errorMsg: '邮箱输入无效'
                },
                fixed: {
                    pattern: /\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
                },
                rules: {
                    allowEmpty: true,
                    ajaxUrl: '',
                    callback: ''
                }
            }
        },
        config: {
            ops: {
                validateBtn: '#validateBtn',
                submitBtn: '#submitBtn',
                resetBtn: '#resetBtn',
                subMsg: '该表单您已经提交过啦',
                successMsg: '验证成功',
                failMsg: '没有全部通过验证',
                callback: undefined,
            }
        },
        initOp: function ($form, op) {
            let tp = PM.getOption($form);
            if (H.isDefined(tp)) {
                return tp;
            }
            // 验证字段检验并绑定
            let $validFields = $form.find('[data-valid-type]');
            for (let i = 0; i < $validFields.length; i++) {
                let $field = $validFields.eq(i);
                let validType = $field.data('valid-type');
                if (!H.isDefined(L.validTypes[validType])) {
                    continue;
                }

                let param = H.merge(H.merge(false, H.merge(L.validTypes[validType].messages, L.validTypes[validType].rules), H.toJson($field.data('valid-params'))), L.validTypes[validType].fixed);

                let fieldOps = {
                    type: validType,
                    $group: $field.closest('.form-group').addClass('has-feedback'),
                    param: {}
                };
                H.each(param, function (k, v) {
                    if ('' !== v) {
                        fieldOps.param[k] = v;
                    }
                });

                if (H.isFunction(L.validTypes[validType].initParam)) {
                    if (false === L.validTypes[validType].initParam(fieldOps.param)) {
                        continue;
                    }
                }

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
        validLib: {
            pattern: function (val, param) {
                if (param.pattern.test(val)) {
                    return true;
                }
                return param.errorMsg;
            },
            ajaxUrl: function (val, param) {
                var res = H.ajax(param.ajaxUrl)


                var r;
                $.ajax({
                    url: ops.ajaxUrl,
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: E.merge(ops.postData, {param: val}),
                    success: function (data) {
                        if (0 == data.code) {
                            r = true;
                        } else {
                            r = data.message;
                        }
                    }
                });
                if ('y' === r) {
                    return true;
                }
                return r;
                console.log(23);

                console.log(val, param);
                return true;

            },
            callback: function (val, param) {
                if (H.isFunction(param.callback)) {
                    return param.callback(val, param);
                }
                param.callback = H.toJson(param.callback);
                if (H.isFunction(param.callback)) {
                    return param.callback(val, param);
                } else {
                    delete param.callback;
                    return true;
                }
            }
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
                    fop.$help.html(fop.param.tipMsg).show();
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
                let rule = L.validTypes[fop.type];
                let val;
                if (H.isFunction(rule.getVal)) {
                    val = rule.getVal($field);
                } else {
                    val = $field.val();
                }

                if (fop.param.allowEmpty && H.isEmpty(val)) {
                    L.func.showTip($field, true);
                    return true;
                }
                if (H.isEmpty(val)) {
                    L.func.showError($field, fop.param.emptyMsg);
                    return false;
                }
                let isSuccess = true;
                H.each(fop.param, function (fname, v) {
                    if (H.isFunction(L.validLib[fname])) {
                        let res = L.validLib[fname](val, fop.param);
                        if (true !== res) {
                            isSuccess = false;
                            L.func.showError($field, res);
                            return false;
                        }
                    }
                });

                if (isSuccess) {
                    L.func.showSuccess($field);
                }
                return isSuccess;
            },
            validForm: function ($form) {
                let ops = PM.getOption($form);
                let isSuccess = true;
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

    /**
     */
    $.fn.extend({
        validate: function (settings) {
            H.isObject(settings) || (settings = {});
            $.extend(L.messages, settings.messages ? settings.messages : {});
            $.extend(L.rules, settings.rules ? settings.rules : {});

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