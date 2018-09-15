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
    __loadPlugin: function (cName, css, js, callback) {
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
    player: function ($triggers) {
        this.__loadPlugin('player', '/plugins/player/css/plugin.css',
            '/plugins/player/bootstrap.player.js', function () {
                $triggers.player();
            });
    },
    tab: function ($triggers) {
        this.__loadPlugin('tab', '/plugins/tab/css/plugin.css',
            '/plugins/tab/bootstrap.tab.js', function () {
                $triggers.bootTab();
            });
    },
    menu: function ($triggers) {
        this.__loadPlugin('tab', '/plugins/menu/css/plugin.css',
            '/plugins/menu/bootstrap.menu.js', function () {
                $triggers.menu();
            });
    },
    datePicker: function () {
        this.loadCss('/plugins/daterangepicker/daterangepicker.min.css');
        this.loadMoment(function () {
            Loader.loadJs('/plugins/daterangepicker/daterangepicker.min.js', function () {
                Loader.loadJs('/plugins/daterangepicker/bootstrap.picker.js');
            });
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
        'tab': '.w-tab',
        'player': '.w-player',
        'menu': '.w-menu',
        'datePicker': '.h-datePicker'
    }
};

(function ($) {
    H.each(Loader.configs, function (key, target) {
        var $targets = $(target);
        if ($targets.length > 0 && H.isFunction(Loader[key])) {
            Loader[key]($targets);
        }
    });
})(jQuery);