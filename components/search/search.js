// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    holderText:{
      type:String,
      value: '搜索'
    }
  },

  options: {
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchVal:'',
    isable:true
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeVal(e){
      this.setData({
        searchVal:e.detail.value
      })
    },

    searchTap(){
      let searchVal = this.data.searchVal;
      if (!searchVal || searchVal.length == 0){
        return false;
      }
      this.setData({
        searchVal:''
      })
      this.triggerEvent("searchTap",searchVal);
    }


  }
})
