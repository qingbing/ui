<?php
$output = [
    'message' => isset($_REQUEST['msg']) ? $_REQUEST['msg'] : 'no message',
    'data' => [
        'time' => date('Y-m-d H:i:s')
    ],
    'code' => 0,
];
if (isset($_GET['H_CALLBACK']) && $_GET['H_CALLBACK']) {
    echo $_GET['H_CALLBACK'] . '(' . json_encode($output) . ')';
} else {
    if (!headers_sent()) header('Content-type: application/json');
    echo json_encode($output);
}