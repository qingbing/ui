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
            // 标题上的关闭按钮事件
            function eventClose(e) {
                hideModal(true);
                e.stopPropagation();
            }
            return this;
        }
    });
})(jQuery);