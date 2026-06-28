App({
  globalData: {
    apiBase: 'http://localhost:8000',
    token: '',
    userInfo: null,
  },

  onLaunch() {
    // 恢复登录态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  setSession(token, userInfo) {
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
  },

  clearSession() {
    this.globalData.token = '';
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  isLoggedIn() {
    return !!this.globalData.token;
  },

  navigateToLogin(returnPage) {
    const url = returnPage
      ? `/pages/login/index?returnPage=${encodeURIComponent(returnPage)}`
      : '/pages/login/index';
    wx.navigateTo({ url });
  },
});
