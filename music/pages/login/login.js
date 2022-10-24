import request from '../../untils/request'

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',  // 手机号
    password: '', //登录密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  handleInput(event) {
    let type = event.currentTarget.dataset.type; // 获取触发事件的是哪个输入栏
    // 将当前输入栏的数据绑定到定义好的数据中
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录的回调
  async login() {
    // 1. 收集表单项数据
    let {phone, password} = this.data
    console.log('phone',phone)
    // 2. 前端验证
    /*
    * 手机号验证：
    *   1. 内容为空
    *   2. 手机号格式不正确
    *   3. 手机号格式正确，验证通过
    * */
   if (!phone) {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
    })
      return;
   }
  //  定义正则表达式
  let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  if (!phoneReg.test(phone)) {
    wx.showToast({
      title: '手机号格式错误',
      icon: 'none'
    })
    return;
  }
  if (!password) {
    wx.showToast({
      title: '密码不能为空',
      icon: 'none'
    })
    return;
  }

  // 后端验证
  let result = await request('/login/cellphone', {phone, password, isLogin: true})
  console.log(result.code)
  if (result.code === 200) {  // 登陆成功
    wx.showToast({
      title: '登录成功'
    })
    
    // 将用户信息储存到本地
    wx.setStorageSync('userInfo', JSON.stringify(result.profile));
    wx.reLaunch({
      url: '/pages/personal/personal',
    });
      
  } else if(result.code === 400){
    wx.showToast({
      title: '手机号错误'
    })
  } else if (result.code === 502) {
    wx.showToast({
      title: '密码错误'
    })
  } else {
    wx.showToast({
      title: '登录失败，请重新登录'
    })
  }
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