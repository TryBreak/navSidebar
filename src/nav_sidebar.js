//本次切换状态存储：
//true 为宽模式和js未掌控状态 ，false 为窄模式和js已掌控状态
window.navSidebarControlState = true;

window.tapNavBar = {};

window.tapNavBar.sidebarMethod = function (status_str, callback) {
  /*
    @status_str:"inset" || "fixed"
    @callback:Function({
      fixed: Boolean,
      inset: Boolean,
    })
  */
  // 存在对应 class 则表示是对应状态 , 默认都不存在

  var utils = {
    sidebarTypeList: ["inset", "fixed"],
    transitionTime: 200,

    navSidebar_w: 240,
    navSidebar_s_w: 72,

    type: null,

    fixedElm: null,
    insetElm: null,

    isInsetOn: null,
    isInsetDisabled: null,

    isFixedOn: null,

    status_list_class: {
      inset_off: "nav_sidebar-narrow",
      inset_on: "nav_sidebar-wide",
      fixed_off: "nav_sidebar-hidden",
      fixed_on: "nav_sidebar-show",
      boxCSSMedia: "nav-sidebar",
      boxJSMedia: "js-nav-sidebar",
    },
    readType: function () {
      if (status_str === this.sidebarTypeList[0]) {
        this.type = this.sidebarTypeList[0];
      }
      if (status_str === this.sidebarTypeList[1]) {
        this.type = this.sidebarTypeList[1];
      }
      this.getElm();
      return this.type;
    },
    getElm: function () {
      this.insetElm = document.getElementById("js-nav-sidebar-inset");
      this.fixedElm = document.getElementById("js-nav-sidebar-fixed");
      insetElmStyle = window.getComputedStyle(this.insetElm);
      this.isInsetDisabled = insetElmStyle.display === "none";
      return {
        fixedElm: this.fixedElm,
        insetElm: this.insetElm,
      };
    },
    readStatus: function () {
      //开关状态不再根据类名读取，根据宽度读取
      if (this.isInsetDisabled) {
        // Disabled
      } else {
        var insetElmStyle = window.getComputedStyle(this.insetElm);
        var insetWidth = parseInt(insetElmStyle.width);
        if (insetWidth > this.navSidebar_s_w) {
          this.isInsetOn = true;
        } else {
          this.isInsetOn = false;
        }
      }

      var fixedOff = !this.fixedElm.classList.contains(
        this.status_list_class.fixed_on
      );
      var fixedOn = !this.fixedElm.classList.contains(
        this.status_list_class.fixed_off
      );

      //浮动式默认为关闭状态
      if (fixedOn) {
        this.isFixedOn = true;
      } else {
        this.isFixedOn = false;
      }
      if (fixedOff && fixedOn) {
        this.isFixedOn = false;
      }

      return {
        isInsetOn: this.isInsetOn,
        isFixedOn: this.isFixedOn,
      };
    },
    disabledCSSMedia: function () {
      var boxElm = document.getElementById("js-nav-sidebar");
      boxElm.classList.remove(this.status_list_class.boxCSSMedia);
      boxElm.classList.add(this.status_list_class.boxJSMedia);
    },
    inset_off: function () {
      if (!this.insetElm) {
        return null;
      }
      this.disabledCSSMedia();
      this.insetElm.classList.remove(this.status_list_class.inset_on);
      this.insetElm.classList.add(this.status_list_class.inset_off);
      return this.inform();
    },
    inset_on: function () {
      if (!this.insetElm) {
        return null;
      }
      this.disabledCSSMedia();
      this.insetElm.classList.remove(this.status_list_class.inset_off);
      this.insetElm.classList.add(this.status_list_class.inset_on);
      return this.inform();
    },
    fixed_off: function () {
      var _this = this;
      this.fixedElm.classList.remove(this.status_list_class.fixed_on);
      this.fixedElm.classList.add(this.status_list_class.fixed_off);
      setTimeout(function () {
        _this.fixedElm.style.display = "none";
        _this.inform();
      }, this.transitionTime);
      return "fixed_off";
    },
    fixed_on: function () {
      var _this = this;
      this.fixedElm.style.display = "block";
      setTimeout(function () {
        _this.fixedElm.classList.remove(_this.status_list_class.fixed_off);
        _this.fixedElm.classList.add(_this.status_list_class.fixed_on);
        _this.inform();
      }, 100);
      return "fixed_on";
    },
    mainOn: function () {
      var mainElm = document.getElementById("js-nav-sidebar-main");
      mainElm.style.paddingLeft = this.navSidebar_w + "px";
      return mainElm.style.paddingLeft;
    },
    mainOff: function () {
      var mainElm = document.getElementById("js-nav-sidebar-main");
      mainElm.style.paddingLeft = this.navSidebar_s_w + "px";
      return mainElm.style.paddingLeft;
    },
    inform: function () {
      //读取当前状态并输出
      utils.readStatus();
      var param = {
        fixed: this.isFixedOn,
        inset: this.isInsetOn,
      };
      callback && callback(param);
      return param;
    },
  };

  if (status_str) {
    //侦测当行类型
    utils.readType();
    // 读取当前状态
    utils.readStatus();
  }

  // 执行切换
  if (utils.isInsetDisabled) {
    utils.type = utils.sidebarTypeList[1];
  }

  if (utils.type === utils.sidebarTypeList[0]) {
    if (utils.isInsetOn) {
      utils.inset_off();
      utils.mainOff();
    } else {
      utils.inset_on();
      utils.mainOn();
    }
  }

  if (utils.type === utils.sidebarTypeList[1]) {
    if (utils.isFixedOn) {
      utils.fixed_off();
    } else {
      utils.fixed_on();
    }
  }

  return utils;
};

// 切换开关
window.tapNavBar.sidebarSwitch = function () {
  var winW = document.body.clientWidth;
  var window_w = 1320; //宽窄模式自动切换临界点
  if (winW - window_w > 0) {
    window.tapNavBar.sidebarMethod("inset", function (param) {
      window.navSidebarControlState = param.inset;
    });
  } else {
    window.tapNavBar.sidebarMethod("fixed");
  }
  window.tapNavBar.sidebarInitialize();
};

window.tapNavBar.sidebarInitialize = function () {
  window.removeEventListener("resize", resizeFun);
  var navSidebarInitialize_main = function () {
    var winW = document.body.clientWidth;
    var window_w = 1320; //宽窄模式自动切换临界点

    var method = window.tapNavBar.sidebarMethod(null);
    method.getElm();
    // 这里需要保留一下手动操作过的痕迹
    var isInsetOn = method.readStatus().isInsetOn;
    if (winW < window_w) {
      if (isInsetOn) {
        method.inset_off();
        method.mainOff();
      }
    } else {
      if (!isInsetOn) {
        method.inset_on();
        method.mainOn();
      }
    }
  };
  window.addEventListener("resize", resizeFun, false);

  function resizeFun() {
    if (window.navSidebarControlState) {
      navSidebarInitialize_main();
    }
  }
};
