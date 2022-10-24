import request from '../../../untils/request'
import PubSub from 'pubsub-js'
// songPackage/pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    musicList: [],  // 音乐列表
    index: 0, // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    /* 
      判断用户是否登录
      已经登录则获取歌曲列表
      未登录则跳转到登录页
    */
   let userInfo = wx.getStorageSync('userInfo');
   if (!userInfo) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      success: () => {
        wx.reLaunch({
          url: '/pages/login/login',
        });
      }
    });
  }
  // 更新日期
  this.setData({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1 
  })
  // 获取音乐列表
  this.getMusicList()

  /* 
    订阅一个消息：
    接收来自songDetail页面的切歌类型，从而确定musicId
    发送一个消息：
    发送musicId给sD页面播放歌曲
  */

  // 订阅消息
  PubSub.subscribe('switchType', (msg, type) => {
    let {musicList, index} = this.data;
    if (type === 'pre') { // 上一首
      (index === 0) && (index = musicList.length);
      index -= 1;
    } else {  // 下一首
      (index === musicList.length - 1) && (index = -1)
      index += 1;
    }
    // 更新下标
    this.setData({
      index
    })
    
    let musicId = musicList[index].id;
    // 发送消息
    PubSub.publish('musicId', musicId)
  })
  },

  // 点击歌曲跳转到歌曲详情
  /* 
    传递参数：
    歌曲id
    当前歌曲下标
  */
  toSongDetail(event) {
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id,
    });
  },

  // 获取音乐列表函数
  async getMusicList() {
    let musicListData = await request('/recommend/songs');
    this.setData({
      musicList: musicListData.recommend
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})