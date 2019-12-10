<?php
/**
 * Link         :   http://www.phpcorner.net
 * User         :   qingbing<780042175@qq.com>
 * Date         :   2018-09-25
 * Version      :   1.0
 */

if (isset($_POST['_type'])) {
    if ('query' === $_POST['_type']) {
        $keyword = isset($_POST['keyword']) ? $_POST['keyword'] : '';
        $data = [];
        for ($i = 0; $i < 10; $i++) {
            array_push($data, [
                'id' => "{$i}",
                'text' => "text-{$i}-{$keyword}",
            ]);
        }
        echo json_encode([
            'code' => 0,
            'data' => $data,
        ]);
    } else if ('init' === $_POST['_type']) {
        $R = [];
        foreach ($_POST['ids'] as $id) {
            array_push($R, [
                'id' => $id,
                'text' => "text - " . $id,
            ]);
        }
        echo json_encode([
            'code' => 0,
            'data' => $R,
        ]);
    }
}

