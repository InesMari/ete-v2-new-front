export default {
  name: 'workNode',
  data() {
    return {
      workNodeList:[],
      workinfo:{},
      pickerOptions: {
        disabledDate(time) {
          var now = new Date();
          now.setHours(23);
          now.setMinutes(59);
          now.setSeconds(59);
          now.setMilliseconds(0)
          return time.getTime() >= now.getTime();
        }
      }
    }
  },
  mounted() {
  },

  components: {
  },
  methods: {
    init(workinfo){
      this.workinfo = workinfo;
      let that = this;
      this.common.postUrl("ordWaybillTF", "getAllWorkNode", {waybillId: workinfo.waybillId},function (data){
        if(data){
          that.workNodeList = data;
          let flag = true;
          for (let i = 0; i < that.workNodeList.length; i++) {
            let workNode = that.workNodeList[i];
            workNode.waybillNum = that.workinfo.waybillNum;
            if(workNode.opDate){
              workNode.opName='修改';
              workNode.type = 2;
              flag=true;
            }else if(flag){
              workNode.workDate = that.common.formatDate.getDateTime();
              workNode.opName='确认';
              workNode.type = 1;
              flag=false;
            }
          }
        }
      });
    },
    close(){
      this.$emit("close");
    },
    opWorkNode(item,index){
      let that = this;
      if(item.type==2){
          item.type = 1;
          item.opName='确认';
          this.$forceUpdate();
          return;
      }

      if(!item.workDate){
        that.$message.error("请选择运作时间！");
        return false;
      }
      if(index==0){
        for (let i = 1; i < this.workNodeList.length; i++) {
          if(this.workNodeList[i].workDate){
            if(new Date(item.workDate).getTime()>=new Date(this.workNodeList[i].workDate).getTime()){
              that.$message.error("接单出车运作时间不对！");
              return false;
            }
          }
        }
      }else if(index==this.workNodeList.length-1){
        for (let i = 0; i < this.workNodeList.length-1; i++) {
          if(this.workNodeList[i].workDate){
            if(new Date(item.workDate).getTime()<=new Date(this.workNodeList[i].workDate).getTime()){
              that.$message.error("收车运作时间不对！");
              return false;
            }
          }
        }
      }else{
        if(this.workNodeList[0].workDate){
          if(new Date(item.workDate).getTime()<=new Date(this.workNodeList[0].workDate).getTime()){
            that.$message.error("运作时间不能早于出车时间！");
            return false;
          }
        }

        if(this.workNodeList[this.workNodeList.length-1].workDate){
          if(new Date(item.workDate).getTime()>=new Date(this.workNodeList[this.workNodeList.length-1].workDate).getTime()){
            that.$message.error("运作时间不能晚于收车时间！");
            return false;
          }
        }
      }

      this.common.postUrl("ordWaybillTF", "opWorkNode", item,function (data){
        if(data){
          that.init(that.workinfo);
          item.type=2;
        }
      });
    }

  },
}
