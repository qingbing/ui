(function ($) {
    var L = {
        options: {
            required: {direction: 'r', tipMsg: '* 必填 *', emptyMsg: '* 必填 *'},
            email: {direction: 'r', tipMsg: '输入邮箱地址', emptyMsg: '* 必填 *', errorMsg: '邮箱地址不合法', pattern: /\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/},
            url: {direction: 'r', tipMsg: '输入URL地址', emptyMsg: '* 必填 *', errorMsg: 'URL地址不合法', pattern: /^https?:\/\/[\w-]+(\.[\w-]+)+/i},
            ip: {direction: 'r', tipMsg: '输入IP地址.', emptyMsg: '* 必填 *', errorMsg: 'IP地址不合法', pattern: /^(1\d{2}|2[0-4]\d|25[0-4]|[1-9]\d?)(\.(1\d{2}|2[0-4]\d|25[0-4]|[1-9]?\d)){3}$/},// (1~255).(0~255).(0~255).(0~255)
            phone: {direction: 'r', tipMsg: '输入电话(010-6666666[-666])', emptyMsg: '* 必填 *', errorMsg: '电话不合法(010-6666666[-666])', pattern: /^0[1-9]\d{1,2}-[1-9]\d{6,7}(-\d{1,4})?$/},
            mobile: {direction: 'r', tipMsg: '输入手机号码.', emptyMsg: '* 必填 *', errorMsg: '手机号码不合法', pattern: /^0?1\d{10}$/},
            contact: {direction: 'r', tipMsg: '输入手机号码或电话号码.', emptyMsg: '* 必填 *', errorMsg: '联系方式不合法', pattern: /^(0[1-9]\d{1,2}-[1-9]\d{6,7}(-\d{1,4})?)|(0?1\d{10})$/},
            fax: {direction: 'r', tipMsg: '输入传真号(010-6666666[-666])', emptyMsg: '* 必填 *', errorMsg: '传真号码不合法', pattern: /^0[1-9]\d{1,2}-[1-9]\d{6,7}(-\d{1,4})?$/},
            zip: {direction: 'r', tipMsg: '输入邮政编码', emptyMsg: '* 必填 *', errorMsg: '邮政编码不合法', pattern: /^\d{6}$/},
            time: {direction: 'r', tipMsg: '输入时间(2000-01-01 01:01:01)', emptyMsg: '* 必填 *', errorMsg: '时间不合法(2000-01-01 01:01:01)', pattern: /^(\d{2})?\d{2}-[0|1]?\d-[0-3]?\d [0-2]?\d:[0-5]?\d:[0-5]?\d$/},
            date: {direction: 'r', tipMsg: '输入日期(2000-01-01)', emptyMsg: '* 必填 *', errorMsg: '日期不合法(2000-01-01).', pattern: /^(\d{2})?\d{2}-[0|1]?\d-[0-3]?\d$/},
            password: {direction: 'r', tipMsg: '输入6-18个字符的密码', emptyMsg: '* 必填 *', errorMsg: '密码不合法', pattern: /^.{6,18}$/},
            compare: {direction: 'r', tipMsg: '输入确认信息', emptyMsg: '* 必填 *', errorMsg: '确认信息不一致', compare: ''},
            string: {direction: 'r', tipMsg: '输入信息', emptyMsg: '* 必填 *', errorMsg: '输入信息不正确', pattern: /^(.|\s)+$/, minLength: false, minErrorMsg: '', maxLength: false, maxErrorMsg: ''},
            username: {direction: 'r', tipMsg: '输入用户名', emptyMsg: '* 必填 *', errorMsg: '用户名不合法', pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\.]{2,18}$/, minLength: 2, minErrorMsg: '', maxLength: 18, maxErrorMsg: ''},
            numeric: {direction: 'r', tipMsg: '输入一个数字', emptyMsg: '* 必填 *', errorMsg: '输入不合法', pattern: /^-?(0|([1-9]\d*))(\.\d{1,})?$/, minNum: false, minErrorMsg: '', maxNum: false, maxErrorMsg: ''},
            integer: {direction: 'r', tipMsg: '输入一个整数', emptyMsg: '* 必填 *', errorMsg: '输入不合法', pattern: /^-?(0|([1-9]\d*))$/, minNum: false, minErrorMsg: '', maxNum: false, maxErrorMsg: ''},
            money: {direction: 'r', tipMsg: '输入金额', emptyMsg: '* 必填 *', errorMsg: '输入金额不合法', pattern: /^(0|([1-9]\d*))(\.\d{1,2})?$/, minNum: false, minErrorMsg: '', maxNum: false, maxErrorMsg: ''},
            preg: {direction: 'r', tipMsg: '输入信息', emptyMsg: '* 必填 *', errorMsg: '输入信息不合法', pattern: ''},
            file: {direction: 'u', tipMsg: '', emptyMsg: '* 必填 *'},
            select: {direction: 'u', tipMsg: '', emptyMsg: '* 必填 *', minLength: false, minErrorMsg: '', maxLength: false, maxErrorMsg: ''},
            radioList: {direction: 'u', name: '', tipMsg: '', emptyMsg: '* 必填 *'},
            checkbox: {direction: 'u', tipMsg: '', emptyMsg: '* 必填 *'},
            checkboxList: {direction: 'u', name: '', tipMsg: '', emptyMsg: '* 必填 *', minLength: false, minErrorMsg: '', maxLength: false, maxErrorMsg: ''}
        },
        validateLib: {
            callback: function (val, ops, $fields) {
                if (!E.isFunction(ops.callback)) {
                    return true;
                }
                return ops.callback(val, ops, $fields);
            },
            ajaxUrl: function (val, ops) {
                if (E.isEmpty(ops.ajaxUrl) || !E.isString(ops.ajaxUrl)) {
                    return true;
                }
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
            },
            common: {
                pattern: function (val, ops) {
                    if (!E.isObject(ops.pattern) && !E.isFunction(ops.pattern)) {
                        return true;
                    }
                    if (ops.pattern.test(val)) {
                        return true;
                    }
                    return ops.errorMsg;
                },
                compare: function (val, ops) {
                    if (0 === ops.$compareObj.length) {
                        return ops.errorMsg;
                    }
                    if (E.isEqual(val, ops.$compareObj.val())) {
                        return true;
                    }
                    return ops.errorMsg;
                },
                minLength: function (val, ops) {
                    if (false === ops.minLength || !E.isNumber(ops.minLength)) {
                        return true;
                    }
                    if ((val.length - ops.minLength) >= 0) {
                        return true;
                    }
                    return ops.minErrorMsg;
                },
                maxLength: function (val, ops) {
                    if (false === ops.maxLength || !E.isNumber(ops.maxLength)) {
                        return true;
                    }
                    if ((val.length - ops.maxLength) <= 0) {
                        return true;
                    }
                    return ops.maxErrorMsg;
                },
                minNum: function (val, ops) {
                    if (false === ops.minNum || !E.isNumber(ops.minNum)) {
                        return true;
                    }
                    if ((val - ops.minNum) >= 0) {
                        return true;
                    }
                    return ops.minErrorMsg;
                },
                maxNum: function (val, ops) {
                    if (false === ops.maxNum || !E.isNumber(ops.maxNum)) {
                        return true;
                    }
                    if ((ops.maxNum - val) >= 0) {
                        return true;
                    }
                    return ops.maxErrorMsg;
                }
            }
        },
        showTip: function (fieldOption, msg, isError) {
            // Add or remove the error tip class.
            if (isError) {
                fieldOption.$tipObj.addClass('w-validate-tip-error');
            } else {
                fieldOption.$tipObj.removeClass('w-validate-tip-error');
            }
            if (fieldOption.tipId) {
                fieldOption.$tipObj.html(msg).show();
            } else {
                // Fill the message into the tip content object.
                fieldOption.$tipConObj.html(msg);

                var _p_o = fieldOption.$relativeTip.offsetParent().offset(), _t_o = fieldOption.$relativeTip.offset(), _pos = {};
                _pos = {
                    top: (_t_o.top - _p_o.top),
                    left: (_t_o.left - _p_o.left)
                };
                // compute position of tip object
                var top, left;
                switch (fieldOption.direction) {
                    case 'd':
                        top = _pos.top + fieldOption.$relativeTip.outerHeight() + 10;
                        left = _pos.left;
                        break;
                    case 'l':
                        top = _pos.top;
                        left = _pos.left - fieldOption.$tipObj.outerWidth() - 10;
                        break;
                    case 'r':
                        top = _pos.top;
                        left = _pos.left + fieldOption.$relativeTip.outerWidth() + 10;
                        break;
                    default :
                        top = _pos.top - fieldOption.$tipObj.outerHeight() - 10;
                        left = _pos.left;
                        break;
                }
                fieldOption.$tipObj.css({top: top, left: left}).show();
            }
        },
        hideTip: function (fieldOption) {
            fieldOption.$tipObj.hide();
        },
        validateField: function (fieldOption) {
            var $triggers = fieldOption.$triggers, val, r = true, _len = 0;
            switch (fieldOption.type) {
                case 'file':
                    // Empty validate.
                    val = $triggers.val();
                    if (fieldOption.allowEmpty && E.isEmpty(val)) {
                        L.hideTip(fieldOption);
                        return true;
                    } else if (!fieldOption.allowEmpty && E.isEmpty(val)) {
                        r = fieldOption.emptyMsg;
                    }
                    break;
                case 'radioList':
                    // Empty validate.
                    var $radio_obj = $triggers.filter(':checked');
                    if (fieldOption.allowEmpty && 0 === $radio_obj.length) {
                        L.hideTip(fieldOption);
                        return true;
                    } else if (!fieldOption.allowEmpty && 0 === $radio_obj.length) {
                        r = fieldOption.emptyMsg;
                    } else {
                        val = $radio_obj.val();
                    }
                    break;
                case 'checkbox':
                    // Empty validate.
                    if (fieldOption.allowEmpty && !$triggers.get(0).checked) {
                        L.hideTip(fieldOption);
                        return true;
                    } else if (!fieldOption.allowEmpty && !$triggers.get(0).checked) {
                        r = fieldOption.emptyMsg;
                    } else {
                        val = $triggers.val();
                    }
                    break;
                case 'checkboxList':
                    // Empty validate.
                    var $checkbox_obj = $triggers.filter(':checked');
                    _len = $checkbox_obj.length;
                    if (fieldOption.allowEmpty && 0 === _len) {
                        L.hideTip(fieldOption);
                        return true;
                    } else if (!fieldOption.allowEmpty && 0 === _len) {
                        r = fieldOption.emptyMsg;
                    } else {
                        val = $checkbox_obj.val();
                        E.isInteger(fieldOption.minLength) && fieldOption.minLength > 0 && _len < fieldOption.minLength && (r = fieldOption.minErrorMsg);
                        E.isInteger(fieldOption.maxLength) && fieldOption.maxLength > 0 && _len > fieldOption.maxLength && (r = fieldOption.maxErrorMsg);
                    }
                    break;
                case 'select':
                    // Empty validate.
                    val = $triggers.val();
                    if (fieldOption.allowEmpty && E.isEmpty(val)) {
                        L.hideTip(fieldOption);
                        return true;
                    } else if (!fieldOption.allowEmpty && E.isEmpty(val)) {
                        r = fieldOption.emptyMsg;
                    } else {
                        _len = fieldOption.$triggers.find('option:selected').length;
                        E.isInteger(fieldOption.minLength) && fieldOption.minLength > 0 && _len < fieldOption.minLength && (r = fieldOption.minErrorMsg);
                        E.isInteger(fieldOption.maxLength) && fieldOption.maxLength > 0 && _len > fieldOption.maxLength && (r = fieldOption.maxErrorMsg);
                    }
                    break;
                default : // compare, required
                    // Empty validate.
                    val = $triggers.val();
                    if ('required' == fieldOption.type) {
                        if (E.isEmpty(val)) {
                            r = fieldOption.emptyMsg;
                        }
                    } else if ('compare' != fieldOption.type) {
                        if (fieldOption.allowEmpty && E.isEmpty(val)) {
                            L.hideTip(fieldOption);
                            return true;
                        } else if (!fieldOption.allowEmpty && E.isEmpty(val)) {
                            r = fieldOption.emptyMsg;
                        }
                    }
                    if (true === r) {
                        var validateLib = L.validateLib.common;
                        for (var i in fieldOption) {
                            if (!E.isDefined(validateLib[i]) || !E.isFunction(validateLib[i])) {
                                continue;
                            }
                            if (true !== (r = validateLib[i](val, fieldOption))) {
                                break;
                            }
                        }
                    }
                    break;
            }
            // ajax-url
            if (true === r) {
                r = L.validateLib.ajaxUrl(val, fieldOption);
            }
            // callback
            if (true === r) {
                r = L.validateLib.callback(val, fieldOption, fieldOption.$triggers);
            }
            // show or hide for the result
            if (true === r) {
                L.hideTip(fieldOption);
            } else {
                L.showTip(fieldOption, r, true);
            }
            return r;
        },
        validateForm: function (ops) {
            var _rs = '', _t;
            E.each(ops.fieldOptions, function (i, fieldOption) {
                _t = L.validateField(fieldOption);
                if (true != _t) {
                    _rs += "\n" + _t;
                }
            });
            if ('' === _rs && E.isFunction(ops.callback)) {
                _rs = ops.callback(ops.$trigger);
            }
            return _rs;
        },
        btnResetForm: function (ops, $btn) {
            E.each(ops.fieldOptions, function (i, fieldOption) {
                L.hideTip(fieldOption);
            });
            if ($btn.is(':reset')) {
                return true;
            } else {
                ops.$trigger.get(0).reset();
                return false;
            }
        },
        btnValidateForm: function (ops, $btn) {
            L.validateForm(ops);
        },
        btnSubmitForm: function (ops, $btn) {
            if (true === ops.isSubmit) {
                alert(ops.subMsg);
            } else {
                var r = L.validateForm(ops);
                if (true === r || E.isEmpty(r)) {
                    ops.isSubmit = true;
                    if ($btn.is(':submit')) {
                        return true;
                    } else {
                        ops.$trigger.get(0).submit();
                        return false;
                    }
                } else {
                    ops.isSubmit = false;
                }
            }
            return false;
        }
    };
    $.fn.extend({
        /**
         * main : validate-btn, submit-btn, reset-btn, sub-msg, callback, allow-empty-field
         * field : ajax-url, callback, post-data, preg, pattern
         *      allow-empty, direction, tip-msg, empty-msg, error-msg
         *      min-length, min-num, min-error-msg, max-length, max-num, max-error-msg
         * @param options
         * @returns {validate}
         */
        validate: function (options) {
            $(this).each(function () {
                var $this = $(this);
                // 扩展参数设置
                var ops = $.extend({
                    'validateBtn': '#validateBtn',
                    'submitBtn': '#submitBtn',
                    'resetBtn': '#resetBtn',
                    'subMsg': '该表单您已经提交过啦',
                    'callback': undefined,
                    'allowEmptyField': false
                }, options, $this.data());
                var $fields = $this.find('[w-vtype]');
                if (0 === $fields.length && !ops.allowEmptyField) {
                    return true;
                }
                ops.$trigger = $this;
                ops.isSubmit = false;
                ops.hasError = false;
                ops.errorMsg = '';
                ops.fieldOptions = [];
                // callback
                if(ops.callback){
                    ops.callback = E.toJson(ops.callback);
                }
                // 循环每个表单验证
                $fields.each(function (i) {
                // reset form
                var $resetBtn = $(ops.resetBtn);
                if ($resetBtn.length > 0) {
                    $resetBtn.bind('click', function (e) {
                        return L.btnResetForm(ops, $(this));
                    });
                }
                // Validate the form box.
                var $validateBtn = $(ops.validateBtn);
                if (0 !== $validateBtn.length) {
                    $validateBtn.bind('click', function (e) {
                        return L.btnValidateForm(ops, $(this));
                    });
                }
                // Validate and submit the form box.
                var $submitBtn = $(ops.submitBtn);
                if ($submitBtn.length > 0) {
                    $submitBtn.bind('click', function (e) {
                        return L.btnSubmitForm(ops, $(this));
                    });
                }
                return true;
            });
            return this;
        }
    });
})(jQuery);