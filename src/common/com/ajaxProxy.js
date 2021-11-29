//全局默认存在jquery
//引入默认接口配置文件
import defaultCgiConfig from "./cgiConfig/default.json";

/*!
 * ajaxProxy.js
 * (c) 2014-2021 bobliao
 * Released under the MIT License.
 */
var _ajaxProxy = function () {
	const self = this;
	this.common = null;
	this.parent = null;

	this.account = null;

	//ajax请求链接
	this.ajaxPort = "";
	this.ajaxPortDev = "";
	this.ajaxPortPro = "";

	//环境变量，通过它来判要使用正式版的智能合约还是测试版的
	this.projEvn = process.env.NODE_ENV;
	if (this.projEvn === "development") {
		//简写环境变量
		this.projEvn = "dev";
	} else {
		//简写环境变量
		this.projEvn = "pro";
	}

	//初始化
	this.init = function (_common, _parent) {
		const $ = $;
		this.$ = $;
		self.$ = $;

		this.common = _common;
		this.parent = _parent;
	};

	/**
	 * 加载/更换配置
	 * @param {Object} _config  接口配置文件
	 */
	this.loadConfig = function (_config) {
		this.ajaxCGI = _config;
		this.ajaxPortDev = _config.devPort;
		this.ajaxPortPro = _config.proPort;
		//调试环境
		if (this.projEvn === "dev") {
			this.ajaxPort = this.ajaxPortDev;
		}

		//线上正式版本
		if (this.projEvn === "pro") {
			this.ajaxPort = this.ajaxPortPro;
		}
	};

	//先自我初始化一遍
	this.loadConfig(defaultCgiConfig);

	//检查登陆情况
	this.getIsLogin = function (_loginedCallBack, _unLoginCall) {
		if (self.account === null) {
			_unLoginCall();
		} else {
			_loginedCallBack();
		}
	};

	//获取登陆账号
	this.getLoginAccount = function () {
		return this.account;
	};

	//服务器状态处理器
	this.stateProcresser = function (_data, _apiName) {
		if (typeof _data.code !== "undefined") {
			if (this.projEvn === "dev") {
				if (Number(_data.code) === 500) {
					self.common.console.write("====开发环境提醒====");
					self.common.console.write("接口错误:");
					self.common.console.write("服务器内部错误！");
					self.common.console.write("来自:" + _apiName);
					self.common.console.write("接口名称:" + self.ajaxCGI[_apiName].url);
					self.common.console.write(_data.message);
					self.common.console.write("====开发环境提醒====");
					return;
				}

				if (Number(_data.code) === 502) {
					self.common.console.write("====开发环境提醒====");
					self.common.console.write("接口错误:");
					self.common.console.write("服务器内部错误！");
					self.common.console.write("来自:" + _apiName);
					self.common.console.write("接口名称:" + self.ajaxCGI[_apiName].url);
					self.common.console.write(_data.message);
					self.common.console.write("====开发环境提醒====");
					return;
				}

				if (Number(_data.code) === 404) {
					self.common.console.write("====开发环境提醒====");
					self.common.console.write("接口错误:");
					self.common.console.write("找不到文件或接口..");
					self.common.console.write("来自:" + _apiName);
					self.common.console.write("接口名称:" + self.ajaxCGI[_apiName].url);
					self.common.console.write(_data.message);
					self.common.console.write("====开发环境提醒====");
					return;
				}

				//数据为空就放开
				if (Number(_data.code) === 1008) {
					return _data.result;
				}

				if (Number(_data.code) !== 0) {
					self.common.console.write("====开发环境提醒====");
					self.common.console.write("接口错误:");
					self.common.console.write("未知错误！");
					self.common.console.write("来自:" + _apiName);
					self.common.console.write("接口名称:" + self.ajaxCGI[_apiName].url);
					self.common.console.write(_data.code);
					self.common.console.write(_data.message);
					self.common.console.write("====开发环境提醒====");
					return;
				}
			} else {
				//数据为空就放开
				if (Number(_data.code) === 1008) {
					return _data.result;
				}
				if (Number(_data.code) !== 0) {
					self.common.console.write("Server has temporarily asleep, Please try again later..");
					console.log("接口错误:");
					console.log("来自:" + _apiName);
					console.log("接口名称:" + self.ajaxCGI[_apiName].url);
					console.log(_data.code);
					console.log(_data.message);
					return;
				}
			}

			return _data.result;
		} else {
			return _data;
		}
	};

	/**
	 * 直接请求数据/推送数据
	 * @param {String or Object} _name  请求接口的名称或者参数
	 */
	this.fetch = function (_arg) {
		var config = {
			name: "",
			params: {},
			urlPar: "",
			dataType: "",
		};
		if (typeof _arg === "string") {
			config.name = _arg;
		} else {
			config = $.extend(config, _arg);
		}

		if (typeof this.ajaxCGI[config.name] === "undefined") {
			if (this.projEvn === "dev") {
				self.common.console.write("ajaxProxy::接口配置不存在:" + config.name);
			}
			return;
		}

		var cgi = this.ajaxCGI[config.name];
		var func = null;
		if (JSON.stringify(config.params) === "{}" && !(config.urlPar !== "" && JSON.stringify(config.urlPar) !== "{}") && typeof cgi.defaultPatams !== "undefined" && cgi.defaultPatams !== "") {
			if (cgi.paramsType === "url") {
				config.urlPar = cgi.defaultPatams;
			} else if (cgi.paramsType === "json") {
				config.params = cgi.defaultPatams;
			}
		}

		if (cgi.method.toLowerCase() === "get") {
			func = this.get;
		} else if (cgi.method.toLowerCase() === "post") {
			func = this.post;
		} else {
			if (this.projEvn === "dev") {
				self.common.console.write("ajaxProxy::接口配置文件错误:" + config.name + "   未表明请求方式!");
			}
			return;
		}
		return func(config.name, config.params, config.urlPar, config.dataType);
	};

	/**
	 * POST请求
	 * @param {String} _name 请求接口名称
	 * @param {Object} _params 请求参数，必须为json格式
	 * @param {String} _urlPar 放在url上的参数
	 * @param {String} _datatType 请求成功后的数据格式
	 * @returns 返回一个Promise对象参数为.then(_data, _status, _xhr,_ajaxObj)
	 * @error .catch(_xmlHr, _msg, _obj, _params)
	 */
	this.post = function (_name, _params, _urlPar, _datatType) {
		return new Promise(function (resolve, reject) {
			var ajaxObj = self.postAction(
				_name,
				_params,
				function (_data, _status, _xhr) {
					resolve(_data, _status, _xhr, ajaxObj);
				},
				function (_xmlHr, _msg, _obj, _params) {
					reject(_xmlHr, _msg, _obj, _params);
					throw new Error(_msg);
				},
				_urlPar,
				_datatType
			);
		});
	};

	/**
	 * GET请求
	 * @param {String} _name 请求接口名称
	 * @param {Object} _params 请求参数，必须为json格式
	 * @param {String} _urlPar 放在url上的参数
	 * @param {String} _datatType 请求成功后的数据格式
	 * @returns 返回一个Promise对象参数为.then(_data, _status, _xhr,_ajaxObj)
	 * @error .catch(_xmlHr, _msg, _obj, _params)
	 */
	this.get = function (_name, _params, _urlPar, _datatType) {
		return new Promise(function (resolve, reject) {
			var ajaxObj = self.getAction(
				_name,
				_params,
				function (_data, _status, _xhr) {
					resolve(_data, _status, _xhr, ajaxObj);
				},
				function (_xmlHr, _msg, _obj, _params) {
					reject(_xmlHr, _msg, _obj, _params);
					throw new Error(_msg);
				},
				_urlPar,
				_datatType
			);
		});
	};

	//系统专用ajaxPost
	/**
	 *
	 * @param {String} _name 请求接口名称
	 * @param {Object} _params 请求参数，必须为json格式
	 * @param {Function} _succCall 成功请求后的回调函数
	 * @param {Function} _faiCall 请求失败后的回调函数
	 * @param {String} _urlPar 放在url上的参数
	 * @param {String} _datatType 请求成功后的数据格式
	 * @returns  返回ajax对象
	 */
	this.postAction = function (_name, _params, _succCall, _faiCall, _urlPar, _datatType) {
		_urlPar = this.makeUrlPar(_urlPar);
		if (typeof _datatType === "undefined") {
			_datatType = "JSON";
		}
		var params = {
			url: this.ajaxPort + self.ajaxCGI[_name].url + _urlPar,
			type: "POST",
			data: _params,
			cache: false,
			dataType: _datatType,
			success: function (_data, _status, _xhr) {
				_succCall(self.stateProcresser(_data, _name), _status, _xhr);
			},
			error: _faiCall,
		};
		return this.arrowAjax(params);
	};

	//系统专用ajaxGet
	/**
	 *
	 * @param {String} _name 请求接口名称
	 * @param {Object} _params 请求参数，必须为json格式
	 * @param {Function} _succCall 成功请求后的回调函数
	 * @param {Function} _faiCall 请求失败后的回调函数
	 * @param {String} _urlPar 放在url上的参数
	 * @param {String} _datatType 请求成功后的数据格式
	 * @returns 返回ajax对象
	 */
	this.getAction = function (_name, _params, _succCall, _faiCall, _urlPar, _datatType) {
		_urlPar = this.makeUrlPar(_urlPar);
		if (typeof _datatType === "undefined") {
			_datatType = "JSON";
		}
		var params = {
			url: this.ajaxPort + self.ajaxCGI[_name].url + _urlPar,
			type: "GET",
			data: _params,
			cache: false,
			dataType: _datatType,
			success: function (_data, _status, _xhr) {
				_succCall(self.stateProcresser(_data, _name), _status, _xhr);
			},
			error: _faiCall,
		};
		return this.arrowAjax(params);
	};

	//制造url请求参数
	this.makeUrlPar = function (_par) {
		if (typeof _par === "undefined") {
			return "";
		}
		if (typeof _par === "object") {
			var resultStr = "?";
			for (var i in _par) {
				if (resultStr !== "?") {
					resultStr += "&";
				}
				resultStr += i + "=" + _par[i];
			}
			return resultStr;
		}
		if (typeof _par === "string") {
			return _par;
		}
	};

	//ajax请求堆
	this.ajaxArr = [];
	//ajax请求方法
	/**
	 *
	 * @param {Object} _params 参数
	 * @returns 返回ajax对象
	 */
	this.arrowAjax = function (_params) {
		//创建ajax参数集
		var ajaxItem = self.makeAjaxItem(_params);
		if (!ajaxItem) {
			return;
		}
		var aParams = {
			url: _params.url,
			type: _params.type,
			data: _params.data,
			cache: _params.cache,
			dataType: _params.dataType,
			xhrFields: {
				//跨域时是否携带cookie信息
				//withCredentials: true,
				//是否允许跨域访问
				"Access-Control-Allow-Origin": "*",
			},
			success: function (data, status, xhr) {
				_params.success(data, status, xhr);
			},
			error: function (xmlHr, msg, obj) {
				self.makeError(xmlHr, msg, obj, _params);
			},
			fail: function (xmlHr, msg, obj) {
				self.makeError(xmlHr, msg, obj, _params);
			},
		};
		if (typeof _params.contentType !== "undefined") {
			aParams.contentType = _params.contentType;
		}
		if (typeof _params.headers !== "undefined") {
			aParams.headers = _params.headers;
		}
		ajaxItem.ajax = $.ajax(aParams).fail(function (xmlHr, msg, obj) {
			self.makeError(xmlHr, msg, obj, _params);
		});

		this.ajaxArr.push(ajaxItem);
		return ajaxItem.ajax;
	};

	//创建ajax错误
	self.makeError = function (xmlHr, msg, obj, params) {
		//如果使用调试码开启了调试模式
		if (self.projEvn === "dev") {
			console.log(msg);
			console.log(params);
			console.log(obj);
			self.common.console.write("====开发环境提醒====");
			self.common.console.write("接口请求错误!");
			self.common.console.write("接口请求:" + params.url);
			self.common.console.write("状态:" + xmlHr.status);
			self.common.console.write("返回数据:" + xmlHr.responseText);
			self.common.console.write(msg);
			self.common.console.write("可能是数据接口服务未开启,或者没设置跨域,或是您的网络已经断开,请打开网络控制面板以查看请求情况..");
			self.common.console.write("====开发环境提醒====");
		}
		if (params.error) {
			params.error(xmlHr, msg, obj, params);
		}
	};

	//创建ajax参数集
	self.makeAjaxItem = function (params) {
		//间隔时间
		//默认为1秒内连续触发5次就拒绝。
		if (!params.delay) {
			params.delay = 1000;
		}
		if (!params.times) {
			params.times = 2;
		}
		var times = 0;
		//url,type,data,cache,dataType,success,error
		for (var i = 0; i < this.ajaxArr.length; i++) {
			if (params.url === this.ajaxArr[i].params.url && params.data === this.ajaxArr[i].params.data && +new Date() - this.ajaxArr[i].time < params.delay) {
				times++;
			}
		}
		if (times > params.times) {
			self.common.console.write({ str: "You got fast hand speed mate!!", e: $(window) });
			return false;
		}

		var ajaxItem = { ajax: null, params: params, time: +new Date() };
		return ajaxItem;
	};

	//往接口配置中增加接口配置
	/**
	 *
	 * @param {Object} _options 新的接口
	 */
	this.addCGI = function (_options) {
		for (var i in _options) {
			this.ajaxCGI[i] = _options[i];
		}
	};

	//ajax接口配置
	this.ajaxCGI = defaultCgiConfig;
};

export default _ajaxProxy;
