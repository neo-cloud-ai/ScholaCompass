Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    const history = wx.getStorageSync('analysisHistory') || [];
    this.setData({
      historyList: history.map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString(),
        time: new Date(item.timestamp).toLocaleTimeString()
      })).reverse() // 最新的记录显示在最上面
    });
  },

  viewHistory(e) {
    const index = e.currentTarget.dataset.index;
    const selected = this.data.historyList[index]; // 直接使用已排序的列表
    
    wx.navigateTo({
      url: `/pages/detail/detail?data=${encodeURIComponent(JSON.stringify(selected))}`
    });
  },

  onPullDownRefresh() {
    this.loadHistory();
    wx.stopPullDownRefresh();
  }
});