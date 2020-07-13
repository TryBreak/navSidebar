//全局存储
var sidebar_status = "inset_switch_off";

function sidebar_inset_switch() {
  sidebarMethod("inset");
}
function sidebar_fixed_switch() {
  sidebarMethod("fixed");
}

// 参数说明： inset 为控制嵌入式状态栏，回调函数为当前侧栏状态
function sidebarMethod(status_str, callback) {
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
  var fixedElm;
  var insetElm;
  var isInsetOff;
  var isInsetOn;
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
    },
    getElm: function () {
      insetElm = document.getElementById("js-global-sidebar-inset");
      fixedElm = document.getElementById("js-global-sidebar-fixed");
    },
    readStatus: function () {
      isInsetOff = !insetElm.classList.contains(status_list_class.inset_on);
      isInsetOn = !insetElm.classList.contains(status_list_class.inset_off);
      //嵌入式默认为关闭状态
      if (isInsetOff && isInsetOn) {
        isInsetOn = false;
      }

      isFixedOff = !fixedElm.classList.contains(status_list_class.fixed_on);
      isFixedOn = !fixedElm.classList.contains(status_list_class.fixed_off);
      //浮动式默认为关闭状态
      if (isFixedOff && isFixedOn) {
        isFixedOn = false;
      }
    },
    inset_off: function () {
      insetElm.classList.remove(status_list_class.inset_on);
      insetElm.classList.add(status_list_class.inset_off);
      inform();
    },
    inset_on: function () {
      console.log("开启");

      insetElm.classList.remove(status_list_class.inset_off);
      insetElm.classList.add(status_list_class.inset_on);
      inform();
    },
    fixed_off: function () {
      fixedElm.classList.remove(status_list_class.fixed_on);
      fixedElm.classList.add(status_list_class.fixed_off);
      setTimeout(function () {
        fixedElm.style.display = "none";
        inform();
      }, transitionTime);
    },
    fixed_on: function () {
      fixedElm.style.display = "block";
      setTimeout(function () {
        fixedElm.classList.remove(status_list_class.fixed_off);
        fixedElm.classList.add(status_list_class.fixed_on);
        inform();
      });
    },
    htmlOn: function () {
      var htmlElm = document.getElementsByTagName("html")[0];
      htmlElm.style.paddingLeft = sidebar_w + "px";
    },
    htmlOff: function () {
      var htmlElm = document.getElementsByTagName("html")[0];
      htmlElm.style.paddingLeft = sidebar_s_w + "px";
    },
  };

  //侦测当行类型
  utils.readType();

  // 读取当前状态
  utils.readStatus();

  // 执行切换

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

  //通知
  function inform() {
    //读取当前状态并输出
    utils.readStatus();
    callback &&
      callback({
        fixed: isFixedOn,
        inset: isInsetOn,
      });
  }
}
