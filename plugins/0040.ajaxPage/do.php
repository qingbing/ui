<?php
// Get current page.
$page = isset($_POST['page']) ? $_POST['page'] : 1;
// Total page
$totalCount = 100;
// Get html.
$html = <<<EOD
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

$data = array(
    'page' => $page,
    'totalCount' => $totalCount,
    'html' => $html,
);
echo json_encode([
    'code' => 0,
    'data' => $data,
]);