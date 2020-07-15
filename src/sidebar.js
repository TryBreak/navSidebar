//本次切换状态存储：
var global_sidebar_inset = true; //true 为展开 ，false 为关闭

function globalSidebarSwitch() {
  var winW = document.body.clientWidth;
  var window_w = 1320; //宽窄模式自动切换临界点
  if (winW - window_w > 0) {
    sidebarMethod("inset", function (param) {
      global_sidebar_inset = param.inset;
    });
  } else {
    sidebarMethod("fixed");
  }
  // 默认嵌入式展开收起
  // 如果宽度小于 1320 , 则默认为浮动式
  // 如果不存在嵌入式，则为浮动式展开收起
}

sidebarInitialize();
function sidebarInitialize() {
  var sidebarInitialize_main = function main() {
    var winW = document.body.clientWidth;
    var window_w = 1320; //宽窄模式自动切换临界点
    var method = sidebarMethod(null);
    if (!global_sidebar_inset) {
      return;
    }
    if (winW - window_w > 0) {
      method.inset_on();
      method.htmlOn();
    } else {
      method.inset_off();
      method.htmlOff();
    }
  };
  sidebarInitialize_main();
  window.onresize = sidebarInitialize_main;
}

function sidebarMethod(status_str, callback) {
  /*
    @status_str:"inset" || "fixed"
    @callback:Function({
      fixed: Boolean,
      inset: Boolean,
    })
  */

  var outsideStatusList = ["inset", "fixed"];

  // 存在对应 class 则表示是对应状态 , 默认都不存在
  var status_list_class = {
    inset_off: "sidebar-narrow",
    inset_on: "sidebar-wide",
    fixed_off: "sidebar-hidden",
    fixed_on: "sidebar-show",
  };

  var transitionTime = 200;
  var sidebar_w = 240;
  var sidebar_s_w = 72;

  var type;
  var fixedElm = null;
  var insetElm = null;
  var isInsetOff;
  var isInsetOn;
  var isInsetDisabled;
  var isFixedOff;
  var isFixedOn;

  var utils = {
    findKey: function (obj, value, compare = (a, b) => a === b) {
      return Object.keys(obj).find((k) => compare(obj[k], value));
    },
    readType: function (params) {
      if (status_str === outsideStatusList[0]) {
        type = outsideStatusList[0];
      }
      if (status_str === outsideStatusList[1]) {
        type = outsideStatusList[1];
      }
      this.getElm();
      return type;
    },
    getElm: function () {
      insetElm = document.getElementById("js-global-sidebar-inset");
      fixedElm = document.getElementById("js-global-sidebar-fixed");
      insetElmStyle = window.getComputedStyle(insetElm);
      isInsetDisabled = insetElmStyle.display === "none";

      return {
        fixedElm: fixedElm,
        insetElm: insetElm,
      };
    },
    readStatus: function () {
      if (insetElm) {
        isInsetOff = !insetElm.classList.contains(status_list_class.inset_on);
        isInsetOn = !insetElm.classList.contains(status_list_class.inset_off);
        //嵌入式默认为关闭状态
        if (isInsetOff && isInsetOn) {
          isInsetOn = false;
        }
      }

      isFixedOff = !fixedElm.classList.contains(status_list_class.fixed_on);
      isFixedOn = !fixedElm.classList.contains(status_list_class.fixed_off);
      //浮动式默认为关闭状态
      if (isFixedOff && isFixedOn) {
        isFixedOn = false;
      }

      return {
        isInsetOn: isInsetOn,
        isFixedOn: isFixedOn,
      };
    },
    inset_off: function () {
      if (!insetElm) {
        return null;
      }
      insetElm.classList.remove(status_list_class.inset_on);
      insetElm.classList.add(status_list_class.inset_off);
      return inform();
    },
    inset_on: function () {
      if (!insetElm) {
        return null;
      }
      insetElm.classList.remove(status_list_class.inset_off);
      insetElm.classList.add(status_list_class.inset_on);
      return inform();
    },
    fixed_off: function () {
      fixedElm.classList.remove(status_list_class.fixed_on);
      fixedElm.classList.add(status_list_class.fixed_off);
      setTimeout(function () {
        fixedElm.style.display = "none";
        inform();
      }, transitionTime);
      return "fixed_off";
    },
    fixed_on: function () {
      fixedElm.style.display = "block";
      setTimeout(function () {
        fixedElm.classList.remove(status_list_class.fixed_off);
        fixedElm.classList.add(status_list_class.fixed_on);
        inform();
      });
      return "fixed_on";
    },
    htmlOn: function () {
      var htmlElm = document.getElementById("global-main");
      htmlElm.style.paddingLeft = sidebar_w + "px";
      return htmlElm.style.paddingLeft;
    },
    htmlOff: function () {
      var htmlElm = document.getElementById("global-main");
      htmlElm.style.paddingLeft = sidebar_s_w + "px";
      return htmlElm.style.paddingLeft;
    },
  };

  //侦测当行类型
  utils.readType();

  // 读取当前状态
  utils.readStatus();

  // 执行切换
  if (isInsetDisabled) {
    type = outsideStatusList[1];
  }

  if (type === outsideStatusList[0]) {
    if (isInsetOff) {
      utils.inset_on();
      utils.htmlOn();
    } else {
      utils.inset_off();
      utils.htmlOff();
    }
  }

  if (type === outsideStatusList[1]) {
    if (isFixedOff) {
      utils.fixed_on();
    } else {
      utils.fixed_off();
    }
  }

  return utils;

  //通知
  function inform() {
    //读取当前状态并输出
    utils.readStatus();
    var param = {
      fixed: isFixedOn,
      inset: isInsetOn,
    };
    callback && callback(param);
    return param;
  }
}
