/*!
 * mobileSwitcher.js
 * (c) 2011-2021 bobliao
 * Released under the MIT License.
 */

import jquery from 'jquery';
import 'jquery.easing';

window.$ = jquery;
window.jQuery = jquery;

//鼠标控制器
window.tc = {
    //当前鼠标所在位置
    nowPosition: { x: 0, y: 0 },
    tPointTime: 20,
    lastTimePosition: { x: 0, y: 0 },
    moveSpeed: { x: 0, y: 0 },
    moveDirection: { x: 'n', y: 'n' },
    //[{ 'funcName': 'goodJob', 'func': function () { alert('aa'); } }, { 'funcName': 'nice', 'func': function () { alert('bb'); } }];
    //鼠标移动的预设方法
    tMReserveFunction: [],
    //鼠标左键弹上的预设方法
    tUReserveFunction: [],
    //向鼠标移动事件数组中注册一个事件
    addTMoveFunc: function (name, callBack) {
        this.tMReserveFunction.push({ 'funcName': name, 'func': callBack });
    },
    //向鼠标弹起事件数组中注册一个事件
    addTUpFunc: function (name, callBack) {
        this.tUReserveFunction.push({ 'funcName': name, 'func': callBack });
    },
    //移除鼠标移动事件数组中的某个方法
    removeTMRFunc: function (name) {
        var tempArr = [];
        for (var i = 0; i < this.tMReserveFunction.length; i++) {
            var functionPro = this.tMReserveFunction[i];
            if (functionPro.funcName != name) {
                tempArr.push(functionPro);
            }
        }
        this.tMReserveFunction = [];
        this.tMReserveFunction = tempArr;
    },
    //移除鼠标弹起事件数组中的某个方法
    removeTURFunc: function (name) {
        var tempArr = [];
        for (var i = 0; i < this.tUReserveFunction.length; i++) {
            var functionPro = this.tUReserveFunction[i];
            if (functionPro.funcName != name) {
                tempArr.push(functionPro);
            }
        }
        this.tUReserveFunction = [];
        this.tUReserveFunction = tempArr;
    },
    findTouchLastPosition: function () {
        var self = this;
        //鼠标测点
        this.timeMouse();
        //启动测点器，检测鼠标的移动

        var timer = setInterval(function () {
            //鼠标测点
            self.timeMouse.call(self);
        }, this.tPointTime);
    },
    timeMouse: function () {
        //计算鼠标的X速度
        tc.moveSpeed.x = tc.lastTimePosition.x - tc.nowPosition.x;
        //计算鼠标的Y速度
        tc.moveSpeed.y = tc.lastTimePosition.y - tc.nowPosition.y;

        //计算鼠标移动方向
        if (tc.moveSpeed.x > 0) {
            //如果鼠标X速度大于零视为往左移动
            tc.moveDirection.x = 'l';
        }
        if (tc.moveSpeed.x < 0) {
            //如果鼠标X速度小于零视为往右移动
            tc.moveDirection.x = 'r';
        }
        if (tc.moveSpeed.x == 0) {
            //否则就是没有移动方向
            tc.moveDirection.x = 'n';
        }

        if (tc.moveSpeed.y > 0) {
            //如果鼠标Y速度大于零视为往上移动
            tc.moveDirection.y = 'u';
        }
        if (tc.moveSpeed.y < 0) {
            //如果鼠标Y速度小于零视为往下移动
            tc.moveDirection.y = 'd';
        }
        if (tc.moveSpeed.y == 0) {
            //否则就是没有移动方向
            tc.moveDirection.y = 'n';
        }

        //在此之前视为上次的移动位置有效
        tc.lastTimePosition.x = tc.nowPosition.x;
        tc.lastTimePosition.y = tc.nowPosition.y;
    }
}

$(document).ready(function () {
    tc.findTouchLastPosition();
});

document.addEventListener('touchstart', function (touchEvent) {

    tc.nowPosition.x = touchEvent.changedTouches[0].clientX;
    tc.nowPosition.y = touchEvent.changedTouches[0].clientY;
}, false);

document.addEventListener('touchmove', function (touchEvent) {
    if (touchEvent.changedTouches.length > 1) {
        return;
    }
    tc.nowPosition.x = touchEvent.changedTouches[0].clientX;
    tc.nowPosition.y = touchEvent.changedTouches[0].clientY;
    //运行预设方法
    if (tc.tMReserveFunction.length != 0) {
        for (var i = 0; i < tc.tMReserveFunction.length; i++) {
            var functionPro = tc.tMReserveFunction[i];
            functionPro.func.call(this, touchEvent);
        }
    }
    try {
        touchEvent.cancelBubble = true
        touchEvent.stopPropagation();
        touchEvent.preventDefault()
    } catch (_e) { }
}, false);

document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    passive: false
});

document.addEventListener('touchend', function (touchEvent) {
    //运行预设方法
    if (tc.tUReserveFunction.length != 0) {
        for (var i = 0; i < tc.tUReserveFunction.length; i++) {
            var functionPro = tc.tUReserveFunction[i];
            functionPro.func.call(this, touchEvent);
        }
    }

}, false);