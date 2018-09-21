<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-21
 * Version      :   1.0
 */

$page = isset($_POST['page']) ? $_POST['page'] : 1;
$body = [
    ['username' => 'xxx_user_01' . $page, 'name' => 'name_01', 'sex' => 'sex_01', 'age' => '10', 'xx' => '10'],
    ['username' => 'xxx_user_02' . $page, 'name' => 'name_02', 'sex' => 'sex_02', 'age' => '20', 'xx' => '20'],
    ['username' => 'xxx_user_03' . $page, 'name' => 'name_03', 'sex' => 'sex_03', 'age' => '30', 'xx' => '30'],
    ['username' => 'xxx_user_04' . $page, 'name' => 'name_04', 'sex' => 'sex_04', 'age' => '40', 'xx' => '40'],
    ['username' => 'xxx_user_05' . $page, 'name' => 'name_05', 'sex' => 'sex_05', 'age' => '50', 'xx' => '50'],
];
$data = [
    'page' => $page,
    'pageSize' => 10,
    'totalPage' => 100,
    'data' => $body,
];
echo json_encode([
    'code' => 0,
    'data' => $data,
]);