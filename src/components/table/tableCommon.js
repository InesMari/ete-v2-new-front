
import vuedraggable from 'vuedraggable';

export default {
    name: 'tableCommon',
    props: {
        // 表头数组
        head: {
            type: Array,
            default: () => []
        },
        // 是否显示表格设置
        showSetTable: {
            type: Boolean,
            default: false
        },
        // 是否显示序号
        showNum: {
            type: Boolean,
            default: false
        },
        // 表名
        tableName: {
            type: String,
            default: ''
        },
        // 是否单选
        singleSelect: {
            type: Boolean,
            default: false
        },
        // 是否显示选择框
        showSelect: {
            type: Boolean,
            default: true
        },
        // 隐藏放大表格按钮
        hideScale: {
            type: Boolean,
            default: false
        },
        // 是否做统计
        doSum: {
            type: Boolean,
            default: false
        },
        // 是否做查询统计统计
        doQrySum: {
            type: Boolean,
            default: false
        },
        showPage:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            tableData: [],
            selectAll: false, //是否全选
            isShowSetTable: true, //是否展示表格设置
            isShowSelect:true,
            setTabelShow: false,
            isShowNum: false,
            headList: [],
            headCache: [],
            defaultW: 80, //单元格默认宽度
            multi_w: 40, //选择格默认宽度
            num_w: 40, //序号列默认宽度
            leftTableW: 60,
            headTop: 0, //默认top
            page:1,
            rows:50,
            totalNum:0,
            pageList:[],//页数
            loadParam:{},//请求的数据对象
            justSort:false,//列排序
            headMutilLine:false,//表头是否多行
            headTr2:[],//表头多行是第二行（业务暂时两行，如果再嵌套重新考虑自动生成）
            headH:30,//表头默认高度
            fixBottomRight:0,
            that:this,
            selectAllModel:false,
            selectBackModel:false,
            doSelectSum:true,//默认选择统计，取消默认时使用prop属性
            // singleSelect:false,//默认多选，取消时使用prop属性
        }
    },
    components: {
        vuedraggable
    },
    mounted() {
        this.windowClose();
        this.initShow();
        this.initHead();
    },
    methods: {
        initScroll(){
            this.$refs.tableHeight.scrollLeft = 0;  //火狐浏览器会保留滚动条位置，需要重置
            this.headTop = 0;
            let fixtable = this.$refs.js_my_fixtable;
            if(this.common.isNotBlank(fixtable)){
                fixtable.style.left = 0;
            }
        },
        async initHead() {
            this.headTr2 = [];  //重置表头数组，以防二次初始化数组重复
            if(this.common.isNotBlank(this.head)){
                //列表列权限处理
                let newHead = [];
                let entityIds = localStorage.getItem("entityIds").split(",");
                let entityIdSet = new Set();
                for (let i = 0; i < entityIds.length; i++)
                    entityIdSet.add(entityIds[i]);
                this.head.forEach(item => {
                    if (this.common.isBlank(item.entityId))
                        newHead.push(item);
                    else
                    {
                        if (entityIdSet.has(item.entityId))
                            newHead.push(item);
                    }
                })
                this.headList = this.common.copyObj(newHead);
            }
            this.headList.forEach((item,index) => {
                this.$set(item, "isShow", true);//默认展示
                // this.$set(item, "isFix", false);//默认不固定
                item.code = item.code?item.code:'code'+index;   //没设置code的时候添加一个
                if(this.common.isBlank(item.width)){
                    this.$set(item, "width", this.defaultW);//没配置宽度设置默认宽度
                }
                if(this.common.isNotBlank(item.children)){
                    this.initHeadMutil(item.children);//表头多行情况处理
                }
            })
            this.headCache = this.common.copyObj(this.headList);
            await this.initTableSet();    //初始化table设置
            this.calcWidth();   //重新计算表格宽度
            this.$forceUpdate();            
            this.$nextTick(() => {
                this.stretch(); //初始化表格拖动
            })
        },
        //表头数组遍历（合并表头数组时会多次调用）
        reForHead(){
            for(let i=0;i<this.headListCopy.length;i++){
                let item = this.headListCopy[i];
                if(this.common.isNotBlank(item.children) && item.isShow && !item.isFix){
                    this.headH = 60;
                    item.children.forEach(el => el.parentCode = item.code);
                    //把表格实质需要字段提取出来
                    this.headListCopy.splice(i,1,...item.children);
                    this.reForHead();
                    break;
                }
            }
        },
        // 表头多行情况处理
        initHeadMutil(list){
            this.headMutilLine = true;
            list.forEach(el => {
                this.$set(el, "isShow", true);//默认展示
                // this.$set(el, "isFix", false);//默认不固定
                if(this.common.isBlank(el.width)){
                    this.$set(el, "width", this.defaultW);//没配置宽度设置默认宽度
                }
                el.parentCode = list.code;
                this.headTr2.push(el);
            })
        },
        async initTableSet(){
            let table = await this.common.postUrl("tableHeadConfigTF", "loadSysTableHeadConfigList",{tableName:this.tableName});
            if(this.common.isBlank(table) || table.length === 0) return;
            //展示隐藏，固定列处理
            let newList = [];
            let oldList = [];
            let tableMap = new Map();
            table.forEach(data => {
                tableMap.set(data.headCode,data);
            })
            this.headList.forEach((item,index) => {
                item.isShow = true;
                if(tableMap.has(item.code)){
                    let data = tableMap.get(item.code);
                    item.isShow = data.isDisplay==1?true:false;
                    if(this.common.isNotBlank(data.headWidth)){
                        item.width = data.headWidth;
                        // 多行表头时，给children平均分配宽度
                        if(this.headMutilLine && item.children && item.children.length > 0){
                            let childWidth = Math.floor(data.headWidth / item.children.length);
                            item.children.forEach((child, idx) => {
                                // 最后一个子项加上剩余宽度
                                child.width = idx === item.children.length - 1
                                    ? childWidth + (data.headWidth % item.children.length)
                                    : childWidth;
                            });
                        }
                    }
                    if(data.isFix == 1){  //为1时侧固定
                        item.isFix = true;
                    }
                    item.headIndex = data.headIndex;
                    oldList.push(item);
                }else{
                    item.indexCache = index;
                    newList.push(item);
                }
            })
            oldList = oldList.sort((a,b)=>a.headIndex-b.headIndex);
            //根据indexCache将newList插入oldList对应位置
            newList.forEach(item => {
                let insertIndex = oldList.findIndex(old => old.headIndex > item.indexCache);
                if(insertIndex === -1){
                    oldList.push(item);
                }else{
                    oldList.splice(insertIndex, 0, item);
                }
            });
            this.headList = oldList;
        },
        initShow() {
            //是否展示表格设置
            if (this.common.isNotBlank(this.showSetTable)) this.isShowSetTable = this.showSetTable;
            //是否展示序号
            if (this.common.isNotBlank(this.showNum)) this.isShowNum = this.showNum;
            if (this.common.isNotBlank(this.showSelect)) this.isShowSelect = this.showSelect;
        },
        //外部调用的查询方法
        async load(beanName,methodName,param,fn,errorFn){
            if(this.common.isNotBlank(beanName)) this.beanName = beanName;   //非空时使用传入的beanName
            if(this.common.isNotBlank(methodName)) this.methodName = methodName;   //非空时使用传入的methodName
            if(this.common.isNotBlank(param)) this.loadParam = param; //非空时使用传入的param
            if(this.common.isNotBlank(fn)) this.loadFn = fn;        //非空时使用传入的fn
            this.page = 1;
            let data = await this.doQuery(errorFn);
            // this.initScroll();
            return data;
        },
        getHeadList(){
          return this.headList;
        },
        //实际查询方法
        async doQuery(errorFn){
            this.changeTop(this.$refs.tableHeight.scrollTop);
            this.loadParam.page = this.page;
            this.loadParam.rows = this.rows;
            let data = await this.common.postUrl(this.beanName,this.methodName,this.loadParam,"",errorFn,"",true);
            this.tableData = data.items;
            this.totalNum = data.totalNum;
            this.totalPage = Math.ceil(this.totalNum/this.loadParam.rows);
            this.pageList = [];
            for(let i=0;i<this.totalPage;i++){
                this.pageList[i] = i+1;
            }
            // this.pageList = new Array(this.totalPage);
            if(this.common.isNotBlank(this.loadFn)) this.loadFn(data);
            this.initTableHeight(); //计算表格高度
            // if(this.doSum && !this.doSelectSum){
                this.calcFootSum();
            // }
            if(this.doQrySum){
                let sumData = await this.common.postUrl(this.beanName,this.methodName+"Sum",this.loadParam,"","","",true);
                let headList = this.common.copyObj(this.headList);
                headList.forEach(hd => {
                    hd.sum = this.common.isNotBlank(sumData[hd.code]) ? sumData[hd.code] : '';
                    if(hd.children && hd.children.length>0){
                        hd.children.forEach(el => {
                            el.sum = this.common.isNotBlank(sumData[el.code]) ? sumData[el.code] : '';
                        })
                    }
                })
                this.headList = this.common.copyObj(headList);
                this.$forceUpdate();
            }
            this.$nextTick(()=>{
                this.changeTop(this.$refs.tableHeight.scrollTop);
                this.resetTrHeight();
                this.resetTableTop();
            })
            return data;
        },
        //汇总
        calcFootSum(){
            this.headList.forEach(hd => {
                let sum = '';
                 // if(!this.doSetHdSet||hd.isSum){
                    this.tableData.forEach(item => {
                        // 旧需求是否勾选统计逻辑，现在全部勾选统计
                        if(this.doSelectSum){
                            if(item.isSelect && !isNaN(item[hd.code]))
                            {
                                sum = this.common.accAdd(Number(sum),Number(item[hd.code]));
                            }
                        }else{
                            if(item.isSelect&&item[hd.code]!==''&item[hd.code]!==null){
                                sum = this.common.accAdd(Number(sum),Number(item[hd.code]));
                            }
                        }
                    })
                    if(!isNaN(sum)){
                        // if(Math.floor(sum) !== sum && sum!==''){
                        //     sum = sum.toFixed(2);
                        // }
                        this.$set(hd, "sum", sum);
                    }else{
                        this.$set(hd, "sum", '');
                    }
                    if(this.getSelectItem().length == 0 && this.doSelectSum) {
                        this.$set(hd, "sum", '');
                    }
                // }
                if(this.common.isNotBlank(hd.children)){
                    hd.children.forEach(el => {
                        sum = ''
                        this.tableData.forEach(item => {
                            if(item.isSelect&&item[el.code]!==''&item[el.code]!==null){
                                sum = this.common.accAdd(Number(sum),Number(item[el.code]));
                            }
                        })
                        if(!isNaN(sum)){
                            this.$set(el, 'sum', sum);
                        }else{
                            this.$set(el, 'sum', '');
                        }
                        if(this.getSelectItem().length == 0 && this.doSelectSum) {
                            this.$set(el, 'sum', '');
                        }
                    })
                }
            })
            this.$forceUpdate();
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
        //每页显示10/50/100条数据
        async changeRows(num){
            this.rows = num;
            this.page = 1;
            let data = await this.doQuery();
            this.$emit("changeRows",data.items)
        },
        prePage(){
            if(this.page>1){
                this.page--;
                this.doQuery();
            }else{
                this.$message("已经是第一页了")
            }
        },
        async nextPage(){
            if(this.page<parseInt(this.totalNum/this.rows)+1){
                this.page++;
                await this.doQuery();
                //重置滚动条
                this.$refs.tableHeight.scrollTop = 0;
                this.changeTop(0);
            }else{
                this.$message("已经是最后一页了")
            }
        },
        async changePage(page){
            this.page = page;
            await this.doQuery();
            //重置滚动条
            this.$refs.tableHeight.scrollTop = 0;
            this.changeTop(0);
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
        //单击行方法
        selectRow(data, index) {
            if(this.singleSelect){  //单选逻辑
                if(this.selectAll){  //全选情况下点击选择点击行
                    for (let obj of this.tableData) {
                        this.$set(obj, "isSelect", false);
                    }
                    this.$set(data, "isSelect", true);
                    this.selectAll = false;
                }else{
                    if(data.isSelect){
                        this.$set(data, "isSelect", false);
                    }else{
                        for (let obj of this.tableData) {
                            this.$set(obj, "isSelect", false);
                        }
                        this.$set(data, "isSelect", true);
                    }
                }
            }else{  //多选逻辑
                this.$set(data, "isSelect", data.isSelect ? false : true);
                this.selectAll = true;
                for (let obj of this.tableData) {
                    if (!obj.isSelect) {
                        this.selectAll = false;
                    }
                }
            }
            this.$emit("clickItem",data);
            if(this.doSelectSum&&!this.doQrySum) this.calcFootSum();
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
            if(this.doSelectSum&&!this.doQrySum) this.calcFootSum();
            //返回两个参数，selectAll是否全选，data整个表格数据
            this.$emit("selectAll",{selectAll:this.selectAll,data:this.tableData});
        },
        //表格设置
        showSetting() {
            if(this.setTabelShow){
                this.cancelSet();
            }else{
                this.headCache = this.common.copyObj(this.headList);
                this.setTabelShow = true;
                this.isSelectAll();
            }
        },
        //保存表格设置
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
        //清空表格
        clean(){
            this.tableData = [];
            this.page = 1;
            this.rows = 50;
            this.totalNum = 0;
            this.pageList = [];
        },
        hideRow(hd) {
            this.isSelectAll();
        },
        selectAllSet(){
            for(var i in this.headList){
                this.headList[i].isShow = true;
            }
            this.$forceUpdate();
        },
        selectBack(){
            for(var index in this.headList){
                if(this.headList[index].isShow){
                    this.headList[index].isShow = false;
                }else{
                    this.headList[index].isShow = true;
                }
            }
            this.isSelectAll();
            this.$forceUpdate();
        },
        isSelectAll(){
            var isAll = true;
            for(var i in this.headList){
                if(!this.headList[i].isShow){
                    isAll = false;
                    this.selectAllModel = false;
                }
            }
            if(isAll){
                this.selectAllModel = true;
            }
        },
        //固定列逻辑
        fixRow(hd, index) {
            let fixIndex = -1;
            for (let i in this.headList) { //获取固定列的长度
                if (this.headList[i].isFix || i == index) {
                    fixIndex = parseInt(i);
                } else {
                    break;
                }
            }
            let obj = this.headList[index];
            if (hd.isFix) { //确实固定
                this.headList.splice(index, 1);
                if (fixIndex - index == 0) {
                    this.headList.splice(fixIndex, 0, obj);
                } else {
                    this.headList.splice(fixIndex + 1, 0, obj);
                }
            } else { //取消固定
                this.headList.splice(index, 1);
                this.headList.splice(fixIndex, 0, obj);
            }
            this.calcWidth();
        },
        calcWidth() {
            let fixTbW = 0;
            for (let i in this.headList) {
                if (this.headList[i].isFix && this.headList[i].isShow) {
                    if (this.headList[i].width == undefined) {
                        fixTbW = fixTbW + this.defaultW;
                    } else {
                        fixTbW = fixTbW + parseInt(this.headList[i].width);
                    }
                }
            }
            if (this.isShowNum) {
                this.leftTableW = fixTbW + this.num_w;
            } else {
                this.leftTableW = fixTbW;
            }
            if (this.isShowSelect) {
                this.leftTableW += this.multi_w;
            }
        },
        changeTop(top) {
            this.headTop = top;
            this.fixBottomRight = top+this.$refs.tableHeight.offsetHeight-39;
            if(this.fixBottomRight<0){
                let _this = this;
                let timer = setTimeout(() => {
                    _this.changeTop(_this.$refs.tableHeight.scrollTop)
                    clearTimeout(timer);
                }, 300);
            } 
            this.$forceUpdate();
        },
        /**
         * 导出功能
         * filename     文件名
         * exportExcelSelect       是否导出选中数据
         **/
        downloadExcelFile(fileName,exportExcelSelect){
            if(exportExcelSelect){
                // 前端导出
                import('@/utils/excelOut').then(excel => {
                    //表头
                    let tHeader = []
                    //表头对应字段
                    let filterVal = []
                    let list = []
                    this.headList.forEach(el => {
                        tHeader.push(el.name);
                        filterVal.push(el.code);
                    })
                    this.tableData.forEach(item => {
                        if(item.isSelect){
                            list.push(item);
                        }
                    })
                    if(list.length==0){
                        this.$message({message: '请选择至少一条数据',type: 'warning'});
                        return
                    }
                    const data = list.map(v => filterVal.map(j => v[j]))
                    data.map(item => {
                        item.map((i, index) => {
                            if (!i) {
                                item[index] = ''
                            }
                        })
                    })
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename:fileName,   // 文件名
                        autoWidth: true,
                    })
                })
            }else{
                // 后端导出
                let queryUrl = this.beanName+'|'+this.methodName;
                let excelKeys='';
                let excelLables='';

                for(let el of this.headList){
                    if(el.isShow&&(el.excelField==null||el.excelField!=false)){
                        excelKeys+=','+el.code;
                        excelLables+=','+el.name;
                    }
                }
                if(excelKeys.length>0){
                    excelKeys=excelKeys.substr(1);
                    excelLables=excelLables.substr(1);
                }
                if(fileName == null || fileName==undefined ){
                    fileName ="";
                }
                this.common.downloadExcelFile(queryUrl,this.loadParam,excelLables,excelKeys,fileName,this.tableName);
            }


        },
            /**
         * 重设tr高度，以确保固定表头和表格内容的高度一致。
         * 主要用于处理表格内含有图片，且图片加载完成后调整表格行高度的场景。
         */
        resetTrHeight(){
            this.$nextTick(()=>{ // 确保DOM更新后再进行操作
                // 获取固定表头和表格内容中的行
                let trFixArray = this.$refs.js_my_fixtable.querySelector('.fixed-tbody').querySelectorAll("tr");
                let trArray = this.$refs.js_my_table.querySelector('.fixed-tbody').querySelectorAll("tr");
                
                // 检查表格中是否有图片
                let table = this.$refs.js_my_table;
                let imgViews = table.querySelectorAll("img");
                if(imgViews.length > 0){
                    let onloadTotal = 0; // 记录已加载完成的图片数量
                    
                    // 监听每张图片是否加载完成
                    let _this = this;
                    imgViews.forEach(el => {
                        let _img = new Image(); // 创建图片对象以触发加载
                        _img.src = el.src;
                        _img.onload = function(){
                            onloadTotal++;
                            // 当所有图片加载完成时，调整表格行高度
                            if(onloadTotal == imgViews.length){
                                for(let i=0;i<trArray.length;i++){
                                    let height = trArray[i].offsetHeight;
                                    // 对高度为0的行重新调用resetTrHeight，可能因图片未及时加载导致
                                    if(height == 0){
                                        // 未读取到高度则递归继续读取
                                        _this.resetTrHeight();
                                        break;
                                    }else{
                                        // 设置行高度
                                        trFixArray[i].style.height = height+"px";
                                        trArray[i].style.height = height+"px";
                                    }
                                }
                            }
                        }
                    })
                }
                // 无图片时或图片全部加载完成后，统一设置行高度
                trArray.forEach((el,index) => {
                    trFixArray[index].style.height = el.offsetHeight+"px";
                    el.style.height = el.offsetHeight+"px";
                })
            })
        },
        resetTableTop(){
            this.$refs.js_my_fixtable.style.top = 0;
            this.$refs.tableHeight.scrollTop = 0;
        },
        resetTableLeft(){
            this.$refs.js_my_fixtable.style.left = 0;
            this.$refs.tableHeight.scrollLeft = 0;
        },
        // 父组件调用该方法重新赋值表格数据
        resetData(data){
            this.tableData = data;
            this.$forceUpdate();
            this.resetTrHeight();
        },
        // 父组件调用改变行数据
        resetItem(item,index){
            this.tableData[index] = this.common.copyObj(item);
            this.$forceUpdate();
        },
        // 父组件调用该方法重新赋值表格数据
        getData(){
            return this.tableData;
        },
        //计算表格高度
        initTableHeight(){
            this.common.initTableHeight();
        },
        // 悬浮展示信息
        showInfo(item,code){
            if(item.type != 'input' && item.type != 'diyColorTd'){
                item[code+'showInfo'] = true;
                this.$forceUpdate();
            }
        },
        // 隐藏悬浮信息
        hideInfo(item,code){
            if(item.type != 'input' && item.type != 'diyColorTd'){
                item[code+'showInfo'] = false;
                this.$forceUpdate();
            }
        },
        //表单列宽自由拖动
        stretch(){
            let myTAbId = this.$refs.js_my_table;
            let tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
            //document点击调用的方法
            var docMouseUpFn = function(){
                tTD.mouseDown = false;
                removeDocMouseUpFn();
            }
            // 绑定document的mouseup方法，用于处理鼠标操作过快导致的拖动异常
            var bindDocMouseUpFn = function(){
                document.addEventListener('mouseup',docMouseUpFn);
            }
            // 移除document的mouseup方法，防止不必要调用
            var removeDocMouseUpFn = function(){
                document.removeEventListener('mouseup',docMouseUpFn);
            }
            if(this.headList == undefined){
                return;
            }
            let _this = this;
            let moveIndex = 0;  //单元格下标
            // for(let m=0;m<myTAbId.length;m++){
                if(this.headMutilLine){   //多行表头
                    var unset = myTAbId.rows[0].cells.length - _this.headTr1Show.length;
                }else{  //单行表头
                    var unset = myTAbId.rows[0].cells.length - _this.headListShow.length;
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
                            bindDocMouseUpFn();
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
                                _this.isStretch = true;     //正在拖动
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
                                    let code = _this.headTr1Show[moveIndex-unset].code;
                                    let childrenTotal = 0;  //子表头数量，用于均摊宽度
                                    _this.headListShow.forEach(el => {
                                        if(el.code == code || el.parentCode == code){
                                            childrenTotal++;
                                        }
                                    })
                                    if(childrenTotal>0){    //有子表头时候均摊宽度
                                        _this.headTr2.forEach(el => {
                                            if(el.parentCode == code){
                                                el.width = Number(tTD.width)/childrenTotal;
                                            }
                                        })
                                    }else{  //没有子表头时直接赋值高度
                                        _this.headListShow[moveIndex-unset].width = tTD.width;
                                    }
                                    _this.headList.forEach(item => {
                                        if(item.code == code){
                                            item.width = tTD.width;
                                        }
                                    })
                                    _this.$forceUpdate();
                                }else{  //单行表头
                                    let code = _this.headListShow[moveIndex-unset].code;
                                    _this.headListShow[moveIndex-unset].width = tTD.width;
                                    _this.headList.forEach(item => {
                                        if(item.code == code){
                                            item.width = tTD.width;
                                        }
                                    })
                                }
                            }
                        };
                    }
                }
            // }
        },
        /**
         * 点击隐藏弹窗
         */
        windowClose(){
            window.addEventListener("click",()=>{
                if(this.setTabelShow){
                    this.cancelSet();
                }
            });
        },
    },
    directives: {
        myscrolled: {
            bind(el) {

            },
            inserted(el, bindings) {
                let fixtable = bindings.value.that.$refs.js_my_fixtable;
                el.onscroll = function (event) {
                    let left = el.scrollLeft;
                    fixtable.style.left = left + 'px';
                    bindings.value.changeTop(el.scrollTop);
                }
            }
        }
    },
    watch:{
        head:{
            handler(n){
                this.initHead();
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
            if(this.headMutilLine){
                this.headListCopy = this.common.copyObj(this.headList);
                this.headH = 30;
                this.reForHead();
                // 如果存在多表头
                if(this.headMutilLine){
                    this.headTr2 = [];                
                    this.headList.forEach((item,index) => {
                        if(this.common.isNotBlank(item.children) && item.isShow){
                            item.children.forEach(el => {
                                el.parentCode = item.code;
                                this.headTr2.push(el);
                            })
                        }
                    })
                }
                return this.headListCopy.filter(function (item) {
                    return item.isShow&&!item.isFix;
                })
            }else{  
                return this.headList.filter(function (item) {
                    return item.isShow&&!item.isFix;
                })
            }
        },
        headTr1Show: function () {
            return this.headList.filter(function (item) {
                return item.isShow&&!item.isFix;
            })
        },
    }
}
