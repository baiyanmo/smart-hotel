const { request } = require('../../utils/request');

Page({
  data: {
    rooms: [],
    types: ['全部', 'standard', 'deluxe', 'suite', 'presidential'],
    typeLabels: ['全部', '标准', '豪华', '套房', '总统'],
    currentType: '',
  },

  onShow() {
    if (!getApp().isLoggedIn()) {
      getApp().navigateToLogin('/pages/rooms/index');
      return;
    }
    this.loadRooms();
  },

  async loadRooms() {
    const { currentType } = this.data;
    try {
      const res = await request({
        url: '/rooms',
        data: {
          room_type: currentType || undefined,
          status: 'available',
        },
      });
      this.setData({ rooms: res.items || [] });
    } catch {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onFilter(e) {
    const idx = e.currentTarget.dataset.index;
    const type = idx === 0 ? '' : this.data.types[idx];
    this.setData({ currentType: type }, () => this.loadRooms());
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/room-detail/index?id=${id}` });
  },
});
