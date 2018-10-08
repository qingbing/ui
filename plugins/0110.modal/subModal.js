function closeCallback() {
    return {
        rand: H.rand(),
        site: 'phpcorner.net',
        author: 'Charles'
    }
}

jQuery(function () {
    // 关闭父页面 modal
    $('.MODAL-CLOSE').click(function (e) {
        parent.modal.hide(true);
        H.preventDefault(e);
    });
    // 关闭父页面 modal, 并刷新父页面
    $('.MODAL-CLOSE-RELOAD').click(function (e) {
        parent.modal.hide(false, true);
        H.preventDefault(e);
    });
    // 关闭父页面 modal, 并执行父页面 modal 的回调函数
    $('.MODAL-CLOSE-CALLBACK').click(function (e) {
        var _data = $(this).data();
        if (H.isDefined(_data.callback)) {
            _data.callback = H.toJson(_data.callback);
            parent.modal.hide(false, false, _data.callback());
        } else {
            parent.modal.hide(true);
        }
        H.preventDefault(e);
    });
});