import request from '../../untils/request'

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    recommendList: [],  //推荐歌曲数据
    topList: [],  //排行榜数据
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner',{type: 2})
    this.setData({
      bannerList: bannerListData.banners,
    })
        
    // 获取推荐数据
    let recommendListData = await request('/personalized',{limit: 10})
    this.setData({
      recommendList: recommendListData.result,
    })

    // 获取排行榜数据
    /*
      需要获取5次,每次获取后添加进toplist
    */ 
    let topIndex = 0
    let topArr = []
    while(topIndex < 5) {
      let topListData = await request('/top/list', {idx: topIndex++})
      // 请求后将数据整理
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3)}
      topArr.push(topListItem)
      this.setData({
        topList: topArr
      })

    }
  },

  // 点击跳转每日推荐页
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
    });
      
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