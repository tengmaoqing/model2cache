/*!
 * Model2Cache.js v1.0.0
 * (c) 2019-2020 Teng Mao Qing
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var set = _interopDefault(require('lodash-es/set'));
var isFunction = _interopDefault(require('lodash-es/isFunction'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var _a;

var StoreType;

(function (StoreType) {
  StoreType[StoreType["localStorage"] = 1] = "localStorage";
  StoreType[StoreType["sessionStorage"] = 2] = "sessionStorage";
  StoreType[StoreType["memory"] = 3] = "memory";
})(StoreType || (StoreType = {}));

var Mem = {};
var storages = (_a = {}, _a[StoreType.localStorage] = window.localStorage, _a[StoreType.sessionStorage] = window.sessionStorage, _a[StoreType.memory] = {
  setItem: function setItem(key, value) {
    Mem[key] = value;
  },
  getItem: function getItem(key) {
    return Mem[key];
  },
  removeItem: function removeItem(key) {
    Mem[key] = null;
    delete Mem[key];
  }
}, _a);

var Store =
/** @class */
function () {
  function Store(storage, storeType) {
    if (storage) {
      this.storage = storage;
      return;
    }

    this.storage = storages[storeType];
  }

  Store.prototype.set = function (key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  };

  Store.prototype.get = function (key) {
    return JSON.parse(this.storage.getItem(key));
  };

  Store.prototype["delete"] = function (key) {
    return this.storage.removeItem(key);
  };

  return Store;
}();

var DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__';

var log = function log() {
  var arg = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    arg[_i] = arguments[_i];
  } // eslint-disable-next-line no-console


  console.log.apply(console, __spreadArrays(['[cache-data]:'], arg));
};

var warn = function warn() {
  var arg = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    arg[_i] = arguments[_i];
  } // eslint-disable-next-line no-console


  console.warn.apply(console, __spreadArrays(['[cache-data]:'], arg));
};

var Model2Cache =
/** @class */
function () {
  function Model2Cache() {
    var arg = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      arg[_i] = arguments[_i];
    }

    this.storeType = StoreType.localStorage;
    this.init.apply(this, arg);
  }

  Model2Cache.prototype.init = function (formModel, options, componentsOptions) {
    if (formModel === void 0) {
      formModel = [];
    }

    if (options === void 0) {
      options = {};
    }

    if (componentsOptions === void 0) {
      componentsOptions = {};
    }

    this.formModel = formModel;
    this.$cacheOptions = componentsOptions;

    if (Array.isArray(this.$cacheOptions)) {
      this.$cacheOptions = {
        cacheKeys: this.$cacheOptions || []
      };
    }

    this.$cacheOptions = __assign(__assign({}, options), this.$cacheOptions);
    this.isdebug = this.$cacheOptions.debug;
    this.cacheKeys = (this.$cacheOptions.cacheKeys || []).map(function (item) {
      var obj = {
        key: '',
        useLocalStore: true
      };

      if (typeof item === 'string') {
        obj.key = item;
      } else {
        Object.assign(obj, item);
      }

      return obj;
    });
    this.namespace = this.$cacheOptions.namespace || DEFAULT_GLOBAL_CACHE_KEY;
    this.store = new Store(null, this.storeType);
    this.applyData();
    this.watchData();
  };

  Model2Cache.prototype.getTruthKey = function (key) {
    return "" + this.namespace + key;
  };

  Model2Cache.prototype.applyData = function () {
    var _this = this;

    this.cacheKeys.forEach(function (_a) {
      var key = _a.key;

      var v = _this.store.get(_this.getTruthKey(key));

      if (!v) {
        return;
      }

      _this.isdebug && log('setModel', key, v);
      set(_this.formModel, key, v);
    });
  };

  Model2Cache.prototype.watchData = function () {
    var _this = this;

    if (!isFunction(this.$cacheOptions.watcher)) {
      this.isdebug && warn('需要提供一个 `options.watcher` 用来接收 `model` 的变化, 否则`model`的变化将不会被自动记录');
      return;
    }

    this.watchs = this.cacheKeys.map(function (_a) {
      var key = _a.key;
      return _this.$cacheOptions.watcher(key, function (nv) {
        _this.isdebug && log('watch', key, nv);

        _this.store.set(_this.getTruthKey(key), nv);
      });
    });
  };

  Model2Cache.prototype.destory = function () {
    if (!this.watchs) {
      return;
    }

    this.watchs.forEach(function (watchFn) {
      return watchFn();
    });
  };

  Model2Cache.prototype.deleteKey = function (key) {
    this.store["delete"](this.getTruthKey(key));
  };

  Model2Cache.prototype.clear = function (key) {
    var _this = this;

    if (key) {
      this.deleteKey(key);
      return;
    }

    this.cacheKeys.map(function (_a) {
      var key = _a.key;

      _this.deleteKey(key);
    });
  };

  return Model2Cache;
}();

var DEFAULT_OPTIONS_KEY = 'cache';
var VueCache = {
  install: function install(Vue, options) {
    if (options === void 0) {
      options = {};
    }

    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY;
    Vue.mixin({
      mounted: function mounted() {
        var _this = this;

        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$model2cache = new Model2Cache(this, __assign(__assign({}, options), {
          watcher: function watcher(key, cb) {
            return _this.$watch(key, cb);
          }
        }), this.$options[options.optionKey]);
      },
      destroyed: function destroyed() {
        if (!this.$options[options.optionKey]) {
          return;
        }

        this.$model2cache.destory();
      }
    });
  }
};

// }

var cache = {
  VueCache: VueCache,
  Model2Cache: Model2Cache
};

module.exports = cache;
