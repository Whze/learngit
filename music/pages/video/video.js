import request from '../../untils/request'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],  // 导航标签数据
    navId: '', // 当前点击导航的id
    videoList: [],  // 当前导航对应的视频列表
    videoId: '', // 播放视频的标识
    videoTimeUpdate: [], // 记录video播放的时长

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 调用获取导航数据方法
    this.getVideoGroupListData();
  },

  /* 
    获取导航标签数据
    1、发送请求获取数据
    2、对数据进行整理
    3、赋值到data中对应的数据
  
  */
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      // 初始化navId等于第一个导航栏的id（默认设置第一导航个为选中）
      navId: videoGroupListData.data[0].id
    })
    console.log('this.data.navId',this.data.navId)
    // 调用获取视频列表的方法
    this.getVideoListData(this.data.navId)
  },

  // 点击导航栏的回调
  changeNav(event) {
    // 通过data-id向event传参接收到被点击的导航id
    let navId = event.currentTarget.dataset.id;
    this.setData({
      navId: navId>>>0,
      videoList: []
    })

    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    });
    // 调用获取视频列表的方法
    this.getVideoListData(this.data.navId)
  },

  /* 
    获取当前导航id对应的视频列表 
    根据传入的navId参数发起请求获得视频列表并赋值
  */
 async getVideoListData(navId) {
  if(!navId) {
    return;
  }
  let videoListData = await request('/video/group', {id: navId});
  // 关闭提示框
  wx.hideLoading();
    

  // 给数组中赋唯一标识值（key）
  let index = 0;
  let videoList = videoListData.datas.map(item => {
    item.id = index++;
    return item;
  })

  this.setData({
    videoList
  })
 },

  //  点击播放的回调
  handlePlay(event) {
    let vid = event.currentTarget.id
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid);
    
    // 播放时判断该id的视频是否在之前播放过,是则跳转到上次播放的时间
    let {videoTimeUpdate} = this.data;
    let videoItem = videoTimeUpdate.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
      
  },

  /* 
    监听视频进度的回调
    存放当前播放的id和进度
    存放方式:
    根据event创建一个播放对象,存放id和进度
    判断该对象是否已经在videoTimeUpdate数组中,是则更新进度,否则存放进数组
  */
  handleTimeOutUpdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    let {videoTimeUpdate} = this.data;
    let videoItem = videoTimeUpdate.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) {  // 数组中存在
      videoItem.currentTime = event.detail.currentTime;
    } else {
      videoTimeUpdate.push(videoTimeObj);
    }
    this.setData({
      videoTimeUpdate
    })
  },

  
  /* 
    播放完的回调
    作用:
    播放完监听视频的回调会把进度保存在最后,每次播放都会在最后.播放完后要清除videoTimeUpdate中的该对象
  */
  handleEnded(event) {
    let {videoTimeUpdate} = this.data;
    videoTimeUpdate.splice(videoTimeUpdate.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoTimeUpdate
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