(function ($) {
    $.fn.extend({
        /**
         * main
         *      mode[full,auto,custom(width,height)]
         *      show-close-btn,layer-close,href,title
         *      fn:html-callback,html-content,close-callback
         * @param options
         * @returns {modal}
         */
        modal: function (options) {
            if (0 === $(this).length) {
                return this;
            }
            var GOptions = {
                'openedParams': []
            };

            var $box = $('#e-modal-id');
            if (0 === $box.length) {
                $box = $('<div class="w-modal-box" id="e-modal-id"><div class="w-modal-layer"></div><div class="w-modal-body">' +
                    '<div class="w-modal-header"><div class="w-modal-title"></div><a class="w-modal-close" href="javascript:void(0)"><span class="fa fa-close"></span></a></div>' +
                    '<div class="w-modal-content"></div>' +
                    '</div></div>').appendTo('body');
                // 关闭按钮
                $box.find('.w-modal-close').on('click', function (e) {
                    hideModal(true);
                    e.stopPropagation();
                });
            }
            GOptions.$box = $box.hide();
            GOptions.$layer = $box.find('.w-modal-layer');
            GOptions.$body = $box.find('.w-modal-body');
            GOptions.$header = $box.find('.w-modal-header');
            GOptions.$title = $box.find('.w-modal-title');
            GOptions.$closeBtn = $box.find('.w-modal-close');
            GOptions.$content = $box.find('.w-modal-content');

            computeWH();
            $(window).on('resize', function (e) {
                computeWH();
            });

            $(this).each(function () {
                var $this = $(this);
                // 扩展参数设置
                var ops = $.extend({
                    'mode': 'auto',
                    'width': '860',
                    'height': '400',
                    'showCloseBtn': true,
                    'layerClose': false,
                    'href': undefined,
                    'title': undefined,
                    'htmlCallback': undefined,
                    'htmlContent': undefined,
                    'closeCallback': undefined
                }, $this.data(), options);
                // 如果没有标题，不显示关闭按钮
                if (!ops.title) {
                    ops.showCloseBtn = false;
                    ops.layerClose = true;
                }
                if (E.isEmpty(ops.href)) {
                    var _h = $this.attr('href');
                    _h && (ops.href = _h);
                }
                if (ops.href) {
                    ops.type = 'iframe';
                    ops.src = ops.href;
                } else {
                    ops.type = 'content';
                    // htmlFn, callback
                    ops.htmlContent = E.toJson(ops.htmlContent);
                    if (!E.isFunction(ops.htmlContent)) {
                        return true;
                    }
                    ops.htmlCallback = E.toJson(ops.htmlCallback);
                }
                ops.closeCallback = E.toJson(ops.closeCallback);

                // 点击触发显示模态框
                $this.on('click', function (e) {
                    show();
                    e.stopPropagation();
                    e.preventDefault();
                });
                return true;
                // ==== 函数 start ====

                function getModalParams() {
                    var subOps = E.merge(ops);
                    switch (subOps.mode) {
                        case 'full':
                            subOps.width = GOptions.W;
                            subOps.height = GOptions.H;
                            break;
                        case 'auto':
                            subOps.width = GOptions.W - 100;
                            subOps.height = GOptions.H - 100;
                            break;
                        default :
                            subOps.width = subOps.width < GOptions.W ? subOps.width : GOptions.W;
                            subOps.height = subOps.height < GOptions.H ? subOps.height : GOptions.H;
                            break;
                    }
                    subOps.marginTop = -subOps.height / 2;
                    subOps.marginLeft = -subOps.width / 2;
                    return subOps;
                }

                // 显示模态框
                function show() {
                    var subOps = getModalParams();
                    GOptions.$body.css({
                        width: subOps.width,
                        height: subOps.height,
                        marginTop: subOps.marginTop,
                        marginLeft: subOps.marginLeft
                    });
                    if (subOps.title) {
                        GOptions.$title.html(subOps.title);
                        GOptions.$header.show();
                        GOptions.$content.height(subOps.height - GOptions.$header.outerHeight());
                        subOps.showCloseBtn ? GOptions.$closeBtn.show() : GOptions.$closeBtn.hide();
                    } else {
                        GOptions.$header.hide();
                        GOptions.$content.height(subOps.height);
                    }
                    // Bind event to close modal for layer.
                    if (ops.layerClose) {
                        GOptions.$layer.on('click', eventClose);
                    }

                    if (ops.type == 'iframe') {
                        GOptions.$content.addClass('w-modal-frame-box');
                        GOptions.$content.empty().html('<iframe class="w-modal-frame" src="' + ops.src + '" frameborder="0" scrolling="auto" allowtransparency="1"></iframe>');
                    } else {
                        GOptions.$content.removeClass('w-modal-frame-box');
                        GOptions.$content.empty();
                        GOptions.$content.html(ops.htmlContent());
                        if (E.isFunction(ops.htmlCallback)) {
                            ops.htmlCallback(GOptions.$content);
                        }
                    }
                    GOptions.openedParams.push(subOps);
                    GOptions.$box.show();
                }

                // ==== 函数 end ====
            });
            // 计算页面 client 的高度和宽度
            function computeWH() {
                GOptions = E.merge(GOptions, E.getClientWH(true));
            }

            // 标题上的关闭按钮事件
            function eventClose(e) {
                hideModal(true);
                e.stopPropagation();
            }

            // 关闭模态框
            if (!E.isDefined(window.modal)) {
                window.modal = {};
            }
            var hideModal = window.modal.hide = function (doNothing, reload, args) {
                var subOps = GOptions.openedParams.pop();
                GOptions.$box.hide();
                if (subOps.layerClose) {
                    GOptions.$layer.off('click', eventClose);
                }
                if (!subOps) return;
                if (doNothing) return;
                if (reload) {
                    window.location.reload();
                } else if (E.isFunction(subOps.closeCallback)) {
                    subOps.closeCallback(args);
                }
            };
            // 获取最新模态框的参数
            window.modal.getArguments = function () {
                return GOptions.openedParams[GOptions.openedParams.length - 1];
            };
            return this;
        }
    });
})(jQuery);