<?php
for ($i = 0; $i < $_REQUEST['num']; $i++) {
	$out[] = array('title' => '测试数据' . (($_REQUEST['page'] - 1) * 10 + $i), 'description' => '测试简介简介简介测试简介简介简介', 'url' => 'http://www.google.com/', 'thumb' => 'http://ww4.sinaimg.cn/bmiddle/631fb009jw1dwb3bfdgr9j.jpg', 'category' => rand(11, 15));
}
echo json_encode(array('list' => $out, 'pageCount' => 6));
?>