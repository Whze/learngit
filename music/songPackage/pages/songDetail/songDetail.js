import request from '../../../untils/request'
import moment from 'moment'
import PubSub from 'pubsub-js'
// songPackage/pages/songDetail/songDetail.js
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情
    musicId: '', // 当前的音乐id
    musicLink: '', // 音乐链接
    currentTime: '00:00', // 当前播放时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实施进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    /* 
      接收路由跳转传递的query参数
      通过传递过来的歌曲id来获取歌曲详情
    */
   let musicId = options.musicId;
   this.setData({
    musicId
   })
  //  获取音乐详情
  this.getMusicInfo(musicId)

  /* 
    通过背景音乐实例控制音乐播放
  */

  //  创建控制音乐播放实例
  this.backgroundAudioManager = wx.getBackgroundAudioManager();
  // 监听音乐播放/暂停/停止
  this.backgroundAudioManager.onPlay(() => {
    this.changePlayState(true);
    appInstance.globalData.musicId = musicId;
  })
  this.backgroundAudioManager.onPause(() => {
    this.changePlayState(false);
  })
  this.backgroundAudioManager.onStop(() => {
    this.changePlayState(false);
  })
  
  // 监听音乐自然播放结束
  this.backgroundAudioManager.onEnded(() => {
    this.setData({
      currentWidth: '0',
      currentTime: '00:00'
    })
  })

  // 监听音乐播放的时长
  this.backgroundAudioManager.onTimeUpdate(() => {
    // 格式化播放的实时时长
    let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
    // 计算小圆点该移动的距离
    let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
    this.setData({
      currentTime,
      currentWidth
    })
  })
  },

  // 获取音乐详情的函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })

    // 修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    });
  },

  // 视频播放按钮回调函数
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  // 控制音乐播放的函数
  /* 
    音乐播放：
    无音乐链接则获取音乐链接
    不在播放：
    暂停音乐    
  */
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request('/song/url', {id: musicId});
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      // 给音乐实例添加src后会自动播放
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    }else { // 暂停音乐
      this.backgroundAudioManager.pause()
    }
  },

  // 改变播放状态的函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay;
  },

  // 点击切歌的回调
  /* 
    订阅一个消息：
    接收music参数用来播放音乐————music参数由recommendSong页面来发送，该参数来自rS页面的musicList参数。music参数本是由点击切换路由传递的参数，切换歌曲时无法从此渠道接收
    发布一个消息：
    把上一首/下一首选项传递给rS页面
  */
  handleSwitch(event) {
    console.log('handleSwitch')
    // 获取切歌类型
    let type = event.currentTarget.id;

    // 关闭当前音乐
    this.backgroundAudioManager.stop();
    // 订阅消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 根据musicId 获取音乐详情
      this.getMusicInfo(musicId);
      // 自动播放当前音乐
      this.musicControl(true, musicId);
      // 取消订阅
      PubSub.unsubscribe('musicId');
    })
    // 发布消息给rS页面
    PubSub.publish('switchType', type)
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