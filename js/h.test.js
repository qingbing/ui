/*
// undefined 检查
console.log(typeof js === 'undefined'); // true
// 类型输出
console.log(H.type(23)); // number
// 字符串判断
console.log(H.isString(23)); // false
console.log(H.isString('23')); // true
// 数字判断
console.log(H.isNumber(23)); // true
console.log(H.isNumber(23.1)); // true
console.log(H.isNumber('23')); // true
console.log(H.isNumber('23.1')); // true
console.log(H.isNumber('23.1b')); // false
console.log(H.isNumber('23', true)); // false
console.log(H.isNumber('23.1', true)); // false
// 整数判断
console.log(H.isInteger(23)); // true
console.log(H.isInteger(23.1)); // false
console.log(H.isInteger('23')); // true
console.log(H.isInteger('23.1')); // false
console.log(H.isInteger('23.1b')); // false
console.log(H.isInteger('23', true)); // false
console.log(H.isInteger('23.1', true)); // false
// boolean 判断
console.log(H.isBoolean(true)); // true
console.log(H.isBoolean(false)); // true
console.log(H.isBoolean("true")); // false
console.log(H.isBoolean("false")); // false
console.log(H.isBoolean("true", false)); // true
console.log(H.isBoolean("false", false)); // true
console.log(H.isBoolean("true", true)); // false
console.log(H.isBoolean("false", true)); // false
// 函数判断
console.log(H.isFunction(false)); // false
// 对象判断
console.log(H.isObject(false)); // false
console.log(H.isObject({})); // true
console.log(H.isObject([])); // true
// 数组判断
console.log(H.isArray(false)); // false
console.log(H.isArray({})); // true
console.log(H.isArray([])); // true
// 空变量判断
console.log(H.isEmpty(undefined)); // true
console.log(H.isEmpty(null)); // true
console.log(H.isEmpty('')); // true
console.log(H.isEmpty('  ')); // true
console.log(H.isEmpty([])); // true
console.log(H.isEmpty({})); // true
console.log(H.isEmpty({'q':'1'})); // false

// 随机数获取
console.log(H.rand()); // 获取一个16位的随机数
console.log(H.random(10, 1000)); // 获取一个10到1000之间的随机数（闭区间）
// 对象排序
console.log(H.ksort({a: 'a', z: 'a', d: 'a', c: 'a', b: 'd'}));
// 判断是否在设置键值
console.log(H.isSet('ka', {'ka':'a', 'kb':'a'}));
// 判断是否在对象之中
console.log(H.inObject('a', {'ka':'a', 'kb':'a'}));
// 数组遍历
H.each({ssss: '34', '444': 'xxx'}, function (key, val) {
    console.log('' + key + " : " + val);
});
// 对象hash
console.log(H.hash({a: 'a', z: 'a', d: 'a', c: 'a', b: 'd'}));
// 对象转换成json字符串
console.log(H.toString({name: 'qingbing', users: [{"name": "好啦"}, {"name": "name11"}]}));
// json字符串转换成对象
console.log(H.toJson('{"name":"qingbing","users":[{"name":"好啦"},{"name":"name11"}]}'));


// 字符串去除空
console.log(H.trim('  sssss  xxxx   ')); // sssss  xxxx
console.log(H.trim('  sssss  xxxx   ').length); // 11


// 构建query参数
// xx=8&name=qingbing&version=1&users[0][id]=5&users[1][id]=7&users[1][name]=u7&0=1&1=2
console.log(H.buildQuery('xx=8', {name:'qingbing', version : 1.0, users : [{id:5},{id:7,name:'u7'}]}, [1, 2]));
// 创建URL
console.log(H.createUrl('i/php', {name: 'n1', sex: 's1'})); // i/php?name=n1&sex=s1

// 加载css
H.loadCss('css/component.css');
// 加载js
H.loadJs('js/plugins/bootstrap.tab.js');
H.loadJs('js/plugins/bootstrap.tab.js', 'documentId');
H.loadJs('js/plugins/bootstrap.tab.js', function (hs) {
    console.log(hs);
    alert(1)
});
// 加载远程js
H.remoteJson('http://www.phpcorner.net/call.php', {
    'msg': 'this is message'
}, function (rs) {
    console.log(rs);
});

// 页面刷新
// H.reload();
// 页面重定向
H.redirect('http://ssd.php', {name: 'qingbing'});
// 获取当前脚本的script路径
console.log(H.jsPath());
// 获取当前项目的css路径
console.log(H.cssPath());
*/
// cookie 使用
// 设置cookie
// H.setCookie('name', {good: 'go', sex: 'xx'});
// 获取cookie
// console.log(H.getCookie('name'));
// 删除cookie
// console.log(H.delCookie('name'));
// 清除cookie
// console.log(H.flushCookie());
