// components/selectCompo/selectCompo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0
    },
    isShow:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:''
    },
    val: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    index:0,
    data:[],
    val:''
  },


  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function (e) {
      let { data} = this.data;
      this.setData({
        isShow:true,
        index: e.detail.value,
        val: data[e.detail.value]
      })

      this.triggerEvent('pickerChange');
    }
  }
})
