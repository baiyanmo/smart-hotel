const { request } = require('../../utils/request');

Page({
  data: {
    weather: null,
    welcomeText: '欢迎回来',
  },

  onShow() {
    if (!getApp().isLoggedIn()) {
      getApp().navigateToLogin('/pages/home/index');
      return;
    }
    this.loadWeather();
  },

  async loadWeather() {
    try {
      const res = await request({
        url: '/chat',
        method: 'POST',
        data: { message: '查询深圳天气' },
      });
      if (res.weather_data) {
        this.setData({ weather: res.weather_data });
      }
    } catch {}
  },

  goChat() {
    wx.navigateTo({ url: '/pages/chat/index' });
  },

  goRooms() {
    wx.switchTab({ url: '/pages/rooms/index' });
  },

  goOrders() {
    wx.switchTab({ url: '/pages/orders/index' });
  },
});
