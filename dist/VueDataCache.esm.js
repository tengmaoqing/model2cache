/*!
 * VueDataCache.js v0.1.4
 * (c) 2014-2019 Teng Mao Qing
 * Released under the MIT License.
 */
import get from 'lodash/get';
import set from 'lodash/set';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var DEFAULT_GLOBAL_CACHE_KEY = '__TMQ_DEFAULT_KEY__';
var DEFAULT_OPTIONS_KEY = 'cacheKeys';
var MemCache = {};

/**
 * 默认存储在 LocalStore，
 * 可以配置存在内存中，在 路由跳转时保存，刷新丢失。
 */

var AutoSaveForm = function () {
  function AutoSaveForm() {
    classCallCheck(this, AutoSaveForm);

    this.init.apply(this, arguments);
  }

  createClass(AutoSaveForm, [{
    key: 'init',
    value: function init(vm) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.vm = vm;
      this.cacheKeys = vm.$options[options.optionKey].map(function (item) {
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
      }) || [];
      this.cachePrefix = vm.$options.cachePrefix || options.cachePrefix || DEFAULT_GLOBAL_CACHE_KEY;
      this.MemCache = MemCache;
    }
  }, {
    key: 'getLocalDate',
    value: function getLocalDate(key) {
      var cachev = localStorage.getItem('' + this.cachePrefix + key);
      if (!cachev) {
        return get(this.vm, key);
      }
      return JSON.parse(cachev);
    }
  }, {
    key: 'getMemData',
    value: function getMemData(key) {
      return this.MemCache[key];
    }
  }, {
    key: 'setLocalDate',
    value: function setLocalDate(key, v) {
      localStorage.setItem('' + this.cachePrefix + key, JSON.stringify(v));
    }
  }, {
    key: 'setMemData',
    value: function setMemData(key, v) {
      this.MemCache[key] = v;
    }
  }, {
    key: 'applyData',
    value: function applyData() {
      var _this = this;

      this.cacheKeys.forEach(function (_ref) {
        var key = _ref.key,
            useLocalStore = _ref.useLocalStore;

        var v = '';
        if (useLocalStore) {
          v = _this.getLocalDate(key);
        } else {
          v = _this.getMemData(key);
        }
        set(_this.vm, key, v);
      });
    }
  }, {
    key: 'watchData',
    value: function watchData() {
      var _this2 = this;

      this.watchs = this.cacheKeys.map(function (_ref2) {
        var key = _ref2.key,
            useLocalStore = _ref2.useLocalStore;

        return _this2.vm.$watch(key, function (nv) {
          if (useLocalStore) {
            _this2.setLocalDate(key, nv);
            return;
          }
          _this2.setMemData(key, nv);
        });
      });
    }
  }, {
    key: 'destory',
    value: function destory() {
      this.watchs.forEach(function (watchFn) {
        return watchFn();
      });
    }
  }, {
    key: 'reset',
    value: function reset() {}
  }]);
  return AutoSaveForm;
}();

var AutoSaveFormForVue = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.optionKey = options.optionKey || DEFAULT_OPTIONS_KEY;
    Vue.mixin({
      mounted: function mounted() {
        if (!this.$options[options.optionKey]) {
          return;
        }
        this.$autoSave = new AutoSaveForm(this, options);
        this.$autoSave.applyData();
        this.$autoSave.watchData();
      },
      destroyed: function destroyed() {
        if (!this.$options[options.optionKey]) {
          return;
        }
        this.$autoSave.destory();
      }
    });
  }
};

export default AutoSaveFormForVue;
