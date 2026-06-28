const { request } = require('../../utils/request');

Page({
  data: { orders: [] },

  onShow() {
    if (!getApp().isLoggedIn()) return getApp().navigateToLogin('/pages/orders/index');
    this.loadOrders();
  },

  async loadOrders() {
    try {
      const res = await request({ url: '/orders' });
      this.setData({ orders: res.items || [] });
    } catch { wx.showToast({ title: '加载失败', icon: 'none' }); }
  },

  getStatusText(status) {
    const map = { pending:'待确认', confirmed:'已确认', checked_in:'已入住', completed:'已完成', cancelled:'已取消' };
    return map[status] || status;
  },

  async onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消预订',
      content: '确定要取消这个预订吗？',
      success: async (r) => {
        if (!r.confirm) return;
        try {
          await request({ url: `/orders/${id}/status?status=cancelled`, method:'PUT' });
          wx.showToast({ title:'已取消', icon:'success' });
          this.loadOrders();
        } catch (err) { wx.showToast({ title:'取消失败', icon:'none' }); }
      },
    });
  },
});
