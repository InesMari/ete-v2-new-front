import enumData from "@/page/pt/enum";

export default {
  name: 'workInfo',
  props:{workInfo:{type: Array}},
  data() {
    return {
      // workInfo: [],
      tmpWorkInfo:[],
      mergeWorkDialogShow: false,
      workDialogShow:false,
      mergeWorkList: [],
      pickerOptions:{
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      workOrderShow:true,
      workDateDisabled:false,
      linkmanNameDisabled:false,
      billDisabled:false,
      phoneDisabled:false,

    }
  },
  mounted(){
  },
  components: {
  },
  methods: {
    initDisabled(waybillState){
      if(waybillState==enumData.waybillState.finished){
        this.workOrderShow=false;
        this.workDateDisabled=true;
        this.linkmanNameDisabled=false;
        this.billDisabled=false;
        this.phoneDisabled=false;
      }
    },
    //处理作业点 从库存单列表传过来
    init(workInfo){
      if(this.workInfo&&this.workInfo.length==0){
        this.workInfo = [];
        let map = new Map();
        //作业点合并，workId相同就合并
        for (let i = 0; i < workInfo.length; i++) {
          if(map.get(i)){
            continue;
          }
          map.set(i,i);
          workInfo[i].mergeWorkList=[];
          if(workInfo[i].workType==1){
            workInfo[i].workTypeName = '提';
          }else if(workInfo[i].workType==2){
            workInfo[i].workTypeName = '卸';
          }
          for (let j = i+1; j < workInfo.length; j++) {
            if(map.get(j)){
              continue;
            }
            if(workInfo[i].workId==workInfo[j].workId){
              if(workInfo[i].mergeWorkList.length==0){
                workInfo[i].mergeWorkList.push(this.common.copyObj(workInfo[i]));
              }
              workInfo[i].mergeWorkList.push(this.common.copyObj(workInfo[j]));
              map.set(j,j);
              if(workInfo[i].workType!=workInfo[j].workType){
                workInfo[i].workType = 3;
                workInfo[i].workTypeName = '提+卸';
              }
            }
          }
          workInfo[i].sort=this.workInfo.length+1;
          this.workInfo.push(workInfo[i]);
        }
      }else {
        let lastPickIdx = 0;
        //第一步删除
        let workIdMap = new Map();
        // let stockIdMap = new Map();
        for (let  i= 0; i < workInfo.length; i++) {
          workIdMap.set(workInfo[i].workId+"_"+workInfo[i].orderStockId, workInfo[i].workId);
          // stockIdMap.set(workInfo[i].orderStockId, workInfo[i].orderStockId);
        }
        for (let i = 0; i < this.workInfo.length; i++) {
          if(this.workInfo[i].mergeWorkList&&this.workInfo[i].mergeWorkList.length>0){
            for (let ii = 0; ii < this.workInfo[i].mergeWorkList.length; ii++) {
              if (!workIdMap.get(this.workInfo[i].mergeWorkList[ii].workId+"_"+this.workInfo[i].mergeWorkList[ii].orderStockId)) {
                this.workInfo[i].mergeWorkList.splice(ii, 1);
                ii--;
              }
              // if (!stockIdMap.get(this.workInfo[i].mergeWorkList[ii].orderStockId)) {
              //   this.workInfo[i].mergeWorkList.splice(ii, 1);
              //   ii--;
              // }
              //如果只剩下最后一个清除
              if(this.workInfo[i].mergeWorkList.length==1){
                this.workInfo[i].mergeWorkList.splice(ii, 1);
                ii=0;
              }
            }
          }

          if (!workIdMap.get(this.workInfo[i].workId+"_"+this.workInfo[i].orderStockId)) {
            this.workInfo.splice(i, 1);
            i--;
          }
          // if (!stockIdMap.get(this.workInfo[i].orderStockId)) {
          //   this.workInfo.splice(i, 1);
          //   i--;
          // }
        }

        //第二步 合并已经存在的点
        for (let i = 0; i < this.workInfo.length; i++) {
          if(this.workInfo[i].workType==1||this.workInfo[i].workType==3){
            lastPickIdx=i;
          }
          for (let j = 0; j < workInfo.length; j++) {
            if (this.workInfo[i].workId == workInfo[j].workId) {
              if (this.workInfo[i].orderStockId != workInfo[j].orderStockId) {
                //跟所有的合并点比较
                let flg = true;
                if(this.workInfo[i].mergeWorkList&&this.workInfo[i].mergeWorkList.length>0){
                  for (let ii = 0; ii < this.workInfo[i].mergeWorkList.length; ii++) {
                    if (this.workInfo[i].mergeWorkList[ii].workId == workInfo[j].workId
                        &&this.workInfo[i].mergeWorkList[ii].orderStockId == workInfo[j].orderStockId){
                      flg = false;
                    }
                  }
                }
                if(flg){
                  if (this.workInfo[i].mergeWorkList.length==0) {
                    this.workInfo[i].mergeWorkList = [];
                    this.workInfo[i].mergeWorkList.push(this.common.copyObj(this.workInfo[i]));
                  }
                  this.workInfo[i].mergeWorkList.push(this.common.copyObj(workInfo[j]));
                  if (this.workInfo[i].workType != workInfo[j].workType
                      && this.workInfo[i].workType != 3) {
                    this.workInfo[i].workType = 3;
                    this.workInfo[i].workTypeName = '提+卸';
                  }
                }
              }

              workInfo.splice(j, 1);
              j--;
            }
          }
        }
        //第三步 新加的点添加过来
        //还在的元素要添加进去
        let map = new Map();
        //作业点合并，workId相同就合并
        for (let i = 0; i < workInfo.length; i++) {
          if (map.get(i)) {
            continue;
          }
          map.set(i, i);
          workInfo[i].mergeWorkList = [];
          if (workInfo[i].workType == 1) {
            workInfo[i].workTypeName = '提';
          } else if (workInfo[i].workType == 2) {
            workInfo[i].workTypeName = '卸';
          }
          for (let j = i + 1; j < workInfo.length; j++) {
            if (map.get(j)) {
              continue;
            }
            if (workInfo[i].workId == workInfo[j].workId) {
              if (workInfo[i].mergeWorkList.length == 0) {
                workInfo[i].mergeWorkList.push(this.common.copyObj(workInfo[i]));
              }
              workInfo[i].mergeWorkList.push(this.common.copyObj(workInfo[j]));
              map.set(j, j);
              if (workInfo[i].workType != workInfo[j].workType) {
                workInfo[i].workType = 3;
                workInfo[i].workTypeName = '提+卸';
              }
            }
          }

          if(workInfo[i].workType!=2){
            lastPickIdx++;
            this.workInfo.splice(lastPickIdx, 0, workInfo[i]);
          }else{
            this.workInfo.push(workInfo[i]);
          }
        }


        for (let i = 0; i < this.workInfo.length; i++) {
          this.workInfo[i].sort=i+1;
        }
      }

      this.setRouteName();
      return this.workInfo.length - 2;
    },
    showMergeWorkDialog(mergeWorkList){
      if(mergeWorkList.length>0){
        this.mergeWorkDialogShow = true;
        this.mergeWorkList = mergeWorkList;
      }
    },

    getData(){
      return this.workInfo;
    },

    showWorkDialog(){
      this.tmpWorkInfo = this.common.copyObj(this.workInfo);
      this.workDialogShow=true
    },
    sortWorkInfo(){
      //报错，第一个必须是提货，最后一个必须是卸货
      let startWorkInfo=this.tmpWorkInfo[0];
      let endWorkInfo=this.tmpWorkInfo[this.tmpWorkInfo.length-1];
      for (let i = 0; i < this.tmpWorkInfo.length; i++) {
        if(startWorkInfo.sort>this.tmpWorkInfo[i].sort){
          startWorkInfo = this.tmpWorkInfo[i];
        }
        if(endWorkInfo.sort<this.tmpWorkInfo[i].sort){
          endWorkInfo = this.tmpWorkInfo[i];
        }
      }
      //判断
      if(startWorkInfo.workType!=1){
        this.$message.error("起点必须是提货");
        return;
      }
      if(endWorkInfo.workType!=2){
        this.$message.error("终点必须是卸货");
        return;
      }

      this.tmpWorkInfo.sort(function(a,b){
        return a.sort - b.sort;
      });
      this.workInfo = this.common.copyObj(this.tmpWorkInfo);
      this.workDialogShow = false;
    },

    //计算线路名称 传给另一个模块
    setRouteName(){
      let routeName = this.workInfo[0].workName+'-';
      if(this.workInfo.length>1){
        routeName += this.workInfo[this.workInfo.length-1].workName;
      }
      this.$parent.setRouteName(routeName);
    }
  },
}
