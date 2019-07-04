function closeCallback(args) {
    console.log(args);
}

function htmlContent() {
    return "<div style='background:#d1d3d8'><div>test0001</div>" +
        "<div>test0001</div>" +
        "<button type='button' class='btn btn-default CLOSE_MODAL'>关闭</button>" +
        "<div>test0001</div>" +
        "<div>test0001</div>" +
        "<div>test0001</div>" +
        "<div>test0001</div>" +
        "<div>test0001</div>" +
        "<div>test0001</div>" +
        "<div>test0001</div></div>";
}

function htmlCallback($content) {
    console.log($content);
}

$(document).on('click', '.CLOSE_MODAL', function () {
    window.modal.hide(false, false, {
        name: 'charles',
        sex: 'man'
    });
});

jQuery(function () {
    setTimeout(function () {
        $('.w-modal').modal();
    }, 2000);

    $('#JsModal').on('click', function (e) {
        window.modal.open({
            'href': 'inner.html', // 必填参数
            'closeCallback': 'closeCallback'
        });
    });
});