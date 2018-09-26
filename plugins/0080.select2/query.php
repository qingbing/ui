<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-25
 * Version      :   1.0
 */

if (isset($_POST['id'])) {
    echo json_encode([
        'code' => 0,
        'data' => [
            ['id' => $_POST['id'], 'text' => $_POST['id'] . " - {text}",]
        ],
    ]);
    exit;
}

$keyword = isset($_POST['keyword']) ? $_POST['keyword'] : 'k111';
$data = [];
for ($i = 0; $i < 10; $i++) {
    $tmp = [
        'id' => "id{$i}",
        'text' => "text{$i}-{$keyword}",
    ];
    array_push($data, $tmp);
}
echo json_encode([
    'code' => 0,
    'data' => $data,
]);