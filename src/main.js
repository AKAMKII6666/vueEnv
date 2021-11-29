import 'babel-polyfill';
//导入公用组件
import jquery from 'jquery';
import 'jquery.easing';
import common from 'common/common.js';

/**
 * 初始化系统
 */
let initSys = function () {
    //将公用组件初始化
    window.jquery = jquery;
    window.$ = jquery;
    window.sys = new common();
    //公用函数加载成功
    window.sys.init(function () {
        //完成公用组件的载入
        //console.write('系统已经载入完成.');
        $(window).resize(function () {
            sys.console.position();
        });
    });
    /**页面载入时 */
    $(docuemnt).ready(function () {
        alt('页面初始化完成');
    });
}

//适配高底浏览器
var userAgent = navigator.userAgent;
window.isOldBrowser = false;
//如果是老浏览器，比如说ie9之类的就使用老的jquery的版本（1.8.3）
//否则默认就使用新的版本就是上面import引入进来的版本
//下面这个是微信内置浏览器的判断
//Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6303004c)
if (userAgent.indexOf('MSIE') !== -1 || (!!window.ActiveXObject || "ActiveXObject" in window) || userAgent.indexOf("WindowsWechat") !== -1) {
    window.isOldBrowser = true;
    console.log("老式浏览器.");
    require(['common/scripts/jquery-lowVersion.js'], function (_jquery) {
        window.jquery = _jquery.default;
        window.$ = _jquery.default;
        initSys();
    });
} else {
    //如果i是现代浏览器就直接初始化系统
    console.log("现代浏览器.");
    initSys();
}






