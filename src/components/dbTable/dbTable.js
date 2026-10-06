
import vuedraggable from 'vuedraggable';
import {data} from '@/static/json.js'

export default {
    name: 'dbTable',
    props: [
        "head",         //默认表头
        "rightHead",    //右边表头(不设置则使用默认表头)
        "showSetTable", //是否显示表格设置
        "showNum",      //是否显示页码
        "tableName",    //表名
        "onlyId",       //数据唯一ID,用于左右切换时识别数据
        "relatedId",    //关联ID，如果有这个id，选择的时候要一起带过去
        "isFilter",     //是否过滤
        "noOnly",       //可以重复选择
        "showTotal",    //是否显示统计
    ],
    data() {
        return {
            tableData: [],
            selectAll: false, //是否全选
            isShowSetTable: false, //是否展示表格设置
            setTabelShow: false,
            isShowNum: false,
            headList: [],
            headCache: [],
            defaultW: 80, //单元格默认宽度
            multi_w: 40, //选择格默认宽度
            num_w: 40, //序号列默认宽度
            leftTableW: 60,
            headTop: 0, //默认top
            fixBottom:null,
            fixBottomRIght:null,
            page:1,
            count:40,
            totalNum:0,
            loadParam:{},//请求的数据对象
            //右边表格需要字段
            setRightTabelShow:false,
            headListRight:[],
            leftTableWRight:60,
            headTopRight: 0, //默认top
            tableDataRight:[],
            leftWidth:'49%',        //表格默认宽度
            rightWidth:'49%',       //表格默认宽度
            showRightTable:true,    //显示右边表格
            showLeftTable:true,     //显示左边表格
            justSort:false,//列排序
            isshowDispatchBtn:false, //是否展示一键派单按钮
        }
    },
    components: {
        vuedraggable
    },
    async mounted() {
        this.initShow();
        await this.initHead();
        this.calcWidth();
        this.calcWidth('right');
        this.$nextTick(() => {
            this.stretch(); //初始化表格拖动
            // this.initScroll();  //初始化滚动事件
        })
    },
    methods: {
        initScroll(){
            let _this = this;
            let el_left = this.$refs.table_height_left.querySelector(".el-scrollbar__wrap");
            el_left.onscroll = function(){
                _this.changeTop(el_left.scrollTop);
            }
            let el_right = this.$refs.table_height_right.querySelector(".el-scrollbar__wrap");
            el_right.onscroll = function(){
                _this.changeTop(el_right.scrollTop,"right");
            }
        },
        initHead() {
            this.head.forEach((item) => {
                this.$set(item, "isShow", true);
                this.$set(item, "isFix", false);
                if(this.common.isBlank(item.width)){
                    this.$set(item, "width", this.defaultW);
                }
            })
            this.headList = this.common.copyObj(this.head); //左边表头
            //右边表头
            if(this.common.isBlank(this.rightHead)){    //页面没配置
                this.headListRight = this.common.copyObj(this.head);
            }else{      //页面有配置
                this.rightHead.forEach((item) => {
                    this.$set(item, "isShow", true);
                    this.$set(item, "isFix", false);
                    if(this.common.isBlank(item.width)){
                        this.$set(item, "width", this.defaultW);
                    }
                })
                this.headListRight = this.common.copyObj(this.rightHead);
            }
            this.initTwoTableSet();    //初始化table设置
        },
        async initTwoTableSet(){

            let tableLeft = await this.common.postUrl("tableHeadConfigTF", "loadSysTableHeadConfigList",{tableName: this.tableName});
            let tableRight = await this.common.postUrl("tableHeadConfigTF", "loadSysTableHeadConfigList",{tableName: this.tableName+"right"});

            //初始化左边table设置
            if (this.common.isNotBlank(tableLeft) && tableLeft.length > 0)
            {
                let headList = this.initTableSet(tableLeft,this.headList);
                if(this.common.isNotBlank(headList)) this.headList = headList;
                this.calcWidth();
            }
            //初始化右边table设置
            if (this.common.isNotBlank(tableRight) && tableRight.length > 0)
            {
                let headListRight = this.initTableSet(tableRight,this.headListRight);
                if(this.common.isNotBlank(headListRight)) this.headListRight = headListRight;
                this.calcWidth('right');
            }
        },
        initTableSet(table,head){
            if(this.common.isBlank(table)) return;
            //展示隐藏，固定列处理
            let newList = [];
            let oldList = [];
            let tableMap = new Map();
            table.forEach(data => {
                tableMap.set(data.headCode,data);
            })
            head.forEach((item) => {
                item.isShow = true;
                if(tableMap.has(item.code)){
                    let data = tableMap.get(item.code);
                    item.isShow = data.isDisplay==1?true:false;
                    if(this.common.isNotBlank(data.headWidth)){
                        item.width = data.headWidth;
                    }
                    if(data.isFix == 1){  //为1时侧固定
                        item.isFix = true;
                    }
                    item.headIndex = data.headIndex;
                    oldList.push(item);
                }else{
                    newList.push(item);
                }
            })
            oldList = oldList.sort((a,b)=>a.headIndex-b.headIndex);
            //合并arr和未被插入的隐藏列
            head = oldList.concat(newList);
            return head
        },
        initShow() {
            //是否展示表格设置
            if (this.common.isNotBlank(this.showSetTable)) this.isShowSetTable = this.showSetTable;
            //是否展示序号
            if (this.common.isNotBlank(this.showNum)) this.isShowNum = this.showNum;
            //是否展示一键派单
            if (this.common.isNotBlank(this.showDispatchBtn)) this.isshowDispatchBtn = true;
        },
        //外部调用查询
        async load(beanName,methodName,param,fn){
            if(this.common.isNotBlank(param)) this.beanName = beanName;//非空时使用传入的beanName
            if(this.common.isNotBlank(methodName)) this.methodName = methodName;   //非空时使用传入的methodName
            if(this.common.isNotBlank(param)) this.loadParam = param; //非空时使用传入的param
            if(this.common.isNotBlank(fn)) this.loadFn = fn;        //非空时使用传入的fn
            await this.doQuery(true);
        },
        //实际查询方法，clean:true时，清空表格重新查询
        async doQuery(clean){
            if(clean){
                this.loadParam.page = 1
                this.loadParam.count = this.loadParam.count || this.count;
                this.$refs.table_height_left.scrollTop = 0; //重新查询需要重置滚动条位置
            }
            let data = await this.common.postUrl(this.beanName,this.methodName,this.loadParam,null,null,"post",true);
            if(clean){
                this.tableData = [];
            }
            this.tableData = [...this.tableData,...data.items];
            this.totalNum = data.totalNum;  //总条数
            this.hasNext = data.hasNext;    //是否有下一页
            this.filterLeftData();  //过滤表格已有数据
            if(this.common.isNotBlank(this.loadFn)) this.loadFn(data);
            this.footerSum();   //统计
            this.$nextTick(()=>{ //刷新样式
                this.changeTop(this.$refs.table_height_left.scrollTop);
            })
            this.common.initTableHeight(); //计算表格高度
        },
        //重新查询的时候过滤右边的数据
        filterLeftData(){
            if(this.noOnly) return;
            this.tableDataRight.forEach(item => {
                this.tableData.forEach((el,index) => {
                    if(item[this.onlyId] == el[this.onlyId]){
                        this.tableData.splice(index,1);
                    }
                })
            })
        },
        //单击行方法
        selectRow(data, index) {
            this.$set(data, "isSelect", data.isSelect ? false : true);
            this.selectAll = true;
            for (let obj of this.tableData) {
                if (!obj.isSelect) {
                    this.selectAll = false;
                }
            }
            // this.$forceUpdate();
        },
        dblclickItem(data){
            this.$emit("dblclickItem",data);
        },
        getSelectItem(){
            let array = [];
            this.tableData.forEach((item)=>{
                if (item.isSelect) {
                    array.push(item);
                }
            })
            return array;
        },
        //全选
        selectAllCheck() {
            if (this.selectAll) {
                this.tableData.forEach((item) => {
                    this.$set(item, "isSelect", true);
                })
            } else {
                this.tableData.forEach((item) => {
                    this.$set(item, "isSelect", false);
                })
            }
        },
        //表格设置
        showSetting(type) {
            if(type=="right"){
                this.headCache = this.common.copyObj(this.headListRight);
                this.setRightTabelShow = true;
            }
            if(type=='left'){
                this.headCache = this.common.copyObj(this.headList);
                this.setTabelShow = true;
            }
        },
        //左边表格设置
        async saveTableRow(){
            let sysTableHeadConfigList = [];
            //组装要保存的table，目前保存需要显示的
            for(let i in this.headList){
                let hd = this.headList[i];
                // if(hd.isShow){
                    let tableHeadConfig = {};
                    tableHeadConfig.headName = hd.name;
                    tableHeadConfig.headCode = hd.code;
                    tableHeadConfig.headWidth = hd.width;
                    tableHeadConfig.headIndex = i;
                    tableHeadConfig.isFix = hd.isFix ? 1 : 0;
                    tableHeadConfig.isDisplay = hd.isShow ? 1 : 0;
                    sysTableHeadConfigList.push(tableHeadConfig);
                // }
            }
            let param = {};
            param.tableName = this.tableName;
            param.tableHeadConfigList = sysTableHeadConfigList;
            await this.common.postUrl("tableHeadConfigTF", "saveSysTableHeadConfigs", param);
            this.setTabelShow = false;
            this.$message.success("保存成功！");
            this.stretch();
        },
        cancelSet() {
            this.headList = this.common.copyObj(this.headCache);
            this.setTabelShow = false;
            this.calcWidth();
        },
        //右边表格设置
        async saveRightTableRow(){
            let sysTableHeadConfigList = [];
            //组装要保存的table，目前保存需要显示的
            for(let i in this.headListRight){
                let hd = this.headListRight[i];
                // if(hd.isShow){
                    let tableHeadConfig = {};
                    tableHeadConfig.headName = hd.name;
                    tableHeadConfig.headCode = hd.code;
                    tableHeadConfig.headWidth = hd.width;
                    tableHeadConfig.headIndex = i;
                    tableHeadConfig.isFix = hd.isFix ? 1 : 0;
                    tableHeadConfig.isDisplay = hd.isShow ? 1 : 0;
                    sysTableHeadConfigList.push(tableHeadConfig);
                // }
            }
            let param = {};
            param.tableName = this.tableName+"right";
            param.tableHeadConfigList = sysTableHeadConfigList;
            await this.common.postUrl("tableHeadConfigTF", "saveSysTableHeadConfigs", param);
            this.setRightTabelShow = false;
            this.$message.success("保存成功！");
        },
        cancelRightSet() {
            this.headListRight = this.common.copyObj(this.headCache);
            this.setRightTabelShow = false;
            this.calcWidth();
        },

        //固定列逻辑
        fixRow(hd, index,type) {
            let headList = 'headList'
            if(type=='right'){
                headList = 'headListRight';
            }
            let fixIndex = -1;
            for (let i in this[headList]) { //获取固定列的长度
                if (this[headList][i].isFix || i == index) {
                    fixIndex = parseInt(i);
                } else {
                    break;
                }
            }
            let obj = this[headList][index];
            if (hd.isFix) { //确实固定
                this[headList].splice(index, 1);
                if (fixIndex - index == 0) {
                    this[headList].splice(fixIndex, 0, obj);
                } else {
                    this[headList].splice(fixIndex + 1, 0, obj);
                }
            } else { //取消固定
                this[headList].splice(index, 1);
                this[headList].splice(fixIndex, 0, obj);
            }
            this.calcWidth(type);
        },
        calcWidth(type) {
            let headList = 'headList'
            if(type=='right'){
                headList = 'headListRight';
            }
            let fixTbW = 0;
            for (let i in this[headList]) {
                if (this[headList][i].isFix && this[headList][i].isShow) {
                    if (this[headList][i].width == undefined) {
                        fixTbW = fixTbW + this.defaultW + 1;
                    } else {
                        fixTbW = fixTbW + parseInt(this[headList][i].width) + 1;
                    }
                }
            }
            if(type=='right'){
                if (this.isShowNum) {
                    this.leftTableWRight = fixTbW + this.multi_w + this.num_w;
                } else {
                    this.leftTableWRight = fixTbW + this.multi_w;
                }
            }else{
                if (this.isShowNum) {
                    this.leftTableW = fixTbW + this.multi_w + this.num_w;
                } else {
                    this.leftTableW = fixTbW + this.multi_w;
                }
            }
        },
        changeTop(top,type) {
            if(type=='right'){
                this.headTopRight = top;
                this.fixBottomRIght = top+this.$refs.table_height_right.offsetHeight-40;
            }else{
                let tableH = this.$refs.table_height_left.offsetHeight; //table容器高度
                let fixtableH = document.getElementById('js_my_fixtable').offsetHeight; //table高度
                this.headTop = top;
                this.fixBottom = top+tableH-40;
                if(fixtableH<=tableH+top && top>1){  //底部滚动
                    let _this = this;
                    const timer = setTimeout(() => {    //滚动触发底部触发时间间隔
                        _this.isSrolling = false;
                        clearTimeout(timer);
                    }, 300);
                    if(this.$listeners.scrollBack&&!this.isSrolling){
                        this.$emit("scrollBack", data);
                    }
                    if(this.hasNext&&!this.isSrolling){
                        this.isSrolling = true;
                        this.loadParam.page++;
                        this.doQuery();
                    }
                }
            }
        },
        // 脚部统计
        footerSum(){
            this.headListShow.forEach(hd => {
                hd.sum = '';
            })
            this.tableData.forEach(el => {
                this.headListShow.forEach(hd => {
                    if(hd.issum){
                        if(this.common.isBlank(hd.sum)) hd.sum=0;
                        if(!isNaN(Number(el[hd.code]))) hd.sum += el[hd.code];
                    }
                })
            })

            this.headListRightShow.forEach(hdr => {
                hdr.sum = '';
            })
            this.tableDataRight.forEach(el => {
                this.headListRightShow.forEach(hd => {
                    if(hd.issum){
                        if(this.common.isBlank(hd.sum)) hd.sum=0;
                        if(!isNaN(Number(el[hd.code]))) hd.sum += el[hd.code];
                    }
                })
            })
        },
        //左右表格数据切换操作
        toRightTable(data,index,isAll){
            let isSelectAll = isAll=='all';
            if(this.isFilter){
                this.$emit("filter", data, index, isSelectAll);
                return;
            }
            if(!this.preventTooFast()) return;
            if (isSelectAll && data.length === 0) return;
            if(isSelectAll){
                let copyDataLst = this.common.copyObj(this.tableData);
                let tableDataRight = [...this.tableDataRight,...copyDataLst];
                if(this.noOnly) return; //可以复选不过滤
                //过滤重复id
                this.tableDataRight = tableDataRight.filter((x, index,self)=>{
                    var arrids = []
                    tableDataRight.forEach((item,i) => {
                      arrids.push(item[this.onlyId])
                    })
                    return arrids.indexOf(x[this.onlyId]) === index
                  }) 
                this.tableData = [];
            }else{
                let copyData = this.common.copyObj(data);
                this.tableDataRight.push(copyData);
                if(this.noOnly) return; //可以复选不过滤
                this.tableData.splice(index,1);
                if(this.relatedId){
                    for (let i = 0; i < this.tableData.length; i++) {
                        if(data[this.relatedId] == this.tableData[i][this.relatedId]){
                            this.tableDataRight.push(this.common.copyObj(this.tableData[i]));
                            this.tableData.splice(index,1);
                            i--;
                        }
                    }
                }
            }
            this.footerSum();
            this.$emit("dataChange",this.tableData,this.tableDataRight, isSelectAll,2,data);
            this.$nextTick(()=>{
                this.changeTop(this.$refs.table_height_left.scrollTop,'left');
                this.changeTop(this.$refs.table_height_right.scrollTop,'right');
            })
        },
        resetLeftTable(){
            if(!this.noOnly){
                //补齐左边的数据
                this.tableData = [...this.tableDataRight,...this.tableData];
            }else{
                const rightIds = new Set(this.tableDataRight.map(item => item[this.onlyId]));
                this.tableData = this.tableData.filter(item => !rightIds.has(item[this.onlyId]));
                //过滤重复id
                this.tableDataRight = this.tableDataRight.filter((x, index,self)=>{
                    var arrids = []
                    this.tableDataRight.forEach((item,i) => {
                        arrids.push(item[this.onlyId])
                    })
                    return arrids.indexOf(x[this.onlyId]) === index
                })
            }
        },
        toLeftTable(data,index,isAll){
            if(!this.preventTooFast()) return;
            let isSelectAll = isAll=='all';
            if(isSelectAll){
                if(!this.noOnly){    //可复选只需要操作右边数据
                    this.tableData = [...this.tableDataRight,...this.tableData];
                }
                this.tableDataRight = [];
            }else{
                this.tableDataRight.splice(index,1);
                if(!this.noOnly){    //可复选只需要操作右边数据
                    this.tableData.unshift(data);
                }
            }
            this.footerSum();
            this.$emit("dataChange",this.tableData,this.tableDataRight, isSelectAll,1,data);
            this.$nextTick(()=>{
                this.changeTop(this.$refs.table_height_left.scrollTop,'left');
                this.changeTop(this.$refs.table_height_right.scrollTop,'right');
            })
        },
        //防止左右切换操作过快
        preventTooFast(){
            if(this.isToNow){
                this.$message({
                    message: '操作过于频繁。',
                    type: 'warning'
                });
                return false;
            }else{
                this.isToNow = true;
                const timer = setTimeout(() => {
                    this.isToNow = false;
                }, 500);
                return true;
            }
        },
        //获取选中的数据
        getRightData(){
            return this.tableDataRight;
        },
        //获取左边的数据
        getLeftData(){
            return this.tableData;
        },
        //父组件改动左侧数据后重设表格数据方法
        setLeftData(data,resetScroll = true){
            this.tableData = data;
            if(resetScroll) this.$refs.table_height_left.scrollTop = 0;
            this.filterLeftData();
            this.$forceUpdate();
        },
        //父组件改动右侧数据后重设表格数据方法
        setRightData(data){
            this.tableDataRight = data;
            this.$refs.table_height_right.scrollTop = 0;
            this.$forceUpdate();
        },
        //计算表格高度
        initTableHeight(){
            return
            let main_frame = document.querySelector(".main_frame").offsetHeight;     //路由内容高度
            let innerTabDom = document.getElementById("innerTab");         //内部tab栏高度
            let innerTab = 0;
            if(innerTabDom) innerTab = innerTabDom.offsetHeight;
            // let searchList = document.querySelector(".search-list").offsetHeight;    //搜索内容高度
            let tableTitle = document.querySelector(".table-title").offsetHeight;    //表格名称高度
            let dbTable = document.getElementById('dbTable');   //组件dom对象
            let table = dbTable.querySelectorAll('.table_height');     //表格对象
            // let tableFooter = dbTable.querySelector('.table_page').offsetHeight; //组件脚部高度
            table.forEach(el => {
                el.style.height = (main_frame - innerTab - tableTitle - 40) + 'px';
            })
        },
        // 列排序
        doSort(code,tableData){
            if(this.isStretch) return;  //正常拖动单元格宽度
            this.justSort = this.justSort?false:true;
            let that = this;
            let compare = function(property) {
                return function(a,b) {
                    if(that.common.isBlank(a[property])){
                        var value1 = '-1';
                    }else{
                        var value1 = a[property].toString();
                    }
                    if(that.common.isBlank(b[property])){
                        var value2 = '-1';
                    }else{
                        var value2 = b[property].toString();
                    }
                    value1 = forStr(value1);
                    value2 = forStr(value2);

                    if(that.justSort){  //正序
                        return value1 - value2
                    }else{  //倒序
                        return value2 - value1
                    }
                }
            }
            const forStr = function(arr){
                let charCode = '';
                for(let i=0;i<arr.length;i++){
                    let code = arr[i].charCodeAt();
                    charCode += code;
                }
                return charCode;
            }
            tableData.sort(compare(code));
            this.$forceUpdate();
        },
        //每页显示10/50/100条数据
        async changeRows(num){
            this.count = num;
            await this.doQuery(true);
            this.$emit("changeRows",this.tableData);
        },
        //表单列宽自由拖动
        stretch(){
            let myTAbIds = [];
            myTAbIds[0] = this.$refs.js_my_table_left;
            myTAbIds[1] = this.$refs.js_my_table_right;
            let tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
            let _this = this;
            let moveIndex = 0;  //单元格下标
            for(let m=0;m<myTAbIds.length;m++){
                let myTAbId = myTAbIds[m];
                if(m == 0 && _this.headList == undefined){
                    return;
                }
                if(m == 1 && _this.headListRight == undefined){
                    return;
                }
                if(m==0){
                    var unset = myTAbId.rows[0].cells.length - _this.headListShow.length;
                }else if(m==1){
                    var unset = myTAbId.rows[0].cells.length - _this.headListRightShow.length;
                }
                for (let j = 0; j < myTAbId.rows[0].cells.length; j++) {
                    myTAbId.rows[0].cells[j].index = j;
                    if(unset - 1<j){
                        myTAbId.rows[0].cells[j].onmousedown = function (event) {
                            //记录单元格
                            tTD = this;
                            if (event.offsetX > tTD.offsetWidth - 10) {
                                tTD.mouseDown = true;
                                tTD.oldX = event.clientX;
                                tTD.oldWidth = tTD.offsetWidth;
                            }
                            moveIndex = this.index; //获取点击时的单元格下标
                            //记录Table宽度
                            //table = tTD; while (table.tagName != ‘TABLE') table = table.parentElement;
                            //tTD.tableWidth = table.offsetWidth;
                        };
                        myTAbId.rows[0].cells[j].onmouseup = function (event) {
                            const sortTimer = setTimeout(() => {
                                _this.isStretch = false;    //结束拖动
                                _this.$forceUpdate();
                                clearTimeout(sortTimer);
                            }, 500);
                            //结束宽度调整
                            if (tTD == undefined) tTD = this;
                            tTD.mouseDown = false;
                            tTD.style.cursor = 'default';
                            if(tTD.getAttribute("data-mouse")=="true"){
                                (function(tTD){
                                    let timer = setTimeout(function(){
                                        tTD.setAttribute("data-mouse","false");
                                        clearTimeout(timer);
                                    }, 500)
                                })(tTD);
                            }
                        };
                        myTAbId.rows[0].cells[j].onmousemove = function (event) {
                            //更改鼠标样式
                            if (event.offsetX > this.offsetWidth - 10)
                            this.style.cursor = 'col-resize';
                            else
                            this.style.cursor = 'default';
                            //取出暂存的Table Cell
                            if (tTD == undefined) tTD = this;
                            //调整宽度
                            if (tTD.mouseDown != null && tTD.mouseDown == true) {
                                _this.isStretch = true;     //正在拖动
                                tTD.setAttribute("data-mouse","true");

                                tTD.style.cursor = 'default';
                                if (tTD.oldWidth + (event.clientX - tTD.oldX)>0)
                                tTD.width = tTD.oldWidth + (event.clientX - tTD.oldX);
                                //调整列宽
                                tTD.style.cursor = 'col-resize';
                                //调整该列中的每个Cell
                                // myTAbId = tTD; while (myTAbId.tagName != 'TABLE') myTAbId = myTAbId.parentElement;
                                let tableElement = this.parentElement.parentElement.parentElement;
                                for (let k = 0; k < tableElement.rows.length; k++) {
                                    tableElement.rows[k].cells[tTD.cellIndex].width = tTD.width;
                                }
                                if(m == 0){
                                    _this.headListShow[moveIndex-unset].width = tTD.width;
                                }else if(m == 1){
                                    _this.headListRightShow[moveIndex-unset].width = tTD.width;
                                }
                            }
                        };
                    }
                }
            }
        }
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
        myRightScrolled: {
            bind(el) {

            },
            inserted(el, bindings) {
                let fixtable = document.getElementById('js_my_fixtable_right');
                el.onscroll = function (event) {
                    let left = el.scrollLeft;
                    fixtable.style.left = left + 'px';
                    bindings.value.changeTop(el.scrollTop,'right');
                }
            }
        }
    },
    computed: {
        headListFix: function () {
            return this.headList.filter(function (item) {
                return item.isShow&&item.isFix;
            })
        },
        headListShow: function () {
            return this.headList.filter(function (item) {
                return item.isShow&&!item.isFix;
            })
        },
        headListRightFix: function () {
            return this.headListRight.filter(function (item) {
                return item.isShow&&item.isFix;
            })
        },
        headListRightShow: function () {
            return this.headListRight.filter(function (item) {
                return item.isShow&&!item.isFix;
            })
        }
    }
}
