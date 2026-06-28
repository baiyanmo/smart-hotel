const { request } = require('../../utils/request');

Page({
  data: {
    room: null,
    checkInDate: '',
    checkOutDate: '',
    guestName: '',
    guestPhone: '',
    days: 0,
    totalPrice: 0,
  },

  onLoad(options) {
    const id = options.id;
    this.loadRoom(id);
  },

  async loadRoom(id) {
    try {
      const room = await request({ url: `/rooms/${id}` });
      this.setData({ room });
    } catch {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onCheckInChange(e) { this.setData({ checkInDate: e.detail.value }, this.calcPrice); },
  onCheckOutChange(e) { this.setData({ checkOutDate: e.detail.value }, this.calcPrice); },

  calcPrice() {
    const { checkInDate, checkOutDate, room } = this.data;
    if (!checkInDate || !checkOutDate || !room) return;
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const days = Math.max(1, (d2 - d1) / (1000 * 60 * 60 * 24));
    this.setData({ days, totalPrice: days * room.price });
  },

  async onSubmit() {
    const { room, checkInDate, checkOutDate, guestName, guestPhone } = this.data;
    if (!checkInDate || !checkOutDate) return wx.showToast({ title: '请选择日期', icon: 'none' });

    try {
      await request({
        url: '/orders',
        method: 'POST',
        data: {
          room_id: room.id,
          check_in: new Date(checkInDate).toISOString(),
          check_out: new Date(checkOutDate).toISOString(),
          guest_name: guestName,
          guest_phone: guestPhone,
        },
      });
      wx.showToast({ title: '预订成功', icon: 'success' });
      setTimeout(() => wx.switchTab({ url: '/pages/orders/index' }), 1500);
    } catch (e) {
      wx.showToast({ title: e.message || '预订失败', icon: 'none' });
    }
  },
});
