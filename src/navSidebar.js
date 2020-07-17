//本次切换状态存储：
//true 为宽模式和js未掌控状态 ，false 为窄模式和js已掌控状态
window.navSidebarControlState = true;

function navSidebarMethod(status_str, callback) {
  /*
    @status_str:"inset" || "fixed"
    @callback:Function({
      fixed: Boolean,
      inset: Boolean,
    })
  */

  var sidebarTypeList = ["inset", "fixed"];

  // 存在对应 class 则表示是对应状态 , 默认都不存在
  var status_list_class = {
    inset_off: "nav_sidebar-narrow",
    inset_on: "nav_sidebar-wide",
    fixed_off: "nav_sidebar-hidden",
    fixed_on: "nav_sidebar-show",
  };

  var transitionTime = 200;
  var navSidebar_w = 240;
  var navSidebar_s_w = 72;

  var type;
  var fixedElm = null;
  var insetElm = null;
  var isInsetOff;
  var isInsetOn;
  var isInsetDisabled;
  var isFixedOff;
  var isFixedOn;

  var utils = {
    readType: function () {
      if (status_str === sidebarTypeList[0]) {
        type = sidebarTypeList[0];
      }
      if (status_str === sidebarTypeList[1]) {
        type = sidebarTypeList[1];
      }
      this.getElm();
      return type;
    },
    getElm: function () {
      insetElm = document.getElementById("js-nav-sidebar-inset");
      fixedElm = document.getElementById("js-nav-sidebar-fixed");
      insetElmStyle = window.getComputedStyle(insetElm);
      isInsetDisabled = insetElmStyle.display === "none";
      return {
        fixedElm: fixedElm,
        insetElm: insetElm,
      };
    },
    readStatus: function () {
      //开关状态不再根据类名读取，根据宽度读取
      if (isInsetDisabled) {
        // Disabled
      } else {
        console.log("显示");
        var insetElmStyle = window.getComputedStyle(insetElm);
        var insetWidth = parseInt(insetElmStyle.width);
        if (insetWidth > navSidebar_s_w) {
          isInsetOn = true;
        }
        isInsetOff = !isInsetOn;
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
      var mainElm = document.getElementById("js-nav-sidebar-main");
      mainElm.style.paddingLeft = navSidebar_w + "px";
      return mainElm.style.paddingLeft;
    },
    htmlOff: function () {
      var mainElm = document.getElementById("js-nav-sidebar-main");
      mainElm.style.paddingLeft = navSidebar_s_w + "px";
      return mainElm.style.paddingLeft;
    },
  };

  //侦测当行类型
  utils.readType();

  // 读取当前状态
  utils.readStatus();

  // 执行切换
  if (isInsetDisabled) {
    type = sidebarTypeList[1];
  }

  if (type === sidebarTypeList[0]) {
    if (isInsetOff) {
      utils.inset_on();
      utils.htmlOn();
    } else {
      utils.inset_off();
      utils.htmlOff();
    }
  }

  if (type === sidebarTypeList[1]) {
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

// 切换开关
function navSidebarSwitch() {
  var winW = document.body.clientWidth;
  var window_w = 1320; //宽窄模式自动切换临界点
  if (winW - window_w > 0) {
    console.log("嵌入式切换开始");
    navSidebarMethod("inset", function (param) {
      global_navSidebar_inset = param.inset;
    });
  } else {
    console.log("浮动式切换开始");
    navSidebarMethod("fixed");
  }
  // 默认嵌入式展开收起
  // 如果宽度小于 1320 , 则默认为浮动式
  // 如果不存在嵌入式，则为浮动式展开收起
}

// $(function(){
// navSidebarInitialize();
// function navSidebarInitialize() {
//   var navSidebarInitialize_main = function main() {
//     var winW = document.body.clientWidth;
//     var window_w = 1320; //宽窄模式自动切换临界点
//     var method = navSidebarMethod(null);
//     if (!global_navSidebar_inset) {
//       return;
//     }
//     if (winW - window_w > 0) {
//       method.inset_on();
//       method.htmlOn();
//     } else {
//       method.inset_off();
//       method.htmlOff();
//     }
//   };
//   navSidebarInitialize_main();
//   window.onresize = navSidebarInitialize_main;
// }
// })
