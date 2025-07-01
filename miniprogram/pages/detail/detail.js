// pages/detail/detail.js
Page({
  data: {
    date: '',
    time: '',
    summary: '',
    content: ''
  },

  onLoad(options) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data));
      const date = new Date(data.timestamp);
      
      // 格式化日期和时间
      const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const formatTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

      this.setData({
        date: formatDate,
        time: formatTime,
        summary: data.summary,
        content: data.prompt
      });
    } catch (error) {
      console.error('解析数据失败:', error);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },

  copyContent() {
    wx.setClipboardData({
      data: this.data.content,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
});