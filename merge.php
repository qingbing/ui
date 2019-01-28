<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2019-01-28
 * Version      :   1.0
 */
// main css
$arr1 = [
    "css/resource/reset.css",
    "css/resource/main.css",
    "css/resource/row-col.css",
    "css/resource/alert.css",
    "css/resource/label.css",
    "css/resource/button.css",
    "css/resource/img.css",
    "css/resource/blockquote.css",
    "css/resource/embed.css",
    "css/resource/media.css",
    "css/resource/table.css",
    "css/resource/text.css",
    "css/resource/bg.css",
    "css/resource/jumbotron.css",
    "css/resource/visible.css",
    "css/resource/form.css",
    "css/resource/list.css",
    "css/resource/breadcrumb.css",
    "css/resource/page.css",
    "css/resource/panel.css",
    "css/resource/progress.css",
    "css/resource/thumbnail.css",
];
$arr2 = [
    "js/plugins/ajaxPage/css/main.css",
    "js/plugins/alert/css/main.css",
    "js/plugins/checkbox/css/main.css",
    "js/plugins/daterange/css/main.css",
    "js/plugins/dropdown/css/main.css",
    "js/plugins/menu/css/main.css",
    "js/plugins/modal/css/main.css",
    "js/plugins/navbar/css/main.css",
    "js/plugins/player/css/main.css",
    "js/plugins/tab/css/main.css",
    "js/plugins/validate/css/main.css",
];
$arr = $arr1;
$arr = $arr2;
$arr = array_unique($arr);

try {
    $R = [];
    foreach ($arr as $file) {
        if (!file_exists($file)) {
            throw new Exception("不存在的文件:" + $file);
        }
        $content = trim(file_get_contents($file));
        if (empty($content)) {
            continue;
        }
        $R[] = "/* {$file} */";
        $R[] = $content;
    }
    echo implode("\n", $R);
} catch (\Exception $e) {
    var_dump($e);
}


