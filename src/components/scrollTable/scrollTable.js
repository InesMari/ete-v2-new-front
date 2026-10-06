
export default {
    name: 'scrollTable',
    props: [
        "head",             //表头数组
        "height",           //表格高度
        "doSum",            //合计
        "doQrySum",         //是否做查询统计统计
        "maxHeight",        //表格最大高度
        "isShowSelect",     //是否显示选择框
        "isShowNum",        //是否展示序号
    ],
    data() {
        return {
            tableData: [],
            headTop: 0, //默认top
            headList: [],
            page:1,
            rows:10,
            totalNum:0,
            loadParam:{},//请求的数据对象
            defaultW:80,
            headH:30,//表头默认高度
            fixBottom:null,
            headMutilLine:false,//表头是否多行
            selectAll:false,
            showNum:this.isShowNum===undefined?true:this.isShowNum,
        }
    },
    mounted() {
        this.initHead();
        this.$nextTick(() => {
            this.stretch(); //初始化表格拖动
        })
    },
    methods: {
        initData(data){
            this.tableData = this.common.copyObj(data);
            this.totalNum = data.totalNum;  //总条数
            if(this.doSum) this.calcFootSum(); //合计
        },
        initHead() {
            this.headTr1 = [];  //重置表头数组，以防二次初始化数组重复
            this.headTr2 = [];  //重置表头数组，以防二次初始化数组重复
            if(this.common.isNotBlank(this.head)){
                this.headList = this.common.copyObj(this.head);
            }
            this.headList.forEach((item,index) => {
                item.code = item.code?item.code:'code'+index;   //没设置code的时候添加一个
                if(this.common.isBlank(item.width)){
                    this.$set(item, "width", this.defaultW);//没配置宽度设置默认宽度
                }
                if(this.common.isNotBlank(item.children)){
                    this.initHeadMutil(item.children);//表头多行情况处理
                }
            })
            if(this.headMutilLine){     //多行表头时处理headList
                this.reForHead();
                this.headH = 60;
            }
            this.$forceUpdate();
        },
        //表头数组遍历（合并表头数组时会多次调用）
        reForHead(){
            for(let i=0;i<this.headList.length;i++){
                let item = this.headList[i];
                if(this.common.isNotBlank(item.children)){
                    item.children.forEach(el => el.parentCode = item.code);
                    //把表格实质需要字段提取出来
                    this.headList.splice(i,1,...item.children);
                    this.reForHead();
                    break;
                }
            }
        },
        // 表头多行情况处理
        initHeadMutil(list){
            this.headMutilLine = true;
            this.headTr1 = this.common.copyObj(this.headList);
            list.forEach(el => {
                this.$set(el, "isShow", true);//默认展示
                // this.$set(el, "isFix", false);//默认不固定
                if(this.common.isBlank(el.width)){
                    this.$set(el, "width", this.defaultW);//没配置宽度设置默认宽度
                }
                this.headTr2.push(el);
            })
        },
        //外部调用查询
        async load(beanName,methodName,param,fn){
            if(this.common.isNotBlank(param)) this.loadParam = param;//非空时使用传入的param
            if(this.common.isNotBlank(beanName)) this.beanName = beanName;   //非空时使用传入的beanName
            if(this.common.isNotBlank(methodName)) this.methodName = methodName;   //非空时使用传入的methodName
            if(this.common.isNotBlank(fn)) this.loadFn = fn;        //非空时使用传入的fn
            let data = await this.doQuery(true);
            return data;
        },
        //实际查询方法，clean:true时，清空表格重新查询
        async doQuery(clean){
            if(clean){
                this.loadParam.page = 1
                this.loadParam.count = this.count;
                this.$refs.table_height.scrollTop = 0; //重新查询需要重置滚动条位置
            }
            let data = await this.common.postUrl(this.beanName,this.methodName,this.loadParam,null,null,"post",true);
            if(clean){
                this.tableData = [];
            }
            if(this.common.isNotBlank(data.items)){
                var items = data.items;
            }else{
                var items = data;
            }
            this.tableData = [...this.tableData,...items];
            this.totalNum = data.totalNum;  //总条数
            this.hasNext = data.hasNext;    //是否有下一页
            if(this.common.isNotBlank(this.loadFn)) this.loadFn(data);
            this.initTableHeight(); //计算表格高度
            if(this.doSum) this.calcFootSum(); //合计
            if(this.doQrySum){
                let data = await this.common.postUrl(this.beanName,this.methodName+"Sum",this.loadParam,"","","",true);
                this.headList.forEach(hd => {
                    if(data[hd.code]){
                        hd.sum = data[hd.code];
                    }else{
                        hd.sum = '';
                    }
                })
                this.$forceUpdate();
            }
            this.$nextTick(()=>{
                this.changeTop(this.$refs.table_height.scrollTop);
            })
            return data;
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
            this.calcFootSum(true);
        },
        // 获取选中列表
        getSelectItem(){
            let array = [];
            this.tableData.forEach((item)=>{
                if (item.isSelect) {
                    array.push(item);
                }
            })
            return array;
        },
        //计算表格高度
        initTableHeight(){
            this.common.initTableHeight();
        },
        changeTop(top) {
            top = isNaN(Number(top))?this.$refs.table_height.scrollTop:top;
            let tableH = this.$refs.table_height.offsetHeight; //table容器高度
            let fixtableH = this.$refs.scrollTable.offsetHeight; //table高度
            this.headTop = top;
            this.fixBottom = top+tableH-41;
            if(fixtableH<=tableH+top){  //底部滚动
                let _this = this;
                const timer = setTimeout(() => {    //滚动触发底部触发时间间隔
                    _this.isSrolling = false;
                    clearTimeout(timer);
                }, 300);
                if(this.hasNext&&!this.isSrolling){
                    this.isSrolling = true;
                    this.loadParam.page++;
                    this.doQuery();
                }
            }
        },
        //单击行方法
        selectRow(data,index) {
            if(this.singleSelect){  //单选逻辑
                if(data.isSelect){
                    this.$set(data, "isSelect", false);
                }else{
                    for (let obj of this.tableData) {
                        this.$set(obj, "isSelect", false);
                    }
                    this.$set(data, "isSelect", true);
                }
            }else{  //多选逻辑
                this.$set(data, "isSelect", data.isSelect ? false : true);
                this.selectAll = true;
                for (let obj of this.tableData) {
                    if (!obj.isSelect) {
                        this.selectAll = false;
                    }
                }
                this.calcFootSum(true);
            }
            this.$emit("clickItem",data);
        },
        
        // 列排序
        doSort(code){
            if(this.isStretch) return;  //正常拖动单元格宽度
            this.justSort = this.justSort?false:true;
            let that = this;

            // 检查是否是百分比字符串
            const isPercentageString = function(str) {
                return /^-?\d+(\.\d+)?%$/.test(str);
            }
            
            // 判断数据类型并进行排序比较            
            let compare = function(property) {
                return function(a,b) {
                    a = a[property];
                    b = b[property];
                    if(that.common.isBlank(a)) a = '-1';
                    if(that.common.isBlank(b)) b = '-1';
                    // 日期排序
                    if (a instanceof Date && b instanceof Date) {
                        if(that.justSort){  //正序
                            return a.getTime() - b.getTime();
                        }else{  //倒序
                            return b.getTime() - a.getTime();
                        }                        
                    }
                
                    // 数字排序
                    if (typeof a === 'number' && typeof b === 'number') {
                        if(that.justSort){  //正序
                            return a - b;
                        }else{  //倒序
                            return b - a;
                        }  
                    }
                
                    // 百分比字符串排序
                    if (isPercentageString(a) && isPercentageString(b)) {
                        const numberA = parseFloat(a);
                        const numberB = parseFloat(b);                         
                        if(that.justSort){  //正序
                            return numberA - numberB;
                        }else{  //倒序
                            return numberB - numberA;
                        }
                    }
                
                    // 文本排序
                    if(that.justSort){  //正序
                        return a.toString().localeCompare(b.toString(),'zh-CN');
                    }else{  //倒序
                        return -a.toString().localeCompare(b.toString(),'zh-CN');
                    }
                }
            }
            this.tableData.sort(compare(code));
        },
        //汇总
        calcFootSum(selectCalc){
            this.headList.forEach(hd => {
                let sum = 0;
                if(hd.isSum){
                    this.tableData.forEach(item => {
                        sum = (sum*10000 + Number(item[hd.code])*10000)/10000;//防止失精
                    })
                    if(!isNaN(sum)){
                        hd.sum = sum;
                    }
                }
            })
            this.$forceUpdate();
        },
        // 设置表格数据
        setData(data){
            this.tableData = this.common.copyObj(data);
            if(this.doSum) this.calcFootSum(); //合计
            this.$nextTick(()=>{
                this.changeTop();
            })
        },
        //获取表格数据
        getData(){
            return this.tableData;
        },
        // 获取选中数据
        getSelectItem(){
            let array = [];
            this.tableData.forEach((item)=>{
                if (item.isSelect) {
                    array.push(item);
                }
            })
            return array;
        },
        //获取表头表脚数据，sum字段为表脚合计
        getSum(){
            return this.headList
        },
        /**
         * 输入框类型失焦回调
         * @param item      行数据
         * @param code      列对应的code
         * @param index     行下标
         * @param fn        父组件head设置的失焦回调方法名称
         */
        tdBlur(item,code,index,fn){
            if(this.common.isBlank(fn)) return;
            if(this.common.isBlank(this.$parent[fn])){  //父组件没指向到页面时候使用emit传递方法（如：组件被el-dialog包裹时）
                this.$emit(fn,item,code,index)
            }else{          //父组件指向到对应页面直接调用
                this.$parent[fn](item,code,index);
            }
        },
        /**
         * 输入框类型输入回调
         * @param item      行数据
         * @param code      列对应的code
         * @param index     行下标
         * @param fn        父组件head设置的失焦回调方法名称
         */
        tdInput(item,code,index,fn){
            if(this.common.isBlank(fn)) return;
            if(this.common.isBlank(this.$parent[fn])){  //父组件没指向到页面时候使用emit传递方法（如：组件被el-dialog包裹时）
                this.$emit(fn,item,code,index)
            }else{          //父组件指向到对应页面直接调用
                this.$parent[fn](item,code,index);
            }
        },
        //表单列宽自由拖动
        stretch(){
            let myTAbId = this.$refs.scrollTable;
            let tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
            if(this.headList == undefined){
                return;
            }
            let _this = this;
            let moveIndex = 0;  //单元格下标
            // for(let m=0;m<myTAbId.length;m++){
                if(this.headMutilLine){   //多行表头
                    var unset = myTAbId.rows[0].cells.length - _this.headTr1.length;
                }else{  //单行表头
                    var unset = myTAbId.rows[0].cells.length - _this.headList.length;
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
                        };
                        myTAbId.rows[0].cells[j].onmouseup = function (event) {
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
                        myTAbId.rows[0].cells[j].onmousemove = function (event,m) {
                            //更改鼠标样式
                            if (event.offsetX > this.offsetWidth - 10)
                            this.style.cursor = 'col-resize';
                            else
                            this.style.cursor = 'default';
                            //取出暂存的Table Cell
                            if (tTD == undefined) tTD = this;
                            //调整宽度
                            if (tTD.mouseDown != null && tTD.mouseDown == true) {
                                tTD.setAttribute("data-mouse","true");

                                tTD.style.cursor = 'default';
                                if (tTD.oldWidth + (event.clientX - tTD.oldX)>0)
                                tTD.width = tTD.oldWidth + (event.clientX - tTD.oldX);
                                //调整列宽
                                tTD.style.cursor = 'col-resize';
                                //调整该列中的每个Cell
                                // myTAbId = tTD; while (myTAbId.tagName != 'TABLE') myTAbId = myTAbId.parentElement;
                                // let tableElement = this.parentElement.parentElement.parentElement;
                                // for (let k = 0; k < tableElement.rows.length; k++) {
                                //     tableElement.rows[k].cells[tTD.cellIndex].width = tTD.width;
                                // }
                                
                                //调整列宽
                                if(_this.headMutilLine){   //多行表头
                                    let code = _this.headTr1[moveIndex-unset].code;
                                    let childrenTotal = 0;  //子表头数量，用于均摊宽度
                                    _this.headList.forEach(el => {
                                        if(el.code == code || el.parentCode == code){
                                            childrenTotal++;
                                        }
                                    })
                                    if(childrenTotal>0){    //有子表头时候均摊宽度
                                        _this.headList.forEach(el => {
                                            if(el.code == code || el.parentCode == code){
                                                el.width = tTD.width/childrenTotal;
                                            }
                                        })
                                    }else{  //没有子表头时直接赋值高度
                                        _this.headList[moveIndex-unset].width = tTD.width;
                                    }
                                }else{  //单行表头
                                    _this.headList[moveIndex-unset].width = tTD.width;
                                }
                            }
                        };
                    }
                }
            // }
        },
        forceUpdate(){
            this.$forceUpdate();
        },
    },
    directives: {
        myscrolled: {
            bind(el) {

            },
            inserted(el, bindings) {
                el.onscroll = function (event) {
                    bindings.value.changeTop(el.scrollTop);
                }
            }
        },
    },
    computed: {
        headTr1Show: function () {
            return this.headTr1.filter(function (item) {
                return item.isShow&&!item.isFix;
            })
        },
    },
    watch:{
        head:function (){
            this.initHead()
        }
    }
}
