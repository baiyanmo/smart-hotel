const app = getApp();

Page({
  data: { userInfo: null },

  onShow() {
    if (!app.isLoggedIn()) return app.navigateToLogin('/pages/me/index');
    this.setData({ userInfo: app.globalData.userInfo });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (r) => {
        if (r.confirm) {
          app.clearSession();
          wx.reLaunch({ url: '/pages/login/index' });
        }
      },
    });
  },
});
