<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-21
 * Version      :   1.0
 */
$header = [
    ['key' => 'operate', 'label' => '操作', 'width' => '400px'],
    ['key' => 'username', 'label' => '用户名', 'width' => '400px'],
    ['key' => 'name', 'label' => '姓名', 'width' => '300px'],
    ['key' => 'sex', 'label' => '性别', 'width' => '200px'],
    ['key' => 'age', 'label' => '年龄', 'width' => '100px'],
    ['key' => 'callback', 'label' => 'callback', 'width' => '100px'],
];
echo json_encode([
    'code' => '0',
    'data' => $header,
]);