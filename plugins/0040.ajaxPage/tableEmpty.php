<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-21
 * Version      :   1.0
 */
$body = [];
$data = [
    'pageSize' => 10,
    'page' => 1,
    'pageCount' => 100,
    'data' => $body,
];
echo json_encode([
    'code' => 0,
    'data' => [],
]);