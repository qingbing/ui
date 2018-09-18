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
        'template': '.w-template',
        'dropdown': '.w-dropdown',
        'navbar': '.w-navbar'
    }
};

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

jQuery(document).ready(function ($) {
    $('.divider,.disabled,[disabled]').on('click', function (e) {
        H.preventDefault(e);
        H.stopPropagation(e);
    });
    H.each(Loader.configs, function (key, target) {
        var $targets = $(target);
        if ($targets.length > 0 && H.isFunction(Loader[key])) {
            Loader[key]($targets);
        }
    });
});