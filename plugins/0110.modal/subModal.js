function closeCallback($trigger) {
    console.log($trigger);
    return {
        rand: H.rand(),
        site: 'phpcorner.net',
        author: 'Charles'
    }
}

jQuery(function () {
    // 关闭父页面 modal
    $('.MODAL-CLOSE').on('click', function (e) {
        parent.modal.hide(true);
        H.preventDefault(e);
    });
    // 关闭父页面 modal, 并刷新父页面
    $('.MODAL-CLOSE-RELOAD').on('click', function (e) {
        parent.modal.hide(false, true);
        H.preventDefault(e);
    });
    // 关闭父页面 modal, 并执行父页面 modal 的回调函数
    $('.MODAL-CLOSE-CALLBACK').on('click', function (e) {
        let callback = $(this).data('callback');
        if (H.isDefined(callback)) {
            callback = H.toJson(callback);
            parent.modal.hide(false, false, callback($(this)));
        } else {
            parent.modal.hide(true);
        }
        H.preventDefault(e);
    });
});