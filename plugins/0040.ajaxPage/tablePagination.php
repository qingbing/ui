<?php
$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 1;
$data = [];
$totalPage = 100;
for ($i = 0; $i < 10; $i++) {
    $tmp = [
        'operate' => "operate{$i}*{$page}",
        'username' => "username{$i}",
        'name' => "name{$i}",
        'sex' => "sex{$i}",
        'age' => "age{$i}",
    ];
    if ($i === 0) {
        $tmp['callback'] = var_export($_POST, true);
    }
    $data[$i] = $tmp;
}
echo json_encode([
    'code' => 0,
    'data' => [
        'page' => $page,
        'totalPage' => $totalPage,
        'res' => $data,
    ],
]);