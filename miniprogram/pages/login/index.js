const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    isRegister: false,
    returnPage: '',
  },

  onLoad(options) {
    if (options.returnPage) {
      this.setData({ returnPage: decodeURIComponent(options.returnPage) });
    }
    if (app.isLoggedIn()) {
      this.goBack();
    }
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  toggleMode() {
    this.setData({ isRegister: !this.data.isRegister });
  },

  async onSubmit() {
    const { username, password, isRegister } = this.data;
    if (!username || !password) return wx.showToast({ title:'请填写完整', icon:'none' });

    const url = isRegister ? '/auth/register' : '/auth/login';
    try {
      const { request } = require('../../utils/request');
      const res = await request({ url, method:'POST', data:{ username, password } });
      app.setSession(res.access_token, res.user);
      wx.showToast({ title: isRegister ? '注册成功' : '登录成功', icon:'success' });
      setTimeout(() => this.goBack(), 1000);
    } catch (e) {
      wx.showToast({ title: e.message || '操作失败', icon:'none' });
    }
  },

  goBack() {
    const { returnPage } = this.data;
    if (returnPage) {
      wx.redirectTo({ url: decodeURIComponent(returnPage) });
    } else {
      wx.switchTab({ url:'/pages/home/index' });
    }
  },
});
