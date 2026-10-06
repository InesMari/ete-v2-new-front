export default {
  name: 'todayPlanBoard',
  data() {
    return {
      tableData: [],
      dateTime: '',
      week: "",
      isFullScreen: false,
      query:{
        page:1,
        rows:999,
      },
      top:-40,
      hasNext:true,
      workName:JSON.parse(localStorage.userInfo).workName,
      workId:JSON.parse(localStorage.userInfo).workId,
      workList:[],
      refresh:30,  //刷新频率
      openTime:0,  //页面打开的总时长
    }
  },
  mounted() {
    this.query.workId = this.workId;
    this.initListener();
    this.doQuery();
    if(this.common.isNotBlank(this.workId)) this.getWorkList();
    this.setTimeInterval();
  },
  methods: {
    // 监听F11和Esc
    initListener() {
      let _this = this;
      window.addEventListener("keydown", function (event) {
        if (event.keyCode == '27') {  //Esc
          setTimeout(() => {
            _this.exitFullScreen();
          })
        } else if (event.keyCode == '122') {  //F11
          setTimeout(() => {
            _this.fullScreen();
          })
        }
      })
    },
    async getWorkList(){
      this.workList = await this.common.postUrl("wmsBaseTF", "getWorkStoreChildByWorkId",{workId:this.workId});
      this.workList.unshift({workId:-1,workName:'全部'});
    },
    // 自动滚动
    autoScroll(){
      this.top = -40;
      clearInterval(this.interval);
      let _this = this;
      let domH = this.$refs.dataDom.offsetHeight; //tbody高度
      let tableDiv = this.$refs.tableDiv;
      let divH = tableDiv.offsetHeight;
      let tableH = tableDiv.querySelector("table").offsetHeight;
      let thH = tableDiv.querySelector("thead").offsetHeight;
      let tbodySeeH = divH - thH;   //tbody可视高度
      let maxTdSum = Math.floor(tbodySeeH/thH);
      if(maxTdSum>=this.tableData.length){
        const timeout = setTimeout(() => {
          _this.doQuery(true);
          clearTimeout(timeout);
        }, Number(_this.refresh*1000));
      }else{
        this.interval = setInterval(() => {
          if(tbodySeeH + _this.top > tableH){   //滚动到全部数据的底部
            _this.doQuery(true);
            _this.top = -40;
          }else{   //滚动到当前页底部
            _this.top++;
          }
        }, 50); //定时器数值越大滚动越慢
      }
      this.$forceUpdate();
    },
    /**
     * 查询
     * clear,true时清空所有重新查询
     */
    async doQuery(clear) {
      this.isQuery = true;
      if(clear) this.query.page = 1;
      let { items,hasNext } = await this.common.postUrl("wmsOutOrderTF", "queryOutOrderKanbanPage",this.query);
      if(clear) this.tableData = [];
      this.hasNext = hasNext;
      this.tableData = [...this.tableData,...items];
      this.isQuery = false;
      this.$nextTick(()=>{
        this.autoScroll();
      })
    },
    // 获取月到分的时间
    getMonthToMin(dtStr){
      let formattedDt = dtStr.substring(5, 10) + " " + dtStr.substring(11, 16);
      return formattedDt;
    },
    // 刷新数据
    refreshChange(){
      this.doQuery(true);
      this.$forceUpdate();
    },
    // 刷新页面
    refreshPage(){      
      window.location.reload()
    },
    setTimeInterval() {
      let _this = this;
      //刷新时间
      setInterval(() => {
        let dateTime = _this.common.formatDate.getDateTime();
        dateTime = dateTime.replace("-", "年");
        dateTime = dateTime.replace("-", "月");
        dateTime = dateTime.replace(" ", "日 ");
        _this.dateTime = dateTime;
        _this.week = _this.common.formatDate.getWeek();
        _this.openTime += 500;
        // 一小时刷新一次页面
        // if(_this.openTime>3600000) _this.refreshPage();
      }, 500);
    },
    /**
     * 全屏
     */
    fullScreen() {
      this.isFullScreen = true;
      let el = document.documentElement;
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
      if (rfs) {
        rfs.call(el);
      }
      this.$forceUpdate();
    },
    // 退出全屏
    exitFullScreen() {
      this.isFullScreen = false;
      // let el = document.documentElement;
      // let cfs = el.exitFullscreen || el.mozCancelFullScreen || el.webkitExitFullscreen || el.msExitFullscreen;
      // if (cfs && document.fullscreenElement) {
      //   cfs.call(document);
      // }
      if (document.exitFullscreen) {  
        document.exitFullscreen();  
      } else if (document.mozCancelFullScreen) { /* Firefox */  
        document.mozCancelFullScreen();  
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari 和 Opera */  
        document.webkitExitFullscreen();  
      } else if (document.msExitFullscreen) { /* IE/Edge */  
        document.msExitFullscreen();  
      }  
      this.$forceUpdate();
    },
    // 切换仓库
    changeWork(){
      if(this.workId == -1){
        this.query.workId = this.workList[1].workId;
        this.query.isAll = 1;  //查全部 
      }else{
        this.query.workId = this.workId;
        this.query.isAll = undefined;
      }
      this.doQuery(true)
    }
  },
  components: {

  },
}