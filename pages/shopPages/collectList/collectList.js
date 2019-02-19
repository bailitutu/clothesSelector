var app = getApp();
var Charts = require('../../../utils/wxcharts-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1, //1：成交率；2：热卖款式
    list: [], //热卖款式数组
    timeList: [], //时间列表
    peopleList: [],//人流量数组
    peoNoData: true, //人流量为空
    rateNoData: true, //成交率为空
    rateList: [], //成交率数组
    hotNoData: true, //是否有热卖款式；
    busId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      busId:options.busId
    })
    this.topTab = this.selectComponent("#topTab");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRateData();
  },
  // 顶部切换
  tabTap() {
    const { current } = this.topTab.data;
    this.setData({
      current: current,
    })
    if (current == 2) {

      this.getPageData();
    }
  },

  getRateData() {
    const { busId } = this.data;
    app.getPageData('/business/turnoverDay', {
      busId:busId
    }, (res) => {

      if (res.peopleList.length == 0 || !res.peopleList) {
        peoNoData = true
      } else {
        peoNoData = false
      }
      if (res.rateList.length == 0 || !res.rateList) {
        rateNoData = true
      } else {
        rateNoData = false
      }

      this.setData({
        timeList: res.timeList,
        peopleList: res.peopleList,
        rateList: res.rateList
      })
      this.chart();
    })
  },

  // 绘制人流量和成绩率图
  chart() {
    const { timeList, peopleList, rateList } = this.data;
    let peoMax = 100;

    peopleList.map((item) => {
      if (item > peoMax) {
        peoMax = item;
      }
    })

    let query = wx.createSelectorQuery();
    query.select('#peoCanvas').boundingClientRect(function (rect) {
      // 绘制时段人流量图
      new Charts({
        canvasId: 'peoCanvas',
        type: 'column',
        categories: timeList,
        series: [{
          name: '人流量',
          data: peopleList,
          color: '#03a863'
        }],
        yAxis: {
          title: '人流量',
          min: 0,
          max: peoMax,
          format: function (val) {
            return val + '人';
          }
        },
        width: rect.width,
        height: rect.height,
        legend: false
      });

      // 绘制成交率
      new Charts({
        canvasId: 'rateCanvas',
        type: 'column',
        categories: timeList,
        series: [{
          name: '成交率',
          data: rateList,
          color: '#03a863'
        }],
        yAxis: {
          min: 0,
          max: 100,
          title: '成交率',
          format: function (val) {
            return val + '%';
          }
        },
        width: rect.width,
        height: rect.height,
        legend: false
      });

    }).exec();
  },
  // 获取款式信息
  getPageData() {
    wx.showNavigationBarLoading();
    const { busId } = this.data;
    app.getPageData('/business/ReportsHot', {
       busId:busId
    }, (res) => {
      let list = [];
      if (res.list.length == 0 || !res.list) {
        this.setData({
          hotNoData: true,
          list: list,
        })
      } else {
        this.setData({
          hotNoData: false,
          list: res.list,
        })
        this.chartHot();
      }
      wx.hideNavigationBarLoading();
    })

  },
  // 绘制饼图
  chartHot() {
    const { list } = this.data;
    let dataList = [];

    list.map((item) => {
      dataList.push({
        name: item.styleName,
        data: Number(item.percent),
        color: item.styleColor
      })
    })

    let query = wx.createSelectorQuery();
    query.select('#hotCanvas').boundingClientRect(function (res) {
      new Charts({
        canvasId: 'hotCanvas',
        type: 'pie',
        series: dataList,
        width: res.width,
        height: res.height,
        dataLabel: true,
        legend: false
      })
    }).exec();
  }

})