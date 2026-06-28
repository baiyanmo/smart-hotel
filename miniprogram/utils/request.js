const BASE_URL = 'http://localhost:8000';
// 正式环境改为你的云服务器地址
// const BASE_URL = 'https://your-server.com';

module.exports = {
  BASE_URL,
  request(options) {
    const app = getApp();
    const token = app.globalData.token;

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.header || {}),
        },
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
            return;
          }
          if (res.statusCode === 401) {
            app.clearSession();
          }
          reject(new Error(res.data?.message || res.data?.detail || '请求失败'));
        },
        fail(err) {
          reject(new Error(err.errMsg || '网络异常'));
        },
      });
    });
  },

  uploadFile(filePath) {
    const app = getApp();
    const token = app.globalData.token;

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${BASE_URL}/asr`,
        filePath,
        name: 'audio',
        header: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        success(res) {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch {
            reject(new Error('解析失败'));
          }
        },
        fail(err) {
          reject(new Error(err.errMsg || '上传失败'));
        },
      });
    });
  },
};
