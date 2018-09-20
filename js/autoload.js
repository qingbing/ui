/**
 * 参数管理类
 */
var ParamsManager = function (wn) {
    /**
     * 触发元素保存参数的名称
     * @type {string}
     * @private
     */
    this.__dataName = "__data__" + wn + "__";
    /**
     * 当前触发器
     * @type {jquery} element
     * @private
     */
    this.__currentTrigger = undefined;
    /**
     * 所有触发器
     * @type {Array}
     * @private
     */
    this.__triggers = [];
    /**
     * 添加触发器
     * @param $trigger
     */
    this.addTrigger = function ($trigger) {
        this.__triggers.push($trigger);
    };
    /**
     * 获取当前触发器
     * @returns {jquery}
     */
    this.getCurrentTrigger = function () {
        return this.__currentTrigger;
    };
    /**
     * 设置当前触发器
     * @returns {jquery}
     */
    this.setCurrentTrigger = function ($trigger) {
        this.__currentTrigger = $trigger;
    };
    /**
     * 获取触发器参数
     * @param $trigger
     * @returns {boolean}
     */
    this.getOption = function ($trigger) {
        if (!H.isDefined($trigger)) {
            $trigger = this.getCurrentTrigger();
        }
        if (!H.isDefined($trigger)) {
            return false;
        }
        return $trigger.data(this.__dataName);
    };
    /**
     * 设置触发器参数
     * @param $trigger
     * @param op
     */
    this.setOption = function ($trigger, op) {
        if (!H.isDefined($trigger)) {
            $trigger = this.getCurrentTrigger();
        }
        $trigger.data(this.__dataName, op);
    };
    /**
     * 遍历触发器并让触发器执行函数
     * @param callback
     */
    this.each = function (callback) {
        for (var i in this.__triggers) {
            callback(this.__triggers[i]);
        }
    }
};
var CP = {
    post: function (ajaxUrl, postData, callback, method) {
        if (!H.isDefined(method)) {
            method = 'POST';
        }
        var async = false, R; // 非异步（等待执行）
        if (H.isFunction(callback)) {
            // 当拥有回调函数是，表示异步
            async = true;
        }
        $.ajax({
            url: ajaxUrl,
            type: method,
            async: async,
            dataType: 'json',
            data: postData,
            success: function (rs) {
                if (0 !== rs.code) {
                    alert(rs.message);// todo
                }
                if (0 === rs.code) {
                    r = true;
                } else {
                    r = rs.message;
                }
            }
        });
        if (false === async) {
            return R;
        }
    }
};
/**
 * 定义一些常用的或自动导入的类
 */
var Loader = {
    __loadedPlugins: {},
    loadCss: function (path, basePath) {
        if (basePath) {
            H.loadCss(basePath + path);
        } else {
            H.loadCss(H.jsPath() + path);
        }
    },
    loadJs: function (path, callback, id) {
        H.loadJs(H.jsPath() + path, callback, id);
    },
    __loadPlugin: function (cName, js, callback, css) {
        if (!this.__loadedPlugins[cName]) {
            this.__loadedPlugins[cName] = true;
            H.isEmpty(css) || (this.loadCss(css));
            if (!H.isEmpty(js)) {
                this.loadJs(js, function () {
                    if (H.isFunction(callback)) {
                        callback();
                    }
                });
            } else if (H.isFunction(callback)) {
                callback();
            }
        } else if (H.isFunction(callback)) {
            callback();
        }
    },
    loadAlert: function () {
        this.__loadPlugin('alert', '/plugins/alert/jquery.alert.js');
    },
    dropdown: function ($triggers) {
        this.__loadPlugin('dropdown',
            '/plugins/dropdown/jquery.dropdown.js', function () {
                $triggers.dropdown();
            });
    },
    navbar: function ($triggers) {
        this.__loadPlugin('navbar',
            '/plugins/navbar/jquery.navbar.js', function () {
                $triggers.navbar();
            });
    },
    ajaxPage: function ($triggers) {
        this.__loadPlugin('ajaxPage',
            '/plugins/ajaxPage/jquery.ajaxPage.js', function () {
                $triggers.ajaxPage();
            });
    },
    tab: function ($triggers) {
        this.__loadPlugin('tab',
            '/plugins/tab/jquery.tab.js', function () {
                $triggers.tab();
            });
    },
    template: function ($triggers) {
        this.__loadPlugin('template',
            '/plugins/template/jquery.template.js', function () {
                $triggers.template();
            });
    },
    loadMoment: function (callback) {
        if (this.__isLoadedMoment) {
            return H.isFunction(callback) && callback();
        }
        this.loadJs('/plugins/moment.min.js', function () {
            Loader.__isLoadedMoment = true;
            H.isFunction(callback) && callback();
        });
    },
    configs: {
        'dropdown': '.w-dropdown',
        'navbar': '.w-navbar',
        'ajaxPage': '.w-ajax-page',
        'tab': '.w-tab',
        'template': '.w-template'
    }
};

jQuery(document).ready(function ($) {
    // 加载alert组件
    Loader.loadAlert();
    // 禁用一些class的事件
    $('.divider,.disabled,[disabled]').on('click', function (e) {
        H.preventDefault(e);
        H.stopPropagation(e);
    });
    // 自动加载组件
    H.each(Loader.configs, function (key, target) {
        var $targets = $(target);
        if ($targets.length > 0 && H.isFunction(Loader[key])) {
            Loader[key]($targets);
        }
    });
});