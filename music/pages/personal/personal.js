import request from '../../untils/request'

// pages/personal/personal.js
let startY = 0;
let moveY = 0;
let moveDistance = 0;

Page({

  
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: []  // 用户播放记录
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取用户基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) { // 用户登录
      // 更新用户信息
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      
      // 更新用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
      
  },

  // 获取用户播放记录功能函数
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', {uid: userId, type: 0});
    let index = 0;
    let recentPlayList = recentPlayListData.allData.map(item => {
      item.id = index++
      return item;
    })
    this.setData({
      recentPlayList
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
      
  },
  
  /*
    实现窗口拉取移动业务：
    1、创建三个变量用于函数体，手指起始坐标startY、移动坐标moveY、移动距离moveDistance
    2、start函数用来读取并赋值起始坐标
    3、move函数读取移动坐标，计算出移动距离，并限制移动范围。并让窗口进行移动
    4、end函数 实现让窗口返回初始位置，并添加动画
  */

    handleTouchStart(event) {
      this.setData({
        coverTransition: ''
      })
      startY = event.touches[0].clientY;
    },
    handleTouchMove(event) {
      moveY = event.touches[0].clientY;
      moveDistance = moveY - startY;
      if (moveDistance < 0 ) {
        return
      } else if( moveDistance >=80 ) {
        moveDistance = 80;
      }
      this.setData({
        coverTransform: `translateY(${moveDistance}rpx)`
      })
    },
    handleTouchEnd() {
      this.setData({
        coverTransform: `translateY(0rpx)`,
        coverTransition: `transform 1s linear`
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