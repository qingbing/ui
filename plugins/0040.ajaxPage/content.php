<?php
$post = var_export($_POST, true);
// Get html.
$html = <<<EOD
<pre>{$post}</pre>
<p> ---- Test Content ---- 1</p>
<p> ---- Test Content ---- 2</p>
<p> ---- Test Content ---- 3</p>
<p> ---- Test Content ---- 4</p>
<p> ---- Test Content ---- 5</p>
<p> ---- Test Content ---- 6</p>
<p> ---- Test Content ---- 7</p>
<p> ---- Test Content ---- 8</p>
<p> ---- Test Content ---- 9</p>
<p> ---- Test Content ---- 10</p>
EOD;

echo json_encode([
    'code' => 0,
    'data' => $html,
]);