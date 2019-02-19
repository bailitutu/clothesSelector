// components/sizeList/sizeList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cell:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    cell:{},
    total:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTap(){
      const { isShow ,cell} = this.data;
      this.setData({
        isShow:!isShow
      })
    },
  },
  attached: function () { 
    let {cell,total} = this.data;
    cell.sizeList.map((item) => {
      total += Number(item.num)
    })
    this.setData({
      total : total
    })
  },

})
