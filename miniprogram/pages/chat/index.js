const { request } = require('../../utils/request');

Page({
  data: {
    message: '',
    messages: [],
    isRecording: false,
    recordingText: '按住说话',
  },

  onLoad() {
    // AI 管家开场白
    this.addMessage('ai', '欢迎来到智慧酒店！我是您的 AI 管家，有什么可以帮您的吗？');
  },

  onInput(e) {
    this.setData({ message: e.detail.value });
  },

  async onSend() {
    const { message } = this.data;
    if (!message.trim()) return;

    this.addMessage('user', message);
    this.setData({ message: '' });

    try {
      const res = await request({
        url: '/chat',
        method: 'POST',
        data: { message },
      });
      this.addMessage('ai', res.reply);
    } catch (e) {
      wx.showToast({ title: e.message || 'AI 服务异常', icon: 'none' });
    }
  },

  // 语音录制（使用微信原生语音 → 腾讯云内置识别，免费）
  onStartRecord() {
    this.setData({ isRecording: true, recordingText: '松开结束' });
    const recorder = wx.getRecorderManager();

    recorder.onStop((res) => {
      this.setData({ isRecording: false, recordingText: '按住说话' });

      // 微信内置语音识别插件（免费）
      const plugin = requirePlugin('WechatSI');
      const manager = plugin.getRecordRecognitionManager();
      manager.start({
        duration: 60000,
        lang: 'zh_CN',
      });

      manager.onRecognize = (result) => {
        // 实时识别结果
        this.setData({ message: result });
      };

      manager.onStop = (result) => {
        if (result && result.length > 0) {
          this.setData({ message: result });
          this.onSend();
        } else {
          wx.showToast({ title: '未识别到语音', icon: 'none' });
        }
      };

      manager.onError = () => {
        wx.hideLoading();
        wx.showToast({ title: '语音识别失败', icon: 'none' });
      };
    });

    recorder.start({
      duration: 60000,
      sampleRate: 16000,
      format: 'mp3',
    });

    this._recorder = recorder;
  },

  onEndRecord() {
    this.setData({ isRecording: false, recordingText: '按住说话' });
    if (this._recorder) {
      this._recorder.stop();
    }
  },

  addMessage(role, content) {
    const messages = [...this.data.messages, {
      role,
      content,
      time: new Date().toLocaleTimeString(),
    }];
    this.setData({ messages });
    this.scrollToBottom();
  },

  scrollToBottom() {
    wx.createSelectorQuery()
      .select('#chatList')
      .boundingClientRect()
      .exec(() => {
        wx.pageScrollTo({ scrollTop: 99999, duration: 300 });
      });
  },
});
