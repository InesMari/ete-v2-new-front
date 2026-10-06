import $echarts from 'echarts';

export default {
  name: 'orderBoard',
  data() {
    return {
      scheduledList:[],
      operation:{list:[]},
      totalData:{},
      stateList: [], // 订单状态统计数据
      dateTime: '',
      week: "",
      isFullScreen: false,
      refresh:60,  //刷新频率，单位秒
      openTime:0,  //页面打开的总时长
      pieChart: null, // 饼图实例
      pieColors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'], // 饼图颜色
      scheduledScrollTop: 0, // 待调度表格滚动位置
      operationScrollTop: 0, // 运作中表格滚动位置
      scheduledPaused: false, // 待调度表格是否暂停
      operationPaused: false, // 运作中表格是否暂停
      scheduledReset: false, // 待调度表格是否需要重置
      operationReset: false, // 运作中表格是否需要重置
      scrollInterval: null, // 滚动定时器
      refreshTimer: null, // 数据刷新定时器
      prevStateListData: null, // 上一次状态列表数据，用于变化对比
    }
  },
  mounted() {
    // this.initListener();
    this.doQuery();
    this.setTimeInterval();
    // 监听窗口大小变化，自适应图表
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
    this.disposeChart();
    this.stopScroll();
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  },
  methods: {
    // 监听F11和Esc
    initListener() {
      let _this = this;
      window.addEventListener("keydown", function (event) {
        if (event.keyCode == '27') {  //Esc
          const timer = setTimeout(() => {
            _this.exitFullScreen();
            this.clearTimeout(timer);
          })
        } else if (event.keyCode == '122') {  //F11
          const timer = setTimeout(() => {
            _this.fullScreen();
            this.clearTimeout(timer);
          })
        }
      })
    },
    /**
     * 查询
     * clear,true时清空所有重新查询
     */
    async doQuery(clear) {
      await this.queryScheduled();
      await this.queryOperation();
      await this.queryTotalData();
      
      // 定时刷新页面数据
      this.refreshData();

      this.$nextTick(() => {
        this.initTableScroll();
      });
    },
    //  查询待调度的订单
    async queryScheduled(){
      this.scheduledList = await this.common.postUrl("orderService", "queryPrepDispatchOrderListForScreen", {});
    },
    //  查询运作中的订单
    async queryOperation(){
      this.operation = await this.common.postUrl("orderService", "queryDispatchOrderListForScreen", {});
    },
    //  查询统计数据
    async queryTotalData(){
      const newData = await this.common.postUrl("orderService", "queryOrderListForScreen", {});
      // 对比数据是否变化，无变化则跳过图表重渲染
      if (this.prevStateListData && this.isStateListEqual(this.prevStateListData, newData.stateList)) {
        // 数据无变化，只更新 totalData 引用，不触发图表重绘
        this.totalData = newData;
        return;
      }
      this.totalData = newData;
      // 根据 totalData 构建状态统计数据
      this.buildStateList();
    },
    // 比较两个 stateList 数据是否相同
    isStateListEqual(prevList, newList) {
      if (!prevList || !newList) return false;
      if (prevList.length !== newList.length) return false;
      return prevList.every((item, index) => {
        const newItem = newList[index];
        return item.stateName === newItem.stateName && item.stateCount === newItem.stateCount;
      });
    },
    // 定时刷新页面数据
    refreshData(){
      // 避免重复创建定时器
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }
      this.refreshTimer = setInterval(() => {
        this.queryScheduled();
        this.queryOperation();
        this.queryTotalData();
      }, this.refresh * 1000);
    },
    // 初始化表格滚动
    initTableScroll() {
      this.stopScroll();
      this.scheduledScrollTop = 0;
      this.operationScrollTop = 0;
      this.scheduledPaused = false;
      this.operationPaused = false;
      this.scheduledReset = false;
      this.operationReset = false;

      this.$nextTick(() => {
        const scheduledBody = this.$refs.scheduledTableBody;
        const operationBody = this.$refs.operationTableBody;

        if (scheduledBody) {
          const scheduledNeedScroll = scheduledBody.scrollHeight > scheduledBody.clientHeight;
          scheduledBody.dataset.autoScroll = scheduledNeedScroll ? 'true' : 'false';
          scheduledBody.scrollTop = 0;
        }
        if (operationBody) {
          const operationNeedScroll = operationBody.scrollHeight > operationBody.clientHeight;
          operationBody.dataset.autoScroll = operationNeedScroll ? 'true' : 'false';
          operationBody.scrollTop = 0;
        }

        // 首次等待3秒后开始滚动
        const timer = setTimeout(() => {
          this.startScroll();
          clearTimeout(timer);
        }, 3000);
      });
    },
    // 启动滚动
    startScroll() {
      this.stopScroll();
      const scrollSpeed = 1; // 每帧滚动像素
      const delay = 50; // 滚动间隔(毫秒)
      const pauseDuration = 3000; // 暂停时长3秒

      this.scrollInterval = setInterval(() => {
        const scheduledBody = this.$refs.scheduledTableBody;
        const operationBody = this.$refs.operationTableBody;

        // 处理待调度表格滚动
        if (scheduledBody && scheduledBody.dataset.autoScroll === 'true') {
          if (this.scheduledPaused) {
            // 暂停中，等待恢复
          } else if (this.scheduledReset) {
            // 到达底部等待后重置
            scheduledBody.scrollTop = 0;
            this.scheduledReset = false;
            this.scheduledPaused = true;
            const timer = setTimeout(() => {
              this.scheduledPaused = false;
              clearTimeout(timer);
            }, pauseDuration);
          } else {
            scheduledBody.scrollTop += scrollSpeed;
            if (scheduledBody.scrollTop >= scheduledBody.scrollHeight - scheduledBody.clientHeight) {
              this.scheduledPaused = true;
              const timer = setTimeout(() => {
                this.scheduledPaused = false;
                this.scheduledReset = true;
              clearTimeout(timer);
              }, pauseDuration);
            }
          }
        }

        // 处理运作中表格滚动
        if (operationBody && operationBody.dataset.autoScroll === 'true') {
          if (this.operationPaused) {
            // 暂停中，等待恢复
          } else if (this.operationReset) {
            // 到达底部等待后重置
            operationBody.scrollTop = 0;
            this.operationReset = false;
            this.operationPaused = true;
            const timer = setTimeout(() => {
              this.operationPaused = false;
              clearTimeout(timer);
            }, pauseDuration);
          } else {
            operationBody.scrollTop += scrollSpeed;
            if (operationBody.scrollTop >= operationBody.scrollHeight - operationBody.clientHeight) {
              this.operationPaused = true;
              const timer = setTimeout(() => {
                this.operationPaused = false;
                this.operationReset = true;
                clearTimeout(timer);
              }, pauseDuration);
            }
          }
        }
      }, delay);
    },
    // 停止滚动
    stopScroll() {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
      }
    },
    // 构建订单状态统计数据
    buildStateList() {
      // 如果 totalData 有 stateList，直接使用；否则根据数据构建
      if (this.totalData.stateList && this.totalData.stateList.length > 0) {
        this.stateList = this.totalData.stateList;
      } else {
        // 根据实际情况构建状态数据，可根据API返回字段调整
        this.stateList = [
          { stateName: '待调度', stateCount: this.totalData.prepDispatch || 0 },
          { stateName: '待派车', stateCount: this.totalData.waitAppointVehicle || 0 },
          { stateName: '待出车', stateCount: this.totalData.waitStartVehicle || 0 },
          { stateName: '运输中', stateCount: this.totalData.inWay || 0 },
        ];
      }
      // 保存当前数据用于下次对比
      this.prevStateListData = JSON.parse(JSON.stringify(this.stateList));
      this.$nextTick(() => {
        this.initPieChart();
      });
    },
    // 初始化饼图
    initPieChart() {
      if (!this.stateList || this.stateList.length === 0) return;

      const chartDom = document.getElementById('pieChart');
      if (!chartDom) return;

      // 构建饼图数据
      const pieData = this.stateList.map(item => ({
        name: item.stateName,
        value: item.stateCount || 0
      }));

      // 如果图表实例已存在，直接更新数据即可，无需销毁重建
      if (this.pieChart) {
        this.pieChart.setOption({
          series: [{ data: pieData }]
        });
        return;
      }

      this.pieChart = $echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0, 20, 50, 0.9)',
          borderColor: '#409EFF',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          show: false // 隐藏图例，下方已有自定义汇总
        },
        color: this.pieColors,
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['0', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#0a1f4d',
              borderWidth: 3
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n{c}',
              fontSize: 12,
              color: '#fff',
              lineHeight: 18,
              padding: [0, 0, 0, 0]
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 15,
              lineStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#fff'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: pieData
          }
        ]
      };

      this.pieChart.setOption(option);
    },
    // 响应窗口大小变化
    resizeChart() {
      if (this.pieChart) {
        this.pieChart.resize();
      }
    },
    // 销毁图表实例
    disposeChart() {
      if (this.pieChart) {
        this.pieChart.dispose();
        this.pieChart = null;
      }
    },
    // 获取月到分的时间
    getMonthToMin(dtStr){
      let formattedDt = dtStr.substring(5, 10) + " " + dtStr.substring(11, 16);
      return formattedDt;
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
  },
  components: {

  },
}