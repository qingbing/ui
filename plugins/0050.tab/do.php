<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-20
 * Version      :   1.0
 */
ob_start();
var_dump(time());
var_dump($_GET);
var_dump($_POST);
var_dump($_POST);
var_dump($_POST);
$content = ob_get_clean();
echo json_encode([
    'code' => 0,
    'data' => $content,
]);