<?php
// Get current page.
$page = isset($_POST['page']) ? $_POST['page'] : 1;
// Total page
$totalPage = 100;
$get = var_export($_GET, true);
// Get html.
$html = <<<EOD
<pre>{$get}</pre>
<p> ---- Test {$page} ---- 1</p>
<p> ---- Test {$page} ---- 2</p>
<p> ---- Test {$page} ---- 3</p>
<p> ---- Test {$page} ---- 4</p>
<p> ---- Test {$page} ---- 5</p>
<p> ---- Test {$page} ---- 6</p>
<p> ---- Test {$page} ---- 7</p>
<p> ---- Test {$page} ---- 8</p>
<p> ---- Test {$page} ---- 9</p>
<p> ---- Test {$page} ---- 10</p>
EOD;

echo json_encode([
    'code' => 0,
    'data' => [
        'page' => $page,
        'totalPage' => $totalPage,
        'res' => $html,
    ],
]);