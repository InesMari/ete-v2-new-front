export default {
    name: 'kanban',
    data() {
        return {
            query: {
                page: 1,
                rows: 15,
                hasNext: false,
                workName: '',
                workId:''
            },
            sum: {
                unloadingCount: 0,
                loadedCountToday: 0,
                unreceiptCount: 0,
                receiptCountToday: 0,
            },
            workData: [],
            tableData: [],//表格数据
            isShowStaticData: false,//是否展示发货人收货人
            consignee1: '',
            consignee2: '',
            consignor1: '',
            consignor2: '',
            date: '',
            timeData: '',
            unloadingCount: 0,//未装货
            loadedCountToday: 0,//已装货今日
            unreceiptCount: 0,//未收货
            receiptCountToday: 0,//已收货今日
            isshowLeftBox:false,  //是否展示侧边栏
            isFullScreen:false,
        }
    },
    mounted() {
        this.getDate();//初始化时间
        this.getStaticData();//凯金货主联系人相关
        this.loadWorkData(false);//加载作业点
        //刷新时间
        setInterval(() => {
            this.reloadTime();
        }, 500);
        //加载
        setInterval(() => {
            this.query.page = 1;
            this.query.rows = 15;
            this.query.hasNext = false;
            this.loadWorkData(false);
        }, 1000 * 60);

        /*$(window).keydown(function () {
            if(event.keyCode == '27'){
                if (this.isFullScreen){
                    this.isFullScreen = false;
                }
            }
        });*/

    },
    methods: {
        initScroll(){
            let _this = this;
            let el_left = this.$refs.table_height_left.querySelector(".el-scrollbar__wrap");
            el_left.onscroll = function(){
                _this.changeTop(el_left.scrollTop);
            }
        },
        changeTop(top) {
            let tableH = this.$refs.table_height_left.offsetHeight; //table容器高度
            let fixtableH = document.getElementById('js_my_fixtable').offsetHeight; //table高度
            if(fixtableH<=(tableH+top+100)){  //底部滚动
                let _this = this;
                const timer = setTimeout(() => {    //滚动触发底部触发时间间隔
                    _this.isSrolling = false;
                    clearTimeout(timer);
                }, 300);                
                if(this.query.hasNext&&!this.isSrolling){
                    this.isSrolling = true;
                    this.loadMore();
                }
            }
        },
        /**
         * 查询作业点数据
         */
        loadWorkData(isReload)
        {
            let that = this;
            let param = {tenantId : this.common.userInfo().tenantId, workName : this.query.workName}
            this.common.postUrl("workGoodsTF","queryWorkDataSelect", param, function (data)
            {
                that.workData = data;
                if (that.workData.length > 0)
                {
                    if (isReload)//页面输入搜索
                    {
                        that.selectWork(that.workData[0]);//默认选择第一个
                    }
                    else
                    {
                        if (that.query.workId)
                        {
                            for (let i = 0; i < that.workData.length; i++)
                            {
                                if (that.workData[i].workId == that.query.workId)
                                {
                                    that.selectWork(that.workData[i]);
                                    break;
                                }
                            }
                        }
                        else
                        {
                            that.selectWork(that.workData[0]);//默认选择第一个
                        }
                    }
                }
            })
        },
        /**
         * 选择作业点
         * @param work
         */
        selectWork(work)
        {
            if (this.common.isNotBlank(work))
            {
                this.query.page = 1;
                this.query.rows = 15;
                this.query.hasNext = false;
                this.query.workId = work.workId;
                this.loadKanbanPage();//加载看板页
                this.loadKanbanSum();//加载看板合计
            }
        },
        /**
         * 获取日期
         */
        getDate()
        {
            let today = new Date();
            this.date = today.getFullYear() + "年" + (parseInt(today.getMonth()) + 1) + "月" + today.getDate() + "日 ";
        },
        /**
         * 加载收发货联系人数据
         */
        getStaticData()
        {
            let that = this;
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "HZ_CONSIGNEE_CONSIGNOR_DATA"}, function (data)
            {
                if (that.common.userInfo().tenantId == 71 && that.common.isNotBlank(data))//凯金专用
                {
                    that.isShowStaticData = true;
                    let dd = data;
                    if (dd.length > 0){ that.consignee1 = dd[0].codeName; }
                    if (dd.length > 1){ that.consignee2 = dd[1].codeName; }

                    if (dd.length > 2){ that.consignor1 = dd[2].codeName; }
                    if (dd.length > 3){ that.consignor2 = dd[3].codeName; }
                }
            });
        },
        /**
         * 重新加载时间
         */
        reloadTime() {
            let time = new Date();
            let hour = time.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            let minute = time.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            let second = time.getSeconds();
            if (second < 10) {
                second = "0" + second;
            }
            if (hour === 23 && minute === 59 && second > 55) {
                this.getDate();
            }
            this.timeData = hour + ":" + minute + ":" + second;
        },
        /**
         * 加载统计数据
         */
        loadKanbanSum()
        {
            let that = this;
            that.common.postUrl("kanbanTF", "loadKanbanSum", that.query, function (data)
            {
                that.sum = data;
            });
        },
        /**
         * 加载看板列表数据
         */
        loadKanbanPage()
        {
            let that = this;
            that.common.postUrl("kanbanTF", "loadKanbanPage", that.query, function (data)
            {
                that.query.hasNext = data.hasNext;
                that.query.totalNum = data.totalNum;
                that.tableData = data.items;
                that.compareAndRecombination(that.tableData);
            });
        },
        /**
         * 全屏
         */
        fullScreen()
        {
            if (!this.isFullScreen)
            {
                this.isFullScreen = true;
                let el = document.documentElement;
                let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if (rfs) {
                    rfs.call(el);
                }
                else if (typeof window.ActiveXObject !== "undefined") {
                    //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
                    let wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }
            else
            {
                this.isFullScreen = false;
                let el = document;
                let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
                if (cfs) {
                    cfs.call(el);
                }
                else if (typeof window.ActiveXObject !== "undefined") {
                    //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
                    let wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }
        },
        /**
         * 加载更多
         */
        async loadMore()
        {
            if (this.query.hasNext)
            {
                let pages = Math.round((this.query.totalNum + 10)/this.query.rows);
                this.query.page = this.query.page + 1;
                if(this.query.page > pages){ return; }//没有更多数据了
                let that = this;

                that.common.postUrl("kanbanTF", "loadKanbanPage", that.query, function (data)
                {
                    that.query.hasNext  = data.hasNext;
                    that.query.totalNum = data.totalNum;
                    data.items.forEach(e => {
                        that.tableData.push(e);
                    });
                    that.compareAndRecombination(that.tableData);
                });
            }
        },
        /**
         * 数据重新排序组合 待装/待卸最上面（加急的排最上面，然后按预计到达时间排序） 下面是未装/未卸
         * @param data
         */
        compareAndRecombination(data)
        {
            let array1 = [];//待装待收加急的
            let array2 = [];//待装待收不加急
            let array3 = [];//未装未收加急的
            let array4 = [];//未装未收不加急
            if (this.common.isNotBlank(data))
            {
                data.forEach(a => {
                    if (this.common.isNotBlank(a.entryTime))
                    {
                        if (a.isUrgent == 1){ array1.push(a); }
                        else { array2.push(a); }
                    }
                    else
                    {
                        if (a.isUrgent == 1){ array3.push(a); }
                        else { array4.push(a); }
                    }
                })
            }
            array1.sort((a, b) => Number(a.workDateTime) - Number(b.workDateTime));
            array2.sort((a, b) => Number(a.workDateTime) - Number(b.workDateTime));
            array3.sort((a, b) => Number(a.workDateTime) - Number(b.workDateTime));
            array4.sort((a, b) => Number(a.workDateTime) - Number(b.workDateTime));
            let array = [];
            this.tableData = [];
            array.push(...array1);
            array.push(...array2);
            array.push(...array3);
            array.push(...array4);
            this.tableData = array;
        },
        /**
         * 显示侧边栏
         */
        showLeftBox(){
            this.isshowLeftBox = this.isshowLeftBox?false:true;
        },
    },
    directives: {
        myscrolled: {
            bind(el) {

            },
            inserted(el, bindings) {
                let that = this;
                let fixtable = document.getElementById('js_my_fixtable');
                el.onscroll = function (event) {
                    let left = el.scrollLeft;
                    fixtable.style.left = left + 'px';
                    bindings.value.changeTop(el.scrollTop);
                }
            }
        },
    },
}
