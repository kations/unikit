/*! For license information please see 4.9b24aee3.chunk.js.LICENSE.txt */
  export default function _asyncIterator(iterable) {
    var method;
    if (typeof Symbol !== "undefined") {
      if (Symbol.asyncIterator) method = iterable[Symbol.asyncIterator];
      if (method == null && Symbol.iterator) method = iterable[Symbol.iterator];
    }
    if (method == null) method = iterable["@@asyncIterator"];
    if (method == null) method = iterable["@@iterator"]
    if (method == null) throw new TypeError("Object is not async iterable");
    return method.call(iterable);
  }
`,s.AwaitValue=l("7.0.0-beta.0")`
  export default function _AwaitValue(value) {
    this.wrapped = value;
  }
`,s.AsyncGenerator=l("7.0.0-beta.0")`
  import AwaitValue from "AwaitValue";

  export default function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null,
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg)
        var value = result.value;
        var wrappedAwait = value instanceof AwaitValue;

        Promise.resolve(wrappedAwait ? value.wrapped : value).then(
          function (arg) {
            if (wrappedAwait) {
              resume(key === "return" ? "return" : "next", arg);
              return
            }

            settle(result.done ? "return" : "normal", arg);
          },
          function (err) { resume("throw", err); });
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({ value: value, done: true });
          break;
        case "throw":
          front.reject(value);
          break;
        default:
          front.resolve({ value: value, done: false });
          break;
      }

      front = front.next;
      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    // Hide "return" method if generator return is not supported
    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; };

  AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };
  AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };
  AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };
`,s.wrapAsyncGenerator=l("7.0.0-beta.0")`
  import AsyncGenerator from "AsyncGenerator";

  export default function _wrapAsyncGenerator(fn) {
    return function () {
      return new AsyncGenerator(fn.apply(this, arguments));
    };
  }
`,s.awaitAsyncGenerator=l("7.0.0-beta.0")`
  import AwaitValue from "AwaitValue";

  export default function _awaitAsyncGenerator(value) {
    return new AwaitValue(value);
  }
`,s.asyncGeneratorDelegate=l("7.0.0-beta.0")`
  export default function _asyncGeneratorDelegate(inner, awaitWrap) {
    var iter = {}, waiting = false;

    function pump(key, value) {
      waiting = true;
      value = new Promise(function (resolve) { resolve(inner[key](value)); });
      return { done: false, value: awaitWrap(value) };
    };

    iter[typeof Symbol !== "undefined" && Symbol.iterator || "@@iterator"] = function () { return this; };

    iter.next = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }
      return pump("next", value);
    };

    if (typeof inner.throw === "function") {
      iter.throw = function (value) {
        if (waiting) {
          waiting = false;
          throw value;
        }
        return pump("throw", value);
      };
    }

    if (typeof inner.return === "function") {
      iter.return = function (value) {
        if (waiting) {
          waiting = false;
          return value;
        }
        return pump("return", value);
      };
    }

    return iter;
  }
`,s.asyncToGenerator=l("7.0.0-beta.0")`
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  export default function _asyncToGenerator(fn) {
    return function () {
      var self = this, args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }
`,s.classCallCheck=l("7.0.0-beta.0")`
  export default function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
`,s.createClass=l("7.0.0-beta.0")`
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i ++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  export default function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
`,s.defineEnumerableProperties=l("7.0.0-beta.0")`
  export default function _defineEnumerableProperties(obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }

    // Symbols are not enumerated over by for-in loops. If native
    // Symbols are available, fetch all of the descs object's own
    // symbol properties and define them on our target object too.
    if (Object.getOwnPropertySymbols) {
      var objectSymbols = Object.getOwnPropertySymbols(descs);
      for (var i = 0; i < objectSymbols.length; i++) {
        var sym = objectSymbols[i];
        var desc = descs[sym];
        desc.configurable = desc.enumerable = true;
        if ("value" in desc) desc.writable = true;
        Object.defineProperty(obj, sym, desc);
      }
    }
    return obj;
  }
`,s.defaults=l("7.0.0-beta.0")`
  export default function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);
      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }
    return obj;
  }
`,s.defineProperty=l("7.0.0-beta.0")`
  export default function _defineProperty(obj, key, value) {
    // Shortcircuit the slow defineProperty path when possible.
    // We are trying to avoid issues where setters defined on the
    // prototype cause side effects under the fast path of simple
    // assignment. By checking for existence of the property with
    // the in operator, we can optimize most of this overhead away.
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
`,s.extends=l("7.0.0-beta.0")`
  export default function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };

    return _extends.apply(this, arguments);
  }
`,s.objectSpread=l("7.0.0-beta.0")`
  import defineProperty from "defineProperty";

  export default function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = (arguments[i] != null) ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        defineProperty(target, key, source[key]);
      });
    }
    return target;
  }
`,s.inherits=l("7.0.0-beta.0")`
  import setPrototypeOf from "setPrototypeOf";

  export default function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }
`,s.inheritsLoose=l("7.0.0-beta.0")`
  import setPrototypeOf from "setPrototypeOf";

  export default function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    setPrototypeOf(subClass, superClass);
  }
`,s.getPrototypeOf=l("7.0.0-beta.0")`
  export default function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }
`,s.setPrototypeOf=l("7.0.0-beta.0")`
  export default function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
`,s.isNativeReflectConstruct=l("7.9.0")`
  export default function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;

    // core-js@3
    if (Reflect.construct.sham) return false;

    // Proxy can't be polyfilled. Every browser implemented
    // proxies before or at the same time as Reflect.construct,
    // so if they support Proxy they also support Reflect.construct.
    if (typeof Proxy === "function") return true;

    // Since Reflect.construct can't be properly polyfilled, some
    // implementations (e.g. core-js@2) don't set the correct internal slots.
    // Those polyfills don't allow us to subclass built-ins, so we need to
    // use our fallback implementation.
    try {
      // If the internal slots aren't set, this throws an error similar to
      //   TypeError: this is not a Boolean object.

      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      return true;
    } catch (e) {
      return false;
    }
  }
`,s.construct=l("7.0.0-beta.0")`
  import setPrototypeOf from "setPrototypeOf";
  import isNativeReflectConstruct from "isNativeReflectConstruct";

  export default function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      // NOTE: If Parent !== Class, the correct __proto__ is set *after*
      //       calling the constructor.
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    // Avoid issues with Class being present but undefined when it wasn't
    // present in the original call.
    return _construct.apply(null, arguments);
  }
`,s.isNativeFunction=l("7.0.0-beta.0")`
  export default function _isNativeFunction(fn) {
    // Note: This function returns "true" for core-js functions.
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
`,s.wrapNativeSuper=l("7.0.0-beta.0")`
  import getPrototypeOf from "getPrototypeOf";
  import setPrototypeOf from "setPrototypeOf";
  import isNativeFunction from "isNativeFunction";
  import construct from "construct";

  export default function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return construct(Class, arguments, getPrototypeOf(this).constructor)
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true,
        }
      });

      return setPrototypeOf(Wrapper, Class);
    }

    return _wrapNativeSuper(Class)
  }
`,s.instanceof=l("7.0.0-beta.0")`
  export default function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
      return !!right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }
`,s.interopRequireDefault=l("7.0.0-beta.0")`
  export default function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
`,s.interopRequireWildcard=l("7.14.0")`
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;

    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function (nodeInterop) {
      return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }

  export default function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
      return { default: obj }
    }

    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor
          ? Object.getOwnPropertyDescriptor(obj, key)
          : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
`,s.newArrowCheck=l("7.0.0-beta.0")`
  export default function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }
`,s.objectDestructuringEmpty=l("7.0.0-beta.0")`
  export default function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  }
`,s.objectWithoutPropertiesLoose=l("7.0.0-beta.0")`
  export default function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};

    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }
`,s.objectWithoutProperties=l("7.0.0-beta.0")`
  import objectWithoutPropertiesLoose from "objectWithoutPropertiesLoose";

  export default function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }
`,s.assertThisInitialized=l("7.0.0-beta.0")`
  export default function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
`,s.possibleConstructorReturn=l("7.0.0-beta.0")`
  import assertThisInitialized from "assertThisInitialized";

  export default function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return assertThisInitialized(self);
  }
`,s.createSuper=l("7.9.0")`
  import getPrototypeOf from "getPrototypeOf";
  import isNativeReflectConstruct from "isNativeReflectConstruct";
  import possibleConstructorReturn from "possibleConstructorReturn";

  export default function _createSuper(Derived) {
    var hasNativeReflectConstruct = isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        // NOTE: This doesn't work if this.__proto__.constructor has been modified.
        var NewTarget = getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return possibleConstructorReturn(this, result);
    }
  }
 `,s.superPropBase=l("7.0.0-beta.0")`
  import getPrototypeOf from "getPrototypeOf";

  export default function _superPropBase(object, property) {
    // Yes, this throws if object is null to being with, that's on purpose.
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = getPrototypeOf(object);
      if (object === null) break;
    }
    return object;
  }
`,s.get=l("7.0.0-beta.0")`
  import superPropBase from "superPropBase";

  export default function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = superPropBase(target, property);

        if (!base) return;

        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }
    return _get(target, property, receiver || target);
  }
`,s.set=l("7.0.0-beta.0")`
  import superPropBase from "superPropBase";
  import defineProperty from "defineProperty";

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = superPropBase(target, property);
        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);
          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            // Both getter and non-writable fall into this.
            return false;
          }
        }

        // Without a super that defines the property, spec boils down to
        // "define on receiver" for some reason.
        desc = Object.getOwnPropertyDescriptor(receiver, property);
        if (desc) {
          if (!desc.writable) {
            // Setter, getter, and non-writable fall into this.
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          // Avoid setters that may be defined on Sub's prototype, but not on
          // the instance.
          defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  export default function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }
`,s.taggedTemplateLiteral=l("7.0.0-beta.0")`
  export default function _taggedTemplateLiteral(strings, raw) {
    if (!raw) { raw = strings.slice(0); }
    return Object.freeze(Object.defineProperties(strings, {
        raw: { value: Object.freeze(raw) }
    }));
  }
`,s.taggedTemplateLiteralLoose=l("7.0.0-beta.0")`
  export default function _taggedTemplateLiteralLoose(strings, raw) {
    if (!raw) { raw = strings.slice(0); }
    strings.raw = raw;
    return strings;
  }
`,s.readOnlyError=l("7.0.0-beta.0")`
  export default function _readOnlyError(name) {
    throw new TypeError("\\"" + name + "\\" is read-only");
  }
`,s.writeOnlyError=l("7.12.13")`
  export default function _writeOnlyError(name) {
    throw new TypeError("\\"" + name + "\\" is write-only");
  }
`,s.classNameTDZError=l("7.0.0-beta.0")`
  export default function _classNameTDZError(name) {
    throw new Error("Class \\"" + name + "\\" cannot be referenced in computed property keys.");
  }
`,s.temporalUndefined=l("7.0.0-beta.0")`
  // This function isn't mean to be called, but to be used as a reference.
  // We can't use a normal object because it isn't hoisted.
  export default function _temporalUndefined() {}
`,s.tdz=l("7.5.5")`
  export default function _tdzError(name) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  }
`,s.temporalRef=l("7.0.0-beta.0")`
  import undef from "temporalUndefined";
  import err from "tdz";

  export default function _temporalRef(val, name) {
    return val === undef ? err(name) : val;
  }
`,s.slicedToArray=l("7.0.0-beta.0")`
  import arrayWithHoles from "arrayWithHoles";
  import iterableToArrayLimit from "iterableToArrayLimit";
  import unsupportedIterableToArray from "unsupportedIterableToArray";
  import nonIterableRest from "nonIterableRest";

  export default function _slicedToArray(arr, i) {
    return (
      arrayWithHoles(arr) ||
      iterableToArrayLimit(arr, i) ||
      unsupportedIterableToArray(arr, i) ||
      nonIterableRest()
    );
  }
`,s.slicedToArrayLoose=l("7.0.0-beta.0")`
  import arrayWithHoles from "arrayWithHoles";
  import iterableToArrayLimitLoose from "iterableToArrayLimitLoose";
  import unsupportedIterableToArray from "unsupportedIterableToArray";
  import nonIterableRest from "nonIterableRest";

  export default function _slicedToArrayLoose(arr, i) {
    return (
      arrayWithHoles(arr) ||
      iterableToArrayLimitLoose(arr, i) ||
      unsupportedIterableToArray(arr, i) ||
      nonIterableRest()
    );
  }
`,s.toArray=l("7.0.0-beta.0")`
  import arrayWithHoles from "arrayWithHoles";
  import iterableToArray from "iterableToArray";
  import unsupportedIterableToArray from "unsupportedIterableToArray";
  import nonIterableRest from "nonIterableRest";

  export default function _toArray(arr) {
    return (
      arrayWithHoles(arr) ||
      iterableToArray(arr) ||
      unsupportedIterableToArray(arr) ||
      nonIterableRest()
    );
  }
`,s.toConsumableArray=l("7.0.0-beta.0")`
  import arrayWithoutHoles from "arrayWithoutHoles";
  import iterableToArray from "iterableToArray";
  import unsupportedIterableToArray from "unsupportedIterableToArray";
  import nonIterableSpread from "nonIterableSpread";

  export default function _toConsumableArray(arr) {
    return (
      arrayWithoutHoles(arr) ||
      iterableToArray(arr) ||
      unsupportedIterableToArray(arr) ||
      nonIterableSpread()
    );
  }
`,s.arrayWithoutHoles=l("7.0.0-beta.0")`
  import arrayLikeToArray from "arrayLikeToArray";

  export default function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }
`,s.arrayWithHoles=l("7.0.0-beta.0")`
  export default function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
`,s.maybeArrayLike=l("7.9.0")`
  import arrayLikeToArray from "arrayLikeToArray";

  export default function _maybeArrayLike(next, arr, i) {
    if (arr && !Array.isArray(arr) && typeof arr.length === "number") {
      var len = arr.length;
      return arrayLikeToArray(arr, i !== void 0 && i < len ? i : len);
    }
    return next(arr, i);
  }
`,s.iterableToArray=l("7.0.0-beta.0")`
  export default function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
`,s.iterableToArrayLimit=l("7.0.0-beta.0")`
  export default function _iterableToArrayLimit(arr, i) {
    // this is an expanded form of \`for...of\` that properly supports abrupt completions of
    // iterators etc. variable names have been minimised to reduce the size of this massive
    // helper. sometimes spec compliance is annoying :(
    //
    // _n = _iteratorNormalCompletion
    // _d = _didIteratorError
    // _e = _iteratorError
    // _i = _iterator
    // _s = _step

    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);
    if (_i == null) return;

    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
`,s.iterableToArrayLimitLoose=l("7.0.0-beta.0")`
  export default function _iterableToArrayLimitLoose(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);
    if (_i == null) return;

    var _arr = [];
    for (_i = _i.call(arr), _step; !(_step = _i.next()).done;) {
      _arr.push(_step.value);
      if (i && _arr.length === i) break;
    }
    return _arr;
  }
`,s.unsupportedIterableToArray=l("7.9.0")`
  import arrayLikeToArray from "arrayLikeToArray";

  export default function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return arrayLikeToArray(o, minLen);
  }
`,s.arrayLikeToArray=l("7.9.0")`
  export default function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
`,s.nonIterableSpread=l("7.0.0-beta.0")`
  export default function _nonIterableSpread() {
    throw new TypeError(
      "Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
`,s.nonIterableRest=l("7.0.0-beta.0")`
  export default function _nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
`,s.createForOfIteratorHelper=l("7.9.0")`
  import unsupportedIterableToArray from "unsupportedIterableToArray";

  // s: start (create the iterator)
  // n: next
  // e: error (called whenever something throws)
  // f: finish (always called at the end)

  export default function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      // Fallback for engines without symbol support
      if (
        Array.isArray(o) ||
        (it = unsupportedIterableToArray(o)) ||
        (allowArrayLike && o && typeof o.length === "number")
      ) {
        if (it) o = it;
        var i = 0;
        var F = function(){};
        return {
          s: F,
          n: function() {
            if (i >= o.length) return { done: true };
            return { done: false, value: o[i++] };
          },
          e: function(e) { throw e; },
          f: F,
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true, didErr = false, err;

    return {
      s: function() {
        it = it.call(o);
      },
      n: function() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function(e) {
        didErr = true;
        err = e;
      },
      f: function() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
`,s.createForOfIteratorHelperLoose=l("7.9.0")`
  import unsupportedIterableToArray from "unsupportedIterableToArray";

  export default function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (it) return (it = it.call(o)).next.bind(it);

    // Fallback for engines without symbol support
    if (
      Array.isArray(o) ||
      (it = unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return { done: true };
        return { done: false, value: o[i++] };
      }
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
`,s.skipFirstGeneratorNext=l("7.0.0-beta.0")`
  export default function _skipFirstGeneratorNext(fn) {
    return function () {
      var it = fn.apply(this, arguments);
      it.next();
      return it;
    }
  }
`,s.toPrimitive=l("7.1.5")`
  export default function _toPrimitive(
    input,
    hint /*: "default" | "string" | "number" | void */
  ) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
`,s.toPropertyKey=l("7.1.5")`
  import toPrimitive from "toPrimitive";

  export default function _toPropertyKey(arg) {
    var key = toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
`,s.initializerWarningHelper=l("7.0.0-beta.0")`
    export default function _initializerWarningHelper(descriptor, context){
        throw new Error(
          'Decorating class property failed. Please ensure that ' +
          'proposal-class-properties is enabled and runs after the decorators transform.'
        );
    }
`,s.initializerDefineProperty=l("7.0.0-beta.0")`
    export default function _initializerDefineProperty(target, property, descriptor, context){
        if (!descriptor) return;

        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0,
        });
    }
`,s.applyDecoratedDescriptor=l("7.0.0-beta.0")`
    export default function _applyDecoratedDescriptor(target, property, decorators, descriptor, context){
        var desc = {};
        Object.keys(descriptor).forEach(function(key){
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;
        if ('value' in desc || desc.initializer){
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function(desc, decorator){
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0){
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0){
            Object.defineProperty(target, property, desc);
            desc = null;
        }

        return desc;
    }
`,s.classPrivateFieldLooseKey=l("7.0.0-beta.0")`
  var id = 0;
  export default function _classPrivateFieldKey(name) {
    return "__private_" + (id++) + "_" + name;
  }
`,s.classPrivateFieldLooseBase=l("7.0.0-beta.0")`
  export default function _classPrivateFieldBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }
    return receiver;
  }
`,s.classPrivateFieldGet=l("7.0.0-beta.0")`
  import classApplyDescriptorGet from "classApplyDescriptorGet";
  import classExtractFieldDescriptor from "classExtractFieldDescriptor";
  export default function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "get");
    return classApplyDescriptorGet(receiver, descriptor);
  }
`,s.classPrivateFieldSet=l("7.0.0-beta.0")`
  import classApplyDescriptorSet from "classApplyDescriptorSet";
  import classExtractFieldDescriptor from "classExtractFieldDescriptor";
  export default function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
    classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
`,s.classPrivateFieldDestructureSet=l("7.4.4")`
  import classApplyDescriptorDestructureSet from "classApplyDescriptorDestructureSet";
  import classExtractFieldDescriptor from "classExtractFieldDescriptor";
  export default function _classPrivateFieldDestructureSet(receiver, privateMap) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
    return classApplyDescriptorDestructureSet(receiver, descriptor);
  }
`,s.classExtractFieldDescriptor=l("7.13.10")`
  export default function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
  }
`,s.classStaticPrivateFieldSpecGet=l("7.0.2")`
  import classApplyDescriptorGet from "classApplyDescriptorGet";
  import classCheckPrivateStaticAccess from "classCheckPrivateStaticAccess";
  import classCheckPrivateStaticFieldDescriptor from "classCheckPrivateStaticFieldDescriptor";
  export default function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    classCheckPrivateStaticAccess(receiver, classConstructor);
    classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return classApplyDescriptorGet(receiver, descriptor);
  }
`,s.classStaticPrivateFieldSpecSet=l("7.0.2")`
  import classApplyDescriptorSet from "classApplyDescriptorSet";
  import classCheckPrivateStaticAccess from "classCheckPrivateStaticAccess";
  import classCheckPrivateStaticFieldDescriptor from "classCheckPrivateStaticFieldDescriptor";
  export default function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    classCheckPrivateStaticAccess(receiver, classConstructor);
    classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
`,s.classStaticPrivateMethodGet=l("7.3.2")`
  import classCheckPrivateStaticAccess from "classCheckPrivateStaticAccess";
  export default function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    classCheckPrivateStaticAccess(receiver, classConstructor);
    return method;
  }
`,s.classStaticPrivateMethodSet=l("7.3.2")`
  export default function _classStaticPrivateMethodSet() {
    throw new TypeError("attempted to set read only static private field");
  }
`,s.classApplyDescriptorGet=l("7.13.10")`
  export default function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }
    return descriptor.value;
  }
`,s.classApplyDescriptorSet=l("7.13.10")`
  export default function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        // This should only throw in strict mode, but class bodies are
        // always strict and private fields can only be used inside
        // class bodies.
        throw new TypeError("attempted to set read only private field");
      }
      descriptor.value = value;
    }
  }
`,s.classApplyDescriptorDestructureSet=l("7.13.10")`
  export default function _classApplyDescriptorDestructureSet(receiver, descriptor) {
    if (descriptor.set) {
      if (!("__destrObj" in descriptor)) {
        descriptor.__destrObj = {
          set value(v) {
            descriptor.set.call(receiver, v)
          },
        };
      }
      return descriptor.__destrObj;
    } else {
      if (!descriptor.writable) {
        // This should only throw in strict mode, but class bodies are
        // always strict and private fields can only be used inside
        // class bodies.
        throw new TypeError("attempted to set read only private field");
      }

      return descriptor;
    }
  }
`,s.classStaticPrivateFieldDestructureSet=l("7.13.10")`
  import classApplyDescriptorDestructureSet from "classApplyDescriptorDestructureSet";
  import classCheckPrivateStaticAccess from "classCheckPrivateStaticAccess";
  import classCheckPrivateStaticFieldDescriptor from "classCheckPrivateStaticFieldDescriptor";
  export default function _classStaticPrivateFieldDestructureSet(receiver, classConstructor, descriptor) {
    classCheckPrivateStaticAccess(receiver, classConstructor);
    classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    return classApplyDescriptorDestructureSet(receiver, descriptor);
  }
`,s.classCheckPrivateStaticAccess=l("7.13.10")`
  export default function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
      throw new TypeError("Private static access of wrong provenance");
    }
  }
`,s.classCheckPrivateStaticFieldDescriptor=l("7.13.10")`
  export default function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
      throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
  }
`,s.decorate=l("7.1.5")`
  import toArray from "toArray";
  import toPropertyKey from "toPropertyKey";

  // These comments are stripped by @babel/template
  /*::
  type PropertyDescriptor =
    | {
        value: any,
        writable: boolean,
        configurable: boolean,
        enumerable: boolean,
      }
    | {
        get?: () => any,
        set?: (v: any) => void,
        configurable: boolean,
        enumerable: boolean,
      };

  type FieldDescriptor ={
    writable: boolean,
    configurable: boolean,
    enumerable: boolean,
  };

  type Placement = "static" | "prototype" | "own";
  type Key = string | symbol; // PrivateName is not supported yet.

  type ElementDescriptor =
    | {
        kind: "method",
        key: Key,
        placement: Placement,
        descriptor: PropertyDescriptor
      }
    | {
        kind: "field",
        key: Key,
        placement: Placement,
        descriptor: FieldDescriptor,
        initializer?: () => any,
      };

  // This is exposed to the user code
  type ElementObjectInput = ElementDescriptor & {
    [@@toStringTag]?: "Descriptor"
  };

  // This is exposed to the user code
  type ElementObjectOutput = ElementDescriptor & {
    [@@toStringTag]?: "Descriptor"
    extras?: ElementDescriptor[],
    finisher?: ClassFinisher,
  };

  // This is exposed to the user code
  type ClassObject = {
    [@@toStringTag]?: "Descriptor",
    kind: "class",
    elements: ElementDescriptor[],
  };

  type ElementDecorator = (descriptor: ElementObjectInput) => ?ElementObjectOutput;
  type ClassDecorator = (descriptor: ClassObject) => ?ClassObject;
  type ClassFinisher = <A, B>(cl: Class<A>) => Class<B>;

  // Only used by Babel in the transform output, not part of the spec.
  type ElementDefinition =
    | {
        kind: "method",
        value: any,
        key: Key,
        static?: boolean,
        decorators?: ElementDecorator[],
      }
    | {
        kind: "field",
        value: () => any,
        key: Key,
        static?: boolean,
        decorators?: ElementDecorator[],
    };

  declare function ClassFactory<C>(initialize: (instance: C) => void): {
    F: Class<C>,
    d: ElementDefinition[]
  }

  */

  /*::
  // Various combinations with/without extras and with one or many finishers

  type ElementFinisherExtras = {
    element: ElementDescriptor,
    finisher?: ClassFinisher,
    extras?: ElementDescriptor[],
  };

  type ElementFinishersExtras = {
    element: ElementDescriptor,
    finishers: ClassFinisher[],
    extras: ElementDescriptor[],
  };

  type ElementsFinisher = {
    elements: ElementDescriptor[],
    finisher?: ClassFinisher,
  };

  type ElementsFinishers = {
    elements: ElementDescriptor[],
    finishers: ClassFinisher[],
  };

  */

  /*::

  type Placements = {
    static: Key[],
    prototype: Key[],
    own: Key[],
  };

  */

  // ClassDefinitionEvaluation (Steps 26-*)
  export default function _decorate(
    decorators /*: ClassDecorator[] */,
    factory /*: ClassFactory */,
    superClass /*: ?Class<*> */,
    mixins /*: ?Array<Function> */,
  ) /*: Class<*> */ {
    var api = _getDecoratorsApi();
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        api = mixins[i](api);
      }
    }

    var r = factory(function initialize(O) {
      api.initializeInstanceElements(O, decorated.elements);
    }, superClass);
    var decorated = api.decorateClass(
      _coalesceClassElements(r.d.map(_createElementDescriptor)),
      decorators,
    );

    api.initializeClassElements(r.F, decorated.elements);

    return api.runClassFinishers(r.F, decorated.finishers);
  }

  function _getDecoratorsApi() {
    _getDecoratorsApi = function() {
      return api;
    };

    var api = {
      elementsDefinitionOrder: [["method"], ["field"]],

      // InitializeInstanceElements
      initializeInstanceElements: function(
        /*::<C>*/ O /*: C */,
        elements /*: ElementDescriptor[] */,
      ) {
        ["method", "field"].forEach(function(kind) {
          elements.forEach(function(element /*: ElementDescriptor */) {
            if (element.kind === kind && element.placement === "own") {
              this.defineClassElement(O, element);
            }
          }, this);
        }, this);
      },

      // InitializeClassElements
      initializeClassElements: function(
        /*::<C>*/ F /*: Class<C> */,
        elements /*: ElementDescriptor[] */,
      ) {
        var proto = F.prototype;

        ["method", "field"].forEach(function(kind) {
          elements.forEach(function(element /*: ElementDescriptor */) {
            var placement = element.placement;
            if (
              element.kind === kind &&
              (placement === "static" || placement === "prototype")
            ) {
              var receiver = placement === "static" ? F : proto;
              this.defineClassElement(receiver, element);
            }
          }, this);
        }, this);
      },

      // DefineClassElement
      defineClassElement: function(
        /*::<C>*/ receiver /*: C | Class<C> */,
        element /*: ElementDescriptor */,
      ) {
        var descriptor /*: PropertyDescriptor */ = element.descriptor;
        if (element.kind === "field") {
          var initializer = element.initializer;
          descriptor = {
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            configurable: descriptor.configurable,
            value: initializer === void 0 ? void 0 : initializer.call(receiver),
          };
        }
        Object.defineProperty(receiver, element.key, descriptor);
      },

      // DecorateClass
      decorateClass: function(
        elements /*: ElementDescriptor[] */,
        decorators /*: ClassDecorator[] */,
      ) /*: ElementsFinishers */ {
        var newElements /*: ElementDescriptor[] */ = [];
        var finishers /*: ClassFinisher[] */ = [];
        var placements /*: Placements */ = {
          static: [],
          prototype: [],
          own: [],
        };

        elements.forEach(function(element /*: ElementDescriptor */) {
          this.addElementPlacement(element, placements);
        }, this);

        elements.forEach(function(element /*: ElementDescriptor */) {
          if (!_hasDecorators(element)) return newElements.push(element);

          var elementFinishersExtras /*: ElementFinishersExtras */ = this.decorateElement(
            element,
            placements,
          );
          newElements.push(elementFinishersExtras.element);
          newElements.push.apply(newElements, elementFinishersExtras.extras);
          finishers.push.apply(finishers, elementFinishersExtras.finishers);
        }, this);

        if (!decorators) {
          return { elements: newElements, finishers: finishers };
        }

        var result /*: ElementsFinishers */ = this.decorateConstructor(
          newElements,
          decorators,
        );
        finishers.push.apply(finishers, result.finishers);
        result.finishers = finishers;

        return result;
      },

      // AddElementPlacement
      addElementPlacement: function(
        element /*: ElementDescriptor */,
        placements /*: Placements */,
        silent /*: boolean */,
      ) {
        var keys = placements[element.placement];
        if (!silent && keys.indexOf(element.key) !== -1) {
          throw new TypeError("Duplicated element (" + element.key + ")");
        }
        keys.push(element.key);
      },

      // DecorateElement
      decorateElement: function(
        element /*: ElementDescriptor */,
        placements /*: Placements */,
      ) /*: ElementFinishersExtras */ {
        var extras /*: ElementDescriptor[] */ = [];
        var finishers /*: ClassFinisher[] */ = [];

        for (
          var decorators = element.decorators, i = decorators.length - 1;
          i >= 0;
          i--
        ) {
          // (inlined) RemoveElementPlacement
          var keys = placements[element.placement];
          keys.splice(keys.indexOf(element.key), 1);

          var elementObject /*: ElementObjectInput */ = this.fromElementDescriptor(
            element,
          );
          var elementFinisherExtras /*: ElementFinisherExtras */ = this.toElementFinisherExtras(
            (0, decorators[i])(elementObject) /*: ElementObjectOutput */ ||
              elementObject,
          );

          element = elementFinisherExtras.element;
          this.addElementPlacement(element, placements);

          if (elementFinisherExtras.finisher) {
            finishers.push(elementFinisherExtras.finisher);
          }

          var newExtras /*: ElementDescriptor[] | void */ =
            elementFinisherExtras.extras;
          if (newExtras) {
            for (var j = 0; j < newExtras.length; j++) {
              this.addElementPlacement(newExtras[j], placements);
            }
            extras.push.apply(extras, newExtras);
          }
        }

        return { element: element, finishers: finishers, extras: extras };
      },

      // DecorateConstructor
      decorateConstructor: function(
        elements /*: ElementDescriptor[] */,
        decorators /*: ClassDecorator[] */,
      ) /*: ElementsFinishers */ {
        var finishers /*: ClassFinisher[] */ = [];

        for (var i = decorators.length - 1; i >= 0; i--) {
          var obj /*: ClassObject */ = this.fromClassDescriptor(elements);
          var elementsAndFinisher /*: ElementsFinisher */ = this.toClassDescriptor(
            (0, decorators[i])(obj) /*: ClassObject */ || obj,
          );

          if (elementsAndFinisher.finisher !== undefined) {
            finishers.push(elementsAndFinisher.finisher);
          }

          if (elementsAndFinisher.elements !== undefined) {
            elements = elementsAndFinisher.elements;

            for (var j = 0; j < elements.length - 1; j++) {
              for (var k = j + 1; k < elements.length; k++) {
                if (
                  elements[j].key === elements[k].key &&
                  elements[j].placement === elements[k].placement
                ) {
                  throw new TypeError(
                    "Duplicated element (" + elements[j].key + ")",
                  );
                }
              }
            }
          }
        }

        return { elements: elements, finishers: finishers };
      },

      // FromElementDescriptor
      fromElementDescriptor: function(
        element /*: ElementDescriptor */,
      ) /*: ElementObject */ {
        var obj /*: ElementObject */ = {
          kind: element.kind,
          key: element.key,
          placement: element.placement,
          descriptor: element.descriptor,
        };

        var desc = {
          value: "Descriptor",
          configurable: true,
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);

        if (element.kind === "field") obj.initializer = element.initializer;

        return obj;
      },

      // ToElementDescriptors
      toElementDescriptors: function(
        elementObjects /*: ElementObject[] */,
      ) /*: ElementDescriptor[] */ {
        if (elementObjects === undefined) return;
        return toArray(elementObjects).map(function(elementObject) {
          var element = this.toElementDescriptor(elementObject);
          this.disallowProperty(elementObject, "finisher", "An element descriptor");
          this.disallowProperty(elementObject, "extras", "An element descriptor");
          return element;
        }, this);
      },

      // ToElementDescriptor
      toElementDescriptor: function(
        elementObject /*: ElementObject */,
      ) /*: ElementDescriptor */ {
        var kind = String(elementObject.kind);
        if (kind !== "method" && kind !== "field") {
          throw new TypeError(
            'An element descriptor\\'s .kind property must be either "method" or' +
              ' "field", but a decorator created an element descriptor with' +
              ' .kind "' +
              kind +
              '"',
          );
        }

        var key = toPropertyKey(elementObject.key);

        var placement = String(elementObject.placement);
        if (
          placement !== "static" &&
          placement !== "prototype" &&
          placement !== "own"
        ) {
          throw new TypeError(
            'An element descriptor\\'s .placement property must be one of "static",' +
              ' "prototype" or "own", but a decorator created an element descriptor' +
              ' with .placement "' +
              placement +
              '"',
          );
        }

        var descriptor /*: PropertyDescriptor */ = elementObject.descriptor;

        this.disallowProperty(elementObject, "elements", "An element descriptor");

        var element /*: ElementDescriptor */ = {
          kind: kind,
          key: key,
          placement: placement,
          descriptor: Object.assign({}, descriptor),
        };

        if (kind !== "field") {
          this.disallowProperty(elementObject, "initializer", "A method descriptor");
        } else {
          this.disallowProperty(
            descriptor,
            "get",
            "The property descriptor of a field descriptor",
          );
          this.disallowProperty(
            descriptor,
            "set",
            "The property descriptor of a field descriptor",
          );
          this.disallowProperty(
            descriptor,
            "value",
            "The property descriptor of a field descriptor",
          );

          element.initializer = elementObject.initializer;
        }

        return element;
      },

      toElementFinisherExtras: function(
        elementObject /*: ElementObject */,
      ) /*: ElementFinisherExtras */ {
        var element /*: ElementDescriptor */ = this.toElementDescriptor(
          elementObject,
        );
        var finisher /*: ClassFinisher */ = _optionalCallableProperty(
          elementObject,
          "finisher",
        );
        var extras /*: ElementDescriptors[] */ = this.toElementDescriptors(
          elementObject.extras,
        );

        return { element: element, finisher: finisher, extras: extras };
      },

      // FromClassDescriptor
      fromClassDescriptor: function(
        elements /*: ElementDescriptor[] */,
      ) /*: ClassObject */ {
        var obj = {
          kind: "class",
          elements: elements.map(this.fromElementDescriptor, this),
        };

        var desc = { value: "Descriptor", configurable: true };
        Object.defineProperty(obj, Symbol.toStringTag, desc);

        return obj;
      },

      // ToClassDescriptor
      toClassDescriptor: function(
        obj /*: ClassObject */,
      ) /*: ElementsFinisher */ {
        var kind = String(obj.kind);
        if (kind !== "class") {
          throw new TypeError(
            'A class descriptor\\'s .kind property must be "class", but a decorator' +
              ' created a class descriptor with .kind "' +
              kind +
              '"',
          );
        }

        this.disallowProperty(obj, "key", "A class descriptor");
        this.disallowProperty(obj, "placement", "A class descriptor");
        this.disallowProperty(obj, "descriptor", "A class descriptor");
        this.disallowProperty(obj, "initializer", "A class descriptor");
        this.disallowProperty(obj, "extras", "A class descriptor");

        var finisher = _optionalCallableProperty(obj, "finisher");
        var elements = this.toElementDescriptors(obj.elements);

        return { elements: elements, finisher: finisher };
      },

      // RunClassFinishers
      runClassFinishers: function(
        constructor /*: Class<*> */,
        finishers /*: ClassFinisher[] */,
      ) /*: Class<*> */ {
        for (var i = 0; i < finishers.length; i++) {
          var newConstructor /*: ?Class<*> */ = (0, finishers[i])(constructor);
          if (newConstructor !== undefined) {
            // NOTE: This should check if IsConstructor(newConstructor) is false.
            if (typeof newConstructor !== "function") {
              throw new TypeError("Finishers must return a constructor.");
            }
            constructor = newConstructor;
          }
        }
        return constructor;
      },

      disallowProperty: function(obj, name, objectType) {
        if (obj[name] !== undefined) {
          throw new TypeError(objectType + " can't have a ." + name + " property.");
        }
      }
    };

    return api;
  }

  // ClassElementEvaluation
  function _createElementDescriptor(
    def /*: ElementDefinition */,
  ) /*: ElementDescriptor */ {
    var key = toPropertyKey(def.key);

    var descriptor /*: PropertyDescriptor */;
    if (def.kind === "method") {
      descriptor = {
        value: def.value,
        writable: true,
        configurable: true,
        enumerable: false,
      };
    } else if (def.kind === "get") {
      descriptor = { get: def.value, configurable: true, enumerable: false };
    } else if (def.kind === "set") {
      descriptor = { set: def.value, configurable: true, enumerable: false };
    } else if (def.kind === "field") {
      descriptor = { configurable: true, writable: true, enumerable: true };
    }

    var element /*: ElementDescriptor */ = {
      kind: def.kind === "field" ? "field" : "method",
      key: key,
      placement: def.static
        ? "static"
        : def.kind === "field"
        ? "own"
        : "prototype",
      descriptor: descriptor,
    };
    if (def.decorators) element.decorators = def.decorators;
    if (def.kind === "field") element.initializer = def.value;

    return element;
  }

  // CoalesceGetterSetter
  function _coalesceGetterSetter(
    element /*: ElementDescriptor */,
    other /*: ElementDescriptor */,
  ) {
    if (element.descriptor.get !== undefined) {
      other.descriptor.get = element.descriptor.get;
    } else {
      other.descriptor.set = element.descriptor.set;
    }
  }

  // CoalesceClassElements
  function _coalesceClassElements(
    elements /*: ElementDescriptor[] */,
  ) /*: ElementDescriptor[] */ {
    var newElements /*: ElementDescriptor[] */ = [];

    var isSameElement = function(
      other /*: ElementDescriptor */,
    ) /*: boolean */ {
      return (
        other.kind === "method" &&
        other.key === element.key &&
        other.placement === element.placement
      );
    };

    for (var i = 0; i < elements.length; i++) {
      var element /*: ElementDescriptor */ = elements[i];
      var other /*: ElementDescriptor */;

      if (
        element.kind === "method" &&
        (other = newElements.find(isSameElement))
      ) {
        if (
          _isDataDescriptor(element.descriptor) ||
          _isDataDescriptor(other.descriptor)
        ) {
          if (_hasDecorators(element) || _hasDecorators(other)) {
            throw new ReferenceError(
              "Duplicated methods (" + element.key + ") can't be decorated.",
            );
          }
          other.descriptor = element.descriptor;
        } else {
          if (_hasDecorators(element)) {
            if (_hasDecorators(other)) {
              throw new ReferenceError(
                "Decorators can't be placed on different accessors with for " +
                  "the same property (" +
                  element.key +
                  ").",
              );
            }
            other.decorators = element.decorators;
          }
          _coalesceGetterSetter(element, other);
        }
      } else {
        newElements.push(element);
      }
    }

    return newElements;
  }

  function _hasDecorators(element /*: ElementDescriptor */) /*: boolean */ {
    return element.decorators && element.decorators.length;
  }

  function _isDataDescriptor(desc /*: PropertyDescriptor */) /*: boolean */ {
    return (
      desc !== undefined &&
      !(desc.value === undefined && desc.writable === undefined)
    );
  }

  function _optionalCallableProperty /*::<T>*/(
    obj /*: T */,
    name /*: $Keys<T> */,
  ) /*: ?Function */ {
    var value = obj[name];
    if (value !== undefined && typeof value !== "function") {
      throw new TypeError("Expected '" + name + "' to be a function");
    }
    return value;
  }

`,s.classPrivateMethodGet=l("7.1.6")`
  export default function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
  }
`,s.classPrivateMethodSet=l("7.1.6")`
    export default function _classPrivateMethodSet() {
      throw new TypeError("attempted to reassign private method");
    }
  `},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wrapRegExp=t.typeof=t.objectSpread2=t.jsx=void 0;var r,i=(r=n(143))&&r.__esModule?r:{default:r};const a={minVersion:"7.0.0-beta.0",ast:()=>i.default.program.ast('\nvar REACT_ELEMENT_TYPE;\nexport default function _createRawReactElement(type, props, key, children) {\n  if (!REACT_ELEMENT_TYPE) {\n    REACT_ELEMENT_TYPE =\n      (typeof Symbol === "function" &&\n        \n        Symbol["for"] &&\n        Symbol["for"]("react.element")) ||\n      0xeac7;\n  }\n  var defaultProps = type && type.defaultProps;\n  var childrenLength = arguments.length - 3;\n  if (!props && childrenLength !== 0) {\n    \n    \n    props = { children: void 0 };\n  }\n  if (childrenLength === 1) {\n    props.children = children;\n  } else if (childrenLength > 1) {\n    var childArray = new Array(childrenLength);\n    for (var i = 0; i < childrenLength; i++) {\n      childArray[i] = arguments[i + 3];\n    }\n    props.children = childArray;\n  }\n  if (props && defaultProps) {\n    for (var propName in defaultProps) {\n      if (props[propName] === void 0) {\n        props[propName] = defaultProps[propName];\n      }\n    }\n  } else if (!props) {\n    props = defaultProps || {};\n  }\n  return {\n    $$typeof: REACT_ELEMENT_TYPE,\n    type: type,\n    key: key === undefined ? null : "" + key,\n    ref: null,\n    props: props,\n    _owner: null,\n  };\n}\n')};t.jsx=a;const o={minVersion:"7.5.0",ast:()=>i.default.program.ast('\nimport defineProperty from "defineProperty";\nfunction ownKeys(object, enumerableOnly) {\n  var keys = Object.keys(object);\n  if (Object.getOwnPropertySymbols) {\n    var symbols = Object.getOwnPropertySymbols(object);\n    if (enumerableOnly) {\n      symbols = symbols.filter(function (sym) {\n        return Object.getOwnPropertyDescriptor(object, sym).enumerable;\n      });\n    }\n    keys.push.apply(keys, symbols);\n  }\n  return keys;\n}\nexport default function _objectSpread2(target) {\n  for (var i = 1; i < arguments.length; i++) {\n    var source = arguments[i] != null ? arguments[i] : {};\n    if (i % 2) {\n      ownKeys(Object(source), true).forEach(function (key) {\n        defineProperty(target, key, source[key]);\n      });\n    } else if (Object.getOwnPropertyDescriptors) {\n      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));\n    } else {\n      ownKeys(Object(source)).forEach(function (key) {\n        Object.defineProperty(\n          target,\n          key,\n          Object.getOwnPropertyDescriptor(source, key)\n        );\n      });\n    }\n  }\n  return target;\n}\n')};t.objectSpread2=o;const s={minVersion:"7.0.0-beta.0",ast:()=>i.default.program.ast('\nexport default function _typeof(obj) {\n  "@babel/helpers - typeof";\n  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {\n    _typeof = function (obj) {\n      return typeof obj;\n    };\n  } else {\n    _typeof = function (obj) {\n      return obj &&\n        typeof Symbol === "function" &&\n        obj.constructor === Symbol &&\n        obj !== Symbol.prototype\n        ? "symbol"\n        : typeof obj;\n    };\n  }\n  return _typeof(obj);\n}\n')};t.typeof=s;const u={minVersion:"7.2.6",ast:()=>i.default.program.ast('\nimport setPrototypeOf from "setPrototypeOf";\nimport inherits from "inherits";\nexport default function _wrapRegExp() {\n  _wrapRegExp = function (re, groups) {\n    return new BabelRegExp(re, undefined, groups);\n  };\n  var _super = RegExp.prototype;\n  var _groups = new WeakMap();\n  function BabelRegExp(re, flags, groups) {\n    var _this = new RegExp(re, flags);\n    \n    _groups.set(_this, groups || _groups.get(re));\n    return setPrototypeOf(_this, BabelRegExp.prototype);\n  }\n  inherits(BabelRegExp, RegExp);\n  BabelRegExp.prototype.exec = function (str) {\n    var result = _super.exec.call(this, str);\n    if (result) result.groups = buildGroups(result, this);\n    return result;\n  };\n  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {\n    if (typeof substitution === "string") {\n      var groups = _groups.get(this);\n      return _super[Symbol.replace].call(\n        this,\n        str,\n        substitution.replace(/\\$<([^>]+)>/g, function (_, name) {\n          return "$" + groups[name];\n        })\n      );\n    } else if (typeof substitution === "function") {\n      var _this = this;\n      return _super[Symbol.replace].call(this, str, function () {\n        var args = arguments;\n        \n        if (typeof args[args.length - 1] !== "object") {\n          args = [].slice.call(args);\n          args.push(buildGroups(args, _this));\n        }\n        return substitution.apply(this, args);\n      });\n    } else {\n      return _super[Symbol.replace].call(this, str, substitution);\n    }\n  };\n  function buildGroups(result, re) {\n    \n    \n    var g = _groups.get(re);\n    return Object.keys(g).reduce(function (groups, name) {\n      groups[name] = result[g[name]];\n      return groups;\n    }, Object.create(null));\n  }\n  return _wrapRegExp.apply(this, arguments);\n}\n')};t.wrapRegExp=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.rewriteModuleStatementsAndPrepareHeader=function(e,{loose:t,exportName:n,strict:c,allowTopLevelThis:p,strictMode:d,noInterop:m,importInterop:y=(m?"none":"babel"),lazy:g,esNamespaceOnly:b,constantReexports:v=t,enumerableModuleMeta:E=t}){(0,l.validateImportInteropOption)(y),r((0,o.isModule)(e),"Cannot process module statements in a script"),e.node.sourceType="script";const T=(0,l.default)(e,n,{importInterop:y,initializeReexports:v,lazy:g,esNamespaceOnly:b});p||(0,s.default)(e);if((0,u.default)(e,T),!1!==d){e.node.directives.some(e=>"use strict"===e.value.value)||e.unshiftContainer("directives",i.directive(i.directiveLiteral("use strict")))}const S=[];(0,l.hasExports)(T)&&!c&&S.push(function(e,t=!1){return(t?a.default.statement`
        EXPORTS.__esModule = true;
      `:a.default.statement`
        Object.defineProperty(EXPORTS, "__esModule", {
          value: true,
        });
      `)({EXPORTS:e.exportName})}(T,E));const x=function(e,t){const n=Object.create(null);for(const i of t.local.values())for(const e of i.names)n[e]=!0;let r=!1;for(const i of t.source.values()){for(const e of i.reexports.keys())n[e]=!0;for(const e of i.reexportNamespace)n[e]=!0;r=r||!!i.reexportAll}if(!r||0===Object.keys(n).length)return null;const a=e.scope.generateUidIdentifier("exportNames");return delete n.default,{name:a.name,statement:i.variableDeclaration("var",[i.variableDeclarator(a,i.valueToNode(n))])}}(e,T);x&&(T.exportNameListName=x.name,S.push(x.statement));return S.push(...function(e,t,n=!1){const r=[],a=[];for(const[o,s]of t.local)"import"===s.kind||("hoisted"===s.kind?r.push(h(t,s.names,i.identifier(o))):a.push(...s.names));for(const i of t.source.values()){n||r.push(...f(t,i,!1));for(const e of i.reexportNamespace)a.push(e)}return r.push(...function(e,t){const n=[];for(let r=0;r<e.length;r+=t)n.push(e.slice(r,r+t));return n}(a,100).map(n=>h(t,n,e.scope.buildUndefinedNode()))),r}(e,T,v)),{meta:T,headers:S}},t.ensureStatementsHoisted=function(e){e.forEach(e=>{e._blockHoist=3})},t.wrapInterop=function(e,t,n){if("none"===n)return null;if("node-namespace"===n)return i.callExpression(e.hub.addHelper("interopRequireWildcard"),[t,i.booleanLiteral(!0)]);if("node-default"===n)return null;let r;if("default"===n)r="interopRequireDefault";else{if("namespace"!==n)throw new Error("Unknown interop: "+n);r="interopRequireWildcard"}return i.callExpression(e.hub.addHelper(r),[t])},t.buildNamespaceInitStatements=function(e,t,n=!1){const r=[];let o=i.identifier(t.name);t.lazy&&(o=i.callExpression(o,[]));for(const s of t.importsNamespace)s!==t.name&&r.push(a.default.statement`var NAME = SOURCE;`({NAME:s,SOURCE:i.cloneNode(o)}));n&&r.push(...f(e,t,!0));for(const s of t.reexportNamespace)r.push((t.lazy?a.default.statement`
            Object.defineProperty(EXPORTS, "NAME", {
              enumerable: true,
              get: function() {
                return NAMESPACE;
              }
            });
          `:a.default.statement`EXPORTS.NAME = NAMESPACE;`)({EXPORTS:e.exportName,NAME:s,NAMESPACE:i.cloneNode(o)}));if(t.reexportAll){const s=function(e,t,n){return(n?a.default.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;
          if (key in EXPORTS && EXPORTS[key] === NAMESPACE[key]) return;

          EXPORTS[key] = NAMESPACE[key];
        });
      `:a.default.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;
          if (key in EXPORTS && EXPORTS[key] === NAMESPACE[key]) return;

          Object.defineProperty(EXPORTS, key, {
            enumerable: true,
            get: function() {
              return NAMESPACE[key];
            },
          });
        });
    `)({NAMESPACE:t,EXPORTS:e.exportName,VERIFY_NAME_LIST:e.exportNameListName?a.default`
            if (Object.prototype.hasOwnProperty.call(EXPORTS_LIST, key)) return;
          `({EXPORTS_LIST:e.exportNameListName}):null})}(e,i.cloneNode(o),n);s.loc=t.reexportAll.loc,r.push(s)}return r},Object.defineProperty(t,"isModule",{enumerable:!0,get:function(){return o.isModule}}),Object.defineProperty(t,"rewriteThis",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"hasExports",{enumerable:!0,get:function(){return l.hasExports}}),Object.defineProperty(t,"isSideEffectImport",{enumerable:!0,get:function(){return l.isSideEffectImport}}),Object.defineProperty(t,"getModuleName",{enumerable:!0,get:function(){return c.default}});var r=n(184),i=n(28),a=n(143),o=n(749),s=n(752),u=n(756),l=n(758),c=n(759);const p={constant:a.default.statement`EXPORTS.EXPORT_NAME = NAMESPACE_IMPORT;`,constantComputed:a.default.statement`EXPORTS["EXPORT_NAME"] = NAMESPACE_IMPORT;`,spec:a.default`
    Object.defineProperty(EXPORTS, "EXPORT_NAME", {
      enumerable: true,
      get: function() {
        return NAMESPACE_IMPORT;
      },
    });
    `},f=(e,t,n)=>{const r=t.lazy?i.callExpression(i.identifier(t.name),[]):i.identifier(t.name),{stringSpecifiers:a}=e;return Array.from(t.reexports,([o,s])=>{let u=i.cloneNode(r);"default"===s&&"node-default"===t.interop||(u=a.has(s)?i.memberExpression(u,i.stringLiteral(s),!0):i.memberExpression(u,i.identifier(s)));const l={EXPORTS:e.exportName,EXPORT_NAME:o,NAMESPACE_IMPORT:u};return n||i.isIdentifier(u)?a.has(o)?p.constantComputed(l):p.constant(l):p.spec(l)})};const d={computed:a.default.expression`EXPORTS["NAME"] = VALUE`,default:a.default.expression`EXPORTS.NAME = VALUE`};function h(e,t,n){const{stringSpecifiers:r,exportName:a}=e;return i.expressionStatement(t.reduce((e,t)=>{const n={EXPORTS:a,NAME:t,VALUE:e};return r.has(t)?d.computed(n):d.default(n)},n))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.addDefault=function(e,t,n){return new r.default(e).addDefault(t,n)},t.addNamed=function(e,t,n,i){return new r.default(e).addNamed(t,n,i)},t.addNamespace=function(e,t,n){return new r.default(e).addNamespace(t,n)},t.addSideEffect=function(e,t,n){return new r.default(e).addSideEffect(t,n)},Object.defineProperty(t,"ImportInjector",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(t,"isModule",{enumerable:!0,get:function(){return i.default}});var r=a(n(750)),i=a(n(435));function a(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=s();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var a=r?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(n,i,a):n[i]=e[i]}n.default=e,t&&t.set(e,n);return n}(n(28)),i=o(n(751)),a=o(n(435));function o(e){return e&&e.__esModule?e:{default:e}}function s(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return s=function(){return e},e}const u=n(184);t.default=class{constructor(e,t,n){this._defaultOpts={importedSource:null,importedType:"commonjs",importedInterop:"babel",importingInterop:"babel",ensureLiveReference:!1,ensureNoContext:!1,importPosition:"before"};const r=e.find(e=>e.isProgram());this._programPath=r,this._programScope=r.scope,this._hub=r.hub,this._defaultOpts=this._applyDefaults(t,n,!0)}addDefault(e,t){return this.addNamed("default",e,t)}addNamed(e,t,n){return u("string"===typeof e),this._generateImport(this._applyDefaults(t,n),e)}addNamespace(e,t){return this._generateImport(this._applyDefaults(e,t),null)}addSideEffect(e,t){return this._generateImport(this._applyDefaults(e,t),!1)}_applyDefaults(e,t,n=!1){const r=[];"string"===typeof e?(r.push({importedSource:e}),r.push(t)):(u(!t,"Unexpected secondary arguments."),r.push(e));const i=Object.assign({},this._defaultOpts);for(const a of r)a&&(Object.keys(i).forEach(e=>{void 0!==a[e]&&(i[e]=a[e])}),n||(void 0!==a.nameHint&&(i.nameHint=a.nameHint),void 0!==a.blockHoist&&(i.blockHoist=a.blockHoist)));return i}_generateImport(e,t){const n="default"===t,o=!!t&&!n,s=null===t,{importedSource:u,importedType:l,importedInterop:c,importingInterop:p,ensureLiveReference:f,ensureNoContext:d,nameHint:h,importPosition:m,blockHoist:y}=e;let g=h||t;const b=(0,a.default)(this._programPath),v=b&&"node"===p,E=b&&"babel"===p;if("after"===m&&!b)throw new Error('"importPosition": "after" is only supported in modules');const T=new i.default(u,this._programScope,this._hub);if("es6"===l){if(!v&&!E)throw new Error("Cannot import an ES6 module from CommonJS");T.import(),s?T.namespace(h||u):(n||o)&&T.named(g,t)}else{if("commonjs"!==l)throw new Error(`Unexpected interopType "${l}"`);if("babel"===c)if(v){g="default"!==g?g:u;const e=u+"$es6Default";T.import(),s?T.default(e).var(g||u).wildcardInterop():n?f?T.default(e).var(g||u).defaultInterop().read("default"):T.default(e).var(g).defaultInterop().prop(t):o&&T.default(e).read(t)}else E?(T.import(),s?T.namespace(g||u):(n||o)&&T.named(g,t)):(T.require(),s?T.var(g||u).wildcardInterop():(n||o)&&f?n?(g="default"!==g?g:u,T.var(g).read(t),T.defaultInterop()):T.var(u).read(t):n?T.var(g).defaultInterop().prop(t):o&&T.var(g).prop(t));else if("compiled"===c)v?(T.import(),s?T.default(g||u):(n||o)&&T.default(u).read(g)):E?(T.import(),s?T.namespace(g||u):(n||o)&&T.named(g,t)):(T.require(),s?T.var(g||u):(n||o)&&(f?T.var(u).read(g):T.prop(t).var(g)));else{if("uncompiled"!==c)throw new Error(`Unknown importedInterop "${c}".`);if(n&&f)throw new Error("No live reference for commonjs default");v?(T.import(),s?T.default(g||u):n?T.default(g):o&&T.default(u).read(g)):E?(T.import(),s?T.default(g||u):n?T.default(g):o&&T.named(g,t)):(T.require(),s?T.var(g||u):n?T.var(g):o&&(f?T.var(u).read(g):T.var(g).prop(t)))}}const{statements:S,resultName:x}=T.done();return this._insertStatements(S,m,y),(n||o)&&d&&"Identifier"!==x.type?r.sequenceExpression([r.numericLiteral(0),x]):x}_insertStatements(e,t="before",n=3){const r=this._programPath.get("body");if("after"===t){for(let i=r.length-1;i>=0;i--)if(r[i].isImportDeclaration())return void r[i].insertAfter(e)}else{e.forEach(e=>{e._blockHoist=n});const t=r.find(e=>{const t=e.node._blockHoist;return Number.isFinite(t)&&t<4});if(t)return void t.insertBefore(e)}this._programPath.unshiftContainer("body",e)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=i();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=r?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(n,a,o):n[a]=e[a]}n.default=e,t&&t.set(e,n);return n}(n(28));function i(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return i=function(){return e},e}const a=n(184);t.default=class{constructor(e,t,n){this._statements=[],this._resultName=null,this._scope=null,this._hub=null,this._importedSource=void 0,this._scope=t,this._hub=n,this._importedSource=e}done(){return{statements:this._statements,resultName:this._resultName}}import(){return this._statements.push(r.importDeclaration([],r.stringLiteral(this._importedSource))),this}require(){return this._statements.push(r.expressionStatement(r.callExpression(r.identifier("require"),[r.stringLiteral(this._importedSource)]))),this}namespace(e="namespace"){const t=this._scope.generateUidIdentifier(e),n=this._statements[this._statements.length-1];return a("ImportDeclaration"===n.type),a(0===n.specifiers.length),n.specifiers=[r.importNamespaceSpecifier(t)],this._resultName=r.cloneNode(t),this}default(e){e=this._scope.generateUidIdentifier(e);const t=this._statements[this._statements.length-1];return a("ImportDeclaration"===t.type),a(0===t.specifiers.length),t.specifiers=[r.importDefaultSpecifier(e)],this._resultName=r.cloneNode(e),this}named(e,t){if("default"===t)return this.default(e);e=this._scope.generateUidIdentifier(e);const n=this._statements[this._statements.length-1];return a("ImportDeclaration"===n.type),a(0===n.specifiers.length),n.specifiers=[r.importSpecifier(e,r.identifier(t))],this._resultName=r.cloneNode(e),this}var(e){e=this._scope.generateUidIdentifier(e);let t=this._statements[this._statements.length-1];return"ExpressionStatement"!==t.type&&(a(this._resultName),t=r.expressionStatement(this._resultName),this._statements.push(t)),this._statements[this._statements.length-1]=r.variableDeclaration("var",[r.variableDeclarator(e,t.expression)]),this._resultName=r.cloneNode(e),this}defaultInterop(){return this._interop(this._hub.addHelper("interopRequireDefault"))}wildcardInterop(){return this._interop(this._hub.addHelper("interopRequireWildcard"))}_interop(e){const t=this._statements[this._statements.length-1];return"ExpressionStatement"===t.type?t.expression=r.callExpression(e,[t.expression]):"VariableDeclaration"===t.type?(a(1===t.declarations.length),t.declarations[0].init=r.callExpression(e,[t.declarations[0].init])):a.fail("Unexpected type."),this}prop(e){const t=this._statements[this._statements.length-1];return"ExpressionStatement"===t.type?t.expression=r.memberExpression(t.expression,r.identifier(e)):"VariableDeclaration"===t.type?(a(1===t.declarations.length),t.declarations[0].init=r.memberExpression(t.declarations[0].init,r.identifier(e))):a.fail("Unexpected type:"+t.type),this}read(e){this._resultName=r.memberExpression(this._resultName,r.identifier(e))}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){(0,i.default)(e.node,Object.assign({},o,{noScope:!0}))};var r=n(753),i=n(82),a=n(28);const o=i.default.visitors.merge([r.environmentVisitor,{ThisExpression(e){e.replaceWith(a.unaryExpression("void",a.numericLiteral(0),!0))}}])},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.skipAllButComputedKey=u,t.default=t.environmentVisitor=void 0;var r=n(82),i=n(754),a=n(755),o=n(28);function s(e,t,n,r){e=o.cloneNode(e);const i=t||r?e:o.memberExpression(e,o.identifier("prototype"));return o.callExpression(n.addHelper("getPrototypeOf"),[i])}function u(e){if(!e.node.computed)return void e.skip();const t=o.VISITOR_KEYS[e.type];for(const n of t)"key"!==n&&e.skipKey(n)}const l={[(o.staticBlock?"StaticBlock|":"")+"ClassPrivateProperty|TypeAnnotation"](e){e.skip()},Function(e){e.isMethod()||e.isArrowFunctionExpression()||e.skip()},"Method|ClassProperty"(e){u(e)}};t.environmentVisitor=l;const c=r.default.visitors.merge([l,{Super(e,t){const{node:n,parentPath:r}=e;r.isMemberExpression({object:n})&&t.handle(r)}}]),p=r.default.visitors.merge([l,{Scopable(e,{refName:t}){const n=e.scope.getOwnBinding(t);n&&n.identifier.name===t&&e.scope.rename(t)}}]),f={memoise(e,t){const{scope:n,node:r}=e,{computed:i,property:a}=r;if(!i)return;const o=n.maybeGenerateMemoised(a);o&&this.memoiser.set(a,o,t)},prop(e){const{computed:t,property:n}=e.node;return this.memoiser.has(n)?o.cloneNode(this.memoiser.get(n)):t?o.cloneNode(n):o.stringLiteral(n.name)},get(e){return this._get(e,this._getThisRefs())},_get(e,t){const n=s(this.getObjectRef(),this.isStatic,this.file,this.isPrivateMethod);return o.callExpression(this.file.addHelper("get"),[t.memo?o.sequenceExpression([t.memo,n]):n,this.prop(e),t.this])},_getThisRefs(){if(!this.isDerivedConstructor)return{this:o.thisExpression()};const e=this.scope.generateDeclaredUidIdentifier("thisSuper");return{memo:o.assignmentExpression("=",e,o.thisExpression()),this:o.cloneNode(e)}},set(e,t){const n=this._getThisRefs(),r=s(this.getObjectRef(),this.isStatic,this.file,this.isPrivateMethod);return o.callExpression(this.file.addHelper("set"),[n.memo?o.sequenceExpression([n.memo,r]):r,this.prop(e),t,n.this,o.booleanLiteral(e.isInStrictMode())])},destructureSet(e){throw e.buildCodeFrameError("Destructuring to a super field is not supported yet.")},call(e,t){const n=this._getThisRefs();return(0,a.default)(this._get(e,n),o.cloneNode(n.this),t,!1)},optionalCall(e,t){const n=this._getThisRefs();return(0,a.default)(this._get(e,n),o.cloneNode(n.this),t,!0)}},d=Object.assign({},f,{prop(e){const{property:t}=e.node;return this.memoiser.has(t)?o.cloneNode(this.memoiser.get(t)):o.cloneNode(t)},get(e){const{isStatic:t,getSuperRef:n}=this,{computed:r}=e.node,i=this.prop(e);let a;var s,u;t?a=null!=(s=n())?s:o.memberExpression(o.identifier("Function"),o.identifier("prototype")):a=o.memberExpression(null!=(u=n())?u:o.identifier("Object"),o.identifier("prototype"));return o.memberExpression(a,i,r)},set(e,t){const{computed:n}=e.node,r=this.prop(e);return o.assignmentExpression("=",o.memberExpression(o.thisExpression(),r,n),t)},destructureSet(e){const{computed:t}=e.node,n=this.prop(e);return o.memberExpression(o.thisExpression(),n,t)},call(e,t){return(0,a.default)(this.get(e),o.thisExpression(),t,!1)},optionalCall(e,t){return(0,a.default)(this.get(e),o.thisExpression(),t,!0)}});t.default=class{constructor(e){var t;const n=e.methodPath;this.methodPath=n,this.isDerivedConstructor=n.isClassMethod({kind:"constructor"})&&!!e.superRef,this.isStatic=n.isObjectMethod()||n.node.static||(null==n.isStaticBlock?void 0:n.isStaticBlock()),this.isPrivateMethod=n.isPrivate()&&n.isMethod(),this.file=e.file,this.constantSuper=null!=(t=e.constantSuper)?t:e.isLoose,this.opts=e}getObjectRef(){return o.cloneNode(this.opts.objectRef||this.opts.getObjectRef())}getSuperRef(){return this.opts.superRef?o.cloneNode(this.opts.superRef):this.opts.getSuperRef?o.cloneNode(this.opts.getSuperRef()):void 0}replace(){this.opts.refToPreserve&&this.methodPath.traverse(p,{refName:this.opts.refToPreserve.name});const e=this.constantSuper?d:f;(0,i.default)(this.methodPath,c,Object.assign({file:this.file,scope:this.methodPath.scope,isDerivedConstructor:this.isDerivedConstructor,isStatic:this.isStatic,isPrivateMethod:this.isPrivateMethod,getObjectRef:this.getObjectRef.bind(this),getSuperRef:this.getSuperRef.bind(this)},e))}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(28);class i{constructor(){this._map=void 0,this._map=new WeakMap}has(e){return this._map.has(e)}get(e){if(!this.has(e))return;const t=this._map.get(e),{value:n}=t;return t.count--,0===t.count?r.assignmentExpression("=",n,e):n}set(e,t,n){return this._map.set(e,{count:n,value:t})}}function a(e,t){const{node:n}=e;if(e.isOptionalMemberExpression())return r.memberExpression(t,n.property,n.computed);if(e.isOptionalCallExpression()){const i=e.get("callee");if(e.node.optional&&i.isOptionalMemberExpression()){const{object:a}=i.node,o=e.scope.maybeGenerateMemoised(a)||a;return i.get("object").replaceWith(r.assignmentExpression("=",o,a)),r.callExpression(r.memberExpression(t,r.identifier("call")),[o,...n.arguments])}return r.callExpression(t,n.arguments)}return e.node}const o={memoise(){},handle(e,t){const{node:n,parent:i,parentPath:o,scope:s}=e;if(e.isOptionalMemberExpression()){if(function(e){for(;e&&!e.isProgram();){const{parentPath:t,container:n,listKey:r}=e,i=t.node;if(r){if(n!==i[r])return!0}else if(n!==i)return!0;e=t}return!1}(e))return;const u=e.find(({node:t,parent:n,parentPath:r})=>r.isOptionalMemberExpression()?n.optional||n.object!==t:!r.isOptionalCallExpression()||(t!==e.node&&n.optional||n.callee!==t));if(s.path.isPattern())return void u.replaceWith(r.callExpression(r.arrowFunctionExpression([],u.node),[]));const l=function e(t){const n=t,{node:r,parentPath:i}=n;if(i.isLogicalExpression()){const{operator:t,right:n}=i.node;if("&&"===t||"||"===t||"??"===t&&r===n)return e(i)}if(i.isSequenceExpression()){const{expressions:t}=i.node;return t[t.length-1]!==r||e(i)}return i.isConditional({test:r})||i.isUnaryExpression({operator:"!"})||i.isLoop({test:r})}(u),c=u.parentPath;if(c.isUpdateExpression({argument:n})||c.isAssignmentExpression({left:n}))throw e.buildCodeFrameError("can't handle assignment");const p=c.isUnaryExpression({operator:"delete"});if(p&&u.isOptionalMemberExpression()&&u.get("property").isPrivateName())throw e.buildCodeFrameError("can't delete a private class element");let f=e;for(;;)if(f.isOptionalMemberExpression()){if(f.node.optional)break;f=f.get("object")}else{if(!f.isOptionalCallExpression())throw new Error("Internal error: unexpected "+f.node.type);if(f.node.optional)break;f=f.get("callee")}const d=f.isOptionalMemberExpression()?"object":"callee",h=f.node[d],m=s.maybeGenerateMemoised(h),y=null!=m?m:h,g=o.isOptionalCallExpression({callee:n}),b=o.isCallExpression({callee:n});f.replaceWith(a(f,y)),g?i.optional?o.replaceWith(this.optionalCall(e,i.arguments)):o.replaceWith(this.call(e,i.arguments)):b?e.replaceWith(this.boundGet(e)):e.replaceWith(this.get(e));let v,E=e.node;for(let t=e;t!==u;){const{parentPath:e}=t;if(e===u&&g&&i.optional){E=e.node;break}E=a(e,E),t=e}const T=u.parentPath;if(r.isMemberExpression(E)&&T.isOptionalCallExpression({callee:u.node,optional:!0})){const{object:t}=E;v=e.scope.maybeGenerateMemoised(t),v&&(E.object=r.assignmentExpression("=",v,t))}let S=u;p&&(S=T,E=T.node);const x=m?r.assignmentExpression("=",r.cloneNode(y),r.cloneNode(h)):r.cloneNode(y);if(l){let e;e=t?r.binaryExpression("!=",x,r.nullLiteral()):r.logicalExpression("&&",r.binaryExpression("!==",x,r.nullLiteral()),r.binaryExpression("!==",r.cloneNode(y),s.buildUndefinedNode())),S.replaceWith(r.logicalExpression("&&",e,E))}else{let e;e=t?r.binaryExpression("==",x,r.nullLiteral()):r.logicalExpression("||",r.binaryExpression("===",x,r.nullLiteral()),r.binaryExpression("===",r.cloneNode(y),s.buildUndefinedNode())),S.replaceWith(r.conditionalExpression(e,p?r.booleanLiteral(!0):s.buildUndefinedNode(),E))}if(v){const e=T.node;T.replaceWith(r.optionalCallExpression(r.optionalMemberExpression(e.callee,r.identifier("call"),!1,!0),[r.cloneNode(v),...e.arguments],!1))}}else if(o.isUpdateExpression({argument:n})){if(this.simpleSet)return void e.replaceWith(this.simpleSet(e));const{operator:t,prefix:a}=i;this.memoise(e,2);const s=r.binaryExpression(t[0],r.unaryExpression("+",this.get(e)),r.numericLiteral(1));if(a)o.replaceWith(this.set(e,s));else{const{scope:t}=e,i=t.generateUidIdentifierBasedOnNode(n);t.push({id:i}),s.left=r.assignmentExpression("=",r.cloneNode(i),s.left),o.replaceWith(r.sequenceExpression([this.set(e,s),r.cloneNode(i)]))}}else if(o.isAssignmentExpression({left:n})){if(this.simpleSet)return void e.replaceWith(this.simpleSet(e));const{operator:t,right:n}=i;if("="===t)o.replaceWith(this.set(e,n));else{const i=t.slice(0,-1);r.LOGICAL_OPERATORS.includes(i)?(this.memoise(e,1),o.replaceWith(r.logicalExpression(i,this.get(e),this.set(e,n)))):(this.memoise(e,2),o.replaceWith(this.set(e,r.binaryExpression(i,this.get(e),n))))}}else{if(!o.isCallExpression({callee:n}))return o.isOptionalCallExpression({callee:n})?s.path.isPattern()?void o.replaceWith(r.callExpression(r.arrowFunctionExpression([],o.node),[])):void o.replaceWith(this.optionalCall(e,i.arguments)):void(o.isForXStatement({left:n})||o.isObjectProperty({value:n})&&o.parentPath.isObjectPattern()||o.isAssignmentPattern({left:n})&&o.parentPath.isObjectProperty({value:i})&&o.parentPath.parentPath.isObjectPattern()||o.isArrayPattern()||o.isAssignmentPattern({left:n})&&o.parentPath.isArrayPattern()||o.isRestElement()?e.replaceWith(this.destructureSet(e)):e.replaceWith(this.get(e)));o.replaceWith(this.call(e,i.arguments))}}};t.default=function(e,t,n){e.traverse(t,Object.assign({},o,n,{memoiser:new i}))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,i){return 1===n.length&&r.isSpreadElement(n[0])&&r.isIdentifier(n[0].argument,{name:"arguments"})?i?r.optionalCallExpression(r.optionalMemberExpression(e,r.identifier("apply"),!1,!0),[t,n[0].argument],!1):r.callExpression(r.memberExpression(e,r.identifier("apply")),[t,n[0].argument]):i?r.optionalCallExpression(r.optionalMemberExpression(e,r.identifier("call"),!1,!0),[t,...n],!1):r.callExpression(r.memberExpression(e,r.identifier("call")),[t,...n])};var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=i();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=r?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(n,a,o):n[a]=e[a]}n.default=e,t&&t.set(e,n);return n}(n(28));function i(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return i=function(){return e},e}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){const n=new Map,r=new Map,a=t=>{e.requeue(t)};for(const[i,o]of t.source){for(const[e,t]of o.imports)n.set(e,[i,t,null]);for(const e of o.importsNamespace)n.set(e,[i,null,e])}for(const[i,o]of t.local){let e=r.get(i);e||(e=[],r.set(i,e)),e.push(...o.names)}const u={metadata:t,requeueInParent:a,scope:e.scope,exported:r};e.traverse(s,u),(0,o.default)(e,new Set([...Array.from(n.keys()),...Array.from(r.keys())]));const l={seen:new WeakSet,metadata:t,requeueInParent:a,scope:e.scope,imported:n,exported:r,buildImportReference:([e,n,r],a)=>{const o=t.source.get(e);if(r)return o.lazy&&(a=i.callExpression(a,[])),a;let s=i.identifier(o.name);if(o.lazy&&(s=i.callExpression(s,[])),"default"===n&&"node-default"===o.interop)return s;const u=t.stringSpecifiers.has(n);return i.memberExpression(s,u?i.stringLiteral(n):i.identifier(n),u)}};e.traverse(c,l)};var r=n(184),i=n(28),a=n(143),o=n(757);const s={Scope(e){e.skip()},ClassDeclaration(e){const{requeueInParent:t,exported:n,metadata:r}=this,{id:a}=e.node;if(!a)throw new Error("Expected class to have a name");const o=a.name,s=n.get(o)||[];if(s.length>0){const n=i.expressionStatement(u(r,s,i.identifier(o)));n._blockHoist=e.node._blockHoist,t(e.insertAfter(n)[0])}},VariableDeclaration(e){const{requeueInParent:t,exported:n,metadata:r}=this;Object.keys(e.getOuterBindingIdentifiers()).forEach(a=>{const o=n.get(a)||[];if(o.length>0){const n=i.expressionStatement(u(r,o,i.identifier(a)));n._blockHoist=e.node._blockHoist,t(e.insertAfter(n)[0])}})}},u=(e,t,n)=>(t||[]).reduce((t,n)=>{const{stringSpecifiers:r}=e,a=r.has(n);return i.assignmentExpression("=",i.memberExpression(i.identifier(e.exportName),a?i.stringLiteral(n):i.identifier(n),a),t)},n),l=e=>a.default.expression.ast`
    (function() {
      throw new Error('"' + '${e}' + '" is read-only.');
    })()
  `,c={ReferencedIdentifier(e){const{seen:t,buildImportReference:n,scope:r,imported:a,requeueInParent:o}=this;if(t.has(e.node))return;t.add(e.node);const s=e.node.name,u=a.get(s);if(u){const t=e.scope.getBinding(s);if(r.getBinding(s)!==t)return;const a=n(u,e.node);if(a.loc=e.node.loc,(e.parentPath.isCallExpression({callee:e.node})||e.parentPath.isOptionalCallExpression({callee:e.node})||e.parentPath.isTaggedTemplateExpression({tag:e.node}))&&i.isMemberExpression(a))e.replaceWith(i.sequenceExpression([i.numericLiteral(0),a]));else if(e.isJSXIdentifier()&&i.isMemberExpression(a)){const{object:t,property:n}=a;e.replaceWith(i.jsxMemberExpression(i.jsxIdentifier(t.name),i.jsxIdentifier(n.name)))}else e.replaceWith(a);o(e),e.skip()}},AssignmentExpression:{exit(e){const{scope:t,seen:n,imported:a,exported:o,requeueInParent:s,buildImportReference:c}=this;if(n.has(e.node))return;n.add(e.node);const p=e.get("left");if(!p.isMemberExpression())if(p.isIdentifier()){const n=p.node.name;if(t.getBinding(n)!==e.scope.getBinding(n))return;const f=o.get(n),d=a.get(n);if((null==f?void 0:f.length)>0||d){r("="===e.node.operator,"Path was not simplified");const t=e.node;d&&(t.left=c(d,t.left),t.right=i.sequenceExpression([t.right,l(n)])),e.replaceWith(u(this.metadata,f,t)),s(e)}}else{const n=p.getOuterBindingIdentifiers(),r=Object.keys(n).filter(n=>t.getBinding(n)===e.scope.getBinding(n)),c=r.find(e=>a.has(e));c&&(e.node.right=i.sequenceExpression([e.node.right,l(c)]));const f=[];if(r.forEach(e=>{const t=o.get(e)||[];t.length>0&&f.push(u(this.metadata,t,i.identifier(e)))}),f.length>0){let t=i.sequenceExpression(f);e.parentPath.isExpressionStatement()&&(t=i.expressionStatement(t),t._blockHoist=e.parentPath.node._blockHoist);s(e.insertAfter(t)[0])}}}},"ForOfStatement|ForInStatement"(e){const{scope:t,node:n}=e,{left:r}=n,{exported:a,scope:o}=this;if(!i.isVariableDeclaration(r)){let n=!1;const s=e.get("body"),u=s.scope;for(const e of Object.keys(i.getOuterBindingIdentifiers(r)))a.get(e)&&o.getBinding(e)===t.getBinding(e)&&(n=!0,u.hasOwnBinding(e)&&u.rename(e));if(!n)return;const l=t.generateUidIdentifierBasedOnNode(r);s.unshiftContainer("body",i.expressionStatement(i.assignmentExpression("=",r,l))),e.get("left").replaceWith(i.variableDeclaration("let",[i.variableDeclarator(i.cloneNode(l))])),t.registerDeclaration(e.get("left"))}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){e.traverse(a,{scope:e.scope,bindingNames:t,seen:new WeakSet})};var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=i();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=r?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(n,a,o):n[a]=e[a]}n.default=e,t&&t.set(e,n);return n}(n(28));function i(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return i=function(){return e},e}const a={UpdateExpression:{exit(e){const{scope:t,bindingNames:n}=this,i=e.get("argument");if(!i.isIdentifier())return;const a=i.node.name;if(n.has(a)&&t.getBinding(a)===e.scope.getBinding(a))if(e.parentPath.isExpressionStatement()&&!e.isCompletionRecord()){const t="++"==e.node.operator?"+=":"-=";e.replaceWith(r.assignmentExpression(t,i.node,r.numericLiteral(1)))}else if(e.node.prefix)e.replaceWith(r.assignmentExpression("=",r.identifier(a),r.binaryExpression(e.node.operator[0],r.unaryExpression("+",i.node),r.numericLiteral(1))));else{const t=e.scope.generateUidIdentifierBasedOnNode(i.node,"old"),n=t.name;e.scope.push({id:t});const a=r.binaryExpression(e.node.operator[0],r.identifier(n),r.numericLiteral(1));e.replaceWith(r.sequenceExpression([r.assignmentExpression("=",r.identifier(n),r.unaryExpression("+",i.node)),r.assignmentExpression("=",r.cloneNode(i.node),a),r.identifier(n)]))}}},AssignmentExpression:{exit(e){const{scope:t,seen:n,bindingNames:i}=this;if("="===e.node.operator)return;if(n.has(e.node))return;n.add(e.node);const a=e.get("left");if(!a.isIdentifier())return;const o=a.node.name;i.has(o)&&t.getBinding(o)===e.scope.getBinding(o)&&(e.node.right=r.binaryExpression(e.node.operator.slice(0,-1),r.cloneNode(e.node.left),e.node.right),e.node.operator="=")}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.hasExports=function(e){return e.hasExports},t.isSideEffectImport=o,t.validateImportInteropOption=s,t.default=function(e,t,{importInterop:n,initializeReexports:i=!1,lazy:s=!1,esNamespaceOnly:p=!1}){t||(t=e.scope.generateUidIdentifier("exports").name);const f=new Set;!function(e){e.get("body").forEach(e=>{e.isExportDefaultDeclaration()&&(0,a.default)(e)})}(e);const{local:d,source:h,hasExports:m}=function(e,{lazy:t,initializeReexports:n},i){const a=function(e,t,n){const r=new Map;e.get("body").forEach(e=>{let n;if(e.isImportDeclaration())n="import";else{if(e.isExportDefaultDeclaration()&&(e=e.get("declaration")),e.isExportNamedDeclaration())if(e.node.declaration)e=e.get("declaration");else if(t&&e.node.source&&e.get("source").isStringLiteral())return void e.get("specifiers").forEach(e=>{c(e),r.set(e.get("local").node.name,"block")});if(e.isFunctionDeclaration())n="hoisted";else if(e.isClassDeclaration())n="block";else if(e.isVariableDeclaration({kind:"var"}))n="var";else{if(!e.isVariableDeclaration())return;n="block"}}Object.keys(e.getOuterBindingIdentifiers()).forEach(e=>{r.set(e,n)})});const i=new Map,a=e=>{const t=e.node.name;let n=i.get(t);if(!n){const a=r.get(t);if(void 0===a)throw e.buildCodeFrameError(`Exporting local "${t}", which is not declared.`);n={names:[],kind:a},i.set(t,n)}return n};return e.get("body").forEach(e=>{if(!e.isExportNamedDeclaration()||!t&&e.node.source){if(e.isExportDefaultDeclaration()){const t=e.get("declaration");if(!t.isFunctionDeclaration()&&!t.isClassDeclaration())throw t.buildCodeFrameError("Unexpected default expression export.");a(t.get("id")).names.push("default")}}else if(e.node.declaration){const t=e.get("declaration"),n=t.getOuterBindingIdentifierPaths();Object.keys(n).forEach(e=>{if("__esModule"===e)throw t.buildCodeFrameError('Illegal export "__esModule".');a(n[e]).names.push(e)})}else e.get("specifiers").forEach(e=>{const t=e.get("local"),r=e.get("exported"),i=a(t),o=l(r,n);if("__esModule"===o)throw r.buildCodeFrameError('Illegal export "__esModule".');i.names.push(o)})}),i}(e,n,i),s=new Map,u=t=>{const n=t.value;let i=s.get(n);return i||(i={name:e.scope.generateUidIdentifier((0,r.basename)(n,(0,r.extname)(n))).name,interop:"none",loc:null,imports:new Map,importsNamespace:new Set,reexports:new Map,reexportNamespace:new Set,reexportAll:null,lazy:!1,source:n},s.set(n,i)),i};let p=!1;e.get("body").forEach(e=>{if(e.isImportDeclaration()){const t=u(e.node.source);t.loc||(t.loc=e.node.loc),e.get("specifiers").forEach(e=>{if(e.isImportDefaultSpecifier()){const n=e.get("local").node.name;t.imports.set(n,"default");const r=a.get(n);r&&(a.delete(n),r.names.forEach(e=>{t.reexports.set(e,"default")}))}else if(e.isImportNamespaceSpecifier()){const n=e.get("local").node.name;t.importsNamespace.add(n);const r=a.get(n);r&&(a.delete(n),r.names.forEach(e=>{t.reexportNamespace.add(e)}))}else if(e.isImportSpecifier()){const n=l(e.get("imported"),i),r=e.get("local").node.name;t.imports.set(r,n);const o=a.get(r);o&&(a.delete(r),o.names.forEach(e=>{t.reexports.set(e,n)}))}})}else if(e.isExportAllDeclaration()){p=!0;const t=u(e.node.source);t.loc||(t.loc=e.node.loc),t.reexportAll={loc:e.node.loc}}else if(e.isExportNamedDeclaration()&&e.node.source){p=!0;const t=u(e.node.source);t.loc||(t.loc=e.node.loc),e.get("specifiers").forEach(e=>{c(e);const n=l(e.get("local"),i),r=l(e.get("exported"),i);if(t.reexports.set(r,n),"__esModule"===r)throw e.get("exported").buildCodeFrameError('Illegal export "__esModule".')})}else(e.isExportNamedDeclaration()||e.isExportDefaultDeclaration())&&(p=!0)});for(const r of s.values()){let e=!1,t=!1;r.importsNamespace.size>0&&(e=!0,t=!0),r.reexportAll&&(t=!0);for(const n of r.imports.values())"default"===n?e=!0:t=!0;for(const n of r.reexports.values())"default"===n?e=!0:t=!0;e&&t?r.interop="namespace":e&&(r.interop="default")}for(const[r,l]of s)if(!1!==t&&!o(l)&&!l.reexportAll)if(!0===t)l.lazy=!/\./.test(r);else if(Array.isArray(t))l.lazy=-1!==t.indexOf(r);else{if("function"!==typeof t)throw new Error(".lazy must be a boolean, string array, or function");l.lazy=t(r)}return{hasExports:p,local:a,source:s}}(e,{initializeReexports:i,lazy:s},f);!function(e){e.get("body").forEach(e=>{if(e.isImportDeclaration())e.remove();else if(e.isExportNamedDeclaration())e.node.declaration?(e.node.declaration._blockHoist=e.node._blockHoist,e.replaceWith(e.node.declaration)):e.remove();else if(e.isExportDefaultDeclaration()){const t=e.get("declaration");if(!t.isFunctionDeclaration()&&!t.isClassDeclaration())throw t.buildCodeFrameError("Unexpected default expression export.");t._blockHoist=e.node._blockHoist,e.replaceWith(t)}else e.isExportAllDeclaration()&&e.remove()})}(e);for(const[,r]of h){r.importsNamespace.size>0&&(r.name=r.importsNamespace.values().next().value);const e=u(n,r.source);"none"===e?r.interop="none":"node"===e&&"namespace"===r.interop?r.interop="node-namespace":"node"===e&&"default"===r.interop?r.interop="node-default":p&&"namespace"===r.interop&&(r.interop="default")}return{exportName:t,exportNameListName:null,hasExports:m,local:d,source:h,stringSpecifiers:f}};var r=n(109),i=n(121),a=n(394);function o(e){return 0===e.imports.size&&0===e.importsNamespace.size&&0===e.reexports.size&&0===e.reexportNamespace.size&&!e.reexportAll}function s(e){if("function"!==typeof e&&"none"!==e&&"babel"!==e&&"node"!==e)throw new Error(`.importInterop must be one of "none", "babel", "node", or a function returning one of those values (received ${e}).`);return e}function u(e,t){return"function"===typeof e?s(e(t)):e}function l(e,t){if(e.isIdentifier())return e.node.name;if(e.isStringLiteral()){const n=e.node.value;return(0,i.isIdentifierName)(n)||t.add(n),n}throw new Error("Expected export specifier to be either Identifier or StringLiteral, got "+e.node.type)}function c(e){if(!e.isExportSpecifier())throw e.isExportNamespaceSpecifier()?e.buildCodeFrameError("Export namespace should be first transformed by `@babel/plugin-proposal-export-namespace-from`."):e.buildCodeFrameError("Unexpected export specifier type")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;{const e=r;t.default=r=function(t,n){var r,i,a,o;return e(t,{moduleId:null!=(r=n.moduleId)?r:t.moduleId,moduleIds:null!=(i=n.moduleIds)?i:t.moduleIds,getModuleId:null!=(a=n.getModuleId)?a:t.getModuleId,moduleRoot:null!=(o=n.moduleRoot)?o:t.moduleRoot})}}function r(e,t){const{filename:n,filenameRelative:r=n,sourceRoot:i=t.moduleRoot}=e,{moduleId:a,moduleIds:o=!!a,getModuleId:s,moduleRoot:u=i}=t;if(!o)return null;if(null!=a&&!s)return a;let l=null!=u?u+"/":"";if(r){const e=null!=i?new RegExp("^"+i+"/?"):"";l+=r.replace(e,"").replace(/\.(\w*?)$/,"")}return l=l.replace(/\\/g,"/"),s&&s(l)||l}},function(e,t,n){"use strict";function r(){const e=n(434);return r=function(){return e},e}function i(){const e=n(217);return i=function(){return e},e}function a(){const e=n(143);return a=function(){return e},e}function o(){const e=n(28);return o=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t="global"){let n;const r={global:u,module:l,umd:c,var:p}[t];if(!r)throw new Error("Unsupported output type "+t);n=r(e);return(0,i().default)(n).code};var s=n(314);function u(e){const t=o().identifier("babelHelpers"),n=[],r=o().functionExpression(null,[o().identifier("global")],o().blockStatement(n)),i=o().program([o().expressionStatement(o().callExpression(r,[o().conditionalExpression(o().binaryExpression("===",o().unaryExpression("typeof",o().identifier("global")),o().stringLiteral("undefined")),o().identifier("self"),o().identifier("global"))]))]);return n.push(o().variableDeclaration("var",[o().variableDeclarator(t,o().assignmentExpression("=",o().memberExpression(o().identifier("global"),t),o().objectExpression([])))])),f(n,t,e),i}function l(e){const t=[],n=f(t,null,e);return t.unshift(o().exportNamedDeclaration(null,Object.keys(n).map(e=>o().exportSpecifier(o().cloneNode(n[e]),o().identifier(e))))),o().program(t,[],"module")}function c(e){const t=o().identifier("babelHelpers"),n=[];return n.push(o().variableDeclaration("var",[o().variableDeclarator(t,o().identifier("global"))])),f(n,t,e),o().program([(r={FACTORY_PARAMETERS:o().identifier("global"),BROWSER_ARGUMENTS:o().assignmentExpression("=",o().memberExpression(o().identifier("root"),t),o().objectExpression([])),COMMON_ARGUMENTS:o().identifier("exports"),AMD_ARGUMENTS:o().arrayExpression([o().stringLiteral("exports")]),FACTORY_BODY:n,UMD_ROOT:o().identifier("this")},a().default`
    (function (root, factory) {
      if (typeof define === "function" && define.amd) {
        define(AMD_ARGUMENTS, factory);
      } else if (typeof exports === "object") {
        factory(COMMON_ARGUMENTS);
      } else {
        factory(BROWSER_ARGUMENTS);
      }
    })(UMD_ROOT, function (FACTORY_PARAMETERS) {
      FACTORY_BODY
    });
  `(r))]);var r}function p(e){const t=o().identifier("babelHelpers"),n=[];n.push(o().variableDeclaration("var",[o().variableDeclarator(t,o().objectExpression([]))]));const r=o().program(n);return f(n,t,e),n.push(o().expressionStatement(t)),r}function f(e,t,n){const i=e=>t?o().memberExpression(t,o().identifier(e)):o().identifier("_"+e),a={};return r().list.forEach((function(t){if(n&&n.indexOf(t)<0)return;const o=a[t]=i(t);r().ensure(t,s.default);const{nodes:u}=r().get(t,i,o);e.push(...u)})),a}},function(e,t,n){"use strict";function r(){const e=n(99);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(438),a=n(315),o=n(313),s=n(225),u=n(226),l=n(446);function c(){const e=n(82);return c=function(){return e},e}var p=n(227),f=n(228),d=n(785),h=n(786),m=n(449),y=(n(448),r()((function*(e){var t;const n=yield*(0,m.default)(e);if(!n)return null;const{options:r,context:i,fileHandling:o}=n;if("ignored"===o)return null;const s={},{plugins:l,presets:c}=r;if(!l||!c)throw new Error("Assertion failure - plugins and presets exist");const p=Object.assign({},i,{targets:r.targets}),d=e=>{const t=(0,u.getItemDescriptor)(e);if(!t)throw new Error("Assertion failure - must be config item");return t},h=c.map(d),y=l.map(d),b=[[]],v=[];if(yield*g(i,(function*e(t,n){const r=[];for(let a=0;a<t.length;a++){const e=t[a];if(!1!==e.options)try{e.ownPass?r.push({preset:yield*P(e,p),pass:[]}):r.unshift({preset:yield*P(e,p),pass:n})}catch(i){throw"BABEL_UNKNOWN_OPTION"===i.code&&(0,f.checkNoUnwrappedItemOptionPairs)(t,a,"preset",i),i}}if(r.length>0){b.splice(1,0,...r.map(e=>e.pass).filter(e=>e!==n));for(const{preset:t,pass:n}of r){if(!t)return!0;n.push(...t.plugins);if(yield*e(t.presets,n))return!0;t.options.forEach(e=>{(0,a.mergeOptions)(s,e)})}}}))(h,b[0]))return null;const E=s;(0,a.mergeOptions)(E,r);const S=Object.assign({},p,{assumptions:null!=(t=E.assumptions)?t:{}});return yield*g(i,(function*(){b[0].unshift(...y);for(const t of b){const n=[];v.push(n);for(let r=0;r<t.length;r++){const i=t[r];if(!1!==i.options)try{n.push(yield*T(i,S))}catch(e){throw"BABEL_UNKNOWN_PLUGIN_PROPERTY"===e.code&&(0,f.checkNoUnwrappedItemOptionPairs)(t,r,"plugin",e),e}}}}))(),E.plugins=v[0],E.presets=v.slice(1).filter(e=>e.length>0).map(e=>({plugins:e})),E.passPerPreset=E.presets.length>0,{options:E,passes:v}})));function g(e,t){return function*(n,r){try{return yield*t(n,r)}catch(i){throw/^\[BABEL\]/.test(i.message)||(i.message=`[BABEL] ${e.filename||"unknown"}: ${i.message}`),i}}}t.default=y;const b=e=>(0,p.makeWeakCache)((function*({value:t,options:n,dirname:r,alias:a},s){if(!1===n)throw new Error("Assertion failure");n=n||{};let u=t;if("function"===typeof t){const c=(0,i.maybeAsync)(t,"You appear to be using an async plugin/preset, but Babel has been called synchronously"),p=Object.assign({},o,e(s));try{u=yield*c(p,n,r)}catch(l){throw a&&(l.message+=` (While processing: ${JSON.stringify(a)})`),l}}if(!u||"object"!==typeof u)throw new Error("Plugin/Preset did not return an object.");if((0,i.isThenable)(u))throw yield*[],new Error(`You appear to be using a promise as a plugin, which your current version of Babel does not support. If you're using a published plugin, you may need to upgrade your @babel/core version. As an alternative, you can prefix the promise with "await". (While processing: ${JSON.stringify(a)})`);return{value:u,options:n,dirname:r,alias:a}})),v=b(h.makePluginAPI),E=b(h.makePresetAPI);function*T(e,t){if(e.value instanceof s.default){if(e.options)throw new Error("Passed options to an existing Plugin instance will not work.");return e.value}return yield*S(yield*v(e,t),t)}const S=(0,p.makeWeakCache)((function*({value:e,options:t,dirname:n,alias:r},a){const o=(0,d.validatePluginObject)(e),u=Object.assign({},o);if(u.visitor&&(u.visitor=c().default.explode(Object.assign({},u.visitor))),u.inherits){const e={name:void 0,alias:r+"$inherits",value:u.inherits,options:t,dirname:n},o=yield*(0,i.forwardAsync)(T,t=>a.invalidate(n=>t(e,n)));u.pre=A(o.pre,u.pre),u.post=A(o.post,u.post),u.manipulateOptions=A(o.manipulateOptions,u.manipulateOptions),u.visitor=c().default.visitors.merge([o.visitor||{},u.visitor||{}])}return new s.default(u,t,r)})),x=(e,t)=>{if(e.test||e.include||e.exclude){const e=t.name?`"${t.name}"`:"/* your preset */";throw new Error([`Preset ${e} requires a filename to be set when babel is called directly,`,"```",`babel.transform(code, { filename: 'file.ts', presets: [${e}] });`,"```","See https://babeljs.io/docs/en/options#filename for more information."].join("\n"))}};function*P(e,t){const n=_(yield*E(e,t));return((e,t,n)=>{if(!t.filename){const{options:t}=e;x(t,n),t.overrides&&t.overrides.forEach(e=>x(e,n))}})(n,t,e),yield*(0,l.buildPresetChain)(n,t)}const _=(0,p.makeWeakCacheSync)(({value:e,dirname:t,alias:n})=>({options:(0,f.validate)("preset",e),alias:n,dirname:t}));function A(e,t){const n=[e,t].filter(Boolean);return n.length<=1?n[0]:function(...e){for(const t of n)t.apply(this,e)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OptionValidator=void 0;var r=n(443);t.OptionValidator=class{constructor(e){this.descriptor=e}validateTopLevelOptions(e,t){const n=Object.keys(t);for(const i of Object.keys(e))if(!n.includes(i))throw new Error(this.formatMessage(`'${i}' is not a valid top-level option.\n- Did you mean '${(0,r.findSuggestion)(i,n)}'?`))}validateBooleanOption(e,t,n){return void 0===t?n:(this.invariant("boolean"===typeof t,`'${e}' option must be a boolean.`),t)}validateStringOption(e,t,n){return void 0===t?n:(this.invariant("string"===typeof t,`'${e}' option must be a string.`),t)}invariant(e,t){if(!e)throw new Error(this.formatMessage(t))}formatMessage(e){return`${this.descriptor}: ${e}`}}},function(e,t,n){e.exports=n(764)},function(e){e.exports=JSON.parse('{"es6.module":{"chrome":"61","and_chr":"61","edge":"16","firefox":"60","and_ff":"60","node":"13.2.0","opera":"48","op_mob":"48","safari":"10.1","ios":"10.3","samsung":"8.2","android":"61","electron":"2.0","ios_saf":"10.3"}}')},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TargetNames=void 0;t.TargetNames={node:"node",chrome:"chrome",opera:"opera",edge:"edge",firefox:"firefox",safari:"safari",ie:"ie",ios:"ios",android:"android",electron:"electron",samsung:"samsung"}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getInclusionReasons=function(e,t,n){const o=n[e]||{};return Object.keys(t).reduce((e,n)=>{const s=(0,i.getLowestImplementedVersion)(o,n),u=t[n];if(s){const t=(0,i.isUnreleasedVersion)(s,n);(0,i.isUnreleasedVersion)(u,n)||!t&&!a.lt(u.toString(),(0,i.semverify)(s))||(e[n]=(0,r.prettifyVersion)(u))}else e[n]=(0,r.prettifyVersion)(u);return e},{})};var r=n(444),i=n(316);const a=n(158)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.targetsSupported=s,t.isRequired=u,t.default=function(e,t,n,r,i,a,o){const s=new Set,l={compatData:e,includes:t,excludes:n};for(const c in e)if(u(c,r,l))s.add(c);else if(o){const e=o.get(c);e&&s.add(e)}i&&i.forEach(e=>!n.has(e)&&s.add(e));a&&a.forEach(e=>!t.has(e)&&s.delete(e));return s};var r,i=(r=n(768))&&r.__esModule?r:{default:r},a=n(316);const o=n(158);function s(e,t){const n=Object.keys(e);if(0===n.length)return!1;return 0===n.filter(n=>{const r=(0,a.getLowestImplementedVersion)(t,n);if(!r)return!0;const i=e[n];if((0,a.isUnreleasedVersion)(i,n))return!1;if((0,a.isUnreleasedVersion)(r,n))return!0;if(!o.valid(i.toString()))throw new Error(`Invalid version passed for target "${n}": "${i}". Versions must be in semver format (major.minor.patch)`);return o.gt((0,a.semverify)(r),i.toString())}).length}function u(e,t,{compatData:n=i.default,includes:r,excludes:a}={}){return(null==a||!a.has(e))&&(!(null==r||!r.has(e))||!s(t,n[e]))}},function(e,t,n){e.exports=n(769)},function(e){e.exports=JSON.parse('{"proposal-class-static-block":{"chrome":"91"},"proposal-private-property-in-object":{"chrome":"91"},"proposal-class-properties":{"chrome":"74","opera":"62","edge":"79","safari":"14.1","node":"12","samsung":"11","electron":"6.0"},"proposal-private-methods":{"chrome":"84","opera":"70","edge":"84","node":"14.6","electron":"10.0"},"proposal-numeric-separator":{"chrome":"75","opera":"62","edge":"79","firefox":"70","safari":"13","node":"12.5","ios":"13","samsung":"11","electron":"6.0"},"proposal-logical-assignment-operators":{"chrome":"85","opera":"71","edge":"85","firefox":"79","safari":"14","node":"15","ios":"14","electron":"10.0"},"proposal-nullish-coalescing-operator":{"chrome":"80","opera":"67","edge":"80","firefox":"72","safari":"13.1","node":"14","ios":"13.4","samsung":"13","electron":"8.0"},"proposal-optional-chaining":{"firefox":"74","safari":"13.1","ios":"13.4"},"proposal-json-strings":{"chrome":"66","opera":"53","edge":"79","firefox":"62","safari":"12","node":"10","ios":"12","samsung":"9","electron":"3.0"},"proposal-optional-catch-binding":{"chrome":"66","opera":"53","edge":"79","firefox":"58","safari":"11.1","node":"10","ios":"11.3","samsung":"9","electron":"3.0"},"transform-parameters":{"chrome":"49","opera":"36","edge":"18","firefox":"53","safari":"10","node":"6","ios":"10","samsung":"5","electron":"0.37"},"proposal-async-generator-functions":{"chrome":"63","opera":"50","edge":"79","firefox":"57","safari":"12","node":"10","ios":"12","samsung":"8","electron":"3.0"},"proposal-object-rest-spread":{"chrome":"60","opera":"47","edge":"79","firefox":"55","safari":"11.1","node":"8.3","ios":"11.3","samsung":"8","electron":"2.0"},"transform-dotall-regex":{"chrome":"62","opera":"49","edge":"79","firefox":"78","safari":"11.1","node":"8.10","ios":"11.3","samsung":"8","electron":"3.0"},"proposal-unicode-property-regex":{"chrome":"64","opera":"51","edge":"79","firefox":"78","safari":"11.1","node":"10","ios":"11.3","samsung":"9","electron":"3.0"},"transform-named-capturing-groups-regex":{"chrome":"64","opera":"51","edge":"79","firefox":"78","safari":"11.1","node":"10","ios":"11.3","samsung":"9","electron":"3.0"},"transform-async-to-generator":{"chrome":"55","opera":"42","edge":"15","firefox":"52","safari":"11","node":"7.6","ios":"11","samsung":"6","electron":"1.6"},"transform-exponentiation-operator":{"chrome":"52","opera":"39","edge":"14","firefox":"52","safari":"10.1","node":"7","ios":"10.3","samsung":"6","electron":"1.3"},"transform-template-literals":{"chrome":"41","opera":"28","edge":"13","firefox":"34","safari":"13","node":"4","ios":"13","samsung":"3.4","electron":"0.21"},"transform-literals":{"chrome":"44","opera":"31","edge":"12","firefox":"53","safari":"9","node":"4","ios":"9","samsung":"4","electron":"0.30"},"transform-function-name":{"chrome":"51","opera":"38","edge":"79","firefox":"53","safari":"10","node":"6.5","ios":"10","samsung":"5","electron":"1.2"},"transform-arrow-functions":{"chrome":"47","opera":"34","edge":"13","firefox":"45","safari":"10","node":"6","ios":"10","samsung":"5","electron":"0.36"},"transform-block-scoped-functions":{"chrome":"41","opera":"28","edge":"12","firefox":"46","safari":"10","node":"4","ie":"11","ios":"10","samsung":"3.4","electron":"0.21"},"transform-classes":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","ios":"10","samsung":"5","electron":"0.36"},"transform-object-super":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","ios":"10","samsung":"5","electron":"0.36"},"transform-shorthand-properties":{"chrome":"43","opera":"30","edge":"12","firefox":"33","safari":"9","node":"4","ios":"9","samsung":"4","electron":"0.27"},"transform-duplicate-keys":{"chrome":"42","opera":"29","edge":"12","firefox":"34","safari":"9","node":"4","ios":"9","samsung":"3.4","electron":"0.25"},"transform-computed-properties":{"chrome":"44","opera":"31","edge":"12","firefox":"34","safari":"7.1","node":"4","ios":"8","samsung":"4","electron":"0.30"},"transform-for-of":{"chrome":"51","opera":"38","edge":"15","firefox":"53","safari":"10","node":"6.5","ios":"10","samsung":"5","electron":"1.2"},"transform-sticky-regex":{"chrome":"49","opera":"36","edge":"13","firefox":"3","safari":"10","node":"6","ios":"10","samsung":"5","electron":"0.37"},"transform-unicode-escapes":{"chrome":"44","opera":"31","edge":"12","firefox":"53","safari":"9","node":"4","ios":"9","samsung":"4","electron":"0.30"},"transform-unicode-regex":{"chrome":"50","opera":"37","edge":"13","firefox":"46","safari":"12","node":"6","ios":"12","samsung":"5","electron":"1.1"},"transform-spread":{"chrome":"46","opera":"33","edge":"13","firefox":"45","safari":"10","node":"5","ios":"10","samsung":"5","electron":"0.36"},"transform-destructuring":{"chrome":"51","opera":"38","edge":"15","firefox":"53","safari":"10","node":"6.5","ios":"10","samsung":"5","electron":"1.2"},"transform-block-scoping":{"chrome":"49","opera":"36","edge":"14","firefox":"51","safari":"11","node":"6","ios":"11","samsung":"5","electron":"0.37"},"transform-typeof-symbol":{"chrome":"38","opera":"25","edge":"12","firefox":"36","safari":"9","node":"0.12","ios":"9","samsung":"3","electron":"0.20"},"transform-new-target":{"chrome":"46","opera":"33","edge":"14","firefox":"41","safari":"10","node":"5","ios":"10","samsung":"5","electron":"0.36"},"transform-regenerator":{"chrome":"50","opera":"37","edge":"13","firefox":"53","safari":"10","node":"6","ios":"10","samsung":"5","electron":"1.1"},"transform-member-expression-literals":{"chrome":"7","opera":"12","edge":"12","firefox":"2","safari":"5.1","node":"0.10","ie":"9","android":"4","ios":"6","phantom":"2","samsung":"1","electron":"0.20"},"transform-property-literals":{"chrome":"7","opera":"12","edge":"12","firefox":"2","safari":"5.1","node":"0.10","ie":"9","android":"4","ios":"6","phantom":"2","samsung":"1","electron":"0.20"},"transform-reserved-words":{"chrome":"13","opera":"10.50","edge":"12","firefox":"2","safari":"3.1","node":"0.10","ie":"9","android":"4.4","ios":"6","phantom":"2","samsung":"1","electron":"0.20"},"proposal-export-namespace-from":{"chrome":"72","and_chr":"72","edge":"79","firefox":"80","and_ff":"80","node":"13.2","opera":"60","op_mob":"51","samsung":"11.0","android":"72","electron":"5.0"}}')},function(e,t,n){var r=n(771),i=n(772).agents,a=n(778),o=n(779),s=n(780),u=n(445),l=n(781);function c(e,t){return 0===(e+".").indexOf(t+".")}function p(e){return e.filter((function(e){return"string"===typeof e}))}function f(e){var t=e;return 3===e.split(".").length&&(t=e.split(".").slice(0,-1).join(".")),t}function d(e){return function(t){return e+" "+t}}function h(e){return parseInt(e.split(".")[0])}function m(e,t){if(0===e.length)return[];var n=y(e.map(h)),r=n[n.length-t];if(!r)return e;for(var i=[],a=e.length-1;a>=0&&!(r>h(e[a]));a--)i.unshift(e[a]);return i}function y(e){for(var t=[],n=0;n<e.length;n++)-1===t.indexOf(e[n])&&t.push(e[n]);return t}function g(e,t,n){for(var r in n)e[t+" "+r]=n[r]}function b(e,t){return t=parseFloat(t),">"===e?function(e){return parseFloat(e)>t}:">="===e?function(e){return parseFloat(e)>=t}:"<"===e?function(e){return parseFloat(e)<t}:function(e){return parseFloat(e)<=t}}function v(e){return parseInt(e)}function E(e,t){return e<t?-1:e>t?1:0}function T(e,t){return E(parseInt(e[0]),parseInt(t[0]))||E(parseInt(e[1]||"0"),parseInt(t[1]||"0"))||E(parseInt(e[2]||"0"),parseInt(t[2]||"0"))}function S(e,t){switch("undefined"===typeof(t=t.split(".").map(v))[1]&&(t[1]="x"),e){case"<=":return function(e){return x(e=e.split(".").map(v),t)<=0};default:case">=":return function(e){return x(e=e.split(".").map(v),t)>=0}}}function x(e,t){return e[0]!==t[0]?e[0]<t[0]?-1:1:"x"===t[1]?0:e[1]!==t[1]?e[1]<t[1]?-1:1:0}function P(e,t){var n=function(e,t){return-1!==e.versions.indexOf(t)?t:!!N.versionAliases[e.name][t]&&N.versionAliases[e.name][t]}(e,t);return n||1===e.versions.length&&e.versions[0]}function _(e,t){return e/=1e3,Object.keys(i).reduce((function(n,r){var i=w(r,t);if(!i)return n;var a=Object.keys(i.releaseDate).filter((function(t){return i.releaseDate[t]>=e}));return n.concat(a.map(d(i.name)))}),[])}function A(e){return{name:e.name,versions:e.versions,released:e.released,releaseDate:e.releaseDate}}function w(e,t){if(e=e.toLowerCase(),e=N.aliases[e]||e,t.mobileToDesktop&&N.desktopNames[e]){var n=N.data[N.desktopNames[e]];if("android"===e)return i=A(N.data[e]),a=n,i.released=O(i.released,a.released),i.versions=O(i.versions,a.versions),i;var r=A(n);return r.name=e,"op_mob"===e&&(r=function(e,t){e.versions=e.versions.map((function(e){return t[e]||e})),e.released=e.versions.map((function(e){return t[e]||e}));var n={};for(var r in e.releaseDate)n[t[r]||r]=e.releaseDate[r];return e.releaseDate=n,e}(r,{"10.0-10.1":"10"})),r}var i,a;return N.data[e]}function O(e,t){var n=t[t.length-1];return e.filter((function(e){return/^(?:[2-4]\.|[34]$)/.test(e)})).concat(t.slice(37-n-1))}function k(e,t){var n=w(e,t);if(!n)throw new u("Unknown browser "+e);return n}function C(e){return new u("Unknown browser query `"+e+"`. Maybe you are using old Browserslist or made typo in query.")}function D(e,t,n){if(n.mobileToDesktop)return e;var r=N.data.android.released,i=r[r.length-1]-37-t;return i>0?e.slice(-1):e.slice(i-1)}function j(e,t){return(e=Array.isArray(e)?function e(t){return Array.isArray(t)?t.reduce((function(t,n){return t.concat(e(n))}),[]):[t]}(e.map(R)):R(e)).reduce((function(e,n,r){var i=n.queryString,a=0===i.indexOf("not ");if(a){if(0===r)throw new u("Write any browsers query (for instance, `defaults`) before `"+i+"`");i=i.slice(4)}for(var o=0;o<V.length;o++){var s=V[o],l=i.match(s.regexp);if(l){var c=[t].concat(l.slice(1)),p=s.select.apply(N,c).map((function(e){var n=e.split(" ");return"0"===n[1]?n[0]+" "+w(n[0],t).versions[0]:e}));switch(n.type){case 2:return a?e.filter((function(e){return-1===p.indexOf(e)})):e.filter((function(e){return-1!==p.indexOf(e)}));case 1:default:if(a){var f={};return p.forEach((function(e){f[e]=!0})),e.filter((function(e){return!f[e]}))}return e.concat(p)}}}throw C(i)}),[])}var I={};function N(e,t){if("undefined"===typeof t&&(t={}),"undefined"===typeof t.path&&(t.path=o.resolve?o.resolve("."):"."),"undefined"===typeof e||null===e){var n=N.loadConfig(t);e=n||N.defaults}if("string"!==typeof e&&!Array.isArray(e))throw new u("Browser queries must be an array or string. Got "+typeof e+".");var r={ignoreUnknownVersions:t.ignoreUnknownVersions,dangerousExtend:t.dangerousExtend,mobileToDesktop:t.mobileToDesktop,path:t.path,env:t.env};l.oldDataWarning(N.data);var i=l.getStat(t,N.data);if(i)for(var a in r.customUsage={},i)g(r.customUsage,a,i[a]);var s=JSON.stringify([e,r]);if(I[s])return I[s];var c=y(j(e,r)).sort((function(e,t){if(e=e.split(" "),t=t.split(" "),e[0]===t[0]){var n=e[1].split("-")[0];return T(t[1].split("-")[0].split("."),n.split("."))}return E(e[0],t[0])}));return Object({NODE_ENV:"production",PUBLIC_URL:"",APP_MANIFEST:{name:"unikit-example",slug:"unikit-example",description:"Example app for unikit",privacy:"public",version:"1.0.0",platforms:["ios","android","web"],assetBundlePatterns:["**/*"],_internal:{isDebug:!1,projectRoot:"/Users/kations/Projekte/unikit/unikit/example",dynamicConfigPath:null,staticConfigPath:"/Users/kations/Projekte/unikit/unikit/example/app.json",packageJsonPath:"/Users/kations/Projekte/unikit/unikit/example/package.json"},sdkVersion:"41.0.0",web:{}}}).BROWSERSLIST_DISABLE_CACHE||(I[s]=c),c}function R(e){var t=[];do{e=M(e,t)}while(e);return t}function M(e,t){var n=/^(?:,\s*|\s+or\s+)(.*)/i,r=/^\s+and\s+(.*)/i;return function(e,t){for(var n=1,r=e.length;n<=r;n++){var i=e.substr(-n,n);if(t(i,n,r))return e.slice(0,-n)}return""}(e,(function(e,i,a){return r.test(e)?(t.unshift({type:2,queryString:e.match(r)[1]}),!0):n.test(e)?(t.unshift({type:1,queryString:e.match(n)[1]}),!0):i===a&&(t.unshift({type:1,queryString:e.trim()}),!0)}))}function L(e,t){var n=r.filter((function(e){return"nodejs"===e.name})).filter((function(e){return c(e.version,t)}));if(0===n.length){if(e.ignoreUnknownVersions)return[];throw new u("Unknown version "+t+" of Node.js")}return["node "+n[n.length-1].version]}function F(e,t,n,r){return t=parseInt(t),n=parseInt(n||"01")-1,r=parseInt(r||"01"),_(Date.UTC(t,n,r,0,0,0),e)}function B(e,t,n){t=parseFloat(t);var r=N.usage.global;if(n)if(n.match(/^my\s+stats$/)){if(!e.customUsage)throw new u("Custom usage statistics was not provided");r=e.customUsage}else{var i;i=2===n.length?n.toUpperCase():n.toLowerCase(),l.loadCountry(N.usage,i,N.data),r=N.usage[i]}for(var a,o=Object.keys(r).sort((function(e,t){return r[t]-r[e]})),s=0,c=[],p=0;p<=o.length&&(a=o[p],0!==r[a])&&(s+=r[a],c.push(a),!(s>=t));p++);return c}N.cache={},N.data={},N.usage={global:{},custom:null},N.defaults=["> 0.5%","last 2 versions","Firefox ESR","not dead"],N.aliases={fx:"firefox",ff:"firefox",ios:"ios_saf",explorer:"ie",blackberry:"bb",explorermobile:"ie_mob",operamini:"op_mini",operamobile:"op_mob",chromeandroid:"and_chr",firefoxandroid:"and_ff",ucandroid:"and_uc",qqandroid:"and_qq"},N.desktopNames={and_chr:"chrome",and_ff:"firefox",ie_mob:"ie",op_mob:"opera",android:"chrome"},N.versionAliases={},N.clearCaches=l.clearCaches,N.parseConfig=l.parseConfig,N.readConfig=l.readConfig,N.findConfig=l.findConfig,N.loadConfig=l.loadConfig,N.coverage=function(e,t){var n;if("undefined"===typeof t)n=N.usage.global;else if("my stats"===t){var r={};r.path=o.resolve?o.resolve("."):".";var i=l.getStat(r);if(!i)throw new u("Custom usage statistics was not provided");for(var a in n={},i)g(n,a,i[a])}else if("string"===typeof t)t=t.length>2?t.toLowerCase():t.toUpperCase(),l.loadCountry(N.usage,t,N.data),n=N.usage[t];else for(var s in"dataByBrowser"in t&&(t=t.dataByBrowser),n={},t)for(var c in t[s])n[s+" "+c]=t[s][c];return e.reduce((function(e,t){var r=n[t];return void 0===r&&(r=n[t.replace(/ \S+$/," 0")]),e+(r||0)}),0)};var V=[{regexp:/^last\s+(\d+)\s+major\s+versions?$/i,select:function(e,t){return Object.keys(i).reduce((function(n,r){var i=w(r,e);if(!i)return n;var a=m(i.released,t);return a=a.map(d(i.name)),"android"===i.name&&(a=D(a,t,e)),n.concat(a)}),[])}},{regexp:/^last\s+(\d+)\s+versions?$/i,select:function(e,t){return Object.keys(i).reduce((function(n,r){var i=w(r,e);if(!i)return n;var a=i.released.slice(-t);return a=a.map(d(i.name)),"android"===i.name&&(a=D(a,t,e)),n.concat(a)}),[])}},{regexp:/^last\s+(\d+)\s+electron\s+major\s+versions?$/i,select:function(e,t){return m(Object.keys(s),t).map((function(e){return"chrome "+s[e]}))}},{regexp:/^last\s+(\d+)\s+(\w+)\s+major\s+versions?$/i,select:function(e,t,n){var r=k(n,e),i=m(r.released,t).map(d(r.name));return"android"===r.name&&(i=D(i,t,e)),i}},{regexp:/^last\s+(\d+)\s+electron\s+versions?$/i,select:function(e,t){return Object.keys(s).slice(-t).map((function(e){return"chrome "+s[e]}))}},{regexp:/^last\s+(\d+)\s+(\w+)\s+versions?$/i,select:function(e,t,n){var r=k(n,e),i=r.released.slice(-t).map(d(r.name));return"android"===r.name&&(i=D(i,t,e)),i}},{regexp:/^unreleased\s+versions$/i,select:function(e){return Object.keys(i).reduce((function(t,n){var r=w(n,e);if(!r)return t;var i=r.versions.filter((function(e){return-1===r.released.indexOf(e)}));return i=i.map(d(r.name)),t.concat(i)}),[])}},{regexp:/^unreleased\s+electron\s+versions?$/i,select:function(){return[]}},{regexp:/^unreleased\s+(\w+)\s+versions?$/i,select:function(e,t){var n=k(t,e);return n.versions.filter((function(e){return-1===n.released.indexOf(e)})).map(d(n.name))}},{regexp:/^last\s+(\d*.?\d+)\s+years?$/i,select:function(e,t){return _(Date.now()-31558432982.4*t,e)}},{regexp:/^since (\d+)$/i,select:F},{regexp:/^since (\d+)-(\d+)$/i,select:F},{regexp:/^since (\d+)-(\d+)-(\d+)$/i,select:F},{regexp:/^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%$/,select:function(e,t,n){n=parseFloat(n);var r=N.usage.global;return Object.keys(r).reduce((function(e,i){return">"===t?r[i]>n&&e.push(i):"<"===t?r[i]<n&&e.push(i):"<="===t?r[i]<=n&&e.push(i):r[i]>=n&&e.push(i),e}),[])}},{regexp:/^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+my\s+stats$/,select:function(e,t,n){if(n=parseFloat(n),!e.customUsage)throw new u("Custom usage statistics was not provided");var r=e.customUsage;return Object.keys(r).reduce((function(e,i){return">"===t?r[i]>n&&e.push(i):"<"===t?r[i]<n&&e.push(i):"<="===t?r[i]<=n&&e.push(i):r[i]>=n&&e.push(i),e}),[])}},{regexp:/^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+(\S+)\s+stats$/,select:function(e,t,n,r){n=parseFloat(n);var i=l.loadStat(e,r,N.data);if(i)for(var a in e.customUsage={},i)g(e.customUsage,a,i[a]);if(!e.customUsage)throw new u("Custom usage statistics was not provided");var o=e.customUsage;return Object.keys(o).reduce((function(e,r){return">"===t?o[r]>n&&e.push(r):"<"===t?o[r]<n&&e.push(r):"<="===t?o[r]<=n&&e.push(r):o[r]>=n&&e.push(r),e}),[])}},{regexp:/^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+((alt-)?\w\w)$/,select:function(e,t,n,r){n=parseFloat(n),r=2===r.length?r.toUpperCase():r.toLowerCase(),l.loadCountry(N.usage,r,N.data);var i=N.usage[r];return Object.keys(i).reduce((function(e,r){return">"===t?i[r]>n&&e.push(r):"<"===t?i[r]<n&&e.push(r):"<="===t?i[r]<=n&&e.push(r):i[r]>=n&&e.push(r),e}),[])}},{regexp:/^cover\s+(\d+|\d+\.\d+|\.\d+)%$/,select:B},{regexp:/^cover\s+(\d+|\d+\.\d+|\.\d+)%\s+in\s+(my\s+stats|(alt-)?\w\w)$/,select:B},{regexp:/^supports\s+([\w-]+)$/,select:function(e,t){l.loadFeature(N.cache,t);var n=N.cache[t];return Object.keys(n).reduce((function(e,t){var r=n[t];return(r.indexOf("y")>=0||r.indexOf("a")>=0)&&e.push(t),e}),[])}},{regexp:/^electron\s+([\d.]+)\s*-\s*([\d.]+)$/i,select:function(e,t,n){var r=f(t),i=f(n);if(!s[r])throw new u("Unknown version "+t+" of electron");if(!s[i])throw new u("Unknown version "+n+" of electron");return t=parseFloat(t),n=parseFloat(n),Object.keys(s).filter((function(e){var r=parseFloat(e);return r>=t&&r<=n})).map((function(e){return"chrome "+s[e]}))}},{regexp:/^node\s+([\d.]+)\s*-\s*([\d.]+)$/i,select:function(e,t,n){return r.filter((function(e){return"nodejs"===e.name})).map((function(e){return e.version})).filter(S(">=",t)).filter(S("<=",n)).map((function(e){return"node "+e}))}},{regexp:/^(\w+)\s+([\d.]+)\s*-\s*([\d.]+)$/i,select:function(e,t,n,r){var i=k(t,e);return n=parseFloat(P(i,n)||n),r=parseFloat(P(i,r)||r),i.released.filter((function(e){var t=parseFloat(e);return t>=n&&t<=r})).map(d(i.name))}},{regexp:/^electron\s*(>=?|<=?)\s*([\d.]+)$/i,select:function(e,t,n){var r=f(n);return Object.keys(s).filter(b(t,r)).map((function(e){return"chrome "+s[e]}))}},{regexp:/^node\s*(>=?|<=?)\s*([\d.]+)$/i,select:function(e,t,n){return r.filter((function(e){return"nodejs"===e.name})).map((function(e){return e.version})).filter(function(e,t){return(t=t.split(".").map(v))[1]=t[1]||0,t[2]=t[2]||0,">"===e?function(e){return T(e=e.split(".").map(v),t)>0}:">="===e?function(e){return T(e=e.split(".").map(v),t)>=0}:"<"===e?function(e){return e=e.split(".").map(v),T(t,e)>0}:function(e){return e=e.split(".").map(v),T(t,e)>=0}}(t,n)).map((function(e){return"node "+e}))}},{regexp:/^(\w+)\s*(>=?|<=?)\s*([\d.]+)$/,select:function(e,t,n,r){var i=k(t,e),a=N.versionAliases[i.name][r];return a&&(r=a),i.released.filter(b(n,r)).map((function(e){return i.name+" "+e}))}},{regexp:/^(firefox|ff|fx)\s+esr$/i,select:function(){return["firefox 78"]}},{regexp:/(operamini|op_mini)\s+all/i,select:function(){return["op_mini all"]}},{regexp:/^electron\s+([\d.]+)$/i,select:function(e,t){var n=f(t),r=s[n];if(!r)throw new u("Unknown version "+t+" of electron");return["chrome "+r]}},{regexp:/^node\s+(\d+)$/i,select:L},{regexp:/^node\s+(\d+\.\d+)$/i,select:L},{regexp:/^node\s+(\d+\.\d+\.\d+)$/i,select:L},{regexp:/^current\s+node$/i,select:function(e){return[l.currentNode(j,e)]}},{regexp:/^maintained\s+node\s+versions$/i,select:function(e){var t=Date.now();return j(Object.keys(a).filter((function(e){return t<Date.parse(a[e].end)&&t>Date.parse(a[e].start)&&function(e){var t=e.slice(1);return r.some((function(e){return c(e.version,t)}))}(e)})).map((function(e){return"node "+e.slice(1)})),e)}},{regexp:/^phantomjs\s+1.9$/i,select:function(){return["safari 5"]}},{regexp:/^phantomjs\s+2.1$/i,select:function(){return["safari 6"]}},{regexp:/^(\w+)\s+(tp|[\d.]+)$/i,select:function(e,t,n){/^tp$/i.test(n)&&(n="TP");var r=k(t,e),i=P(r,n);if(i)n=i;else{if(!(i=P(r,i=-1===n.indexOf(".")?n+".0":n.replace(/\.0$/,"")))){if(e.ignoreUnknownVersions)return[];throw new u("Unknown version "+n+" of "+t)}n=i}return[r.name+" "+n]}},{regexp:/^browserslist config$/i,select:function(e){return N(void 0,e)}},{regexp:/^extends (.+)$/i,select:function(e,t){return j(l.loadQueries(e,t),e)}},{regexp:/^defaults$/i,select:function(e){return j(N.defaults,e)}},{regexp:/^dead$/i,select:function(e){return j(["ie <= 10","ie_mob <= 11","bb <= 10","op_mob <= 12.1","samsung 4"],e)}},{regexp:/^(\w+)$/i,select:function(e,t){throw w(t,e)?new u("Specify versions in Browserslist query for browser "+t):C(t)}}];!function(){for(var e in i){var t=i[e];N.data[e]={name:e,versions:p(i[e].versions),released:p(i[e].versions.slice(0,-3)),releaseDate:i[e].release_date},g(N.usage.global,e,t.usage_global),N.versionAliases[e]={};for(var n=0;n<t.versions.length;n++){var r=t.versions[n];if(r&&-1!==r.indexOf("-"))for(var a=r.split("-"),o=0;o<a.length;o++)N.versionAliases[e][a[o]]=r}}N.versionAliases.op_mob[59]="58"}(),e.exports=N},function(e){e.exports=JSON.parse('[{"name":"nodejs","version":"0.2.0","date":"2011-08-26","lts":false,"security":false},{"name":"nodejs","version":"0.3.0","date":"2011-08-26","lts":false,"security":false},{"name":"nodejs","version":"0.4.0","date":"2011-08-26","lts":false,"security":false},{"name":"nodejs","version":"0.5.0","date":"2011-08-26","lts":false,"security":false},{"name":"nodejs","version":"0.6.0","date":"2011-11-04","lts":false,"security":false},{"name":"nodejs","version":"0.7.0","date":"2012-01-17","lts":false,"security":false},{"name":"nodejs","version":"0.8.0","date":"2012-06-22","lts":false,"security":false},{"name":"nodejs","version":"0.9.0","date":"2012-07-20","lts":false,"security":false},{"name":"nodejs","version":"0.10.0","date":"2013-03-11","lts":false,"security":false},{"name":"nodejs","version":"0.11.0","date":"2013-03-28","lts":false,"security":false},{"name":"nodejs","version":"0.12.0","date":"2015-02-06","lts":false,"security":false},{"name":"iojs","version":"1.0.0","date":"2015-01-14"},{"name":"iojs","version":"1.1.0","date":"2015-02-03"},{"name":"iojs","version":"1.2.0","date":"2015-02-11"},{"name":"iojs","version":"1.3.0","date":"2015-02-20"},{"name":"iojs","version":"1.5.0","date":"2015-03-06"},{"name":"iojs","version":"1.6.0","date":"2015-03-20"},{"name":"iojs","version":"2.0.0","date":"2015-05-04"},{"name":"iojs","version":"2.1.0","date":"2015-05-24"},{"name":"iojs","version":"2.2.0","date":"2015-06-01"},{"name":"iojs","version":"2.3.0","date":"2015-06-13"},{"name":"iojs","version":"2.4.0","date":"2015-07-17"},{"name":"iojs","version":"2.5.0","date":"2015-07-28"},{"name":"iojs","version":"3.0.0","date":"2015-08-04"},{"name":"iojs","version":"3.1.0","date":"2015-08-19"},{"name":"iojs","version":"3.2.0","date":"2015-08-25"},{"name":"iojs","version":"3.3.0","date":"2015-09-02"},{"name":"nodejs","version":"4.0.0","date":"2015-09-08","lts":false,"security":false},{"name":"nodejs","version":"4.1.0","date":"2015-09-17","lts":false,"security":false},{"name":"nodejs","version":"4.2.0","date":"2015-10-12","lts":"Argon","security":false},{"name":"nodejs","version":"4.3.0","date":"2016-02-09","lts":"Argon","security":false},{"name":"nodejs","version":"4.4.0","date":"2016-03-08","lts":"Argon","security":false},{"name":"nodejs","version":"4.5.0","date":"2016-08-16","lts":"Argon","security":false},{"name":"nodejs","version":"4.6.0","date":"2016-09-27","lts":"Argon","security":true},{"name":"nodejs","version":"4.7.0","date":"2016-12-06","lts":"Argon","security":false},{"name":"nodejs","version":"4.8.0","date":"2017-02-21","lts":"Argon","security":false},{"name":"nodejs","version":"4.9.0","date":"2018-03-28","lts":"Argon","security":true},{"name":"nodejs","version":"5.0.0","date":"2015-10-29","lts":false,"security":false},{"name":"nodejs","version":"5.1.0","date":"2015-11-17","lts":false,"security":false},{"name":"nodejs","version":"5.2.0","date":"2015-12-09","lts":false,"security":false},{"name":"nodejs","version":"5.3.0","date":"2015-12-15","lts":false,"security":false},{"name":"nodejs","version":"5.4.0","date":"2016-01-06","lts":false,"security":false},{"name":"nodejs","version":"5.5.0","date":"2016-01-21","lts":false,"security":false},{"name":"nodejs","version":"5.6.0","date":"2016-02-09","lts":false,"security":false},{"name":"nodejs","version":"5.7.0","date":"2016-02-23","lts":false,"security":false},{"name":"nodejs","version":"5.8.0","date":"2016-03-09","lts":false,"security":false},{"name":"nodejs","version":"5.9.0","date":"2016-03-16","lts":false,"security":false},{"name":"nodejs","version":"5.10.0","date":"2016-04-01","lts":false,"security":false},{"name":"nodejs","version":"5.11.0","date":"2016-04-21","lts":false,"security":false},{"name":"nodejs","version":"5.12.0","date":"2016-06-23","lts":false,"security":false},{"name":"nodejs","version":"6.0.0","date":"2016-04-26","lts":false,"security":false},{"name":"nodejs","version":"6.1.0","date":"2016-05-05","lts":false,"security":false},{"name":"nodejs","version":"6.2.0","date":"2016-05-17","lts":false,"security":false},{"name":"nodejs","version":"6.3.0","date":"2016-07-06","lts":false,"security":false},{"name":"nodejs","version":"6.4.0","date":"2016-08-12","lts":false,"security":false},{"name":"nodejs","version":"6.5.0","date":"2016-08-26","lts":false,"security":false},{"name":"nodejs","version":"6.6.0","date":"2016-09-14","lts":false,"security":false},{"name":"nodejs","version":"6.7.0","date":"2016-09-27","lts":false,"security":true},{"name":"nodejs","version":"6.8.0","date":"2016-10-12","lts":false,"security":false},{"name":"nodejs","version":"6.9.0","date":"2016-10-18","lts":"Boron","security":false},{"name":"nodejs","version":"6.10.0","date":"2017-02-21","lts":"Boron","security":false},{"name":"nodejs","version":"6.11.0","date":"2017-06-06","lts":"Boron","security":false},{"name":"nodejs","version":"6.12.0","date":"2017-11-06","lts":"Boron","security":false},{"name":"nodejs","version":"6.13.0","date":"2018-02-10","lts":"Boron","security":false},{"name":"nodejs","version":"6.14.0","date":"2018-03-28","lts":"Boron","security":true},{"name":"nodejs","version":"6.15.0","date":"2018-11-27","lts":"Boron","security":true},{"name":"nodejs","version":"6.16.0","date":"2018-12-26","lts":"Boron","security":false},{"name":"nodejs","version":"6.17.0","date":"2019-02-28","lts":"Boron","security":true},{"name":"nodejs","version":"7.0.0","date":"2016-10-25","lts":false,"security":false},{"name":"nodejs","version":"7.1.0","date":"2016-11-08","lts":false,"security":false},{"name":"nodejs","version":"7.2.0","date":"2016-11-22","lts":false,"security":false},{"name":"nodejs","version":"7.3.0","date":"2016-12-20","lts":false,"security":false},{"name":"nodejs","version":"7.4.0","date":"2017-01-04","lts":false,"security":false},{"name":"nodejs","version":"7.5.0","date":"2017-01-31","lts":false,"security":false},{"name":"nodejs","version":"7.6.0","date":"2017-02-21","lts":false,"security":false},{"name":"nodejs","version":"7.7.0","date":"2017-02-28","lts":false,"security":false},{"name":"nodejs","version":"7.8.0","date":"2017-03-29","lts":false,"security":false},{"name":"nodejs","version":"7.9.0","date":"2017-04-11","lts":false,"security":false},{"name":"nodejs","version":"7.10.0","date":"2017-05-02","lts":false,"security":false},{"name":"nodejs","version":"8.0.0","date":"2017-05-30","lts":false,"security":false},{"name":"nodejs","version":"8.1.0","date":"2017-06-08","lts":false,"security":false},{"name":"nodejs","version":"8.2.0","date":"2017-07-19","lts":false,"security":false},{"name":"nodejs","version":"8.3.0","date":"2017-08-08","lts":false,"security":false},{"name":"nodejs","version":"8.4.0","date":"2017-08-15","lts":false,"security":false},{"name":"nodejs","version":"8.5.0","date":"2017-09-12","lts":false,"security":false},{"name":"nodejs","version":"8.6.0","date":"2017-09-26","lts":false,"security":false},{"name":"nodejs","version":"8.7.0","date":"2017-10-11","lts":false,"security":false},{"name":"nodejs","version":"8.8.0","date":"2017-10-24","lts":false,"security":false},{"name":"nodejs","version":"8.9.0","date":"2017-10-31","lts":"Carbon","security":false},{"name":"nodejs","version":"8.10.0","date":"2018-03-06","lts":"Carbon","security":false},{"name":"nodejs","version":"8.11.0","date":"2018-03-28","lts":"Carbon","security":true},{"name":"nodejs","version":"8.12.0","date":"2018-09-10","lts":"Carbon","security":false},{"name":"nodejs","version":"8.13.0","date":"2018-11-20","lts":"Carbon","security":false},{"name":"nodejs","version":"8.14.0","date":"2018-11-27","lts":"Carbon","security":true},{"name":"nodejs","version":"8.15.0","date":"2018-12-26","lts":"Carbon","security":false},{"name":"nodejs","version":"8.16.0","date":"2019-04-16","lts":"Carbon","security":false},{"name":"nodejs","version":"8.17.0","date":"2019-12-17","lts":"Carbon","security":true},{"name":"nodejs","version":"9.0.0","date":"2017-10-31","lts":false,"security":false},{"name":"nodejs","version":"9.1.0","date":"2017-11-07","lts":false,"security":false},{"name":"nodejs","version":"9.2.0","date":"2017-11-14","lts":false,"security":false},{"name":"nodejs","version":"9.3.0","date":"2017-12-12","lts":false,"security":false},{"name":"nodejs","version":"9.4.0","date":"2018-01-10","lts":false,"security":false},{"name":"nodejs","version":"9.5.0","date":"2018-01-31","lts":false,"security":false},{"name":"nodejs","version":"9.6.0","date":"2018-02-21","lts":false,"security":false},{"name":"nodejs","version":"9.7.0","date":"2018-03-01","lts":false,"security":false},{"name":"nodejs","version":"9.8.0","date":"2018-03-07","lts":false,"security":false},{"name":"nodejs","version":"9.9.0","date":"2018-03-21","lts":false,"security":false},{"name":"nodejs","version":"9.10.0","date":"2018-03-28","lts":false,"security":true},{"name":"nodejs","version":"9.11.0","date":"2018-04-04","lts":false,"security":false},{"name":"nodejs","version":"10.0.0","date":"2018-04-24","lts":false,"security":false},{"name":"nodejs","version":"10.1.0","date":"2018-05-08","lts":false,"security":false},{"name":"nodejs","version":"10.2.0","date":"2018-05-23","lts":false,"security":false},{"name":"nodejs","version":"10.3.0","date":"2018-05-29","lts":false,"security":false},{"name":"nodejs","version":"10.4.0","date":"2018-06-06","lts":false,"security":false},{"name":"nodejs","version":"10.5.0","date":"2018-06-20","lts":false,"security":false},{"name":"nodejs","version":"10.6.0","date":"2018-07-04","lts":false,"security":false},{"name":"nodejs","version":"10.7.0","date":"2018-07-18","lts":false,"security":false},{"name":"nodejs","version":"10.8.0","date":"2018-08-01","lts":false,"security":false},{"name":"nodejs","version":"10.9.0","date":"2018-08-15","lts":false,"security":false},{"name":"nodejs","version":"10.10.0","date":"2018-09-06","lts":false,"security":false},{"name":"nodejs","version":"10.11.0","date":"2018-09-19","lts":false,"security":false},{"name":"nodejs","version":"10.12.0","date":"2018-10-10","lts":false,"security":false},{"name":"nodejs","version":"10.13.0","date":"2018-10-30","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.14.0","date":"2018-11-27","lts":"Dubnium","security":true},{"name":"nodejs","version":"10.15.0","date":"2018-12-26","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.16.0","date":"2019-05-28","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.17.0","date":"2019-10-22","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.18.0","date":"2019-12-17","lts":"Dubnium","security":true},{"name":"nodejs","version":"10.19.0","date":"2020-02-05","lts":"Dubnium","security":true},{"name":"nodejs","version":"10.20.0","date":"2020-03-26","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.21.0","date":"2020-06-02","lts":"Dubnium","security":true},{"name":"nodejs","version":"10.22.0","date":"2020-07-21","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.23.0","date":"2020-10-27","lts":"Dubnium","security":false},{"name":"nodejs","version":"10.24.0","date":"2021-02-23","lts":"Dubnium","security":true},{"name":"nodejs","version":"11.0.0","date":"2018-10-23","lts":false,"security":false},{"name":"nodejs","version":"11.1.0","date":"2018-10-30","lts":false,"security":false},{"name":"nodejs","version":"11.2.0","date":"2018-11-15","lts":false,"security":false},{"name":"nodejs","version":"11.3.0","date":"2018-11-27","lts":false,"security":true},{"name":"nodejs","version":"11.4.0","date":"2018-12-07","lts":false,"security":false},{"name":"nodejs","version":"11.5.0","date":"2018-12-18","lts":false,"security":false},{"name":"nodejs","version":"11.6.0","date":"2018-12-26","lts":false,"security":false},{"name":"nodejs","version":"11.7.0","date":"2019-01-17","lts":false,"security":false},{"name":"nodejs","version":"11.8.0","date":"2019-01-24","lts":false,"security":false},{"name":"nodejs","version":"11.9.0","date":"2019-01-30","lts":false,"security":false},{"name":"nodejs","version":"11.10.0","date":"2019-02-14","lts":false,"security":false},{"name":"nodejs","version":"11.11.0","date":"2019-03-05","lts":false,"security":false},{"name":"nodejs","version":"11.12.0","date":"2019-03-14","lts":false,"security":false},{"name":"nodejs","version":"11.13.0","date":"2019-03-28","lts":false,"security":false},{"name":"nodejs","version":"11.14.0","date":"2019-04-10","lts":false,"security":false},{"name":"nodejs","version":"11.15.0","date":"2019-04-30","lts":false,"security":false},{"name":"nodejs","version":"12.0.0","date":"2019-04-23","lts":false,"security":false},{"name":"nodejs","version":"12.1.0","date":"2019-04-29","lts":false,"security":false},{"name":"nodejs","version":"12.2.0","date":"2019-05-07","lts":false,"security":false},{"name":"nodejs","version":"12.3.0","date":"2019-05-21","lts":false,"security":false},{"name":"nodejs","version":"12.4.0","date":"2019-06-04","lts":false,"security":false},{"name":"nodejs","version":"12.5.0","date":"2019-06-26","lts":false,"security":false},{"name":"nodejs","version":"12.6.0","date":"2019-07-03","lts":false,"security":false},{"name":"nodejs","version":"12.7.0","date":"2019-07-23","lts":false,"security":false},{"name":"nodejs","version":"12.8.0","date":"2019-08-06","lts":false,"security":false},{"name":"nodejs","version":"12.9.0","date":"2019-08-20","lts":false,"security":false},{"name":"nodejs","version":"12.10.0","date":"2019-09-04","lts":false,"security":false},{"name":"nodejs","version":"12.11.0","date":"2019-09-25","lts":false,"security":false},{"name":"nodejs","version":"12.12.0","date":"2019-10-11","lts":false,"security":false},{"name":"nodejs","version":"12.13.0","date":"2019-10-21","lts":"Erbium","security":false},{"name":"nodejs","version":"12.14.0","date":"2019-12-17","lts":"Erbium","security":true},{"name":"nodejs","version":"12.15.0","date":"2020-02-05","lts":"Erbium","security":true},{"name":"nodejs","version":"12.16.0","date":"2020-02-11","lts":"Erbium","security":false},{"name":"nodejs","version":"12.17.0","date":"2020-05-26","lts":"Erbium","security":false},{"name":"nodejs","version":"12.18.0","date":"2020-06-02","lts":"Erbium","security":true},{"name":"nodejs","version":"12.19.0","date":"2020-10-06","lts":"Erbium","security":false},{"name":"nodejs","version":"12.20.0","date":"2020-11-24","lts":"Erbium","security":false},{"name":"nodejs","version":"12.21.0","date":"2021-02-23","lts":"Erbium","security":true},{"name":"nodejs","version":"12.22.0","date":"2021-03-30","lts":"Erbium","security":false},{"name":"nodejs","version":"13.0.0","date":"2019-10-22","lts":false,"security":false},{"name":"nodejs","version":"13.1.0","date":"2019-11-05","lts":false,"security":false},{"name":"nodejs","version":"13.2.0","date":"2019-11-21","lts":false,"security":false},{"name":"nodejs","version":"13.3.0","date":"2019-12-03","lts":false,"security":false},{"name":"nodejs","version":"13.4.0","date":"2019-12-17","lts":false,"security":true},{"name":"nodejs","version":"13.5.0","date":"2019-12-18","lts":false,"security":false},{"name":"nodejs","version":"13.6.0","date":"2020-01-07","lts":false,"security":false},{"name":"nodejs","version":"13.7.0","date":"2020-01-21","lts":false,"security":false},{"name":"nodejs","version":"13.8.0","date":"2020-02-05","lts":false,"security":true},{"name":"nodejs","version":"13.9.0","date":"2020-02-18","lts":false,"security":false},{"name":"nodejs","version":"13.10.0","date":"2020-03-04","lts":false,"security":false},{"name":"nodejs","version":"13.11.0","date":"2020-03-12","lts":false,"security":false},{"name":"nodejs","version":"13.12.0","date":"2020-03-26","lts":false,"security":false},{"name":"nodejs","version":"13.13.0","date":"2020-04-14","lts":false,"security":false},{"name":"nodejs","version":"13.14.0","date":"2020-04-29","lts":false,"security":false},{"name":"nodejs","version":"14.0.0","date":"2020-04-21","lts":false,"security":false},{"name":"nodejs","version":"14.1.0","date":"2020-04-29","lts":false,"security":false},{"name":"nodejs","version":"14.2.0","date":"2020-05-05","lts":false,"security":false},{"name":"nodejs","version":"14.3.0","date":"2020-05-19","lts":false,"security":false},{"name":"nodejs","version":"14.4.0","date":"2020-06-02","lts":false,"security":true},{"name":"nodejs","version":"14.5.0","date":"2020-06-30","lts":false,"security":false},{"name":"nodejs","version":"14.6.0","date":"2020-07-20","lts":false,"security":false},{"name":"nodejs","version":"14.7.0","date":"2020-07-29","lts":false,"security":false},{"name":"nodejs","version":"14.8.0","date":"2020-08-11","lts":false,"security":false},{"name":"nodejs","version":"14.9.0","date":"2020-08-27","lts":false,"security":false},{"name":"nodejs","version":"14.10.0","date":"2020-09-08","lts":false,"security":false},{"name":"nodejs","version":"14.11.0","date":"2020-09-15","lts":false,"security":true},{"name":"nodejs","version":"14.12.0","date":"2020-09-22","lts":false,"security":false},{"name":"nodejs","version":"14.13.0","date":"2020-09-29","lts":false,"security":false},{"name":"nodejs","version":"14.14.0","date":"2020-10-15","lts":false,"security":false},{"name":"nodejs","version":"14.15.0","date":"2020-10-27","lts":"Fermium","security":false},{"name":"nodejs","version":"14.16.0","date":"2021-02-23","lts":"Fermium","security":true},{"name":"nodejs","version":"14.17.0","date":"2021-05-11","lts":"Fermium","security":false},{"name":"nodejs","version":"15.0.0","date":"2020-10-20","lts":false,"security":false},{"name":"nodejs","version":"15.1.0","date":"2020-11-04","lts":false,"security":false},{"name":"nodejs","version":"15.2.0","date":"2020-11-10","lts":false,"security":false},{"name":"nodejs","version":"15.3.0","date":"2020-11-24","lts":false,"security":false},{"name":"nodejs","version":"15.4.0","date":"2020-12-09","lts":false,"security":false},{"name":"nodejs","version":"15.5.0","date":"2020-12-22","lts":false,"security":false},{"name":"nodejs","version":"15.6.0","date":"2021-01-14","lts":false,"security":false},{"name":"nodejs","version":"15.7.0","date":"2021-01-25","lts":false,"security":false},{"name":"nodejs","version":"15.8.0","date":"2021-02-02","lts":false,"security":false},{"name":"nodejs","version":"15.9.0","date":"2021-02-18","lts":false,"security":false},{"name":"nodejs","version":"15.10.0","date":"2021-02-23","lts":false,"security":true},{"name":"nodejs","version":"15.11.0","date":"2021-03-03","lts":false,"security":false},{"name":"nodejs","version":"15.12.0","date":"2021-03-17","lts":false,"security":false},{"name":"nodejs","version":"15.13.0","date":"2021-03-31","lts":false,"security":false},{"name":"nodejs","version":"15.14.0","date":"2021-04-06","lts":false,"security":false},{"name":"nodejs","version":"16.0.0","date":"2021-04-20","lts":false,"security":false},{"name":"nodejs","version":"16.1.0","date":"2021-05-04","lts":false,"security":false}]')},function(e,t,n){const{browsers:r}=n(773),i=n(775).browserVersions,a=n(777);function o(e){return Object.keys(e).reduce((t,n)=>(t[i[n]]=e[n],t),{})}e.exports.agents=Object.keys(a).reduce((e,t)=>{let n=a[t];return e[r[t]]=Object.keys(n).reduce((e,t)=>("A"===t?e.usage_global=o(n[t]):"C"===t?e.versions=n[t].reduce((e,t)=>(""===t?e.push(null):e.push(i[t]),e),[]):"D"===t?e.prefix_exceptions=o(n[t]):"E"===t?e.browser=n[t]:"F"===t?e.release_date=Object.keys(n[t]).reduce((e,r)=>(e[i[r]]=n[t][r],e),{}):e.prefix=n[t],e),{}),e},{})},function(e,t,n){e.exports.browsers=n(774)},function(e,t){e.exports={A:"ie",B:"edge",C:"firefox",D:"chrome",E:"safari",F:"opera",G:"ios_saf",H:"op_mini",I:"android",J:"bb",K:"op_mob",L:"and_chr",M:"and_ff",N:"ie_mob",O:"and_uc",P:"samsung",Q:"and_qq",R:"baidu",S:"kaios"}},function(e,t,n){e.exports.browserVersions=n(776)},function(e,t){e.exports={0:"44",1:"45",2:"46",3:"47",4:"48",5:"49",6:"50",7:"51",8:"52",9:"53",A:"10",B:"11",C:"12",D:"7",E:"8",F:"9",G:"90",H:"4",I:"6",J:"13",K:"14",L:"15",M:"16",N:"17",O:"18",P:"87",Q:"62",R:"79",S:"80",T:"81",U:"83",V:"84",W:"85",X:"86",Y:"88",Z:"89",a:"5",b:"19",c:"20",d:"21",e:"22",f:"23",g:"24",h:"25",i:"26",j:"27",k:"28",l:"29",m:"30",n:"31",o:"32",p:"33",q:"34",r:"35",s:"36",t:"37",u:"38",v:"39",w:"40",x:"41",y:"42",z:"43",AB:"54",BB:"55",CB:"56",DB:"57",EB:"58",FB:"60",GB:"63",HB:"64",IB:"65",JB:"66",KB:"67",LB:"68",MB:"69",NB:"70",OB:"71",PB:"72",QB:"73",RB:"74",SB:"75",TB:"11.1",UB:"12.1",VB:"3",WB:"59",XB:"61",YB:"76",ZB:"77",aB:"78",bB:"3.2",cB:"10.1",dB:"11.5",eB:"4.2-4.3",fB:"5.5",gB:"2",hB:"82",iB:"3.5",jB:"3.6",kB:"91",lB:"92",mB:"93",nB:"3.1",oB:"5.1",pB:"6.1",qB:"7.1",rB:"9.1",sB:"13.1",tB:"14.1",uB:"TP",vB:"9.5-9.6",wB:"10.0-10.1",xB:"10.5",yB:"10.6",zB:"11.6","0B":"4.0-4.1","1B":"5.0-5.1","2B":"6.0-6.1","3B":"7.0-7.1","4B":"8.1-8.4","5B":"9.0-9.2","6B":"9.3","7B":"10.0-10.2","8B":"10.3","9B":"11.0-11.2",AC:"11.3-11.4",BC:"12.0-12.1",CC:"12.2-12.4",DC:"13.0-13.1",EC:"13.2",FC:"13.3",GC:"13.4-13.7",HC:"14.0-14.4",IC:"14.5",JC:"all",KC:"2.1",LC:"2.2",MC:"2.3",NC:"4.1",OC:"4.4",PC:"4.4.3-4.4.4",QC:"12.12",RC:"5.0-5.4",SC:"6.2-6.4",TC:"7.2-7.4",UC:"8.2",VC:"9.2",WC:"11.1-11.2",XC:"12.0",YC:"13.0",ZC:"14.0",aC:"10.4",bC:"7.12",cC:"2.5"}},function(e,t){e.exports={A:{A:{I:.0131217,D:.00621152,E:.0262435,F:.111535,A:.0328044,B:.905401,fB:.009298},B:"ms",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","fB","I","D","E","F","A","B","","",""],E:"IE",F:{fB:962323200,I:998870400,D:1161129600,E:1237420800,F:1300060800,A:1346716800,B:1381968e3}},B:{A:{C:.008542,J:.004267,K:.004271,L:.008542,M:.008542,N:.029897,O:.106775,R:0,S:.004298,T:.00944,U:.00415,V:.008542,W:.012813,X:.012813,P:.017084,Y:.025626,Z:2.26363,G:1.03358},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","C","J","K","L","M","N","O","R","S","T","U","V","W","X","P","Y","Z","G","","",""],E:"Edge",F:{C:1438128e3,J:1447286400,K:1470096e3,L:1491868800,M:1508198400,N:1525046400,O:1542067200,R:1579046400,S:1581033600,T:1586736e3,U:1590019200,V:1594857600,W:1598486400,X:1602201600,P:1605830400,Y:161136e4,Z:1614816e3,G:1618358400},D:{C:"ms",J:"ms",K:"ms",L:"ms",M:"ms",N:"ms",O:"ms"}},C:{A:{0:.004271,1:.004271,2:.004525,3:.004271,4:.008542,5:.004538,6:.004267,7:.008542,8:.064065,9:.004335,gB:.012813,VB:.004271,H:.021355,a:.004879,I:.020136,D:.005725,E:.004525,F:.00533,A:.004283,B:.004271,C:.004471,J:.004486,K:.00453,L:.008542,M:.004417,N:.004425,O:.008542,b:.004443,c:.004283,d:.008542,e:.013698,f:.008542,g:.008786,h:.017084,i:.004317,j:.004393,k:.004418,l:.008834,m:.008542,n:.008928,o:.004471,p:.009284,q:.004707,r:.009076,s:.004425,t:.004783,u:.004271,v:.004783,w:.00487,x:.005029,y:.0047,z:.051252,AB:.004271,BB:.004425,CB:.012813,DB:.004425,EB:.008534,WB:.004271,FB:.008542,XB:.00472,Q:.004425,GB:.017084,HB:.00415,IB:.004267,JB:.008542,KB:.004267,LB:.012813,MB:.00415,NB:.004271,OB:.004425,PB:.008542,QB:.00415,RB:.00415,SB:.008542,YB:.004298,ZB:.008542,aB:.153756,R:.012813,S:.012813,T:.012813,hB:.021355,U:.012813,V:.029897,W:.038439,X:.08542,P:1.76819,Y:.708986,Z:.008542,G:0,iB:.008786,jB:.00487},B:"moz",C:["gB","VB","iB","jB","H","a","I","D","E","F","A","B","C","J","K","L","M","N","O","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","AB","BB","CB","DB","EB","WB","FB","XB","Q","GB","HB","IB","JB","KB","LB","MB","NB","OB","PB","QB","RB","SB","YB","ZB","aB","R","S","T","hB","U","V","W","X","P","Y","Z","G",""],E:"Firefox",F:{0:1453852800,1:1457395200,2:1461628800,3:1465257600,4:1470096e3,5:1474329600,6:1479168e3,7:1485216e3,8:1488844800,9:149256e4,gB:1161648e3,VB:1213660800,iB:124632e4,jB:1264032e3,H:1300752e3,a:1308614400,I:1313452800,D:1317081600,E:1317081600,F:1320710400,A:1324339200,B:1327968e3,C:1331596800,J:1335225600,K:1338854400,L:1342483200,M:1346112e3,N:1349740800,O:1353628800,b:1357603200,c:1361232e3,d:1364860800,e:1368489600,f:1372118400,g:1375747200,h:1379376e3,i:1386633600,j:1391472e3,k:1395100800,l:1398729600,m:1402358400,n:1405987200,o:1409616e3,p:1413244800,q:1417392e3,r:1421107200,s:1424736e3,t:1428278400,u:1431475200,v:1435881600,w:1439251200,x:144288e4,y:1446508800,z:1450137600,AB:1497312e3,BB:1502150400,CB:1506556800,DB:1510617600,EB:1516665600,WB:1520985600,FB:1525824e3,XB:1529971200,Q:1536105600,GB:1540252800,HB:1544486400,IB:154872e4,JB:1552953600,KB:1558396800,LB:1562630400,MB:1567468800,NB:1571788800,OB:1575331200,PB:1578355200,QB:1581379200,RB:1583798400,SB:1586304e3,YB:1588636800,ZB:1591056e3,aB:1593475200,R:1595894400,S:1598313600,T:1600732800,hB:1603152e3,U:1605571200,V:1607990400,W:1611619200,X:1614038400,P:1616457600,Y:1618790400,Z:null,G:null}},D:{A:{0:.004465,1:.004642,2:.004891,3:.008542,4:.021355,5:.200737,6:.004271,7:.004271,8:.004271,9:.055523,H:.004706,a:.004879,I:.004879,D:.005591,E:.005591,F:.005591,A:.004534,B:.004464,C:.010424,J:.0083,K:.004706,L:.015087,M:.004393,N:.004393,O:.008652,b:.008542,c:.004393,d:.004317,e:.008542,f:.008786,g:.025626,h:.004461,i:.004298,j:.004326,k:.0047,l:.004538,m:.008542,n:.008596,o:.004566,p:.012813,q:.008542,r:.025626,s:.004335,t:.004464,u:.025626,v:.004464,w:.012813,x:.0236,y:.004403,z:.008542,AB:.012813,BB:.017084,CB:.064065,DB:.008542,EB:.012813,WB:.008542,FB:.012813,XB:.089691,Q:.008542,GB:.021355,HB:.012813,IB:.021355,JB:.021355,KB:.04271,LB:.04271,MB:.068336,NB:.051252,OB:.025626,PB:.046981,QB:.021355,RB:.119588,SB:.093962,YB:.064065,ZB:.034168,aB:.081149,R:.175111,S:.102504,T:.081149,U:.166569,V:.136672,W:.205008,X:.230634,P:.431371,Y:.743154,Z:16.8235,G:6.40223,kB:.021355,lB:.012813,mB:0},B:"webkit",C:["","","","H","a","I","D","E","F","A","B","C","J","K","L","M","N","O","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","AB","BB","CB","DB","EB","WB","FB","XB","Q","GB","HB","IB","JB","KB","LB","MB","NB","OB","PB","QB","RB","SB","YB","ZB","aB","R","S","T","U","V","W","X","P","Y","Z","G","kB","lB","mB"],E:"Chrome",F:{0:1437523200,1:1441152e3,2:1444780800,3:1449014400,4:1453248e3,5:1456963200,6:1460592e3,7:1464134400,8:1469059200,9:1472601600,H:1264377600,a:1274745600,I:1283385600,D:1287619200,E:1291248e3,F:1296777600,A:1299542400,B:1303862400,C:1307404800,J:1312243200,K:1316131200,L:1316131200,M:1319500800,N:1323734400,O:1328659200,b:1332892800,c:133704e4,d:1340668800,e:1343692800,f:1348531200,g:1352246400,h:1357862400,i:1361404800,j:1364428800,k:1369094400,l:1374105600,m:1376956800,n:1384214400,o:1389657600,p:1392940800,q:1397001600,r:1400544e3,s:1405468800,t:1409011200,u:141264e4,v:1416268800,w:1421798400,x:1425513600,y:1429401600,z:143208e4,AB:1476230400,BB:1480550400,CB:1485302400,DB:1489017600,EB:149256e4,WB:1496707200,FB:1500940800,XB:1504569600,Q:1508198400,GB:1512518400,HB:1516752e3,IB:1520294400,JB:1523923200,KB:1527552e3,LB:1532390400,MB:1536019200,NB:1539648e3,OB:1543968e3,PB:154872e4,QB:1552348800,RB:1555977600,SB:1559606400,YB:1564444800,ZB:1568073600,aB:1571702400,R:1575936e3,S:1580860800,T:1586304e3,U:1589846400,V:1594684800,W:1598313600,X:1601942400,P:1605571200,Y:1611014400,Z:1614556800,G:1618272e3,kB:null,lB:null,mB:null}},E:{A:{H:0,a:.008542,I:.004656,D:.004465,E:.234905,F:.004891,A:.004425,B:.008542,C:.012813,J:.098233,K:2.95126,nB:0,bB:.008692,oB:.106775,pB:.00456,qB:.004283,rB:.034168,cB:.021355,TB:.064065,UB:.098233,sB:.439913,tB:.055523,uB:0},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","nB","bB","H","a","oB","I","pB","D","qB","E","F","rB","A","cB","B","TB","C","UB","J","sB","K","tB","uB","",""],E:"Safari",F:{nB:1205798400,bB:1226534400,H:1244419200,a:1275868800,oB:131112e4,I:1343174400,pB:13824e5,D:13824e5,qB:1410998400,E:1413417600,F:1443657600,rB:1458518400,A:1474329600,cB:1490572800,B:1505779200,TB:1522281600,C:1537142400,UB:1553472e3,J:1568851200,sB:1585008e3,K:1600214400,tB:1619395200,uB:null}},F:{A:{0:.004227,1:.004725,2:.004271,3:.008942,4:.004707,5:.004827,6:.004707,7:.004707,8:.004326,9:.008922,F:.0082,B:.016581,C:.004317,L:.00685,M:.00685,N:.00685,O:.005014,b:.006015,c:.004879,d:.006597,e:.006597,f:.013434,g:.006702,h:.006015,i:.005595,j:.004393,k:.008652,l:.004879,m:.004879,n:.004711,o:.005152,p:.005014,q:.009758,r:.004879,s:.008542,t:.004283,u:.004367,v:.004534,w:.004271,x:.004227,y:.004418,z:.008542,AB:.014349,BB:.004425,CB:.00472,DB:.004425,EB:.004425,FB:.00472,Q:.004532,GB:.004566,HB:.02283,IB:.00867,JB:.004656,KB:.004642,LB:.004298,MB:.00944,NB:.00415,OB:.004271,PB:.004298,QB:.324596,RB:.153756,SB:.516791,vB:.00685,wB:.008542,xB:.008392,yB:.004706,TB:.006229,dB:.004879,zB:.008786,UB:.00472},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","F","vB","wB","xB","yB","B","TB","dB","zB","C","UB","L","M","N","O","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","AB","BB","CB","DB","EB","FB","Q","GB","HB","IB","JB","KB","LB","MB","NB","OB","PB","QB","RB","SB","","",""],E:"Opera",F:{0:1490054400,1:1494374400,2:1498003200,3:1502236800,4:1506470400,5:1510099200,6:1515024e3,7:1517961600,8:1521676800,9:1525910400,F:1150761600,vB:1223424e3,wB:1251763200,xB:1267488e3,yB:1277942400,B:1292457600,TB:1302566400,dB:1309219200,zB:1323129600,C:1323129600,UB:1352073600,L:1372723200,M:1377561600,N:1381104e3,O:1386288e3,b:1390867200,c:1393891200,d:1399334400,e:1401753600,f:1405987200,g:1409616e3,h:1413331200,i:1417132800,j:1422316800,k:1425945600,l:1430179200,m:1433808e3,n:1438646400,o:1442448e3,p:1445904e3,q:1449100800,r:1454371200,s:1457308800,t:146232e4,u:1465344e3,v:1470096e3,w:1474329600,x:1477267200,y:1481587200,z:1486425600,AB:1530144e3,BB:1534982400,CB:1537833600,DB:1543363200,EB:1548201600,FB:1554768e3,Q:1561593600,GB:1566259200,HB:1570406400,IB:1573689600,JB:1578441600,KB:1583971200,LB:1587513600,MB:1592956800,NB:1595894400,OB:1600128e3,PB:1603238400,QB:161352e4,RB:1612224e3,SB:1616544e3},D:{F:"o",B:"o",C:"o",vB:"o",wB:"o",xB:"o",yB:"o",TB:"o",dB:"o",zB:"o",UB:"o"}},G:{A:{E:.0014611,bB:0,"0B":0,eB:.00292219,"1B":.00876657,"2B":.159259,"3B":.0321441,"4B":.0204553,"5B":.0262997,"6B":.153415,"7B":.0555216,"8B":.159259,"9B":.0905879,AC:.077438,BC:.0847435,CC:.283452,DC:.0715937,EC:.0336052,FC:.189942,GC:.647265,HC:11.7531,IC:.150493},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","bB","0B","eB","1B","2B","3B","E","4B","5B","6B","7B","8B","9B","AC","BC","CC","DC","EC","FC","GC","HC","IC","","",""],E:"Safari on iOS",F:{bB:1270252800,"0B":1283904e3,eB:1299628800,"1B":1331078400,"2B":1359331200,"3B":1394409600,E:1410912e3,"4B":1413763200,"5B":1442361600,"6B":1458518400,"7B":1473724800,"8B":1490572800,"9B":1505779200,AC:1522281600,BC:1537142400,CC:1553472e3,DC:1568851200,EC:1572220800,FC:1580169600,GC:1585008e3,HC:1600214400,IC:1619395200}},H:{A:{JC:1.0685},B:"o",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","JC","","",""],E:"Opera Mini",F:{JC:1426464e3}},I:{A:{VB:0,H:.0137496,G:0,KC:0,LC:0,MC:0,NC:.0120309,eB:.051561,OC:0,PC:.214838},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","KC","LC","MC","VB","H","NC","eB","OC","PC","G","","",""],E:"Android Browser",F:{KC:1256515200,LC:1274313600,MC:1291593600,VB:1298332800,H:1318896e3,NC:1341792e3,eB:1374624e3,OC:1386547200,PC:1401667200,G:1618704e3}},J:{A:{D:0,A:0},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","D","A","","",""],E:"Blackberry Browser",F:{D:1325376e3,A:1359504e3}},K:{A:{A:0,B:0,C:0,Q:.0111391,TB:0,dB:0,UB:0},B:"o",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","A","B","TB","dB","C","UB","Q","","",""],E:"Opera Mobile",F:{A:1287100800,B:1300752e3,TB:1314835200,dB:1318291200,C:1330300800,UB:1349740800,Q:1613433600},D:{Q:"webkit"}},L:{A:{G:37.9297},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","G","","",""],E:"Chrome for Android",F:{G:1618704e3}},M:{A:{P:.274992},B:"moz",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","P","","",""],E:"Firefox for Android",F:{P:1616457600}},N:{A:{A:.0115934,B:.022664},B:"ms",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","A","B","","",""],E:"IE Mobile",F:{A:1340150400,B:1353456e3}},O:{A:{QC:1.30048},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","QC","","",""],E:"UC Browser for Android",F:{QC:1471392e3},D:{QC:"webkit"}},P:{A:{H:.30804,RC:.0103543,SC:.010304,TC:.071876,UC:.0103584,VC:.071876,cB:.041072,WC:.174556,XC:.133484,YC:1.85851,ZC:.800904},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","H","RC","SC","TC","UC","VC","cB","WC","XC","YC","ZC","","",""],E:"Samsung Internet",F:{H:1461024e3,RC:1481846400,SC:1509408e3,TC:1528329600,UC:1546128e3,VC:1554163200,cB:1567900800,WC:1582588800,XC:1593475200,YC:1605657600,ZC:1618531200}},Q:{A:{aC:.177599},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","aC","","",""],E:"QQ Browser",F:{aC:1589846400}},R:{A:{bC:0},B:"webkit",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","bC","","",""],E:"Baidu Browser",F:{bC:1491004800}},S:{A:{cC:.097393},B:"moz",C:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","cC","","",""],E:"KaiOS Browser",F:{cC:1527811200}}}},function(e){e.exports=JSON.parse('{"v0.8":{"start":"2012-06-25","end":"2014-07-31"},"v0.10":{"start":"2013-03-11","end":"2016-10-31"},"v0.12":{"start":"2015-02-06","end":"2016-12-31"},"v4":{"start":"2015-09-08","lts":"2015-10-12","maintenance":"2017-04-01","end":"2018-04-30","codename":"Argon"},"v5":{"start":"2015-10-29","maintenance":"2016-04-30","end":"2016-06-30"},"v6":{"start":"2016-04-26","lts":"2016-10-18","maintenance":"2018-04-30","end":"2019-04-30","codename":"Boron"},"v7":{"start":"2016-10-25","maintenance":"2017-04-30","end":"2017-06-30"},"v8":{"start":"2017-05-30","lts":"2017-10-31","maintenance":"2019-01-01","end":"2019-12-31","codename":"Carbon"},"v9":{"start":"2017-10-01","maintenance":"2018-04-01","end":"2018-06-30"},"v10":{"start":"2018-04-24","lts":"2018-10-30","maintenance":"2020-05-19","end":"2021-04-30","codename":"Dubnium"},"v11":{"start":"2018-10-23","maintenance":"2019-04-22","end":"2019-06-01"},"v12":{"start":"2019-04-23","lts":"2019-10-21","maintenance":"2020-11-30","end":"2022-04-30","codename":"Erbium"},"v13":{"start":"2019-10-22","maintenance":"2020-04-01","end":"2020-06-01"},"v14":{"start":"2020-04-21","lts":"2020-10-27","maintenance":"2021-10-19","end":"2023-04-30","codename":"Fermium"},"v15":{"start":"2020-10-20","maintenance":"2021-04-01","end":"2021-06-01"},"v16":{"start":"2021-04-20","lts":"2021-10-26","maintenance":"2022-10-18","end":"2024-04-30","codename":""},"v17":{"start":"2021-10-19","maintenance":"2022-04-01","end":"2022-06-01"},"v18":{"start":"2022-04-19","lts":"2022-10-25","maintenance":"2023-10-18","end":"2025-04-30","codename":""}}')},,function(e,t){e.exports={"0.20":"39",.21:"41",.22:"41",.23:"41",.24:"41",.25:"42",.26:"42",.27:"43",.28:"43",.29:"43","0.30":"44",.31:"45",.32:"45",.33:"45",.34:"45",.35:"45",.36:"47",.37:"49","1.0":"49",1.1:"50",1.2:"51",1.3:"52",1.4:"53",1.5:"54",1.6:"56",1.7:"58",1.8:"59","2.0":"61",2.1:"61","3.0":"66",3.1:"66","4.0":"69",4.1:"69",4.2:"69","5.0":"73","6.0":"76",6.1:"76","7.0":"78",7.1:"78",7.2:"78",7.3:"78","8.0":"80",8.1:"80",8.2:"80",8.3:"80",8.4:"80",8.5:"80","9.0":"83",9.1:"83",9.2:"83",9.3:"83",9.4:"83","10.0":"85",10.1:"85",10.2:"85",10.3:"85",10.4:"85","11.0":"87",11.1:"87",11.2:"87",11.3:"87",11.4:"87","12.0":"89","13.0":"91"}},function(e,t,n){var r=n(445);function i(){}e.exports={loadQueries:function(){throw new r("Sharable configs are not supported in client-side build of Browserslist")},getStat:function(e){return e.stats},loadConfig:function(e){if(e.config)throw new r("Browserslist config are not supported in client-side build")},loadCountry:function(){throw new r("Country statistics are not supported in client-side build of Browserslist")},loadFeature:function(){throw new r("Supports queries are not available in client-side build of Browserslist")},currentNode:function(e,t){return e(["maintained node versions"],t)[0]},parseConfig:i,readConfig:i,findConfig:i,clearCaches:i,oldDataWarning:i}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={auxiliaryComment:{message:"Use `auxiliaryCommentBefore` or `auxiliaryCommentAfter`"},blacklist:{message:"Put the specific transforms you want in the `plugins` option"},breakConfig:{message:"This is not a necessary option in Babel 6"},experimental:{message:"Put the specific transforms you want in the `plugins` option"},externalHelpers:{message:"Use the `external-helpers` plugin instead. Check out http://babeljs.io/docs/plugins/external-helpers/"},extra:{message:""},jsxPragma:{message:"use the `pragma` option in the `react-jsx` plugin. Check out http://babeljs.io/docs/plugins/transform-react-jsx/"},loose:{message:"Specify the `loose` option for the relevant plugin you are using or use a preset that sets the option."},metadataUsedHelpers:{message:"Not required anymore as this is enabled by default"},modules:{message:"Use the corresponding module transform plugin in the `plugins` option. Check out http://babeljs.io/docs/plugins/#modules"},nonStandard:{message:"Use the `react-jsx` and `flow-strip-types` plugins to support JSX and Flow. Also check out the react preset http://babeljs.io/docs/plugins/preset-react/"},optional:{message:"Put the specific transforms you want in the `plugins` option"},sourceMapName:{message:"The `sourceMapName` option has been removed because it makes more sense for the tooling that calls Babel to assign `map.file` themselves."},stage:{message:"Check out the corresponding stage-x presets http://babeljs.io/docs/plugins/#presets"},whitelist:{message:"Put the specific transforms you want in the `plugins` option"},resolveModuleSource:{version:6,message:"Use `babel-plugin-module-resolver@3`'s 'resolvePath' options"},metadata:{version:6,message:"Generated plugin metadata is always included in the output result"},sourceMapTarget:{version:6,message:"The `sourceMapTarget` option has been removed because it makes more sense for the tooling that calls Babel to assign `map.file` themselves."}}},function(e,t,n){"use strict";function r(){const e=n(109);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){const n=r().resolve(t,e).split(r().sep);return new RegExp(["^",...n.map((e,t)=>{const r=t===n.length-1;return"**"===e?r?c:l:"*"===e?r?u:s:0===e.indexOf("*.")?o+p(e.slice(1))+(r?a:i):p(e)+(r?a:i)})].join(""))};const i="\\"+r().sep,a=`(?:${i}|$)`,o=`[^${i}]+`,s=`(?:${o}${i})`,u=`(?:${o}${a})`,l=s+"*?",c=`${s}*?${u}?`;function p(e){return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&")}},function(e,t,n){"use strict";function r(){const e=n(99);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.ConfigPrinter=t.ChainFormatter=void 0;const i={Programmatic:0,Config:1};t.ChainFormatter=i;const a={title(e,t,n){let r="";return e===i.Programmatic?(r="programmatic options",t&&(r+=" from "+t)):r="config "+n,r},loc(e,t){let n="";return null!=e&&(n+=`.overrides[${e}]`),null!=t&&(n+=`.env["${t}"]`),n},*optionsAndDescriptors(e){const t=Object.assign({},e.options);delete t.overrides,delete t.env;const n=[...yield*e.plugins()];n.length&&(t.plugins=n.map(e=>o(e)));const r=[...yield*e.presets()];return r.length&&(t.presets=[...r].map(e=>o(e))),JSON.stringify(t,void 0,2)}};function o(e){var t;let n=null==(t=e.file)?void 0:t.request;return null==n&&("object"===typeof e.value?n=e.value:"function"===typeof e.value&&(n=`[Function: ${e.value.toString().substr(0,50)} ... ]`)),null==n&&(n="[Unknown]"),void 0===e.options?n:null==e.name?[n,e.options]:[n,e.options,e.name]}class s{constructor(){this._stack=[]}configure(e,t,{callerName:n,filepath:r}){return e?(e,i,a)=>{this._stack.push({type:t,callerName:n,filepath:r,content:e,index:i,envName:a})}:()=>{}}static*format(e){let t=a.title(e.type,e.callerName,e.filepath);const n=a.loc(e.index,e.envName);n&&(t+=" "+n);return`${t}\n${yield*a.optionsAndDescriptors(e.content)}`}*output(){if(0===this._stack.length)return"";return(yield*r().all(this._stack.map(e=>s.format(e)))).join("\n\n")}}t.ConfigPrinter=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.validatePluginObject=function(e){const t={type:"root",source:"plugin"};return Object.keys(e).forEach(n=>{const r=i[n];if(!r){const e=new Error(`.${n} is not a valid Plugin property`);throw e.code="BABEL_UNKNOWN_PLUGIN_PROPERTY",e}r({type:"option",name:n,parent:t},e[n])}),e};var r=n(447);const i={name:r.assertString,manipulateOptions:r.assertFunction,pre:r.assertFunction,post:r.assertFunction,inherits:r.assertFunction,visitor:function(e,t){const n=(0,r.assertObject)(e,t);if(n&&(Object.keys(n).forEach(e=>function(e,t){if(t&&"object"===typeof t)Object.keys(t).forEach(t=>{if("enter"!==t&&"exit"!==t)throw new Error(`.visitor["${e}"] may only have .enter and/or .exit handlers.`)});else if("function"!==typeof t)throw new Error(`.visitor["${e}"] must be a function`);return t}(e,n[e])),n.enter||n.exit))throw new Error((0,r.msg)(e)+' cannot contain catch-all "enter" or "exit" handlers. Please target individual nodes.');return n},parserOverride:r.assertFunction,generatorOverride:r.assertFunction}},function(e,t,n){"use strict";function r(){const e=n(158);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.makeConfigAPI=o,t.makePresetAPI=s,t.makePluginAPI=function(e){return Object.assign({},s(e),{assumption:t=>e.using(e=>e.assumptions[t])})};var i=n(313),a=n(227);n(448);function o(e){return{version:i.version,cache:e.simple(),env:t=>e.using(e=>"undefined"===typeof t?e.envName:"function"===typeof t?(0,a.assertSimpleType)(t(e.envName)):(Array.isArray(t)||(t=[t]),t.some(t=>{if("string"!==typeof t)throw new Error("Unexpected non-string value");return t===e.envName}))),async:()=>!1,caller:t=>e.using(e=>(0,a.assertSimpleType)(t(e.caller))),assertVersion:u}}function s(e){return Object.assign({},o(e),{targets:()=>JSON.parse(e.using(e=>JSON.stringify(e.targets)))})}function u(e){if("number"===typeof e){if(!Number.isInteger(e))throw new Error("Expected string or integer value.");e=`^${e}.0.0-0`}if("string"!==typeof e)throw new Error("Expected string or integer value.");if(r().satisfies(i.version,e))return;const t=Error.stackTraceLimit;"number"===typeof t&&t<25&&(Error.stackTraceLimit=25);const n=new Error(`Requires Babel "${e}", but was loaded with "${i.version}". If you are sure you have a compatible version of @babel/core, it is likely that something in your build process is loading the wrong version. Inspect the stack trace of this error to look for the first entry that doesn't mention "@babel/core" or "babel-core" to see what is calling Babel.`);throw"number"===typeof t&&(Error.stackTraceLimit=t),Object.assign(n,{code:"BABEL_VERSION_UNSUPPORTED",version:i.version,range:e})}},function(e,t,n){"use strict";function r(){const e=n(99);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.transformAsync=t.transformSync=t.transform=void 0;var i=n(224),a=n(450);const o=r()((function*(e,t){const n=yield*(0,i.default)(t);return null===n?null:yield*(0,a.run)(n,e)}));t.transform=function(e,t,n){if("function"===typeof t&&(n=t,t=void 0),void 0===n)return o.sync(e,t);o.errback(e,t,n)};const s=o.sync;t.transformSync=s;const u=o.async;t.transformAsync=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class r{constructor(e,t,n){this._map=new Map,this.key=void 0,this.file=void 0,this.opts=void 0,this.cwd=void 0,this.filename=void 0,this.key=t,this.file=e,this.opts=n||{},this.cwd=e.opts.cwd,this.filename=e.opts.filename}set(e,t){this._map.set(e,t)}get(e){return this._map.get(e)}availableHelper(e,t){return this.file.availableHelper(e,t)}addHelper(e){return this.file.addHelper(e)}addImport(){return this.file.addImport()}buildCodeFrameError(e,t,n){return this.file.buildCodeFrameError(e,t,n)}}t.default=r,r.prototype.getModuleName=function(){return this.file.getModuleName()}},function(e,t,n){"use strict";function r(){const e=n(82);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){a||(a=new i.default(Object.assign({},s,{visitor:r().default.explode(s.visitor)}),{}));return a};var i=n(225);let a;function o(e){const t=null==e?void 0:e._blockHoist;return null==t?1:!0===t?2:t}const s={name:"internal.blockHoist",visitor:{Block:{exit({node:e}){const{body:t}=e;let n=Math.pow(2,30)-1,r=!1;for(let i=0;i<t.length;i++){const e=o(t[i]);if(e>n){r=!0;break}n=e}r&&(e.body=function(e){const t=Object.create(null);for(let i=0;i<e.length;i++){const n=e[i],r=o(n);(t[r]||(t[r]=[])).push(n)}const n=Object.keys(t).map(e=>+e).sort((e,t)=>t-e);let r=0;for(const i of n){const n=t[i];for(const t of n)e[r++]=t}return e}(t.slice()))}}}}},function(e,t,n){"use strict";function r(){const e=n(488);return r=function(){return e},e}function i(){const e=n(109);return i=function(){return e},e}function a(){const e=n(304);return a=function(){return e},e}function o(){const e=n(28);return o=function(){return e},e}function s(){const e=n(452);return s=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function*(e,t,n,a){if(n=""+(n||""),a){if("Program"===a.type)a=o().file(a,[],[]);else if("File"!==a.type)throw new Error("AST root must be a Program or File node");t.cloneInputAst&&(a=(0,c.default)(a))}else a=yield*(0,l.default)(e,t,n);let h=null;if(!1!==t.inputSourceMap){if("object"===typeof t.inputSourceMap&&(h=s().fromObject(t.inputSourceMap)),!h){const e=m(f,a);if(e)try{h=s().fromComment(e)}catch(y){p("discarding unknown inline input sourcemap",y)}}if(!h){const e=m(d,a);if("string"===typeof t.filename&&e)try{const n=d.exec(e),a=r().readFileSync(i().resolve(i().dirname(t.filename),n[1]));a.length>1e6?p("skip merging input map > 1 MB"):h=s().fromJSON(a)}catch(y){p("discarding unknown file input sourcemap",y)}else e&&p("discarding un-loadable file input sourcemap")}}return new u.default(t,{code:n,ast:a,inputMap:h})};var u=n(314),l=n(453),c=n(794);const p=a()("babel:transform:file");const f=/^[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,(?:.*)$/,d=/^[@#][ \t]+sourceMappingURL=([^\s'"`]+)[ \t]*$/;function h(e,t,n){return t&&(t=t.filter(({value:t})=>!e.test(t)||(n=t,!1))),[t,n]}function m(e,t){let n=null;return o().traverseFast(t,t=>{[t.leadingComments,n]=h(e,t.leadingComments,n),[t.innerComments,n]=h(e,t.innerComments,n),[t.trailingComments,n]=h(e,t.trailingComments,n)}),n}},,function(e,t,n){var r=n(327),i=r.Buffer;function a(e,t){for(var n in e)t[n]=e[n]}function o(e,t,n){return i(e,t,n)}i.from&&i.alloc&&i.allocUnsafe&&i.allocUnsafeSlow?e.exports=r:(a(r,t),t.Buffer=o),a(i,o),o.from=function(e,t,n){if("number"===typeof e)throw new TypeError("Argument must not be a number");return i(e,t,n)},o.alloc=function(e,t,n){if("number"!==typeof e)throw new TypeError("Argument must be a number");var r=i(e);return void 0!==t?"string"===typeof n?r.fill(t,n):r.fill(t):r.fill(0),r},o.allocUnsafe=function(e){if("number"!==typeof e)throw new TypeError("Argument must be a number");return i(e)},o.allocUnsafeSlow=function(e){if("number"!==typeof e)throw new TypeError("Argument must be a number");return r.SlowBuffer(e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){let a=`Support for the experimental syntax '${e}' isn't currently enabled (${t.line}:${t.column+1}):\n\n`+n;const o=r[e];if(o){const{syntax:e,transform:t}=o;if(e){const n=i(e);if(t){const e=i(t),r=t.name.startsWith("@babel/plugin")?"plugins":"presets";a+=`\n\nAdd ${e} to the '${r}' section of your Babel config to enable transformation.\nIf you want to leave it as-is, add ${n} to the 'plugins' section to enable parsing.`}else a+=`\n\nAdd ${n} to the 'plugins' section of your Babel config to enable parsing.`}}return a};const r={asyncDoExpressions:{syntax:{name:"@babel/plugin-syntax-async-do-expressions",url:"https://git.io/JYer8"}},classProperties:{syntax:{name:"@babel/plugin-syntax-class-properties",url:"https://git.io/vb4yQ"},transform:{name:"@babel/plugin-proposal-class-properties",url:"https://git.io/vb4SL"}},classPrivateProperties:{syntax:{name:"@babel/plugin-syntax-class-properties",url:"https://git.io/vb4yQ"},transform:{name:"@babel/plugin-proposal-class-properties",url:"https://git.io/vb4SL"}},classPrivateMethods:{syntax:{name:"@babel/plugin-syntax-class-properties",url:"https://git.io/vb4yQ"},transform:{name:"@babel/plugin-proposal-private-methods",url:"https://git.io/JvpRG"}},classStaticBlock:{syntax:{name:"@babel/plugin-syntax-class-static-block",url:"https://git.io/JTLB6"},transform:{name:"@babel/plugin-proposal-class-static-block",url:"https://git.io/JTLBP"}},decimal:{syntax:{name:"@babel/plugin-syntax-decimal",url:"https://git.io/JfKOH"}},decorators:{syntax:{name:"@babel/plugin-syntax-decorators",url:"https://git.io/vb4y9"},transform:{name:"@babel/plugin-proposal-decorators",url:"https://git.io/vb4ST"}},doExpressions:{syntax:{name:"@babel/plugin-syntax-do-expressions",url:"https://git.io/vb4yh"},transform:{name:"@babel/plugin-proposal-do-expressions",url:"https://git.io/vb4S3"}},dynamicImport:{syntax:{name:"@babel/plugin-syntax-dynamic-import",url:"https://git.io/vb4Sv"}},exportDefaultFrom:{syntax:{name:"@babel/plugin-syntax-export-default-from",url:"https://git.io/vb4SO"},transform:{name:"@babel/plugin-proposal-export-default-from",url:"https://git.io/vb4yH"}},exportNamespaceFrom:{syntax:{name:"@babel/plugin-syntax-export-namespace-from",url:"https://git.io/vb4Sf"},transform:{name:"@babel/plugin-proposal-export-namespace-from",url:"https://git.io/vb4SG"}},flow:{syntax:{name:"@babel/plugin-syntax-flow",url:"https://git.io/vb4yb"},transform:{name:"@babel/preset-flow",url:"https://git.io/JfeDn"}},functionBind:{syntax:{name:"@babel/plugin-syntax-function-bind",url:"https://git.io/vb4y7"},transform:{name:"@babel/plugin-proposal-function-bind",url:"https://git.io/vb4St"}},functionSent:{syntax:{name:"@babel/plugin-syntax-function-sent",url:"https://git.io/vb4yN"},transform:{name:"@babel/plugin-proposal-function-sent",url:"https://git.io/vb4SZ"}},importMeta:{syntax:{name:"@babel/plugin-syntax-import-meta",url:"https://git.io/vbKK6"}},jsx:{syntax:{name:"@babel/plugin-syntax-jsx",url:"https://git.io/vb4yA"},transform:{name:"@babel/preset-react",url:"https://git.io/JfeDR"}},importAssertions:{syntax:{name:"@babel/plugin-syntax-import-assertions",url:"https://git.io/JUbkv"}},moduleStringNames:{syntax:{name:"@babel/plugin-syntax-module-string-names",url:"https://git.io/JTL8G"}},numericSeparator:{syntax:{name:"@babel/plugin-syntax-numeric-separator",url:"https://git.io/vb4Sq"},transform:{name:"@babel/plugin-proposal-numeric-separator",url:"https://git.io/vb4yS"}},optionalChaining:{syntax:{name:"@babel/plugin-syntax-optional-chaining",url:"https://git.io/vb4Sc"},transform:{name:"@babel/plugin-proposal-optional-chaining",url:"https://git.io/vb4Sk"}},pipelineOperator:{syntax:{name:"@babel/plugin-syntax-pipeline-operator",url:"https://git.io/vb4yj"},transform:{name:"@babel/plugin-proposal-pipeline-operator",url:"https://git.io/vb4SU"}},privateIn:{syntax:{name:"@babel/plugin-syntax-private-property-in-object",url:"https://git.io/JfK3q"},transform:{name:"@babel/plugin-proposal-private-property-in-object",url:"https://git.io/JfK3O"}},recordAndTuple:{syntax:{name:"@babel/plugin-syntax-record-and-tuple",url:"https://git.io/JvKp3"}},throwExpressions:{syntax:{name:"@babel/plugin-syntax-throw-expressions",url:"https://git.io/vb4SJ"},transform:{name:"@babel/plugin-proposal-throw-expressions",url:"https://git.io/vb4yF"}},typescript:{syntax:{name:"@babel/plugin-syntax-typescript",url:"https://git.io/vb4SC"},transform:{name:"@babel/preset-typescript",url:"https://git.io/JfeDz"}},asyncGenerators:{syntax:{name:"@babel/plugin-syntax-async-generators",url:"https://git.io/vb4SY"},transform:{name:"@babel/plugin-proposal-async-generator-functions",url:"https://git.io/vb4yp"}},logicalAssignment:{syntax:{name:"@babel/plugin-syntax-logical-assignment-operators",url:"https://git.io/vAlBp"},transform:{name:"@babel/plugin-proposal-logical-assignment-operators",url:"https://git.io/vAlRe"}},nullishCoalescingOperator:{syntax:{name:"@babel/plugin-syntax-nullish-coalescing-operator",url:"https://git.io/vb4yx"},transform:{name:"@babel/plugin-proposal-nullish-coalescing-operator",url:"https://git.io/vb4Se"}},objectRestSpread:{syntax:{name:"@babel/plugin-syntax-object-rest-spread",url:"https://git.io/vb4y5"},transform:{name:"@babel/plugin-proposal-object-rest-spread",url:"https://git.io/vb4Ss"}},optionalCatchBinding:{syntax:{name:"@babel/plugin-syntax-optional-catch-binding",url:"https://git.io/vb4Sn"},transform:{name:"@babel/plugin-proposal-optional-catch-binding",url:"https://git.io/vb4SI"}}};r.privateIn.syntax=r.privateIn.transform;const i=({name:e,url:t})=>`${e} (${t})`},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return JSON.parse(JSON.stringify(e,i),a)};const r="$$ babel internal serialized type"+Math.random();function i(e,t){return"bigint"!==typeof t?t:{[r]:"BigInt",value:t.toString()}}function a(e,t){return t&&"object"===typeof t?"BigInt"!==t[r]?t:BigInt(t.value):t}},function(e,t,n){"use strict";function r(){const e=n(452);return r=function(){return e},e}function i(){const e=n(217);return i=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){const{opts:n,ast:o,code:s,inputMap:u}=t,l=[];for(const r of e)for(const e of r){const{generatorOverride:t}=e;if(t){const e=t(o,n.generatorOpts,s,i().default);void 0!==e&&l.push(e)}}let c;if(0===l.length)c=(0,i().default)(o,n.generatorOpts,s);else{if(1!==l.length)throw new Error("More than one plugin attempted to override codegen.");if(c=l[0],"function"===typeof c.then)throw new Error("You appear to be using an async codegen plugin, which your current version of Babel does not support. If you're using a published plugin, you may need to upgrade your @babel/core version.")}let{code:p,map:f}=c;f&&u&&(f=(0,a.default)(u.toObject(),f));"inline"!==n.sourceMaps&&"both"!==n.sourceMaps||(p+="\n"+r().fromObject(f).toComment());"inline"===n.sourceMaps&&(f=null);return{outputCode:p,outputMap:f}};var a=n(796)},function(e,t,n){"use strict";function r(){const e=n(797);return r=function(){return e},e}function i(e){return`${e.line}/${e.columnStart}`}function a(e){const t=new(r().SourceMapConsumer)(Object.assign({},e,{sourceRoot:null})),n=new Map,i=new Map;let a=null;return t.computeColumnSpans(),t.eachMapping(e=>{if(null===e.originalLine)return;let r=n.get(e.source);r||(r={path:e.source,content:t.sourceContentFor(e.source,!0)},n.set(e.source,r));let o=i.get(r);o||(o={source:r,mappings:[]},i.set(r,o));const s={line:e.originalLine,columnStart:e.originalColumn,columnEnd:1/0,name:e.name};a&&a.source===r&&a.mapping.line===e.originalLine&&(a.mapping.columnEnd=e.originalColumn),a={source:r,mapping:s},o.mappings.push({original:s,generated:t.allGeneratedPositionsFor({source:e.source,line:e.originalLine,column:e.originalColumn}).map(e=>({line:e.line,columnStart:e.column,columnEnd:e.lastColumn+1}))})},null,r().SourceMapConsumer.ORIGINAL_ORDER),{file:e.file,sourceRoot:e.sourceRoot,sources:Array.from(i.values())}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){const n=a(e),o=a(t),s=new(r().SourceMapGenerator);for(const{source:r}of n.sources)"string"===typeof r.content&&s.setSourceContent(r.path,r.content);if(1===o.sources.length){const e=o.sources[0],t=new Map;!function(e,t){for(const{source:n,mappings:r}of e.sources)for(const{original:e,generated:i}of r)for(const r of i)t(r,e,n)}(n,(n,r,a)=>{!function(e,t,n){const r=function({mappings:e},{line:t,columnStart:n,columnEnd:r}){return function(e,t){const n=function(e,t){let n=0,r=e.length;for(;n<r;){const i=Math.floor((n+r)/2),a=e[i],o=t(a);if(0===o){n=i;break}o>=0?r=i:n=i+1}let i=n;if(i<e.length){for(;i>=0&&t(e[i])>=0;)i--;return i+1}return i}(e,t),r=[];for(let i=n;i<e.length&&0===t(e[i]);i++)r.push(e[i]);return r}(e,({original:e})=>t>e.line?-1:t<e.line?1:n>=e.columnEnd?-1:r<=e.columnStart?1:0)}(e,t);for(const{generated:i}of r)for(const e of i)n(e)}(e,n,e=>{const n=i(e);t.has(n)||(t.set(n,e),s.addMapping({source:a.path,original:{line:r.line,column:r.columnStart},generated:{line:e.line,column:e.columnStart},name:r.name}))})});for(const n of t.values()){if(n.columnEnd===1/0)continue;const e={line:n.line,columnStart:n.columnEnd},r=i(e);t.has(r)||s.addMapping({generated:{line:e.line,column:e.columnStart}})}}const u=s.toJSON();"string"===typeof n.sourceRoot&&(u.sourceRoot=n.sourceRoot);return u}},function(e,t,n){t.SourceMapGenerator=n(454).SourceMapGenerator,t.SourceMapConsumer=n(800).SourceMapConsumer,t.SourceNode=n(803).SourceNode},function(e,t){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");t.encode=function(e){if(0<=e&&e<n.length)return n[e];throw new TypeError("Must be between 0 and 63: "+e)},t.decode=function(e){return 65<=e&&e<=90?e-65:97<=e&&e<=122?e-97+26:48<=e&&e<=57?e-48+52:43==e?62:47==e?63:-1}},function(e,t,n){var r=n(193);function i(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}i.prototype.unsortedForEach=function(e,t){this._array.forEach(e,t)},i.prototype.add=function(e){!function(e,t){var n=e.generatedLine,i=t.generatedLine,a=e.generatedColumn,o=t.generatedColumn;return i>n||i==n&&o>=a||r.compareByGeneratedPositionsInflated(e,t)<=0}(this._last,e)?(this._sorted=!1,this._array.push(e)):(this._last=e,this._array.push(e))},i.prototype.toArray=function(){return this._sorted||(this._array.sort(r.compareByGeneratedPositionsInflated),this._sorted=!0),this._array},t.MappingList=i},function(e,t,n){var r=n(193),i=n(801),a=n(456).ArraySet,o=n(455),s=n(802).quickSort;function u(e){var t=e;return"string"===typeof e&&(t=JSON.parse(e.replace(/^\)\]\}'/,""))),null!=t.sections?new p(t):new l(t)}function l(e){var t=e;"string"===typeof e&&(t=JSON.parse(e.replace(/^\)\]\}'/,"")));var n=r.getArg(t,"version"),i=r.getArg(t,"sources"),o=r.getArg(t,"names",[]),s=r.getArg(t,"sourceRoot",null),u=r.getArg(t,"sourcesContent",null),l=r.getArg(t,"mappings"),c=r.getArg(t,"file",null);if(n!=this._version)throw new Error("Unsupported version: "+n);i=i.map(String).map(r.normalize).map((function(e){return s&&r.isAbsolute(s)&&r.isAbsolute(e)?r.relative(s,e):e})),this._names=a.fromArray(o.map(String),!0),this._sources=a.fromArray(i,!0),this.sourceRoot=s,this.sourcesContent=u,this._mappings=l,this.file=c}function c(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}function p(e){var t=e;"string"===typeof e&&(t=JSON.parse(e.replace(/^\)\]\}'/,"")));var n=r.getArg(t,"version"),i=r.getArg(t,"sections");if(n!=this._version)throw new Error("Unsupported version: "+n);this._sources=new a,this._names=new a;var o={line:-1,column:0};this._sections=i.map((function(e){if(e.url)throw new Error("Support for url field in sections not implemented.");var t=r.getArg(e,"offset"),n=r.getArg(t,"line"),i=r.getArg(t,"column");if(n<o.line||n===o.line&&i<o.column)throw new Error("Section offsets must be ordered and non-overlapping.");return o=t,{generatedOffset:{generatedLine:n+1,generatedColumn:i+1},consumer:new u(r.getArg(e,"map"))}}))}u.fromSourceMap=function(e){return l.fromSourceMap(e)},u.prototype._version=3,u.prototype.__generatedMappings=null,Object.defineProperty(u.prototype,"_generatedMappings",{get:function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings}}),u.prototype.__originalMappings=null,Object.defineProperty(u.prototype,"_originalMappings",{get:function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings}}),u.prototype._charIsMappingSeparator=function(e,t){var n=e.charAt(t);return";"===n||","===n},u.prototype._parseMappings=function(e,t){throw new Error("Subclasses must implement _parseMappings")},u.GENERATED_ORDER=1,u.ORIGINAL_ORDER=2,u.GREATEST_LOWER_BOUND=1,u.LEAST_UPPER_BOUND=2,u.prototype.eachMapping=function(e,t,n){var i,a=t||null;switch(n||u.GENERATED_ORDER){case u.GENERATED_ORDER:i=this._generatedMappings;break;case u.ORIGINAL_ORDER:i=this._originalMappings;break;default:throw new Error("Unknown order of iteration.")}var o=this.sourceRoot;i.map((function(e){var t=null===e.source?null:this._sources.at(e.source);return null!=t&&null!=o&&(t=r.join(o,t)),{source:t,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:null===e.name?null:this._names.at(e.name)}}),this).forEach(e,a)},u.prototype.allGeneratedPositionsFor=function(e){var t=r.getArg(e,"line"),n={source:r.getArg(e,"source"),originalLine:t,originalColumn:r.getArg(e,"column",0)};if(null!=this.sourceRoot&&(n.source=r.relative(this.sourceRoot,n.source)),!this._sources.has(n.source))return[];n.source=this._sources.indexOf(n.source);var a=[],o=this._findMapping(n,this._originalMappings,"originalLine","originalColumn",r.compareByOriginalPositions,i.LEAST_UPPER_BOUND);if(o>=0){var s=this._originalMappings[o];if(void 0===e.column)for(var u=s.originalLine;s&&s.originalLine===u;)a.push({line:r.getArg(s,"generatedLine",null),column:r.getArg(s,"generatedColumn",null),lastColumn:r.getArg(s,"lastGeneratedColumn",null)}),s=this._originalMappings[++o];else for(var l=s.originalColumn;s&&s.originalLine===t&&s.originalColumn==l;)a.push({line:r.getArg(s,"generatedLine",null),column:r.getArg(s,"generatedColumn",null),lastColumn:r.getArg(s,"lastGeneratedColumn",null)}),s=this._originalMappings[++o]}return a},t.SourceMapConsumer=u,l.prototype=Object.create(u.prototype),l.prototype.consumer=u,l.fromSourceMap=function(e){var t=Object.create(l.prototype),n=t._names=a.fromArray(e._names.toArray(),!0),i=t._sources=a.fromArray(e._sources.toArray(),!0);t.sourceRoot=e._sourceRoot,t.sourcesContent=e._generateSourcesContent(t._sources.toArray(),t.sourceRoot),t.file=e._file;for(var o=e._mappings.toArray().slice(),u=t.__generatedMappings=[],p=t.__originalMappings=[],f=0,d=o.length;f<d;f++){var h=o[f],m=new c;m.generatedLine=h.generatedLine,m.generatedColumn=h.generatedColumn,h.source&&(m.source=i.indexOf(h.source),m.originalLine=h.originalLine,m.originalColumn=h.originalColumn,h.name&&(m.name=n.indexOf(h.name)),p.push(m)),u.push(m)}return s(t.__originalMappings,r.compareByOriginalPositions),t},l.prototype._version=3,Object.defineProperty(l.prototype,"sources",{get:function(){return this._sources.toArray().map((function(e){return null!=this.sourceRoot?r.join(this.sourceRoot,e):e}),this)}}),l.prototype._parseMappings=function(e,t){for(var n,i,a,u,l,p=1,f=0,d=0,h=0,m=0,y=0,g=e.length,b=0,v={},E={},T=[],S=[];b<g;)if(";"===e.charAt(b))p++,b++,f=0;else if(","===e.charAt(b))b++;else{for((n=new c).generatedLine=p,u=b;u<g&&!this._charIsMappingSeparator(e,u);u++);if(a=v[i=e.slice(b,u)])b+=i.length;else{for(a=[];b<u;)o.decode(e,b,E),l=E.value,b=E.rest,a.push(l);if(2===a.length)throw new Error("Found a source, but no line and column");if(3===a.length)throw new Error("Found a source and line, but no column");v[i]=a}n.generatedColumn=f+a[0],f=n.generatedColumn,a.length>1&&(n.source=m+a[1],m+=a[1],n.originalLine=d+a[2],d=n.originalLine,n.originalLine+=1,n.originalColumn=h+a[3],h=n.originalColumn,a.length>4&&(n.name=y+a[4],y+=a[4])),S.push(n),"number"===typeof n.originalLine&&T.push(n)}s(S,r.compareByGeneratedPositionsDeflated),this.__generatedMappings=S,s(T,r.compareByOriginalPositions),this.__originalMappings=T},l.prototype._findMapping=function(e,t,n,r,a,o){if(e[n]<=0)throw new TypeError("Line must be greater than or equal to 1, got "+e[n]);if(e[r]<0)throw new TypeError("Column must be greater than or equal to 0, got "+e[r]);return i.search(e,t,a,o)},l.prototype.computeColumnSpans=function(){for(var e=0;e<this._generatedMappings.length;++e){var t=this._generatedMappings[e];if(e+1<this._generatedMappings.length){var n=this._generatedMappings[e+1];if(t.generatedLine===n.generatedLine){t.lastGeneratedColumn=n.generatedColumn-1;continue}}t.lastGeneratedColumn=1/0}},l.prototype.originalPositionFor=function(e){var t={generatedLine:r.getArg(e,"line"),generatedColumn:r.getArg(e,"column")},n=this._findMapping(t,this._generatedMappings,"generatedLine","generatedColumn",r.compareByGeneratedPositionsDeflated,r.getArg(e,"bias",u.GREATEST_LOWER_BOUND));if(n>=0){var i=this._generatedMappings[n];if(i.generatedLine===t.generatedLine){var a=r.getArg(i,"source",null);null!==a&&(a=this._sources.at(a),null!=this.sourceRoot&&(a=r.join(this.sourceRoot,a)));var o=r.getArg(i,"name",null);return null!==o&&(o=this._names.at(o)),{source:a,line:r.getArg(i,"originalLine",null),column:r.getArg(i,"originalColumn",null),name:o}}}return{source:null,line:null,column:null,name:null}},l.prototype.hasContentsOfAllSources=function(){return!!this.sourcesContent&&(this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some((function(e){return null==e})))},l.prototype.sourceContentFor=function(e,t){if(!this.sourcesContent)return null;if(null!=this.sourceRoot&&(e=r.relative(this.sourceRoot,e)),this._sources.has(e))return this.sourcesContent[this._sources.indexOf(e)];var n;if(null!=this.sourceRoot&&(n=r.urlParse(this.sourceRoot))){var i=e.replace(/^file:\/\//,"");if("file"==n.scheme&&this._sources.has(i))return this.sourcesContent[this._sources.indexOf(i)];if((!n.path||"/"==n.path)&&this._sources.has("/"+e))return this.sourcesContent[this._sources.indexOf("/"+e)]}if(t)return null;throw new Error('"'+e+'" is not in the SourceMap.')},l.prototype.generatedPositionFor=function(e){var t=r.getArg(e,"source");if(null!=this.sourceRoot&&(t=r.relative(this.sourceRoot,t)),!this._sources.has(t))return{line:null,column:null,lastColumn:null};var n={source:t=this._sources.indexOf(t),originalLine:r.getArg(e,"line"),originalColumn:r.getArg(e,"column")},i=this._findMapping(n,this._originalMappings,"originalLine","originalColumn",r.compareByOriginalPositions,r.getArg(e,"bias",u.GREATEST_LOWER_BOUND));if(i>=0){var a=this._originalMappings[i];if(a.source===n.source)return{line:r.getArg(a,"generatedLine",null),column:r.getArg(a,"generatedColumn",null),lastColumn:r.getArg(a,"lastGeneratedColumn",null)}}return{line:null,column:null,lastColumn:null}},t.BasicSourceMapConsumer=l,p.prototype=Object.create(u.prototype),p.prototype.constructor=u,p.prototype._version=3,Object.defineProperty(p.prototype,"sources",{get:function(){for(var e=[],t=0;t<this._sections.length;t++)for(var n=0;n<this._sections[t].consumer.sources.length;n++)e.push(this._sections[t].consumer.sources[n]);return e}}),p.prototype.originalPositionFor=function(e){var t={generatedLine:r.getArg(e,"line"),generatedColumn:r.getArg(e,"column")},n=i.search(t,this._sections,(function(e,t){var n=e.generatedLine-t.generatedOffset.generatedLine;return n||e.generatedColumn-t.generatedOffset.generatedColumn})),a=this._sections[n];return a?a.consumer.originalPositionFor({line:t.generatedLine-(a.generatedOffset.generatedLine-1),column:t.generatedColumn-(a.generatedOffset.generatedLine===t.generatedLine?a.generatedOffset.generatedColumn-1:0),bias:e.bias}):{source:null,line:null,column:null,name:null}},p.prototype.hasContentsOfAllSources=function(){return this._sections.every((function(e){return e.consumer.hasContentsOfAllSources()}))},p.prototype.sourceContentFor=function(e,t){for(var n=0;n<this._sections.length;n++){var r=this._sections[n].consumer.sourceContentFor(e,!0);if(r)return r}if(t)return null;throw new Error('"'+e+'" is not in the SourceMap.')},p.prototype.generatedPositionFor=function(e){for(var t=0;t<this._sections.length;t++){var n=this._sections[t];if(-1!==n.consumer.sources.indexOf(r.getArg(e,"source"))){var i=n.consumer.generatedPositionFor(e);if(i)return{line:i.line+(n.generatedOffset.generatedLine-1),column:i.column+(n.generatedOffset.generatedLine===i.line?n.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}},p.prototype._parseMappings=function(e,t){this.__generatedMappings=[],this.__originalMappings=[];for(var n=0;n<this._sections.length;n++)for(var i=this._sections[n],a=i.consumer._generatedMappings,o=0;o<a.length;o++){var u=a[o],l=i.consumer._sources.at(u.source);null!==i.consumer.sourceRoot&&(l=r.join(i.consumer.sourceRoot,l)),this._sources.add(l),l=this._sources.indexOf(l);var c=i.consumer._names.at(u.name);this._names.add(c),c=this._names.indexOf(c);var p={source:l,generatedLine:u.generatedLine+(i.generatedOffset.generatedLine-1),generatedColumn:u.generatedColumn+(i.generatedOffset.generatedLine===u.generatedLine?i.generatedOffset.generatedColumn-1:0),originalLine:u.originalLine,originalColumn:u.originalColumn,name:c};this.__generatedMappings.push(p),"number"===typeof p.originalLine&&this.__originalMappings.push(p)}s(this.__generatedMappings,r.compareByGeneratedPositionsDeflated),s(this.__originalMappings,r.compareByOriginalPositions)},t.IndexedSourceMapConsumer=p},function(e,t){t.GREATEST_LOWER_BOUND=1,t.LEAST_UPPER_BOUND=2,t.search=function(e,n,r,i){if(0===n.length)return-1;var a=function e(n,r,i,a,o,s){var u=Math.floor((r-n)/2)+n,l=o(i,a[u],!0);return 0===l?u:l>0?r-u>1?e(u,r,i,a,o,s):s==t.LEAST_UPPER_BOUND?r<a.length?r:-1:u:u-n>1?e(n,u,i,a,o,s):s==t.LEAST_UPPER_BOUND?u:n<0?-1:n}(-1,n.length,e,n,r,i||t.GREATEST_LOWER_BOUND);if(a<0)return-1;for(;a-1>=0&&0===r(n[a],n[a-1],!0);)--a;return a}},function(e,t){function n(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function r(e,t,i,a){if(i<a){var o=i-1;n(e,(c=i,p=a,Math.round(c+Math.random()*(p-c))),a);for(var s=e[a],u=i;u<a;u++)t(e[u],s)<=0&&n(e,o+=1,u);n(e,o+1,u);var l=o+1;r(e,t,i,l-1),r(e,t,l+1,a)}var c,p}t.quickSort=function(e,t){r(e,t,0,e.length-1)}},function(e,t,n){var r=n(454).SourceMapGenerator,i=n(193),a=/(\r?\n)/,o="$$$isSourceNode$$$";function s(e,t,n,r,i){this.children=[],this.sourceContents={},this.line=null==e?null:e,this.column=null==t?null:t,this.source=null==n?null:n,this.name=null==i?null:i,this[o]=!0,null!=r&&this.add(r)}s.fromStringWithSourceMap=function(e,t,n){var r=new s,o=e.split(a),u=0,l=function(){return e()+(e()||"");function e(){return u<o.length?o[u++]:void 0}},c=1,p=0,f=null;return t.eachMapping((function(e){if(null!==f){if(!(c<e.generatedLine)){var t=(n=o[u]).substr(0,e.generatedColumn-p);return o[u]=n.substr(e.generatedColumn-p),p=e.generatedColumn,d(f,t),void(f=e)}d(f,l()),c++,p=0}for(;c<e.generatedLine;)r.add(l()),c++;if(p<e.generatedColumn){var n=o[u];r.add(n.substr(0,e.generatedColumn)),o[u]=n.substr(e.generatedColumn),p=e.generatedColumn}f=e}),this),u<o.length&&(f&&d(f,l()),r.add(o.splice(u).join(""))),t.sources.forEach((function(e){var a=t.sourceContentFor(e);null!=a&&(null!=n&&(e=i.join(n,e)),r.setSourceContent(e,a))})),r;function d(e,t){if(null===e||void 0===e.source)r.add(t);else{var a=n?i.join(n,e.source):e.source;r.add(new s(e.originalLine,e.originalColumn,a,t,e.name))}}},s.prototype.add=function(e){if(Array.isArray(e))e.forEach((function(e){this.add(e)}),this);else{if(!e[o]&&"string"!==typeof e)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+e);e&&this.children.push(e)}return this},s.prototype.prepend=function(e){if(Array.isArray(e))for(var t=e.length-1;t>=0;t--)this.prepend(e[t]);else{if(!e[o]&&"string"!==typeof e)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+e);this.children.unshift(e)}return this},s.prototype.walk=function(e){for(var t,n=0,r=this.children.length;n<r;n++)(t=this.children[n])[o]?t.walk(e):""!==t&&e(t,{source:this.source,line:this.line,column:this.column,name:this.name})},s.prototype.join=function(e){var t,n,r=this.children.length;if(r>0){for(t=[],n=0;n<r-1;n++)t.push(this.children[n]),t.push(e);t.push(this.children[n]),this.children=t}return this},s.prototype.replaceRight=function(e,t){var n=this.children[this.children.length-1];return n[o]?n.replaceRight(e,t):"string"===typeof n?this.children[this.children.length-1]=n.replace(e,t):this.children.push("".replace(e,t)),this},s.prototype.setSourceContent=function(e,t){this.sourceContents[i.toSetString(e)]=t},s.prototype.walkSourceContents=function(e){for(var t=0,n=this.children.length;t<n;t++)this.children[t][o]&&this.children[t].walkSourceContents(e);var r=Object.keys(this.sourceContents);for(t=0,n=r.length;t<n;t++)e(i.fromSetString(r[t]),this.sourceContents[r[t]])},s.prototype.toString=function(){var e="";return this.walk((function(t){e+=t})),e},s.prototype.toStringWithSourceMap=function(e){var t={code:"",line:1,column:0},n=new r(e),i=!1,a=null,o=null,s=null,u=null;return this.walk((function(e,r){t.code+=e,null!==r.source&&null!==r.line&&null!==r.column?(a===r.source&&o===r.line&&s===r.column&&u===r.name||n.addMapping({source:r.source,original:{line:r.line,column:r.column},generated:{line:t.line,column:t.column},name:r.name}),a=r.source,o=r.line,s=r.column,u=r.name,i=!0):i&&(n.addMapping({generated:{line:t.line,column:t.column}}),a=null,i=!1);for(var l=0,c=e.length;l<c;l++)10===e.charCodeAt(l)?(t.line++,t.column=0,l+1===c?(a=null,i=!1):i&&n.addMapping({source:r.source,original:{line:r.line,column:r.column},generated:{line:t.line,column:t.column},name:r.name})):t.column++})),this.walkSourceContents((function(e,t){n.setSourceContent(e,t)})),{code:t.code,map:n}},t.SourceNode=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.transformFileSync=function(){throw new Error("Transforming files is not supported in browsers")},t.transformFileAsync=function(){return Promise.reject(new Error("Transforming files is not supported in browsers"))},t.transformFile=void 0;t.transformFile=function(e,t,n){"function"===typeof t&&(n=t),n(new Error("Transforming files is not supported in browsers"),null)}},function(e,t,n){"use strict";function r(){const e=n(99);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.transformFromAstAsync=t.transformFromAstSync=t.transformFromAst=void 0;var i=n(224),a=n(450);const o=r()((function*(e,t,n){const r=yield*(0,i.default)(n);if(null===r)return null;if(!e)throw new Error("No AST given");return yield*(0,a.run)(r,t,e)}));t.transformFromAst=function(e,t,n,r){if("function"===typeof n&&(r=n,n=void 0),void 0===r)return o.sync(e,t,n);o.errback(e,t,n,r)};const s=o.sync;t.transformFromAstSync=s;const u=o.async;t.transformFromAstAsync=u},function(e,t,n){"use strict";function r(){const e=n(99);return r=function(){return e},e}Object.defineProperty(t,"__esModule",{value:!0}),t.parseAsync=t.parseSync=t.parse=void 0;var i=n(224),a=n(453),o=n(451);const s=r()((function*(e,t){const n=yield*(0,i.default)(t);return null===n?null:yield*(0,a.default)(n.passes,(0,o.default)(n),e)}));t.parse=function(e,t,n){if("function"===typeof t&&(n=t,t=void 0),void 0===n)return s.sync(e,t);s.errback(e,t,n)};const u=s.sync;t.parseSync=u;const l=s.async;t.parseAsync=l},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"findAllComponentDefinitions",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"findExportedComponentDefinition",{enumerable:!0,get:function(){return a.default}}),Object.defineProperty(t,"findAllExportedComponentDefinitions",{enumerable:!0,get:function(){return o.default}});var i=r(n(808)),a=r(n(812)),o=r(n(813))},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=new Set;function n(e){return(0,a.default)(e)&&((0,l.default)(e),t.add(e)),!1}function r(e){return(0,u.default)(e)&&t.add(e),!1}return(0,i.visit)(e,{visitFunctionDeclaration:r,visitFunctionExpression:r,visitArrowFunctionExpression:r,visitClassExpression:n,visitClassDeclaration:n,visitCallExpression:function(e){if((0,s.default)(e)){const n=(0,c.default)(e.get("arguments",0));return t.delete(n),t.add(e),!1}if((0,o.default)(e)){const n=(0,c.default)(e.get("arguments",0));return i.namedTypes.ObjectExpression.check(n.node)&&t.add(n),!1}this.traverse(e)}}),Array.from(t)};var i=n(35),a=r(n(124)),o=r(n(159)),s=r(n(98)),u=r(n(229)),l=r(n(230)),c=r(n(47))},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return(0,i.default)(e,"createElement")};var i=r(n(213))},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return(0,i.default)(e,"cloneElement")};var i=r(n(213))},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){i.namedTypes.ExpressionStatement.check(e.node)&&(e=e.get("expression"));if(!(0,o.default)(e.node,{callee:{property:{name:"only"}}}))return!1;const t=e.get("callee","object"),n=(0,s.default)(t);if(!(0,o.default)(t,{value:{property:{name:"Children"}}}))return!1;return Boolean(n&&(0,a.default)(n))};var i=n(35),a=r(n(187)),o=r(n(138)),s=r(n(139))},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){let t;function n(e){const n=(0,p.default)(e).reduce((e,t)=>{if(m(t))e.push(t);else{const n=(0,f.default)((0,d.default)(t));m(n)&&e.push(n)}return e},[]);if(0===n.length)return!1;if(n.length>1||t)throw new Error("Multiple exported component definitions found.");return t=y(n[0]),!1}return(0,i.visit)(e,{visitFunctionDeclaration:h,visitFunctionExpression:h,visitClassDeclaration:h,visitClassExpression:h,visitIfStatement:h,visitWithStatement:h,visitSwitchStatement:h,visitWhileStatement:h,visitDoWhileStatement:h,visitForStatement:h,visitForInStatement:h,visitForOfStatement:h,visitImportDeclaration:h,visitExportNamedDeclaration:n,visitExportDefaultDeclaration:n,visitAssignmentExpression:function(e){if(!(0,a.default)(e))return!1;if(!m(e=(0,f.default)(e.get("right")))&&!m(e=(0,f.default)((0,d.default)(e))))return!1;if(t)throw new Error("Multiple exported component definitions found.");return t=y(e),!1}}),t};var i=n(35),a=r(n(318)),o=r(n(124)),s=r(n(159)),u=r(n(98)),l=r(n(229)),c=r(n(230)),p=r(n(319)),f=r(n(47)),d=r(n(457));function h(){return!1}function m(e){return(0,s.default)(e)||(0,o.default)(e)||(0,l.default)(e)||(0,u.default)(e)}function y(e){if((0,s.default)(e)){const t=(0,f.default)(e.get("arguments",0));if(i.namedTypes.ObjectExpression.check(t.node))return t}else{if((0,o.default)(e))return(0,c.default)(e),e;if((0,l.default)(e)||(0,u.default)(e))return e}return null}},function(e,t,n){"use strict";var r=n(26);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=[];function n(e){const n=(0,p.default)(e).reduce((e,t)=>{if(m(t))e.push(t);else{const n=(0,f.default)((0,d.default)(t));m(n)&&e.push(n)}return e},[]).map(e=>y(e));return 0===n.length||n.forEach(e=>{e&&-1===t.indexOf(e)&&t.push(e)}),!1}return(0,i.visit)(e,{visitFunctionDeclaration:h,visitFunctionExpression:h,visitClassDeclaration:h,visitClassExpression:h,visitIfStatement:h,visitWithStatement:h,visitSwitchStatement:h,visitCatchCause:h,visitWhileStatement:h,visitDoWhileStatement:h,visitForStatement:h,visitForInStatement:h,visitExportDeclaration:n,visitExportNamedDeclaration:n,visitExportDefaultDeclaration:n,visitAssignmentExpression:function(e){if(!(0,a.default)(e))return!1;if(!m(e=(0,f.default)(e.get("right")))&&!m(e=(0,f.default)((0,d.default)(e))))return!1;const n=y(e);return n&&-1===t.indexOf(n)&&t.push(n),!1}}),t};var i=n(35),a=r(n(318)),o=r(n(124)),s=r(n(159)),u=r(n(98)),l=r(n(229)),c=r(n(230)),p=r(n(319)),f=r(n(47)),d=r(n(457));function h(){return!1}function m(e){return(0,s.default)(e)||(0,o.default)(e)||(0,l.default)(e)||(0,u.default)(e)}function y(e){if((0,s.default)(e)){const t=(0,f.default)(e.get("arguments",0));if(i.namedTypes.ObjectExpression.check(t.node))return t}else{if((0,o.default)(e))return(0,c.default)(e),e;if((0,l.default)(e)||(0,u.default)(e))return e}return null}},function(e,t,n){"use strict";var r=n(26),i=n(156);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getClassMemberValuePath",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"getFlowType",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"getFlowTypeFromReactComponent",{enumerable:!0,get:function(){return u.default}}),Object.defineProperty(t,"getMemberExpressionRoot",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"getMembers",{enumerable:!0,get:function(){return c.default}}),Object.defineProperty(t,"getMemberValuePath",{enumerable:!0,get:function(){return p.default}}),Object.defineProperty(t,"getMethodDocumentation",{enumerable:!0,get:function(){return f.default}}),Object.defineProperty(t,"getNameOrValue",{enumerable:!0,get:function(){return d.default}}),Object.defineProperty(t,"getParameterName",{enumerable:!0,get:function(){return h.default}}),Object.defineProperty(t,"getPropertyName",{enumerable:!0,get:function(){return m.default}}),Object.defineProperty(t,"getPropertyValuePath",{enumerable:!0,get:function(){return y.default}}),Object.defineProperty(t,"getPropType",{enumerable:!0,get:function(){return g.default}}),Object.defineProperty(t,"getTypeAnnotation",{enumerable:!0,get:function(){return b.default}}),Object.defineProperty(t,"isExportsOrModuleAssignment",{enumerable:!0,get:function(){return v.default}}),Object.defineProperty(t,"isReactComponentClass",{enumerable:!0,get:function(){return E.default}}),Object.defineProperty(t,"isReactComponentMethod",{enumerable:!0,get:function(){return T.default}}),Object.defineProperty(t,"isReactCreateClassCall",{enumerable:!0,get:function(){return S.default}}),Object.defineProperty(t,"isReactForwardRefCall",{enumerable:!0,get:function(){return x.default}}),Object.defineProperty(t,"isReactModuleName",{enumerable:!0,get:function(){return P.default}}),Object.defineProperty(t,"isStatelessComponent",{enumerable:!0,get:function(){return _.default}}),Object.defineProperty(t,"match",{enumerable:!0,get:function(){return A.default}}),Object.defineProperty(t,"normalizeClassDefinition",{enumerable:!0,get:function(){return w.default}}),Object.defineProperty(t,"normalizeClassDefiniton",{enumerable:!0,get:function(){return w.default}}),Object.defineProperty(t,"printValue",{enumerable:!0,get:function(){return O.default}}),Object.defineProperty(t,"resolveExportDeclaration",{enumerable:!0,get:function(){return k.default}}),Object.defineProperty(t,"resolveToModule",{enumerable:!0,get:function(){return C.default}}),Object.defineProperty(t,"resolveToValue",{enumerable:!0,get:function(){return D.default}}),t.docblock=void 0;var a=i(n(186));t.docblock=a;var o=r(n(371)),s=r(n(298)),u=r(n(433)),l=r(n(294)),c=r(n(222)),p=r(n(119)),f=r(n(372)),d=r(n(188)),h=r(n(426)),m=r(n(97)),y=r(n(214)),g=r(n(430)),b=r(n(192)),v=r(n(318)),E=r(n(124)),T=r(n(427)),S=r(n(159)),x=r(n(98)),P=r(n(187)),_=r(n(229)),A=r(n(138)),w=r(n(230)),O=r(n(140)),k=r(n(319)),C=r(n(139)),D=r(n(47))},,function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAAlklEQVR4Ae3a1REDMRDG4A3VmHbcUFLigf0exn/mkxuQjmELAAAAAD5Eq5atP6+rZeuPhGz9kZCtPxKy9fs6Zuuf60CfPn369OnTp0+fPn369OnTfx36X1vh+nO6/pytL+D1BCexy+iNhFPt6/dIOEiQIEGCBAkSJEiQ8B0k+PwoQYKhP2OXAYOvRo+vD38bvwcAAACABXF8ILs1PQqpAAAAAElFTkSuQmCC"},function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABVCAQAAAChx3/YAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkAQMKHDc9iQjuAAACmUlEQVRo3r3ZS2sUQRAH8M5zklwWg0K8mKBB/AIqXhTEi1cTPQe9iH4AUXBNjh79EooKgggSHyCICIIQL7NV1T2bze6EFS/xoms0ie0hs+sa9zE901U79/3R8+iu+pdSnn/VfbCAz/Um2r+XV8AO0jH9pP3vvSN2COdhGX8xInbIzNMKbv1PeEPsiLmEn2i7E+EJsSN4Az+UtjoTXpBwlG7CGnQlPCA2oFtQxZ3uRG7EBnAvjHsTOREbwB2s9bpRuZHKGCzCer9V5ELi8ehuOiIzYkejBUTYTkNkREyAV5DgdzoiE2ICuoYaUxMZEBPQdYpdCGfkzbA+rUsugDNiAnOGwJVwQipj0XlCd8IBscN0wv1GOSEmCE9qyEakREyAZ4myEqkQE+hzupydSIHE4+aUjvIQfZH6hL6QbxV9kfqEnqP1vEQPxA6YA3hReyB6IOUC3vZDdEXKBVPUG36ILkhlihbxqy+iI1KZogf4xW0zd0TWDuJD+AYWLRuyOo2P0DOxB6nM4Fv87pv4B1mdxhfY8E+0IeaIfok/OIgWEs3q97DJQyTI5xn9FBpcBFqlVDgLz6CBlu9S8SS9JlYCraKlTv2qb+QdN4FWYV0AEVkJLQH/M4kn9Sv2t0vkOxH64pt7F9f22LYLVw8D9y4sdJ40T0bgPRmVUqp+iP2MF6pWkrrrPnPdJVRB7tbCVMQNZkSkqlfKDtD+kLs/Eem0xHpGoe631cdHzIhIIiGUrSQp0XHmlEgo7xJK7loZZMiMJGlqjTVNbebCRKy5cPJsLjMn3EJZvdDUQWh+krwCReZJUHOmVaqxzrSEpnNCc0ahiWlz9ksrrLNfoSn27sgf5mCZfrIiStnB8lF8rHdYEaWU+ljQV/dW0X8Ac6zWpmDZsO8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDEtMDNUMTA6Mjg6NTIrMDA6MDD7fVVWAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAxLTAzVDEwOjI4OjUyKzAwOjAwiiDt6gAAAABJRU5ErkJggg=="},function(e,t,n){var r=n(402),i=n(819),a={};for(var o in r)r.hasOwnProperty(o)&&(a[r[o]]=o);var s=e.exports={to:{},get:{}};function u(e,t,n){return Math.min(Math.max(t,e),n)}function l(e){var t=e.toString(16).toUpperCase();return t.length<2?"0"+t:t}s.get=function(e){var t,n;switch(e.substring(0,3).toLowerCase()){case"hsl":t=s.get.hsl(e),n="hsl";break;case"hwb":t=s.get.hwb(e),n="hwb";break;default:t=s.get.rgb(e),n="rgb"}return t?{model:n,value:t}:null},s.get.rgb=function(e){if(!e)return null;var t,n,i,a=[0,0,0,1];if(t=e.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)){for(i=t[2],t=t[1],n=0;n<3;n++){var o=2*n;a[n]=parseInt(t.slice(o,o+2),16)}i&&(a[3]=parseInt(i,16)/255)}else if(t=e.match(/^#([a-f0-9]{3,4})$/i)){for(i=(t=t[1])[3],n=0;n<3;n++)a[n]=parseInt(t[n]+t[n],16);i&&(a[3]=parseInt(i+i,16)/255)}else if(t=e.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)){for(n=0;n<3;n++)a[n]=parseInt(t[n+1],0);t[4]&&(a[3]=parseFloat(t[4]))}else{if(!(t=e.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)))return(t=e.match(/(\D+)/))?"transparent"===t[1]?[0,0,0,0]:(a=r[t[1]])?(a[3]=1,a):null:null;for(n=0;n<3;n++)a[n]=Math.round(2.55*parseFloat(t[n+1]));t[4]&&(a[3]=parseFloat(t[4]))}for(n=0;n<3;n++)a[n]=u(a[n],0,255);return a[3]=u(a[3],0,1),a},s.get.hsl=function(e){if(!e)return null;var t=e.match(/^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);if(t){var n=parseFloat(t[4]);return[(parseFloat(t[1])+360)%360,u(parseFloat(t[2]),0,100),u(parseFloat(t[3]),0,100),u(isNaN(n)?1:n,0,1)]}return null},s.get.hwb=function(e){if(!e)return null;var t=e.match(/^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);if(t){var n=parseFloat(t[4]);return[(parseFloat(t[1])%360+360)%360,u(parseFloat(t[2]),0,100),u(parseFloat(t[3]),0,100),u(isNaN(n)?1:n,0,1)]}return null},s.to.hex=function(){var e=i(arguments);return"#"+l(e[0])+l(e[1])+l(e[2])+(e[3]<1?l(Math.round(255*e[3])):"")},s.to.rgb=function(){var e=i(arguments);return e.length<4||1===e[3]?"rgb("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+")":"rgba("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+", "+e[3]+")"},s.to.rgb.percent=function(){var e=i(arguments),t=Math.round(e[0]/255*100),n=Math.round(e[1]/255*100),r=Math.round(e[2]/255*100);return e.length<4||1===e[3]?"rgb("+t+"%, "+n+"%, "+r+"%)":"rgba("+t+"%, "+n+"%, "+r+"%, "+e[3]+")"},s.to.hsl=function(){var e=i(arguments);return e.length<4||1===e[3]?"hsl("+e[0]+", "+e[1]+"%, "+e[2]+"%)":"hsla("+e[0]+", "+e[1]+"%, "+e[2]+"%, "+e[3]+")"},s.to.hwb=function(){var e=i(arguments),t="";return e.length>=4&&1!==e[3]&&(t=", "+e[3]),"hwb("+e[0]+", "+e[1]+"%, "+e[2]+"%"+t+")"},s.to.keyword=function(e){return a[e.slice(0,3)]}},function(e,t,n){"use strict";var r=n(820),i=Array.prototype.concat,a=Array.prototype.slice,o=e.exports=function(e){for(var t=[],n=0,o=e.length;n<o;n++){var s=e[n];r(s)?t=i.call(t,a.call(s)):t.push(s)}return t};o.wrap=function(e){return function(){return e(o(arguments))}}},function(e,t){e.exports=function(e){return!(!e||"string"===typeof e)&&(e instanceof Array||Array.isArray(e)||e.length>=0&&(e.splice instanceof Function||Object.getOwnPropertyDescriptor(e,e.length-1)&&"String"!==e.constructor.name))}},,function(e,t,n){"use strict";const r=Math.PI,i=2*r,a=i-1e-6;function o(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function s(){return new o}o.prototype=s.prototype={constructor:o,moveTo:function(e,t){this._+="M"+(this._x0=this._x1=+e)+","+(this._y0=this._y1=+t)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(e,t){this._+="L"+(this._x1=+e)+","+(this._y1=+t)},quadraticCurveTo:function(e,t,n,r){this._+="Q"+ +e+","+ +t+","+(this._x1=+n)+","+(this._y1=+r)},bezierCurveTo:function(e,t,n,r,i,a){this._+="C"+ +e+","+ +t+","+ +n+","+ +r+","+(this._x1=+i)+","+(this._y1=+a)},arcTo:function(e,t,n,i,a){e=+e,t=+t,n=+n,i=+i,a=+a;var o=this._x1,s=this._y1,u=n-e,l=i-t,c=o-e,p=s-t,f=c*c+p*p;if(a<0)throw new Error("negative radius: "+a);if(null===this._x1)this._+="M"+(this._x1=e)+","+(this._y1=t);else if(f>1e-6)if(Math.abs(p*u-l*c)>1e-6&&a){var d=n-o,h=i-s,m=u*u+l*l,y=d*d+h*h,g=Math.sqrt(m),b=Math.sqrt(f),v=a*Math.tan((r-Math.acos((m+f-y)/(2*g*b)))/2),E=v/b,T=v/g;Math.abs(E-1)>1e-6&&(this._+="L"+(e+E*c)+","+(t+E*p)),this._+="A"+a+","+a+",0,0,"+ +(p*d>c*h)+","+(this._x1=e+T*u)+","+(this._y1=t+T*l)}else this._+="L"+(this._x1=e)+","+(this._y1=t);else;},arc:function(e,t,n,o,s,u){e=+e,t=+t,u=!!u;var l=(n=+n)*Math.cos(o),c=n*Math.sin(o),p=e+l,f=t+c,d=1^u,h=u?o-s:s-o;if(n<0)throw new Error("negative radius: "+n);null===this._x1?this._+="M"+p+","+f:(Math.abs(this._x1-p)>1e-6||Math.abs(this._y1-f)>1e-6)&&(this._+="L"+p+","+f),n&&(h<0&&(h=h%i+i),h>a?this._+="A"+n+","+n+",0,1,"+d+","+(e-l)+","+(t-c)+"A"+n+","+n+",0,1,"+d+","+(this._x1=p)+","+(this._y1=f):h>1e-6&&(this._+="A"+n+","+n+",0,"+ +(h>=r)+","+d+","+(this._x1=e+n*Math.cos(s))+","+(this._y1=t+n*Math.sin(s))))},rect:function(e,t,n,r){this._+="M"+(this._x0=this._x1=+e)+","+(this._y0=this._y1=+t)+"h"+ +n+"v"+ +r+"h"+-n+"Z"},toString:function(){return this._}},t.a=s},,,,,,,,,,function(e,t,n){"use strict";n.d(t,"a",(function(){return De}));var r=Math.sqrt(50),i=Math.sqrt(10),a=Math.sqrt(2);function o(e,t,n){var o=(t-e)/Math.max(0,n),s=Math.floor(Math.log(o)/Math.LN10),u=o/Math.pow(10,s);return s>=0?(u>=r?10:u>=i?5:u>=a?2:1)*Math.pow(10,s):-Math.pow(10,-s)/(u>=r?10:u>=i?5:u>=a?2:1)}var s=function(e,t){return null==e||null==t?NaN:e<t?-1:e>t?1:e>=t?0:NaN},u=function(e){let t=e,n=e;function r(e,t,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){const a=r+i>>>1;n(e[a],t)<0?r=a+1:i=a}return r}return 1===e.length&&(t=(t,n)=>e(t)-n,n=function(e){return(t,n)=>s(e(t),n)}(e)),{left:r,center:function(e,n,i,a){null==i&&(i=0),null==a&&(a=e.length);const o=r(e,n,i,a-1);return o>i&&t(e[o-1],n)>-t(e[o],n)?o-1:o},right:function(e,t,r,i){for(null==r&&(r=0),null==i&&(i=e.length);r<i;){const a=r+i>>>1;n(e[a],t)>0?i=a:r=a+1}return r}}};const l=u(s),c=l.right;l.left,u((function(e){return null===e?NaN:+e})).center;var p=c,f=function(e,t,n){e.prototype=t.prototype=n,n.constructor=e};function d(e,t){var n=Object.create(e.prototype);for(var r in t)n[r]=t[r];return n}function h(){}var m="\\s*([+-]?\\d+)\\s*",y="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",g="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",b=/^#([0-9a-f]{3,8})$/,v=new RegExp("^rgb\\("+[m,m,m]+"\\)$"),E=new RegExp("^rgb\\("+[g,g,g]+"\\)$"),T=new RegExp("^rgba\\("+[m,m,m,y]+"\\)$"),S=new RegExp("^rgba\\("+[g,g,g,y]+"\\)$"),x=new RegExp("^hsl\\("+[y,g,g]+"\\)$"),P=new RegExp("^hsla\\("+[y,g,g,y]+"\\)$"),_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function A(){return this.rgb().formatHex()}function w(){return this.rgb().formatRgb()}function O(e){var t,n;return e=(e+"").trim().toLowerCase(),(t=b.exec(e))?(n=t[1].length,t=parseInt(t[1],16),6===n?k(t):3===n?new I(t>>8&15|t>>4&240,t>>4&15|240&t,(15&t)<<4|15&t,1):8===n?C(t>>24&255,t>>16&255,t>>8&255,(255&t)/255):4===n?C(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|240&t,((15&t)<<4|15&t)/255):null):(t=v.exec(e))?new I(t[1],t[2],t[3],1):(t=E.exec(e))?new I(255*t[1]/100,255*t[2]/100,255*t[3]/100,1):(t=T.exec(e))?C(t[1],t[2],t[3],t[4]):(t=S.exec(e))?C(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4]):(t=x.exec(e))?L(t[1],t[2]/100,t[3]/100,1):(t=P.exec(e))?L(t[1],t[2]/100,t[3]/100,t[4]):_.hasOwnProperty(e)?k(_[e]):"transparent"===e?new I(NaN,NaN,NaN,0):null}function k(e){return new I(e>>16&255,e>>8&255,255&e,1)}function C(e,t,n,r){return r<=0&&(e=t=n=NaN),new I(e,t,n,r)}function D(e){return e instanceof h||(e=O(e)),e?new I((e=e.rgb()).r,e.g,e.b,e.opacity):new I}function j(e,t,n,r){return 1===arguments.length?D(e):new I(e,t,n,null==r?1:r)}function I(e,t,n,r){this.r=+e,this.g=+t,this.b=+n,this.opacity=+r}function N(){return"#"+M(this.r)+M(this.g)+M(this.b)}function R(){var e=this.opacity;return(1===(e=isNaN(e)?1:Math.max(0,Math.min(1,e)))?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===e?")":", "+e+")")}function M(e){return((e=Math.max(0,Math.min(255,Math.round(e)||0)))<16?"0":"")+e.toString(16)}function L(e,t,n,r){return r<=0?e=t=n=NaN:n<=0||n>=1?e=t=NaN:t<=0&&(e=NaN),new B(e,t,n,r)}function F(e){if(e instanceof B)return new B(e.h,e.s,e.l,e.opacity);if(e instanceof h||(e=O(e)),!e)return new B;if(e instanceof B)return e;var t=(e=e.rgb()).r/255,n=e.g/255,r=e.b/255,i=Math.min(t,n,r),a=Math.max(t,n,r),o=NaN,s=a-i,u=(a+i)/2;return s?(o=t===a?(n-r)/s+6*(n<r):n===a?(r-t)/s+2:(t-n)/s+4,s/=u<.5?a+i:2-a-i,o*=60):s=u>0&&u<1?0:o,new B(o,s,u,e.opacity)}function B(e,t,n,r){this.h=+e,this.s=+t,this.l=+n,this.opacity=+r}function V(e,t,n){return 255*(e<60?t+(n-t)*e/60:e<180?n:e<240?t+(n-t)*(240-e)/60:t)}function U(e,t,n,r,i){var a=e*e,o=a*e;return((1-3*e+3*a-o)*t+(4-6*a+3*o)*n+(1+3*e+3*a-3*o)*r+o*i)/6}f(h,O,{copy:function(e){return Object.assign(new this.constructor,this,e)},displayable:function(){return this.rgb().displayable()},hex:A,formatHex:A,formatHsl:function(){return F(this).formatHsl()},formatRgb:w,toString:w}),f(I,j,d(h,{brighter:function(e){return e=null==e?1/.7:Math.pow(1/.7,e),new I(this.r*e,this.g*e,this.b*e,this.opacity)},darker:function(e){return e=null==e?.7:Math.pow(.7,e),new I(this.r*e,this.g*e,this.b*e,this.opacity)},rgb:function(){return this},displayable:function(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:N,formatHex:N,formatRgb:R,toString:R})),f(B,(function(e,t,n,r){return 1===arguments.length?F(e):new B(e,t,n,null==r?1:r)}),d(h,{brighter:function(e){return e=null==e?1/.7:Math.pow(1/.7,e),new B(this.h,this.s,this.l*e,this.opacity)},darker:function(e){return e=null==e?.7:Math.pow(.7,e),new B(this.h,this.s,this.l*e,this.opacity)},rgb:function(){var e=this.h%360+360*(this.h<0),t=isNaN(e)||isNaN(this.s)?0:this.s,n=this.l,r=n+(n<.5?n:1-n)*t,i=2*n-r;return new I(V(e>=240?e-240:e+120,i,r),V(e,i,r),V(e<120?e+240:e-120,i,r),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl:function(){var e=this.opacity;return(1===(e=isNaN(e)?1:Math.max(0,Math.min(1,e)))?"hsl(":"hsla(")+(this.h||0)+", "+100*(this.s||0)+"%, "+100*(this.l||0)+"%"+(1===e?")":", "+e+")")}}));var H=e=>()=>e;function W(e,t){return function(n){return e+n*t}}function K(e){return 1===(e=+e)?z:function(t,n){return n-t?function(e,t,n){return e=Math.pow(e,n),t=Math.pow(t,n)-e,n=1/n,function(r){return Math.pow(e+r*t,n)}}(t,n,e):H(isNaN(t)?n:t)}}function z(e,t){var n=t-e;return n?W(e,n):H(isNaN(e)?t:e)}var Y=function e(t){var n=K(t);function r(e,t){var r=n((e=j(e)).r,(t=j(t)).r),i=n(e.g,t.g),a=n(e.b,t.b),o=z(e.opacity,t.opacity);return function(t){return e.r=r(t),e.g=i(t),e.b=a(t),e.opacity=o(t),e+""}}return r.gamma=e,r}(1);function q(e){return function(t){var n,r,i=t.length,a=new Array(i),o=new Array(i),s=new Array(i);for(n=0;n<i;++n)r=j(t[n]),a[n]=r.r||0,o[n]=r.g||0,s[n]=r.b||0;return a=e(a),o=e(o),s=e(s),r.opacity=1,function(e){return r.r=a(e),r.g=o(e),r.b=s(e),r+""}}}q((function(e){var t=e.length-1;return function(n){var r=n<=0?n=0:n>=1?(n=1,t-1):Math.floor(n*t),i=e[r],a=e[r+1],o=r>0?e[r-1]:2*i-a,s=r<t-1?e[r+2]:2*a-i;return U((n-r/t)*t,o,i,a,s)}})),q((function(e){var t=e.length;return function(n){var r=Math.floor(((n%=1)<0?++n:n)*t),i=e[(r+t-1)%t],a=e[r%t],o=e[(r+1)%t],s=e[(r+2)%t];return U((n-r/t)*t,i,a,o,s)}}));var X=function(e,t){t||(t=[]);var n,r=e?Math.min(t.length,e.length):0,i=t.slice();return function(a){for(n=0;n<r;++n)i[n]=e[n]*(1-a)+t[n]*a;return i}};function G(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function J(e,t){var n,r=t?t.length:0,i=e?Math.min(r,e.length):0,a=new Array(i),o=new Array(r);for(n=0;n<i;++n)a[n]=re(e[n],t[n]);for(;n<r;++n)o[n]=t[n];return function(e){for(n=0;n<i;++n)o[n]=a[n](e);return o}}var $=function(e,t){var n=new Date;return e=+e,t=+t,function(r){return n.setTime(e*(1-r)+t*r),n}},Q=function(e,t){return e=+e,t=+t,function(n){return e*(1-n)+t*n}},Z=function(e,t){var n,r={},i={};for(n in null!==e&&"object"===typeof e||(e={}),null!==t&&"object"===typeof t||(t={}),t)n in e?r[n]=re(e[n],t[n]):i[n]=t[n];return function(e){for(n in r)i[n]=r[n](e);return i}},ee=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,te=new RegExp(ee.source,"g");var ne=function(e,t){var n,r,i,a=ee.lastIndex=te.lastIndex=0,o=-1,s=[],u=[];for(e+="",t+="";(n=ee.exec(e))&&(r=te.exec(t));)(i=r.index)>a&&(i=t.slice(a,i),s[o]?s[o]+=i:s[++o]=i),(n=n[0])===(r=r[0])?s[o]?s[o]+=r:s[++o]=r:(s[++o]=null,u.push({i:o,x:Q(n,r)})),a=te.lastIndex;return a<t.length&&(i=t.slice(a),s[o]?s[o]+=i:s[++o]=i),s.length<2?u[0]?function(e){return function(t){return e(t)+""}}(u[0].x):function(e){return function(){return e}}(t):(t=u.length,function(e){for(var n,r=0;r<t;++r)s[(n=u[r]).i]=n.x(e);return s.join("")})},re=function(e,t){var n,r=typeof t;return null==t||"boolean"===r?H(t):("number"===r?Q:"string"===r?(n=O(t))?(t=n,Y):ne:t instanceof O?Y:t instanceof Date?$:G(t)?X:Array.isArray(t)?J:"function"!==typeof t.valueOf&&"function"!==typeof t.toString||isNaN(t)?Z:Q)(e,t)},ie=function(e,t){return e=+e,t=+t,function(n){return Math.round(e*(1-n)+t*n)}};function ae(e){return+e}var oe=[0,1];function se(e){return e}function ue(e,t){return(t-=e=+e)?function(n){return(n-e)/t}:(n=isNaN(t)?NaN:.5,function(){return n});var n}function le(e,t,n){var r=e[0],i=e[1],a=t[0],o=t[1];return i<r?(r=ue(i,r),a=n(o,a)):(r=ue(r,i),a=n(a,o)),function(e){return a(r(e))}}function ce(e,t,n){var r=Math.min(e.length,t.length)-1,i=new Array(r),a=new Array(r),o=-1;for(e[r]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());++o<r;)i[o]=ue(e[o],e[o+1]),a[o]=n(t[o],t[o+1]);return function(t){var n=p(e,t,1,r)-1;return a[n](i[n](t))}}function pe(e,t){return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())}function fe(){var e,t,n,r,i,a,o=oe,s=oe,u=re,l=se;function c(){var e=Math.min(o.length,s.length);return l!==se&&(l=function(e,t){var n;return e>t&&(n=e,e=t,t=n),function(n){return Math.max(e,Math.min(t,n))}}(o[0],o[e-1])),r=e>2?ce:le,i=a=null,p}function p(t){return null==t||isNaN(t=+t)?n:(i||(i=r(o.map(e),s,u)))(e(l(t)))}return p.invert=function(n){return l(t((a||(a=r(s,o.map(e),Q)))(n)))},p.domain=function(e){return arguments.length?(o=Array.from(e,ae),c()):o.slice()},p.range=function(e){return arguments.length?(s=Array.from(e),c()):s.slice()},p.rangeRound=function(e){return s=Array.from(e),u=ie,c()},p.clamp=function(e){return arguments.length?(l=!!e||se,c()):l!==se},p.interpolate=function(e){return arguments.length?(u=e,c()):u},p.unknown=function(e){return arguments.length?(n=e,p):n},function(n,r){return e=n,t=r,c()}}function de(){return fe()(se,se)}var he=n(175),me=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function ye(e){if(!(t=me.exec(e)))throw new Error("invalid format: "+e);var t;return new ge({fill:t[1],align:t[2],sign:t[3],symbol:t[4],zero:t[5],width:t[6],comma:t[7],precision:t[8]&&t[8].slice(1),trim:t[9],type:t[10]})}function ge(e){this.fill=void 0===e.fill?" ":e.fill+"",this.align=void 0===e.align?">":e.align+"",this.sign=void 0===e.sign?"-":e.sign+"",this.symbol=void 0===e.symbol?"":e.symbol+"",this.zero=!!e.zero,this.width=void 0===e.width?void 0:+e.width,this.comma=!!e.comma,this.precision=void 0===e.precision?void 0:+e.precision,this.trim=!!e.trim,this.type=void 0===e.type?"":e.type+""}ye.prototype=ge.prototype,ge.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};function be(e,t){if((n=(e=t?e.toExponential(t-1):e.toExponential()).indexOf("e"))<0)return null;var n,r=e.slice(0,n);return[r.length>1?r[0]+r.slice(2):r,+e.slice(n+1)]}var ve,Ee,Te,Se,xe=function(e){return(e=be(Math.abs(e)))?e[1]:NaN},Pe=function(e,t){var n=be(e,t);if(!n)return e+"";var r=n[0],i=n[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(i+1):r+new Array(i-r.length+2).join("0")},_e={"%":(e,t)=>(100*e).toFixed(t),b:e=>Math.round(e).toString(2),c:e=>e+"",d:function(e){return Math.abs(e=Math.round(e))>=1e21?e.toLocaleString("en").replace(/,/g,""):e.toString(10)},e:(e,t)=>e.toExponential(t),f:(e,t)=>e.toFixed(t),g:(e,t)=>e.toPrecision(t),o:e=>Math.round(e).toString(8),p:(e,t)=>Pe(100*e,t),r:Pe,s:function(e,t){var n=be(e,t);if(!n)return e+"";var r=n[0],i=n[1],a=i-(ve=3*Math.max(-8,Math.min(8,Math.floor(i/3))))+1,o=r.length;return a===o?r:a>o?r+new Array(a-o+1).join("0"):a>0?r.slice(0,a)+"."+r.slice(a):"0."+new Array(1-a).join("0")+be(e,Math.max(0,t+a-1))[0]},X:e=>Math.round(e).toString(16).toUpperCase(),x:e=>Math.round(e).toString(16)},Ae=function(e){return e},we=Array.prototype.map,Oe=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"];Ee=function(e){var t,n,r=void 0===e.grouping||void 0===e.thousands?Ae:(t=we.call(e.grouping,Number),n=e.thousands+"",function(e,r){for(var i=e.length,a=[],o=0,s=t[0],u=0;i>0&&s>0&&(u+s+1>r&&(s=Math.max(1,r-u)),a.push(e.substring(i-=s,i+s)),!((u+=s+1)>r));)s=t[o=(o+1)%t.length];return a.reverse().join(n)}),i=void 0===e.currency?"":e.currency[0]+"",a=void 0===e.currency?"":e.currency[1]+"",o=void 0===e.decimal?".":e.decimal+"",s=void 0===e.numerals?Ae:function(e){return function(t){return t.replace(/[0-9]/g,(function(t){return e[+t]}))}}(we.call(e.numerals,String)),u=void 0===e.percent?"%":e.percent+"",l=void 0===e.minus?"\u2212":e.minus+"",c=void 0===e.nan?"NaN":e.nan+"";function p(e){var t=(e=ye(e)).fill,n=e.align,p=e.sign,f=e.symbol,d=e.zero,h=e.width,m=e.comma,y=e.precision,g=e.trim,b=e.type;"n"===b?(m=!0,b="g"):_e[b]||(void 0===y&&(y=12),g=!0,b="g"),(d||"0"===t&&"="===n)&&(d=!0,t="0",n="=");var v="$"===f?i:"#"===f&&/[boxX]/.test(b)?"0"+b.toLowerCase():"",E="$"===f?a:/[%p]/.test(b)?u:"",T=_e[b],S=/[defgprs%]/.test(b);function x(e){var i,a,u,f=v,x=E;if("c"===b)x=T(e)+x,e="";else{var P=(e=+e)<0||1/e<0;if(e=isNaN(e)?c:T(Math.abs(e),y),g&&(e=function(e){e:for(var t,n=e.length,r=1,i=-1;r<n;++r)switch(e[r]){case".":i=t=r;break;case"0":0===i&&(i=r),t=r;break;default:if(!+e[r])break e;i>0&&(i=0)}return i>0?e.slice(0,i)+e.slice(t+1):e}(e)),P&&0===+e&&"+"!==p&&(P=!1),f=(P?"("===p?p:l:"-"===p||"("===p?"":p)+f,x=("s"===b?Oe[8+ve/3]:"")+x+(P&&"("===p?")":""),S)for(i=-1,a=e.length;++i<a;)if(48>(u=e.charCodeAt(i))||u>57){x=(46===u?o+e.slice(i+1):e.slice(i))+x,e=e.slice(0,i);break}}m&&!d&&(e=r(e,1/0));var _=f.length+e.length+x.length,A=_<h?new Array(h-_+1).join(t):"";switch(m&&d&&(e=r(A+e,A.length?h-x.length:1/0),A=""),n){case"<":e=f+e+x+A;break;case"=":e=f+A+e+x;break;case"^":e=A.slice(0,_=A.length>>1)+f+e+x+A.slice(_);break;default:e=A+f+e+x}return s(e)}return y=void 0===y?6:/[gprs]/.test(b)?Math.max(1,Math.min(21,y)):Math.max(0,Math.min(20,y)),x.toString=function(){return e+""},x}return{format:p,formatPrefix:function(e,t){var n=p(((e=ye(e)).type="f",e)),r=3*Math.max(-8,Math.min(8,Math.floor(xe(t)/3))),i=Math.pow(10,-r),a=Oe[8+r/3];return function(e){return n(i*e)+a}}}}({thousands:",",grouping:[3],currency:["$",""]}),Te=Ee.format,Se=Ee.formatPrefix;function ke(e,t,n,o){var s,u=function(e,t,n){var o=Math.abs(t-e)/Math.max(0,n),s=Math.pow(10,Math.floor(Math.log(o)/Math.LN10)),u=o/s;return u>=r?s*=10:u>=i?s*=5:u>=a&&(s*=2),t<e?-s:s}(e,t,n);switch((o=ye(null==o?",f":o)).type){case"s":var l=Math.max(Math.abs(e),Math.abs(t));return null!=o.precision||isNaN(s=function(e,t){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(xe(t)/3)))-xe(Math.abs(e)))}(u,l))||(o.precision=s),Se(o,l);case"":case"e":case"g":case"p":case"r":null!=o.precision||isNaN(s=function(e,t){return e=Math.abs(e),t=Math.abs(t)-e,Math.max(0,xe(t)-xe(e))+1}(u,Math.max(Math.abs(e),Math.abs(t))))||(o.precision=s-("e"===o.type));break;case"f":case"%":null!=o.precision||isNaN(s=function(e){return Math.max(0,-xe(Math.abs(e)))}(u))||(o.precision=s-2*("%"===o.type))}return Te(o)}function Ce(e){var t=e.domain;return e.ticks=function(e){var n=t();return function(e,t,n){var r,i,a,s,u=-1;if(n=+n,(e=+e)===(t=+t)&&n>0)return[e];if((r=t<e)&&(i=e,e=t,t=i),0===(s=o(e,t,n))||!isFinite(s))return[];if(s>0){let n=Math.round(e/s),r=Math.round(t/s);for(n*s<e&&++n,r*s>t&&--r,a=new Array(i=r-n+1);++u<i;)a[u]=(n+u)*s}else{s=-s;let n=Math.round(e*s),r=Math.round(t*s);for(n/s<e&&++n,r/s>t&&--r,a=new Array(i=r-n+1);++u<i;)a[u]=(n+u)/s}return r&&a.reverse(),a}(n[0],n[n.length-1],null==e?10:e)},e.tickFormat=function(e,n){var r=t();return ke(r[0],r[r.length-1],null==e?10:e,n)},e.nice=function(n){null==n&&(n=10);var r,i,a=t(),s=0,u=a.length-1,l=a[s],c=a[u],p=10;for(c<l&&(i=l,l=c,c=i,i=s,s=u,u=i);p-- >0;){if((i=o(l,c,n))===r)return a[s]=l,a[u]=c,t(a);if(i>0)l=Math.floor(l/i)*i,c=Math.ceil(c/i)*i;else{if(!(i<0))break;l=Math.ceil(l*i)/i,c=Math.floor(c*i)/i}r=i}return e},e}function De(){var e=de();return e.copy=function(){return pe(e,De())},he.a.apply(e,arguments),Ce(e)}},function(e,t,n){"use strict";var r,i,a=n(4),o=n.n(a),s=n(23),u=n.n(s),l=n(0),c=n(10),p=n(63),f=n(24),d=n.n(f),h=n(6),m=n.n(h),y=n(9),g=n.n(y),b=n(7),v=n.n(b),E=n(14),T=n.n(E),S=n(15),x=n.n(S),P=n(2),_=n.n(P),A=n(8),w=n(11),O=n(836),k=function(e){var t=e.children;return l.createElement(l.Fragment,null,t)},C=A.a,D=2,j=3,I=5,N=n(17),R=n(48),M=n(208);function L(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=_()(e);if(t){var i=_()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return x()(this,n)}}function F(){return(F=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}try{i=n(208)}catch(zt){}var B=function(e){T()(n,e);var t=L(n);function n(){return m()(this,n),t.apply(this,arguments)}return g()(n,[{key:"render",value:function(){var e=this.props,t=e.active,n=e.style,r=u()(e,["active","style"]);return l.createElement(A.a,F({hidden:!t,style:[n,{display:t?"flex":"none"}]},r))}}]),n}(l.Component),V=N.a.createAnimatedComponent(B),U=null===(r=i)||void 0===r?void 0:r.shouldUseActivityState,H=function(e){var t,n=e.enabled,r=u()(e,["enabled"]);return n&&"web"!==c.a.OS&&null!==(t=i)&&void 0!==t&&t.screensEnabled()?l.createElement(i.ScreenContainer,F({enabled:n},r)):l.createElement(A.a,r)},W=function(e){var t,n=e.enabled,r=e.active,a=u()(e,["enabled","active"]);return n&&"web"===c.a.OS?l.createElement(V,F({active:r},a)):n&&null!==(t=i)&&void 0!==t&&t.screensEnabled()?U?l.createElement(i.Screen,F({enabled:n,activityState:r},a)):l.createElement(i.Screen,F({enabled:n,active:r},a)):l.createElement(A.a,a)},K=n(29),z=n.n(K),Y=n(55),q=n(68),X=n(458);function G(e){return e.children}var J=n(133),$=n(126);function Q(){return(Q=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function Z(e){var t=e.borderless,n=void 0!==t&&t,r=e.pressColor,i=void 0===r?"rgba(0, 0, 0, .32)":r,a=e.style,o=e.children,s=u()(e,["borderless","pressColor","style","children"]);return"android"===c.a.OS&&c.a.Version>=21?l.createElement(J.a,Q({},s,{useForeground:J.a.canUseNativeForeground(),background:J.a.Ripple(i,n)}),l.createElement(A.a,{style:a},l.Children.only(o))):l.createElement($.a,Q({style:a},s),o)}function ee(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function te(e){var t=e.disabled,r=e.allowFontScaling,i=e.backImage,a=e.label,o=e.labelStyle,s=e.labelVisible,u=void 0===s?"ios"===c.a.OS:s,p=e.onLabelLayout,f=e.onPress,d=e.pressColorAndroid,h=e.screenLayout,m=e.tintColor,y=e.titleLayout,g=e.truncatedLabel,b=void 0===g?"Back":g,v=e.accessibilityLabel,E=void 0===v?a&&"Back"!==a?"".concat(a,", back"):"Go back":v,T=e.style,S=Object(X.a)(),x=S.dark,P=S.colors,_=l.useState(void 0),w=z()(_,2),O=w[0],k=w[1],C=void 0!==m?m:c.a.select({ios:P.primary,default:P.text}),D=void 0!==d?d:x?"rgba(255, 255, 255, .32)":"rgba(0, 0, 0, .32)",j=function(e){null===p||void 0===p||p(e),k(e.nativeEvent.layout.x+e.nativeEvent.layout.width)};return l.createElement(Z,{disabled:t,accessible:!0,accessibilityRole:"button",accessibilityComponentType:"button",accessibilityLabel:E,accessibilityTraits:"button",testID:"header-back",delayPressIn:0,onPress:t?void 0:function(){return f&&requestAnimationFrame(f)},pressColor:D,style:[ne.container,t&&ne.disabled,T],hitSlop:c.a.select({ios:void 0,default:{top:16,right:16,bottom:16,left:16}}),borderless:!0},l.createElement(l.Fragment,null,i?i({tintColor:C}):l.createElement(q.a,{style:[ne.icon,Boolean(u)&&ne.iconWithLabel,Boolean(C)&&{tintColor:C}],source:n(816),fadeDuration:0}),function(){var e=!a||O&&y&&h&&(h.width-y.width)/2<O+26?b:a;if(!u||void 0===e)return null;var t=l.createElement(A.a,{style:h?[ne.labelWrapper,{minWidth:h.width/2-27}]:null},l.createElement(N.a.Text,{accessible:!1,onLayout:e===a?j:void 0,style:[ne.label,C?{color:C}:null,o],numberOfLines:1,allowFontScaling:!!r},e));return i||"ios"!==c.a.OS?t:l.createElement(G,{maskElement:l.createElement(A.a,{style:ne.iconMaskContainer},l.createElement(q.a,{source:n(817),style:ne.iconMask}),l.createElement(A.a,{style:ne.iconMaskFillerRect}))},t)}()))}var ne=w.a.create({container:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ee(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ee(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({alignItems:"center",flexDirection:"row"},c.a.select({ios:null,default:{marginVertical:3,marginHorizontal:11}})),disabled:{opacity:.5},label:{fontSize:17,letterSpacing:.35},labelWrapper:{flexDirection:"row",alignItems:"flex-start"},icon:c.a.select({ios:{height:21,width:13,marginLeft:8,marginRight:22,marginVertical:12,resizeMode:"contain",transform:[{scaleX:Y.a.isRTL?-1:1}]},default:{height:24,width:24,margin:3,resizeMode:"contain",transform:[{scaleX:Y.a.isRTL?-1:1}]}}),iconWithLabel:"ios"===c.a.OS?{marginRight:6}:{},iconMaskContainer:{flex:1,flexDirection:"row",justifyContent:"center"},iconMaskFillerRect:{flex:1,backgroundColor:"#000"},iconMask:{height:21,width:13,marginLeft:-14.5,marginVertical:12,alignSelf:"center",resizeMode:"contain",transform:[{scaleX:Y.a.isRTL?-1:1}]}});function re(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ie(){return(ie=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function ae(e){var t=e.style,n=u()(e,["style"]),r=Object(X.a)().colors;return l.createElement(N.a.View,ie({style:[oe.container,{backgroundColor:r.card,borderBottomColor:r.border,shadowColor:r.border},t]},n))}var oe=w.a.create({container:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?re(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):re(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({flex:1},c.a.select({android:{elevation:4},ios:{shadowOpacity:.85,shadowRadius:0,shadowOffset:{width:0,height:w.a.hairlineWidth}},default:{borderBottomWidth:w.a.hairlineWidth}}))}),se=l.createContext(!1);function ue(e){var t,n;return function(){for(var r=!1,i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];if(t){if(t.length!==a.length)r=!0;else for(var s=0;s<t.length;s++)if(t[s]!==a[s]){r=!0;break}}else r=!0;return t=a,(r||void 0===n)&&(n=e.apply(void 0,a)),n}}var le=function(e,t){var n=e.width>e.height;return("ios"===c.a.OS?n&&!c.a.isPad?32:44:"android"===c.a.OS?56:64)+t};function ce(e){var t=l.useState(void 0),n=z()(t,2),r=n[0],i=n[1],a=l.useState(void 0),o=z()(a,2),s=o[0],p=o[1],f=l.useContext(se),d=ue((function(e,t,n,r,i,a,o){return e({current:{progress:n},next:r&&{progress:r},layouts:{header:{height:o,width:t.width},screen:t,title:i,leftLabel:a}})})),h=e.scene,m=e.layout,y=e.insets,g=e.title,b=e.leftLabel,v=e.onGoBack,E=e.headerTitle,T=e.headerTitleAlign,S=void 0===T?c.a.select({ios:"center",default:"left"}):T,x=e.headerLeft,P=void 0===x?v?function(e){return l.createElement(te,e)}:void 0:x,_=e.headerTransparent,O=e.headerTintColor,k=e.headerBackground,C=e.headerRight,D=e.headerBackImage,j=e.headerBackTitle,I=e.headerBackTitleVisible,R=e.headerTruncatedBackTitle,M=e.headerPressColorAndroid,L=e.headerBackAccessibilityLabel,F=e.headerBackAllowFontScaling,B=e.headerTitleAllowFontScaling,V=e.headerTitleStyle,U=e.headerBackTitleStyle,H=e.headerLeftContainerStyle,W=e.headerRightContainerStyle,K=e.headerTitleContainerStyle,Y=e.headerStyle,q=e.headerStatusBarHeight,X=void 0===q?f?0:y.top:q,G=e.styleInterpolator,J=le(m,X),$=w.a.flatten(Y||{}),Q=$.height,Z=void 0===Q?J:Q,ee=$.minHeight,ne=$.maxHeight,re=$.backgroundColor,ie=$.borderBottomColor,oe=$.borderBottomEndRadius,ce=$.borderBottomLeftRadius,fe=$.borderBottomRightRadius,de=$.borderBottomStartRadius,he=$.borderBottomWidth,me=$.borderColor,ye=$.borderEndColor,ge=$.borderEndWidth,be=$.borderLeftColor,ve=$.borderLeftWidth,Ee=$.borderRadius,Te=$.borderRightColor,Se=$.borderRightWidth,xe=$.borderStartColor,Pe=$.borderStartWidth,_e=$.borderStyle,Ae=$.borderTopColor,we=$.borderTopEndRadius,Oe=$.borderTopLeftRadius,ke=$.borderTopRightRadius,Ce=$.borderTopStartRadius,De=$.borderTopWidth,je=$.borderWidth,Ie=$.boxShadow,Ne=$.elevation,Re=$.shadowColor,Me=$.shadowOffset,Le=$.shadowOpacity,Fe=$.shadowRadius,Be=$.opacity,Ve=$.transform;u()($,["height","minHeight","maxHeight","backgroundColor","borderBottomColor","borderBottomEndRadius","borderBottomLeftRadius","borderBottomRightRadius","borderBottomStartRadius","borderBottomWidth","borderColor","borderEndColor","borderEndWidth","borderLeftColor","borderLeftWidth","borderRadius","borderRightColor","borderRightWidth","borderStartColor","borderStartWidth","borderStyle","borderTopColor","borderTopEndRadius","borderTopLeftRadius","borderTopRightRadius","borderTopStartRadius","borderTopWidth","borderWidth","boxShadow","elevation","shadowColor","shadowOffset","shadowOpacity","shadowRadius","opacity","transform"]);var Ue={backgroundColor:re,borderBottomColor:ie,borderBottomEndRadius:oe,borderBottomLeftRadius:ce,borderBottomRightRadius:fe,borderBottomStartRadius:de,borderBottomWidth:he,borderColor:me,borderEndColor:ye,borderEndWidth:ge,borderLeftColor:be,borderLeftWidth:ve,borderRadius:Ee,borderRightColor:Te,borderRightWidth:Se,borderStartColor:xe,borderStartWidth:Pe,borderStyle:_e,borderTopColor:Ae,borderTopEndRadius:we,borderTopLeftRadius:Oe,borderTopRightRadius:ke,borderTopStartRadius:Ce,borderTopWidth:De,borderWidth:je,boxShadow:Ie,elevation:Ne,shadowColor:Re,shadowOffset:Me,shadowOpacity:Le,shadowRadius:Fe,opacity:Be,transform:Ve};for(var He in Ue)void 0===Ue[He]&&delete Ue[He];var We=d(G,m,h.progress.current,h.progress.next,s,b?r:void 0,"number"===typeof Z?Z:J),Ke=We.titleStyle,ze=We.leftButtonStyle,Ye=We.leftLabelStyle,qe=We.rightButtonStyle,Xe=We.backgroundStyle,Ge=P?P({backImage:D,pressColorAndroid:M,accessibilityLabel:L,allowFontScaling:F,onPress:v,labelVisible:I,label:void 0!==j?j:b,truncatedLabel:R,labelStyle:[Ye,U],onLabelLayout:function(e){var t=e.nativeEvent.layout,n=t.height,a=t.width;r&&n===r.height&&a===r.width||i({height:n,width:a})},screenLayout:m,titleLayout:s,tintColor:O,canGoBack:Boolean(v)}):null,Je=C?C({tintColor:O}):null;return l.createElement(l.Fragment,null,l.createElement(N.a.View,{pointerEvents:"box-none",style:[w.a.absoluteFill,{zIndex:0},Xe]},k?k({style:Ue}):_?null:l.createElement(ae,{style:Ue})),l.createElement(N.a.View,{pointerEvents:"box-none",style:[{height:Z,minHeight:ee,maxHeight:ne,opacity:Be,transform:Ve}]},l.createElement(A.a,{pointerEvents:"none",style:{height:X}}),l.createElement(A.a,{pointerEvents:"box-none",style:pe.content},Ge?l.createElement(N.a.View,{pointerEvents:"box-none",style:[pe.left,{left:y.left},ze,H]},Ge):null,l.createElement(N.a.View,{pointerEvents:"box-none",style:["left"===S?{position:"absolute",left:(Ge?72:16)+y.left,right:(Je?72:16)+y.right}:{marginHorizontal:(Ge?32:16)+(Ge&&!1!==I?40:0)+Math.max(y.left,y.right)},Ke,K]},E({children:g,onLayout:function(e){var t=e.nativeEvent.layout,n=t.height,r=t.width;p((function(e){return e&&n===e.height&&r===e.width?e:{height:n,width:r}}))},allowFontScaling:B,tintColor:O,style:V})),Je?l.createElement(N.a.View,{pointerEvents:"box-none",style:[pe.right,{right:y.right},qe,W]},Je):null)))}var pe=w.a.create({content:{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"center"},left:{position:"absolute",left:0,top:0,bottom:0,justifyContent:"center",alignItems:"flex-start"},right:{position:"absolute",right:0,top:0,bottom:0,justifyContent:"center",alignItems:"flex-end"}}),fe=n(85),de=n(479),he=n.n(de);function me(){return(me=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var ye=l.forwardRef((function(e,t){var n=e.enabled,r=e.layout,i=e.style,a=u()(e,["enabled","layout","style"]),o=l.useState(!1),s=z()(o,2),c=s[0],p=s[1];return l.useEffect((function(){if("undefined"!==typeof document&&document.body){var e=document.body.clientWidth,t=document.body.clientHeight;p(e===r.width&&t===r.height)}}),[r.height,r.width]),l.createElement(A.a,me({},a,{ref:t,style:[n&&c?ge.page:ge.card,i]}))})),ge=w.a.create({page:{minHeight:"100%"},card:{flex:1,overflow:"hidden"}}),be=l.createContext(void 0);function ve(e){switch(e){case"vertical":return 1;case"vertical-inverted":return-1;case"horizontal":return Y.a.isRTL?-1:1;case"horizontal-inverted":return Y.a.isRTL?1:-1}}function Ee(e,t){var n=ve(t);switch(t){case"vertical":case"vertical-inverted":return e.height*n;case"horizontal":case"horizontal-inverted":return e.width*n}}function Te(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Se(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Te(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Te(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function xe(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(zt){return!1}}();return function(){var n,r=_()(e);if(t){var i=_()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return x()(this,n)}}function Pe(){return(Pe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function _e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Ae="web"!==c.a.OS,we=function(e){T()(n,e);var t=xe(n);function n(){var e;m()(this,n);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return e=t.call.apply(t,[this].concat(i)),_e(v()(e),"isCurrentlyMounted",!1),_e(v()(e),"isClosing",new N.a.Value(0)),_e(v()(e),"inverted",new N.a.Value(ve(e.props.gestureDirection))),_e(v()(e),"layout",{width:new N.a.Value(e.props.layout.width),height:new N.a.Value(e.props.layout.height)}),_e(v()(e),"isSwiping",new N.a.Value(0)),_e(v()(e),"interactionHandle",void 0),_e(v()(e),"pendingGestureCallback",void 0),_e(v()(e),"lastToValue",void 0),_e(v()(e),"animate",(function(t){var n=t.closing,r=t.velocity,i=e.props,a=i.gesture,o=i.transitionSpec,s=i.onOpen,u=i.onClose,l=i.onTransition,c=e.getAnimateToValue(Se(Se({},e.props),{},{closing:n}));e.lastToValue=c;var p=n?o.close:o.open,f="spring"===p.animation?N.a.spring:N.a.timing;e.setPointerEventsEnabled(!n),e.handleStartInteraction(),clearTimeout(e.pendingGestureCallback),null===l||void 0===l||l({closing:n,gesture:void 0!==r}),f(a,Se(Se({},p.config),{},{velocity:r,toValue:c,useNativeDriver:Ae,isInteraction:!1})).start((function(t){var r=t.finished;e.handleEndInteraction(),clearTimeout(e.pendingGestureCallback),r&&(n?u():s(),e.isCurrentlyMounted&&e.forceUpdate())}))})),_e(v()(e),"getAnimateToValue",(function(e){var t=e.closing,n=e.layout,r=e.gestureDirection;return t?Ee(n,r):0})),_e(v()(e),"setPointerEventsEnabled",(function(t){var n,r=t?"box-none":"none";null===(n=e.contentRef.current)||void 0===n||n.setNativeProps({pointerEvents:r})})),_e(v()(e),"handleStartInteraction",(function(){void 0===e.interactionHandle&&(e.interactionHandle=fe.a.createInteractionHandle())})),_e(v()(e),"handleEndInteraction",(function(){void 0!==e.interactionHandle&&(fe.a.clearInteractionHandle(e.interactionHandle),e.interactionHandle=void 0)})),_e(v()(e),"handleGestureStateChange",(function(t){var n=t.nativeEvent,r=e.props,i=r.layout,a=r.onClose,o=r.onGestureBegin,s=r.onGestureCanceled,u=r.onGestureEnd,l=r.gestureDirection,c=r.gestureVelocityImpact;switch(n.state){case D:e.isSwiping.setValue(1),e.handleStartInteraction(),null===o||void 0===o||o();break;case j:e.isSwiping.setValue(0),e.handleEndInteraction();var p="vertical"===l||"vertical-inverted"===l?n.velocityY:n.velocityX;e.animate({closing:e.props.closing,velocity:p}),null===s||void 0===s||s();break;case I:var f,d,h;e.isSwiping.setValue(0),"vertical"===l||"vertical-inverted"===l?(f=i.height,d=n.translationY,h=n.velocityY):(f=i.width,d=n.translationX,h=n.velocityX);var m=(d+h*c)*ve(l)>f/2?0!==h||0!==d:e.props.closing;e.animate({closing:m,velocity:h}),m&&(e.pendingGestureCallback=setTimeout((function(){a(),e.forceUpdate()}),32)),null===u||void 0===u||u()}})),_e(v()(e),"getInterpolatedStyle",ue((function(t,n,r,i,a,o,s,u,l){return t({index:n,current:{progress:r},next:i&&{progress:i},closing:e.isClosing,swiping:e.isSwiping,inverted:e.inverted,layouts:{screen:a},insets:{top:o,right:s,bottom:u,left:l}})}))),_e(v()(e),"getCardAnimationContext",ue((function(t,n,r,i,a,o,s,u){return{index:t,current:{progress:n},next:r&&{progress:r},closing:e.isClosing,swiping:e.isSwiping,inverted:e.inverted,layouts:{screen:i},insets:{top:a,right:o,bottom:s,left:u}}}))),_e(v()(e),"contentRef",l.createRef()),e}return g()(n,[{key:"componentDidMount",value:function(){this.animate({closing:this.props.closing}),this.isCurrentlyMounted=!0}},{key:"componentDidUpdate",value:function(e){var t=this.props,n=t.layout,r=t.gestureDirection,i=t.closing,a=n.width,o=n.height;a!==e.layout.width&&this.layout.width.setValue(a),o!==e.layout.height&&this.layout.height.setValue(o),r!==e.gestureDirection&&this.inverted.setValue(ve(r));var s=this.getAnimateToValue(this.props);this.getAnimateToValue(e)===s&&this.lastToValue===s||this.animate({closing:i})}},{key:"componentWillUnmount",value:function(){this.isCurrentlyMounted=!1,this.handleEndInteraction()}},{key:"gestureActivationCriteria",value:function(){var e=this.props,t=e.layout,n=e.gestureDirection,r=e.gestureResponseDistance,i="vertical"===n||"vertical-inverted"===n?void 0!==(null===r||void 0===r?void 0:r.vertical)?r.vertical:135:void 0!==(null===r||void 0===r?void 0:r.horizontal)?r.horizontal:50;if("vertical"===n)return{maxDeltaX:15,minOffsetY:5,hitSlop:{bottom:-t.height+i}};if("vertical-inverted"===n)return{maxDeltaX:15,minOffsetY:-5,hitSlop:{top:-t.height+i}};var a=-t.width+i;return 1===ve(n)?{minOffsetX:5,maxDeltaY:20,hitSlop:{right:a}}:{minOffsetX:-5,maxDeltaY:20,hitSlop:{left:a}}}},{key:"render",value:function(){var e,t=this.props,n=t.styleInterpolator,r=t.index,i=t.current,a=t.gesture,o=t.next,s=t.layout,c=t.insets,p=t.overlay,f=t.overlayEnabled,d=t.shadowEnabled,h=t.gestureEnabled,m=t.gestureDirection,y=t.pageOverflowEnabled,g=t.children,b=t.containerStyle,v=t.contentStyle,E=u()(t,["styleInterpolator","index","current","gesture","next","layout","insets","overlay","overlayEnabled","shadowEnabled","gestureEnabled","gestureDirection","pageOverflowEnabled","children","containerStyle","contentStyle"]),T=this.getInterpolatedStyle(n,r,i,o,s,c.top,c.right,c.bottom,c.left),S=this.getCardAnimationContext(r,i,o,s,c.top,c.right,c.bottom,c.left),x=T.containerStyle,P=T.cardStyle,_=T.overlayStyle,O=T.shadowStyle,C=h?N.a.event([{nativeEvent:"vertical"===m||"vertical-inverted"===m?{translationY:a}:{translationX:a}}],{useNativeDriver:Ae}):void 0,D=w.a.flatten(v||{}).backgroundColor,j="string"===typeof D&&0===he()(D).alpha();return l.createElement(be.Provider,{value:S},l.createElement(N.a.View,{style:{opacity:i},collapsable:!1}),l.createElement(A.a,Pe({pointerEvents:"box-none"},E),f?l.createElement(A.a,{pointerEvents:"box-none",style:w.a.absoluteFill},p({style:_})):null,l.createElement(N.a.View,{needsOffscreenAlphaCompositing:(e=x,!!e&&null!=w.a.flatten(e).opacity),style:[Oe.container,x,b],pointerEvents:"box-none"},l.createElement(k,Pe({enabled:0!==s.width&&h,onGestureEvent:C,onHandlerStateChange:this.handleGestureStateChange},this.gestureActivationCriteria()),l.createElement(N.a.View,{style:[Oe.container,P]},d&&O&&!j?l.createElement(N.a.View,{style:[Oe.shadow,"horizontal"===m?[Oe.shadowHorizontal,Oe.shadowLeft]:"horizontal-inverted"===m?[Oe.shadowHorizontal,Oe.shadowRight]:"vertical"===m?[Oe.shadowVertical,Oe.shadowTop]:[Oe.shadowVertical,Oe.shadowBottom],{backgroundColor:D},O],pointerEvents:"none"}):null,l.createElement(ye,{ref:this.contentRef,enabled:y,layout:s,style:v},g))))))}}]),n}(l.Component);_e(we,"defaultProps",{overlayEnabled:"ios"!==c.a.OS,shadowEnabled:!0,gestureEnabled:!0,gestureVelocityImpact:.3,overlay:function(e){var t=e.style;return t?l.createElement(N.a.View,{pointerEvents:"none",style:[Oe.overlay,t]}):null}});var Oe=w.a.create({container:{flex:1},overlay:{flex:1,backgroundColor:"#000"},shadow:{position:"absolute",shadowRadius:5,shadowColor:"#000",shadowOpacity:.3},shadowHorizontal:{top:0,bottom:0,width:3,shadowOffset:{width:-1,height:1}},shadowLeft:{left:0},shadowRight:{right:0},shadowVertical:{left:0,right:0,height:3,shadowOffset:{width:1,height:-1}},shadowTop:{top:0},shadowBottom:{bottom:0}}),ke=l.createContext(void 0),Ce=l.createContext(void 0);var De=l.memo((function(e){var t=e.active,n=e.cardOverlay,r=e.cardOverlayEnabled,i=e.cardShadowEnabled,a=e.cardStyle,o=e.cardStyleInterpolator,s=e.closing,u=e.gesture,c=e.focused,p=e.gestureDirection,f=e.gestureEnabled,d=e.gestureResponseDistance,h=e.gestureVelocityImpact,m=e.getPreviousScene,y=e.getFocusedRoute,g=e.mode,b=e.headerMode,v=e.headerShown,E=e.headerStyleInterpolator,T=e.hasAbsoluteHeader,S=e.headerHeight,x=e.onHeaderHeightChange,P=e.isParentHeaderShown,_=e.index,O=e.layout,k=e.onCloseRoute,C=e.onOpenRoute,D=e.onPageChangeCancel,j=e.onPageChangeConfirm,I=e.onPageChangeStart,N=e.onGestureCancel,R=e.onGestureEnd,M=e.onGestureStart,L=e.onTransitionEnd,F=e.onTransitionStart,B=e.renderHeader,V=e.renderScene,U=e.safeAreaInsetBottom,H=e.safeAreaInsetLeft,W=e.safeAreaInsetRight,K=e.safeAreaInsetTop,Y=e.scene,q=e.transitionSpec,G={top:K,right:W,bottom:U,left:H},J=Object(X.a)().colors,$=l.useState("box-none"),Q=z()($,2),Z=Q[0],ee=Q[1];l.useEffect((function(){var e,t,n=null===(e=Y.progress.next)||void 0===e||null===(t=e.addListener)||void 0===t?void 0:t.call(e,(function(e){var t=e.value;ee(t<=.1?"box-none":"none")}));return function(){var e,t;n&&(null===(e=Y.progress.next)||void 0===e||null===(t=e.removeListener)||void 0===t||t.call(e,n))}}),[Z,Y.progress.next]);var te="none"!==b&&!1!==v,ne=m({route:Y.route});return l.createElement(we,{index:_,gestureDirection:p,layout:O,insets:G,gesture:u,current:Y.progress.current,next:Y.progress.next,closing:s,onOpen:function(){var e=Y.route;null===L||void 0===L||L({route:e},!1),C({route:e})},onClose:function(){var e=Y.route;null===L||void 0===L||L({route:e},!0),k({route:e})},overlay:n,overlayEnabled:r,shadowEnabled:i,onTransition:function(e){var n=e.closing,r=e.gesture,i=Y.route;r?t&&n?null===j||void 0===j||j(!1):null===D||void 0===D||D():null===j||void 0===j||j(!0),null===F||void 0===F||F({route:i},n)},onGestureBegin:function(){var e=Y.route;null===I||void 0===I||I(),null===M||void 0===M||M({route:e})},onGestureCanceled:function(){var e=Y.route;null===D||void 0===D||D(),null===N||void 0===N||N({route:e})},onGestureEnd:function(){var e=Y.route;null===R||void 0===R||R({route:e})},gestureEnabled:f,gestureResponseDistance:d,gestureVelocityImpact:h,transitionSpec:q,styleInterpolator:o,accessibilityElementsHidden:!c,importantForAccessibility:c?"auto":"no-hide-descendants",pointerEvents:t?"box-none":Z,pageOverflowEnabled:"screen"===b&&"card"===g,containerStyle:T?{marginTop:S}:null,contentStyle:[{backgroundColor:J.background},a],style:[{overflow:t?void 0:"hidden"},w.a.absoluteFill]},l.createElement(A.a,{style:je.container},l.createElement(A.a,{style:je.scene},l.createElement(Ce.Provider,{value:ne},l.createElement(se.Provider,{value:P||te},l.createElement(ke.Provider,{value:S},V({route:Y.route}))))),"screen"===b?B({mode:"screen",layout:O,insets:G,scenes:[ne,Y],getPreviousScene:m,getFocusedRoute:y,gestureDirection:p,styleInterpolator:E,onContentHeightChange:x}):null))})),je=w.a.create({container:{flex:1,flexDirection:"column-reverse"},scene:{flex:1}}),Ie=n(149);function Ne(){var e=R.a.get("window");return"ios"===c.a.OS&&!c.a.isPad&&!c.a.isTVOS&&(780===e.height||780===e.width||812===e.height||812===e.width||844===e.height||844===e.width||896===e.height||896===e.width||926===e.height||926===e.width)}var Re=N.a.add,Me=N.a.multiply;function Le(e,t,n){return Re(Me(e,t),Me(e.interpolate({inputRange:[0,1],outputRange:[1,0]}),n))}var Fe=N.a.add,Be=N.a.multiply;function Ve(){return{}}var Ue=N.a.add;function He(e){var t=e.current,n=e.next,r=Ue(t.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}),n?n.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}):0),i=r.interpolate({inputRange:[0,1,2],outputRange:[0,1,0]});return{leftButtonStyle:{opacity:i},rightButtonStyle:{opacity:i},titleStyle:{opacity:i},backgroundStyle:{opacity:r.interpolate({inputRange:[0,1,1.9,2],outputRange:[0,1,1,0]})}}}function We(e){var t=e.current,n=e.next,r=e.layouts.screen,i=[{translateX:Ue(t.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}),n?n.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}):0).interpolate({inputRange:[0,1,2],outputRange:Y.a.isRTL?[-r.width,0,r.width]:[r.width,0,-r.width]})}];return{leftButtonStyle:{transform:i},rightButtonStyle:{transform:i},titleStyle:{transform:i},backgroundStyle:{transform:i}}}function Ke(e){var t=e.current,n=e.next,r=e.layouts.screen,i=[{translateX:Ue(t.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}),n?n.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}):0).interpolate({inputRange:[0,1,2],outputRange:Y.a.isRTL?[r.width,0,-r.width]:[-r.width,0,r.width]})}];return{leftButtonStyle:{transform:i},rightButtonStyle:{transform:i},titleStyle:{transform:i},backgroundStyle:{transform:i}}}function ze(e){var t=e.current,n=e.next,r=e.layouts.header,i=[{translateY:Ue(t.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}),n?n.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}):0).interpolate({inputRange:[0,1,2],outputRange:[-r.height,0,-r.height]})}];return{leftButtonStyle:{transform:i},rightButtonStyle:{transform:i},titleStyle:{transform:i},backgroundStyle:{transform:i}}}function Ye(){return{}}var qe=n(78),Xe={animation:"spring",config:{stiffness:1e3,damping:500,mass:3,overshootClamping:!0,restDisplacementThreshold:10,restSpeedThreshold:10}},Ge={animation:"timing",config:{duration:350,easing:qe.a.out(qe.a.poly(5))}},Je={animation:"timing",config:{duration:150,easing:qe.a.in(qe.a.linear)}},$e={animation:"timing",config:{duration:425,easing:qe.a.bezier(.35,.45,0,1)}},Qe={animation:"timing",config:{duration:400,easing:qe.a.bezier(.35,.45,0,1)}},Ze={gestureDirection:"horizontal",transitionSpec:{open:Xe,close:Xe},cardStyleInterpolator:function(e){var t=e.current,n=e.next,r=e.inverted,i=e.layouts.screen;return{cardStyle:{transform:[{translateX:Be(t.progress.interpolate({inputRange:[0,1],outputRange:[i.width,0],extrapolate:"clamp"}),r)},{translateX:n?Be(n.progress.interpolate({inputRange:[0,1],outputRange:[0,-.3*i.width],extrapolate:"clamp"}),r):0}]},overlayStyle:{opacity:t.progress.interpolate({inputRange:[0,1],outputRange:[0,.07],extrapolate:"clamp"})},shadowStyle:{shadowOpacity:t.progress.interpolate({inputRange:[0,1],outputRange:[0,.3],extrapolate:"clamp"})}}},headerStyleInterpolator:He},et={gestureDirection:"vertical",transitionSpec:{open:Xe,close:Xe},cardStyleInterpolator:function(e){var t=e.current,n=e.inverted,r=e.layouts.screen;return{cardStyle:{transform:[{translateY:Be(t.progress.interpolate({inputRange:[0,1],outputRange:[r.height,0],extrapolate:"clamp"}),n)}]}}},headerStyleInterpolator:He},tt={gestureDirection:"vertical",transitionSpec:{open:Ge,close:Je},cardStyleInterpolator:function(e){var t=e.current,n=e.inverted,r=e.layouts.screen,i=e.closing,a=Be(t.progress.interpolate({inputRange:[0,1],outputRange:[.08*r.height,0],extrapolate:"clamp"}),n);return{cardStyle:{opacity:Le(i,t.progress,t.progress.interpolate({inputRange:[0,.5,.9,1],outputRange:[0,.25,.7,1]})),transform:[{translateY:a}]}}},headerStyleInterpolator:He},nt={gestureDirection:"vertical",transitionSpec:{open:$e,close:$e},cardStyleInterpolator:function(e){var t=e.current,n=e.next,r=e.inverted,i=e.layouts.screen;return{containerStyle:{overflow:"hidden",transform:[{translateY:Be(t.progress.interpolate({inputRange:[0,1],outputRange:[i.height,0],extrapolate:"clamp"}),r)}]},cardStyle:{transform:[{translateY:Be(t.progress.interpolate({inputRange:[0,1],outputRange:[i.height*(95.9/100)*-1,0],extrapolate:"clamp"}),r)},{translateY:n?Be(n.progress.interpolate({inputRange:[0,1],outputRange:[0,.02*i.height*-1],extrapolate:"clamp"}),r):0}]},overlayStyle:{opacity:t.progress.interpolate({inputRange:[0,.36,1],outputRange:[0,.1,.1],extrapolate:"clamp"})}}},headerStyleInterpolator:He},rt={gestureDirection:"horizontal",transitionSpec:{open:Qe,close:Qe},cardStyleInterpolator:function(e){var t=e.current,n=e.next,r=e.closing,i=Fe(t.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}),n?n.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:"clamp"}):0);return{containerStyle:{opacity:i.interpolate({inputRange:[0,.75,.875,1,1.0825,1.2075,2],outputRange:[0,0,1,1,1,1,0]}),transform:[{scale:Le(r,t.progress.interpolate({inputRange:[0,1],outputRange:[.9,1],extrapolate:"clamp"}),i.interpolate({inputRange:[0,1,2],outputRange:[.85,1,1.1]}))}]}}},headerStyleInterpolator:He},it=c.a.select({ios:Ze,android:c.a.Version>=29?rt:c.a.Version>=28?nt:tt,default:rt}),at=c.a.select({ios:et,default:it});function ot(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(zt){return!1}}();return function(){var n,r=_()(e);if(t){var i=_()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return x()(this,n)}}function st(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ut(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?st(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):st(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function lt(){return(lt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function ct(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var pt=Object.freeze({options:{}}),ft=function(e,t,n,r,i,a){return e.reduce((function(e,o){var s=(r[o.key]||{}).options,u=void 0===s?{}:s,l=w.a.flatten(u.headerStyle||{}),c="number"===typeof l.height?l.height:a[o.key],p=ut(ut({},t),u.safeAreaInsets),f=u.headerStatusBarHeight,d=void 0===f?n?0:p.top:f;return e[o.key]="number"===typeof c?c:le(i,d),e}),{})},dt=function(e,t,n){var r=((null===n||void 0===n?void 0:n.options)||{}).gestureDirection;return Ee(t,void 0===r?"modal"===e?at.gestureDirection:it.gestureDirection:r)},ht=function(e,t,n,r){var i=dt(e,{width:Math.max(1,n.width),height:Math.max(1,n.height)},r);return i>0?t.interpolate({inputRange:[0,i],outputRange:[1,0]}):t.interpolate({inputRange:[i,0],outputRange:[0,1]})},mt=function(e){T()(n,e);var t=ot(n);function n(e){var r;m()(this,n),r=t.call(this,e),ct(v()(r),"handleLayout",(function(e){var t=e.nativeEvent.layout,n=t.height,i=t.width,a={width:i,height:n};r.setState((function(e,t){return n===e.layout.height&&i===e.layout.width?null:{layout:a,headerHeights:ft(t.routes,t.insets,t.isParentHeaderShown,e.descriptors,a,e.headerHeights)}}))})),ct(v()(r),"handleHeaderLayout",(function(e){var t=e.route,n=e.height;r.setState((function(e){var r=e.headerHeights;return r[t.key]===n?null:{headerHeights:ut(ut({},r),{},o()({},t.key,n))}}))})),ct(v()(r),"getFocusedRoute",(function(){var e=r.props.state;return e.routes[e.index]})),ct(v()(r),"getPreviousScene",(function(e){var t=e.route,n=r.props.getPreviousRoute,i=r.state.scenes,a=n({route:t});if(a)return i.find((function(e){return e.route.key===a.key}))}));var i=R.a.get("window"),a=i.height,s=void 0===a?0:a,u=i.width,l=void 0===u?0:u;return r.state={routes:[],scenes:[],gestures:{},layout:{height:s,width:l},descriptors:r.props.descriptors,headerHeights:{}},r}return g()(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.mode,r=t.insets,i=t.descriptors,a=t.state,o=t.routes,s=t.closingRouteKeys,u=t.onOpenRoute,p=t.onCloseRoute,f=t.getGesturesEnabled,d=t.renderHeader,h=t.renderScene,m=t.headerMode,y=t.isParentHeaderShown,g=t.onTransitionStart,b=t.onTransitionEnd,v=t.onPageChangeStart,E=t.onPageChangeConfirm,T=t.onPageChangeCancel,S=t.onGestureStart,x=t.onGestureEnd,P=t.onGestureCancel,_=t.detachInactiveScreens,A=void 0===_?"web"===c.a.OS||U:_,O=this.state,k=O.scenes,C=O.layout,D=O.gestures,j=O.headerHeights,I=a.routes[a.index],N=i[I.key],R=N?N.options:{},L=j[I.key],F="modal"===n?at:it;"screen"===m&&(F=ut(ut({},F),{},{headerStyleInterpolator:Ye}));for(var B=R.safeAreaInsets||{},V=B.top,K=void 0===V?r.top:V,z=B.right,Y=void 0===z?r.right:z,q=B.bottom,X=void 0===q?r.bottom:q,G=B.left,J=void 0===G?r.left:G,$=1,Q=k.length-1;Q>=0;Q--){var Z=k[Q].descriptor.options.detachPreviousScreen;if(!1!==(void 0===Z?"modal"!==n||Q!==k.length-1:Z))break;$++}var ee="float"===m&&this.state.scenes.slice(-2).some((function(e){var t=e.descriptor,n=t?t.options:{},r=n.headerTransparent,i=n.headerShown;return!(!r&&!1!==(void 0===i||i))})),te="float"===m?l.createElement(l.Fragment,{key:"header"},d({mode:"float",layout:C,insets:{top:K,right:Y,bottom:X,left:J},scenes:k,getPreviousScene:this.getPreviousScene,getFocusedRoute:this.getFocusedRoute,onContentHeightChange:this.handleHeaderLayout,gestureDirection:void 0!==R.gestureDirection?R.gestureDirection:F.gestureDirection,styleInterpolator:void 0!==R.headerStyleInterpolator?R.headerStyleInterpolator:F.headerStyleInterpolator,style:[yt.floating,ee&&[{height:L},yt.absolute]]})):null,ne=(null===M.screensEnabled||void 0===M.screensEnabled?void 0:Object(M.screensEnabled)())&&A;return l.createElement(l.Fragment,null,ee?null:te,l.createElement(H,{enabled:ne,style:yt.container,onLayout:this.handleLayout},o.map((function(t,i,a){var o=I.key===t.key,_=D[t.key],A=k[i],O=1;if(U||"web"===c.a.OS)if(i<a.length-$-1)O=0;else{var N=k[a.length-1],R=i===a.length-1?2:i>=a.length-$?1:0;O=N?N.progress.current.interpolate({inputRange:[0,.99,1],outputRange:[1,1,R],extrapolate:"clamp"}):1}else O=A.progress.next?A.progress.next.interpolate({inputRange:[0,.99,1],outputRange:[1,1,0],extrapolate:"clamp"}):1;var M=A.descriptor?A.descriptor.options:{},L=M.safeAreaInsets,B=M.headerShown,V=void 0===B||B,H=M.headerTransparent,K=M.cardShadowEnabled,z=M.cardOverlayEnabled,Y=M.cardOverlay,q=M.cardStyle,X=M.animationEnabled,G=M.gestureResponseDistance,J=M.gestureVelocityImpact,Q=M.gestureDirection,Z=void 0===Q?F.gestureDirection:Q,te=M.transitionSpec,re=void 0===te?F.transitionSpec:te,ie=M.cardStyleInterpolator,ae=void 0===ie?!1===X?Ve:F.cardStyleInterpolator:ie,oe=M.headerStyleInterpolator,se={gestureDirection:Z,transitionSpec:re,cardStyleInterpolator:ae,headerStyleInterpolator:void 0===oe?F.headerStyleInterpolator:oe};if(i!==a.length-1){var ue=k[i+1];if(ue){var le=ue.descriptor?ue.descriptor.options:{},ce=le.animationEnabled,pe=le.gestureDirection,fe=void 0===pe?F.gestureDirection:pe,de=le.transitionSpec,he=void 0===de?F.transitionSpec:de,me=le.cardStyleInterpolator,ye=void 0===me?!1===ce?Ve:F.cardStyleInterpolator:me,ge=le.headerStyleInterpolator;se={gestureDirection:fe,transitionSpec:he,cardStyleInterpolator:ye,headerStyleInterpolator:void 0===ge?F.headerStyleInterpolator:ge}}}var be=L||{},ve=be.top,Ee=void 0===ve?r.top:ve,Te=be.right,Se=void 0===Te?r.right:Te,xe=be.bottom,Pe=void 0===xe?r.bottom:xe,_e=be.left,Ae=void 0===_e?r.left:_e,we="none"!==m&&!1!==V?j[t.key]:0;return l.createElement(W,{key:t.key,style:w.a.absoluteFill,enabled:ne,active:O,pointerEvents:"box-none"},l.createElement(De,lt({index:i,active:i===a.length-1,focused:o,closing:s.includes(t.key),layout:C,gesture:_,scene:A,safeAreaInsetTop:Ee,safeAreaInsetRight:Se,safeAreaInsetBottom:Pe,safeAreaInsetLeft:Ae,cardOverlay:Y,cardOverlayEnabled:z,cardShadowEnabled:K,cardStyle:q,onPageChangeStart:v,onPageChangeConfirm:E,onPageChangeCancel:T,onGestureStart:S,onGestureCancel:P,onGestureEnd:x,gestureResponseDistance:G,headerHeight:we,isParentHeaderShown:y,onHeaderHeightChange:e.handleHeaderLayout,getPreviousScene:e.getPreviousScene,getFocusedRoute:e.getFocusedRoute,mode:n,headerMode:m,headerShown:V,hasAbsoluteHeader:ee&&!H,renderHeader:d,renderScene:h,onOpenRoute:u,onCloseRoute:p,onTransitionStart:g,onTransitionEnd:b,gestureEnabled:0!==i&&f({route:t}),gestureVelocityImpact:J},se)))}))),ee?te:null)}}],[{key:"getDerivedStateFromProps",value:function(e,t){if(e.routes===t.routes&&e.descriptors===t.descriptors)return null;var n=e.routes.reduce((function(n,r){var i=e.descriptors[r.key],a=((null===i||void 0===i?void 0:i.options)||{}).animationEnabled;return n[r.key]=t.gestures[r.key]||new N.a.Value(e.openingRouteKeys.includes(r.key)&&!1!==a?dt(e.mode,t.layout,i):0),n}),{});return{routes:e.routes,scenes:e.routes.map((function(r,i,a){var o=a[i-1],s=a[i+1],u=t.scenes[i],l=n[r.key],c=o?n[o.key]:void 0,p=s?n[s.key]:void 0,f=e.descriptors[r.key]||t.descriptors[r.key]||(u?u.descriptor:pt),d=e.descriptors[null===s||void 0===s?void 0:s.key]||t.descriptors[null===s||void 0===s?void 0:s.key],h=e.descriptors[null===o||void 0===o?void 0:o.key]||t.descriptors[null===o||void 0===o?void 0:o.key],m={route:r,descriptor:f,progress:{current:ht(e.mode,l,t.layout,f),next:p?ht(e.mode,p,t.layout,d):void 0,previous:c?ht(e.mode,c,t.layout,h):void 0},__memo:[r,t.layout,f,d,h,l,p,c]};return u&&m.__memo.every((function(e,t){return u.__memo[t]===e}))?u:m})),gestures:n,descriptors:e.descriptors,headerHeights:ft(e.routes,e.insets,e.isParentHeaderShown,t.descriptors,t.layout,t.headerHeights)}}}]),n}(l.Component),yt=w.a.create({container:{flex:1},absolute:{position:"absolute",top:0,left:0,right:0},floating:{zIndex:1}}),gt=n(73),bt=n(164);function vt(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(zt){return!1}}();return function(){var n,r=_()(e);if(t){var i=_()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return x()(this,n)}}function Et(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Tt=function(e){T()(n,e);var t=vt(n);function n(){var e;m()(this,n);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return e=t.call.apply(t,[this].concat(i)),Et(v()(e),"previouslyFocusedTextInput",void 0),Et(v()(e),"startTimestamp",0),Et(v()(e),"keyboardTimeout",void 0),Et(v()(e),"clearKeyboardTimeout",(function(){void 0!==e.keyboardTimeout&&(clearTimeout(e.keyboardTimeout),e.keyboardTimeout=void 0)})),Et(v()(e),"handlePageChangeStart",(function(){if(e.props.enabled){e.clearKeyboardTimeout();var t=gt.a.State.currentlyFocusedInput?gt.a.State.currentlyFocusedInput():gt.a.State.currentlyFocusedField();gt.a.State.blurTextInput(t),e.previouslyFocusedTextInput=t,e.startTimestamp=Date.now()}})),Et(v()(e),"handlePageChangeConfirm",(function(t){if(e.props.enabled){if(e.clearKeyboardTimeout(),t)bt.a.dismiss();else{var n=e.previouslyFocusedTextInput;n&&gt.a.State.blurTextInput(n)}e.previouslyFocusedTextInput=void 0}})),Et(v()(e),"handlePageChangeCancel",(function(){if(e.props.enabled){e.clearKeyboardTimeout();var t=e.previouslyFocusedTextInput;t&&(Date.now()-e.startTimestamp<100?e.keyboardTimeout=setTimeout((function(){gt.a.State.focusTextInput(t),e.previouslyFocusedTextInput=void 0}),100):(gt.a.State.focusTextInput(t),e.previouslyFocusedTextInput=void 0))}})),e}return g()(n,[{key:"componentWillUnmount",value:function(){this.clearKeyboardTimeout()}},{key:"render",value:function(){return this.props.children({onPageChangeStart:this.handlePageChangeStart,onPageChangeConfirm:this.handlePageChangeConfirm,onPageChangeCancel:this.handlePageChangeCancel})}}]),n}(l.Component);function St(){return(St=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function xt(e){var t=e.tintColor,n=e.style,r=u()(e,["tintColor","style"]),i=Object(X.a)().colors;return l.createElement(N.a.Text,St({accessibilityRole:"header","aria-level":"1",numberOfLines:1},r,{style:[Pt.title,{color:void 0===t?i.text:t},n]}))}var Pt=w.a.create({title:c.a.select({ios:{fontSize:17,fontWeight:"600"},android:{fontSize:20,fontFamily:"sans-serif-medium",fontWeight:"normal"},default:{fontSize:18,fontWeight:"500"}})});function _t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function At(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_t(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_t(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function wt(){return(wt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var Ot=l.memo((function(e){var t,n=e.scene,r=e.previous,i=e.layout,a=e.insets,o=e.navigation,s=e.styleInterpolator,u=n.descriptor.options,c="function"!==typeof u.headerTitle&&void 0!==u.headerTitle?u.headerTitle:void 0!==u.title?u.title:n.route.name;if(void 0!==u.headerBackTitle)t=u.headerBackTitle;else if(r){var f=r.descriptor.options;t="function"!==typeof f.headerTitle&&void 0!==f.headerTitle?f.headerTitle:void 0!==f.title?f.title:r.route.name}var d=l.useCallback(function(e,t){var n;return function(){if(!n){for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];e.apply(this,i),n=setTimeout((function(){n=void 0}),t)}}}((function(){o.isFocused()&&o.canGoBack()&&o.dispatch(At(At({},p.StackActions.pop()),{},{source:n.route.key}))}),50),[o,n.route.key]);return l.createElement(ce,wt({},u,{insets:a,layout:i,scene:n,title:c,leftLabel:t,headerTitle:"function"!==typeof u.headerTitle?function(e){return l.createElement(xt,e)}:u.headerTitle,onGoBack:r?d:void 0,styleInterpolator:s}))}));function kt(e){var t=e.mode,n=e.scenes,r=e.layout,i=e.insets,a=e.getPreviousScene,o=e.getFocusedRoute,s=e.onContentHeightChange,u=e.gestureDirection,c=e.styleInterpolator,f=e.style,d=o(),h=l.useContext(Ce);return l.createElement(N.a.View,{pointerEvents:"box-none",style:f},n.slice(-3).map((function(e,n,o){var f;if("screen"===t&&n!==o.length-1||!e)return null;var m=e.descriptor.options||{},y=m.header,g=m.headerShown,b=void 0===g||g,v=m.headerTransparent;if(!b)return null;var E=d.key===e.route.key,T=null!==(f=a({route:e.route}))&&void 0!==f?f:h,S=o[n-1],x=o[n+1],P=((null===S||void 0===S?void 0:S.descriptor.options)||{}).headerShown,_=void 0===P||P,w=((null===x||void 0===x?void 0:x.descriptor.options)||{}).headerShown,O=!1===_&&!x||!1===(void 0===w||w),k={mode:t,layout:r,insets:i,scene:e,previous:T,navigation:e.descriptor.navigation,styleInterpolator:"float"===t?O?"vertical"===u||"vertical-inverted"===u?ze:"horizontal-inverted"===u?Ke:We:c:Ye};return l.createElement(p.NavigationContext.Provider,{key:e.route.key,value:e.descriptor.navigation},l.createElement(p.NavigationRouteContext.Provider,{value:e.route},l.createElement(A.a,{onLayout:s?function(t){var n=t.nativeEvent.layout.height;s({route:e.route,height:n})}:void 0,pointerEvents:E?"box-none":"none",accessibilityElementsHidden:!E,importantForAccessibility:E?"auto":"no-hide-descendants",style:"float"===t&&!E||v?Ct.header:null},void 0!==y?y(k):l.createElement(Ot,k))))})))}var Ct=w.a.create({header:{position:"absolute",top:0,left:0,right:0}});function Dt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var jt=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Dt(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Dt(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({top:function(e){return c.a.select({ios:(t=e?44:30,n=20,Ne()?t:n),android:Ie.a.currentHeight,default:0});var t,n}(!0),bottom:Ne()?34:0,right:0,left:0},null);function It(e){var t=e.children;return l.createElement(O.a,null,(function(e){return e?t:l.createElement(O.b,{initialSafeAreaInsets:jt},t)}))}function Nt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Rt(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Nt(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Nt(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Mt(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(zt){return!1}}();return function(){var n,r=_()(e);if(t){var i=_()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return x()(this,n)}}function Lt(){return(Lt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function Ft(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Bt=null!==C&&void 0!==C?C:A.a,Vt=function(e){T()(n,e);var t=Mt(n);function n(){var e;m()(this,n);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return e=t.call.apply(t,[this].concat(i)),Ft(v()(e),"state",{routes:[],previousRoutes:[],previousDescriptors:{},openingRouteKeys:[],closingRouteKeys:[],replacingRouteKeys:[],descriptors:{}}),Ft(v()(e),"getGesturesEnabled",(function(t){var n=t.route,r=e.state.descriptors[n.key];if(r){var i=r.options,a=i.gestureEnabled;return!1!==i.animationEnabled&&!1!==a}return!1})),Ft(v()(e),"getPreviousRoute",(function(t){var n=t.route,r=e.state,i=r.closingRouteKeys,a=r.replacingRouteKeys,o=e.state.routes.filter((function(e){return e.key===n.key||!i.includes(e.key)&&!a.includes(e.key)})),s=o.findIndex((function(e){return e.key===n.key}));return o[s-1]})),Ft(v()(e),"renderScene",(function(t){var n=t.route,r=e.state.descriptors[n.key]||e.props.descriptors[n.key];return r?r.render():null})),Ft(v()(e),"renderHeader",(function(e){return l.createElement(kt,e)})),Ft(v()(e),"handleOpenRoute",(function(t){var n=t.route,r=e.props,i=r.state,a=r.navigation,o=e.state,s=o.closingRouteKeys,u=o.replacingRouteKeys;s.some((function(e){return e===n.key}))&&u.every((function(e){return e!==n.key}))&&i.routeNames.includes(n.name)&&!i.routes.some((function(e){return e.key===n.key}))?a.navigate(n):e.setState((function(e){return{routes:e.replacingRouteKeys.length?e.routes.filter((function(t){return!e.replacingRouteKeys.includes(t.key)})):e.routes,openingRouteKeys:e.openingRouteKeys.filter((function(e){return e!==n.key})),closingRouteKeys:e.closingRouteKeys.filter((function(e){return e!==n.key})),replacingRouteKeys:[]}}))})),Ft(v()(e),"handleCloseRoute",(function(t){var n=t.route,r=e.props,i=r.state,a=r.navigation;i.routes.some((function(e){return e.key===n.key}))?a.dispatch(Rt(Rt({},p.StackActions.pop()),{},{source:n.key,target:i.key})):e.setState((function(e){return{routes:e.routes.filter((function(e){return e.key!==n.key})),openingRouteKeys:e.openingRouteKeys.filter((function(e){return e!==n.key})),closingRouteKeys:e.closingRouteKeys.filter((function(e){return e!==n.key}))}}))})),Ft(v()(e),"handleTransitionStart",(function(t,n){var r=t.route;return e.props.navigation.emit({type:"transitionStart",data:{closing:n},target:r.key})})),Ft(v()(e),"handleTransitionEnd",(function(t,n){var r=t.route;return e.props.navigation.emit({type:"transitionEnd",data:{closing:n},target:r.key})})),Ft(v()(e),"handleGestureStart",(function(t){var n=t.route;e.props.navigation.emit({type:"gestureStart",target:n.key})})),Ft(v()(e),"handleGestureEnd",(function(t){var n=t.route;e.props.navigation.emit({type:"gestureEnd",target:n.key})})),Ft(v()(e),"handleGestureCancel",(function(t){var n=t.route;e.props.navigation.emit({type:"gestureCancel",target:n.key})})),e}return g()(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.state,r=t.navigation,i=t.keyboardHandlingEnabled,a=t.mode,o=void 0===a?"card":a,s=t.headerMode,f=void 0===s?"card"===o&&"ios"===c.a.OS?"float":"screen":s,d=(t.descriptors,u()(t,["state","navigation","keyboardHandlingEnabled","mode","headerMode","descriptors"])),h=this.state,m=h.routes,y=h.descriptors,g=h.openingRouteKeys,b=h.closingRouteKeys;return l.createElement(p.NavigationHelpersContext.Provider,{value:r},l.createElement(Bt,{style:Ut.container},l.createElement(It,null,l.createElement(O.a,null,(function(t){return l.createElement(Tt,{enabled:!1!==i},(function(r){return l.createElement(se.Consumer,null,(function(i){return l.createElement(mt,Lt({mode:o,insets:t,isParentHeaderShown:i,getPreviousRoute:e.getPreviousRoute,getGesturesEnabled:e.getGesturesEnabled,routes:m,openingRouteKeys:g,closingRouteKeys:b,onOpenRoute:e.handleOpenRoute,onCloseRoute:e.handleCloseRoute,onTransitionStart:e.handleTransitionStart,onTransitionEnd:e.handleTransitionEnd,renderHeader:e.renderHeader,renderScene:e.renderScene,headerMode:f,state:n,descriptors:y,onGestureStart:e.handleGestureStart,onGestureEnd:e.handleGestureEnd,onGestureCancel:e.handleGestureCancel},d,r))}))}))})))))}}],[{key:"getDerivedStateFromProps",value:function(e,t){if((e.state.routes===t.previousRoutes||(s=e.state.routes.map((function(e){return e.key})),u=t.previousRoutes.map((function(e){return e.key})),s.length===u.length&&s.every((function(e,t){return e===u[t]}))))&&t.routes.length){var n=t.routes,r=t.previousRoutes,i=e.descriptors,a=t.previousDescriptors;if(e.descriptors!==t.previousDescriptors&&(i=t.routes.reduce((function(n,r){return n[r.key]=e.descriptors[r.key]||t.descriptors[r.key],n}),{}),a=e.descriptors),e.state.routes!==t.previousRoutes){var o=e.state.routes.reduce((function(e,t){return e[t.key]=t,e}),{});n=t.routes.map((function(e){return o[e.key]||e})),r=e.state.routes}return{routes:n,previousRoutes:r,descriptors:i,previousDescriptors:a}}var s,u,l=e.state.index<e.state.routes.length-1?e.state.routes.slice(0,e.state.index+1):e.state.routes,c=t.openingRouteKeys,p=t.closingRouteKeys,f=t.replacingRouteKeys,h=t.previousRoutes,m=h[h.length-1],y=l[l.length-1],g=function(n){var r=e.descriptors[n]||t.descriptors[n];return!r||!1!==r.options.animationEnabled};if(m&&m.key!==y.key)h.some((function(e){return e.key===y.key}))?l.some((function(e){return e.key===m.key}))||g(m.key)&&!p.includes(m.key)&&(p=[].concat(d()(p),[m.key]),c=c.filter((function(e){return e!==m.key})),f=f.filter((function(e){return e!==m.key})),l=[].concat(d()(l),[m])):g(y.key)&&!c.includes(y.key)&&(c=[].concat(d()(c),[y.key]),p=p.filter((function(e){return e!==y.key})),f=f.filter((function(e){return e!==y.key})),l.some((function(e){return e.key===m.key}))||(c=c.filter((function(e){return e!==m.key})),"pop"===function(n){var r;return null!==(r=(e.descriptors[n]||t.descriptors[n]).options.animationTypeForReplace)&&void 0!==r?r:"push"}(y.key)?(p=[].concat(d()(p),[m.key]),c=c.filter((function(e){return e!==y.key})),l=[].concat(d()(l),[m])):(f=[].concat(d()(f),[m.key]),p=p.filter((function(e){return e!==m.key})),(l=l.slice()).splice(l.length-1,0,m))));else if(f.length||p.length){var b;(b=l=l.slice()).splice.apply(b,[l.length-1,0].concat(d()(t.routes.filter((function(e){var t=e.key;return!!g(t)&&(f.includes(t)||p.includes(t))})))))}if(!l.length)throw new Error("There should always be at least one route in the navigation state.");var v=l.reduce((function(n,r){return n[r.key]=e.descriptors[r.key]||t.descriptors[r.key],n}),{});return{routes:l,previousRoutes:e.state.routes,previousDescriptors:e.descriptors,openingRouteKeys:c,closingRouteKeys:p,replacingRouteKeys:f,descriptors:v}}}]),n}(l.Component),Ut=w.a.create({container:{flex:1}});function Ht(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Wt(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Ht(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ht(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Kt(){return(Kt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}t.a=Object(p.createNavigatorFactory)((function(e){var t=e.initialRouteName,n=e.children,r=e.screenOptions,i=u()(e,["initialRouteName","children","screenOptions"]),a={gestureEnabled:"ios"===c.a.OS,animationEnabled:"web"!==c.a.OS&&"windows"!==c.a.OS&&"macos"!==c.a.OS},o=Object(p.useNavigationBuilder)(p.StackRouter,{initialRouteName:t,children:n,screenOptions:"function"===typeof r?function(){return Wt(Wt({},a),r.apply(void 0,arguments))}:Wt(Wt({},a),r)}),s=o.state,f=o.descriptors,d=o.navigation;return l.useEffect((function(){var e;return null===(e=d.addListener)||void 0===e?void 0:e.call(d,"tabPress",(function(e){var t=d.isFocused();requestAnimationFrame((function(){s.index>0&&t&&!e.defaultPrevented&&d.dispatch(Wt(Wt({},p.StackActions.popToTop()),{},{target:s.key}))}))}))}),[d,s.index,s.key]),l.createElement(Vt,Kt({},i,{state:s,descriptors:f,navigation:d}))}))},function(e,t,n){"use strict";n.d(t,"a",(function(){return C}));var r=n(150);r.a;var i=console.warn;console.warn=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.length>0&&"string"===typeof t[0]&&(/^Require cycle: .*node_modules/.test(t[0])||/Use UIManager\.getViewManagerConfig\('LottieAnimationView'\) instead\./.test(t[0])||/ReactNative\.NativeModules\.LottieAnimationView\.getConstants/.test(t[0]))||i.apply(console,t)};var a=console.error;console.error=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.length>0&&"string"===typeof t[0]&&/^Warning: .* has been extracted/.test(t[0])||a.apply(console,t)};var o,s=n(10),u=n(4),l=n.n(u),c=n(6),p=n.n(c),f=n(9),d=n.n(f),h=n(14),m=n.n(h),y=n(15),g=n.n(y),b=n(2),v=n.n(b);var E="undefined"!==typeof window&&!(null==(o=window.document)||!o.createElement),T=E&&!(!window.addEventListener&&!window.attachEvent),S=E&&!!window.screen,x={OS:s.a.OS,select:s.a.select,isDOMAvailable:E,canUseEventListeners:T,canUseViewport:S};var P={get name(){return"ExpoErrorRecovery"},saveRecoveryProps:function(e){if(x.isDOMAvailable)try{localStorage.setItem("EXPO_ERROR_RECOVERY_STORAGE",e)}catch(t){}},recoveredProps:function(){if(!x.isDOMAvailable)return null;try{var e=localStorage.getItem("EXPO_ERROR_RECOVERY_STORAGE");return localStorage.removeItem("EXPO_ERROR_RECOVERY_STORAGE"),e}catch(t){}return null}()},_=function(){if(P.recoveredProps)return JSON.parse(P.recoveredProps);return null}();var A=n(0);function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(Object(n),!0).forEach((function(t){l()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function k(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v()(e);if(t){var i=v()(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return g()(this,n)}}function C(e){if(r.a.registerComponent("main",(function(){return t=e,function(e){m()(r,e);var n=k(r);function r(){return p()(this,r),n.apply(this,arguments)}return d()(r,[{key:"render",value:function(){var e=O(O({},this.props),{},{exp:O(O({},this.props.exp),{},{errorRecovery:_})});return A.createElement(t,Object.assign({},e))}}]),r}(A.Component);var t})),"web"===s.a.OS){var t,n=null!=(t=document.getElementById("root"))?t:document.getElementById("main");r.a.runApplication("main",{rootTag:n})}}},function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var r=function(e,t,n){e=+e,t=+t,n=(i=arguments.length)<2?(t=e,e=0,1):i<3?1:+n;for(var r=-1,i=0|Math.max(0,Math.ceil((t-e)/n)),a=new Array(i);++r<i;)a[r]=e+r*n;return a},i=n(175);class a extends Map{constructor(e,t=l){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:t}}),null!=e)for(const[n,r]of e)this.set(n,r)}get(e){return super.get(o(this,e))}has(e){return super.has(o(this,e))}set(e,t){return super.set(s(this,e),t)}delete(e){return super.delete(u(this,e))}}Set;function o({_intern:e,_key:t},n){const r=t(n);return e.has(r)?e.get(r):n}function s({_intern:e,_key:t},n){const r=t(n);return e.has(r)?e.get(r):(e.set(r,n),n)}function u({_intern:e,_key:t},n){const r=t(n);return e.has(r)&&(n=e.get(n),e.delete(r)),n}function l(e){return null!==e&&"object"===typeof e?e.valueOf():e}const c=Symbol("implicit");function p(){var e=new a,t=[],n=[],r=c;function o(i){let a=e.get(i);if(void 0===a){if(r!==c)return r;e.set(i,a=t.push(i)-1)}return n[a%n.length]}return o.domain=function(n){if(!arguments.length)return t.slice();t=[],e=new a;for(const r of n)e.has(r)||e.set(r,t.push(r)-1);return o},o.range=function(e){return arguments.length?(n=Array.from(e),o):n.slice()},o.unknown=function(e){return arguments.length?(r=e,o):r},o.copy=function(){return p(t,n).unknown(r)},i.a.apply(o,arguments),o}function f(){var e,t,n=p().unknown(void 0),a=n.domain,o=n.range,s=0,u=1,l=!1,c=0,d=0,h=.5;function m(){var n=a().length,i=u<s,p=i?u:s,f=i?s:u;e=(f-p)/Math.max(1,n-c+2*d),l&&(e=Math.floor(e)),p+=(f-p-e*(n-c))*h,t=e*(1-c),l&&(p=Math.round(p),t=Math.round(t));var m=r(n).map((function(t){return p+e*t}));return o(i?m.reverse():m)}return delete n.unknown,n.domain=function(e){return arguments.length?(a(e),m()):a()},n.range=function(e){return arguments.length?([s,u]=e,s=+s,u=+u,m()):[s,u]},n.rangeRound=function(e){return[s,u]=e,s=+s,u=+u,l=!0,m()},n.bandwidth=function(){return t},n.step=function(){return e},n.round=function(e){return arguments.length?(l=!!e,m()):l},n.padding=function(e){return arguments.length?(c=Math.min(1,d=+e),m()):c},n.paddingInner=function(e){return arguments.length?(c=Math.min(1,e),m()):c},n.paddingOuter=function(e){return arguments.length?(d=+e,m()):d},n.align=function(e){return arguments.length?(h=Math.max(0,Math.min(1,e)),m()):h},n.copy=function(){return f(a(),[s,u]).round(l).paddingInner(c).paddingOuter(d).align(h)},i.a.apply(m(),arguments)}},function(e,t,n){"use strict";n.d(t,"b",(function(){return g})),n.d(t,"c",(function(){return v})),n.d(t,"a",(function(){return E}));var r=n(29),i=n.n(r),a=n(0),o=n(48),s=n(11),u=n(8),l={WebkitTransition:"webkitTransitionEnd",Transition:"transitionEnd",MozTransition:"transitionend",MSTransition:"msTransitionEnd",OTransition:"oTransitionEnd"};function c(e){var t=e.children,n=e.style,r=e.onInsetsChange;return a.useEffect((function(){if("undefined"!==typeof document){var e=function(){var e=document.createElement("div"),t=e.style;return t.position="fixed",t.left="0",t.top="0",t.width="0",t.height="0",t.zIndex="-1",t.overflow="hidden",t.visibility="hidden",t.transitionDuration="0.05s",t.transitionProperty="padding",t.transitionDelay="0s",t.paddingTop=h("top"),t.paddingBottom=h("bottom"),t.paddingLeft=h("left"),t.paddingRight=h("right"),e}();document.body.appendChild(e);var t=function(){var t=window.getComputedStyle(e),n=t.paddingTop,i=t.paddingBottom,a=t.paddingLeft,o=t.paddingRight,s={top:n?parseInt(n,10):0,bottom:i?parseInt(i,10):0,left:a?parseInt(a,10):0,right:o?parseInt(o,10):0},u={x:0,y:0,width:document.documentElement.offsetWidth,height:document.documentElement.offsetHeight};r({nativeEvent:{insets:s,frame:u}})};return e.addEventListener(f(),t),t(),function(){document.body.removeChild(e),e.removeEventListener(f(),t)}}}),[r]),a.createElement(u.a,{style:n},t)}var p=null;function f(){if(null!==p)return p;var e=document.createElement("invalidtype");for(var t in p=l.Transition,l)if(void 0!==e.style[t]){p=l[t];break}return p}var d=null;function h(e){return"".concat(function(){if(null!==d)return d;var e=window.CSS;return d=e&&e.supports&&e.supports("top: constant(safe-area-inset-top)")?"constant":"env"}(),"(safe-area-inset-").concat(e,")")}var m=a.createContext(null);m.displayName="SafeAreaInsetsContext";var y=a.createContext(null);function g(e){var t,n,r,s,u,l=e.children,p=e.initialMetrics,f=e.initialSafeAreaInsets,d=e.style,h=a.useContext(m),g=a.useContext(y),v=a.useState(null!==(t=null!==(n=null!==(r=null===p||void 0===p?void 0:p.insets)&&void 0!==r?r:f)&&void 0!==n?n:h)&&void 0!==t?t:null),E=i()(v,2),T=E[0],S=E[1],x=a.useState(null!==(s=null!==(u=null===p||void 0===p?void 0:p.frame)&&void 0!==u?u:g)&&void 0!==s?s:{x:0,y:0,width:o.a.get("window").width,height:o.a.get("window").height}),P=i()(x,2),_=P[0],A=P[1],w=a.useCallback((function(e){var t=e.nativeEvent,n=t.frame,r=t.insets;!n||n.height===_.height&&n.width===_.width&&n.x===_.x&&n.y===_.y||A(n),T&&r.bottom===T.bottom&&r.left===T.left&&r.right===T.right&&r.top===T.top||S(r)}),[_,T]);return a.createElement(c,{style:[b.fill,d],onInsetsChange:w},null!=T?a.createElement(y.Provider,{value:_},a.createElement(m.Provider,{value:T},l)):null)}y.displayName="SafeAreaFrameContext";var b=s.a.create({fill:{flex:1}});function v(){var e=a.useContext(m);if(null==e)throw new Error("No safe area insets value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.");return e}var E=m.Consumer}]]);
//# sourceMappingURL=4.9b24aee3.chunk.js.map