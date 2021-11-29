/*!
 * mobileSwitcher.js
 * (c) 2021-2021 bobliao
 * Released under the MIT License.
 */
//手机端/电脑端选择器
var _mobileSwitcher = function (_options) {
    var self = this;
    this.mobileLink = _options.mobileLink;
    this.pcLink = _options.pcLink;
    this.isMobileInv = _options.isMobileInv;
    this.init = function () {
        var mobile_bs = {
            versions: (function () {
                var u = navigator.userAgent
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile:
                        !!u.match(/AppleWebKit.*Mobile.*/) ||
                        (!!u.match(/AppleWebKit/) &&
                            u.indexOf('QIHU') &&
                            u.indexOf('QIHU') > -1 &&
                            u.indexOf('Chrome') < 0), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                }
            })(),
        }
        if (mobile_bs.versions.mobile) {
            if (
                mobile_bs.versions.android ||
                mobile_bs.versions.iPhone ||
                mobile_bs.versions.iPad ||
                mobile_bs.versions.ios
            ) {
                //如果当前站点版本不是手机版本
                //但是偏偏是用手机访问的
                //就跳转到手机版去
                if (!self.isMobileInv) {
                    window.location.href = self.mobileLink
                }
            }
        } else {
            //如果当前站点版本是手机版本
            //但是偏偏是用电脑访问的
            //就跳转到电脑版去
            if (self.isMobileInv) {
                window.location.href = self.pcLink
            }
        }
    }
}

export default _mobileSwitcher;