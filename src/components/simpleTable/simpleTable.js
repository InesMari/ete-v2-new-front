export default {
    name: 'simpleTable',
    props: [
        "head",             //表头数组
        "height",           //表格高度
        "data",             //表格数据
        "showNum",          //是否显示序号
        "singleSelect",     //是否单选
        "tableName",        //表名
        "noSelect",
        "noIndex",
    ],
    data() {
        return {
            headTop: 0, //默认top
            defaultW:80,
            multi_w: 40, //选择格默认宽度
            isShowNum: false,
            tableData:[],
            selectAll:false,
        }
    },
    mounted() {
        this.common.tableStretch(this.$refs.simpleTable);
        this.initData()
        this.initShow();
    },
    methods: {
        initData(){
            if (this.common.isNotBlank(this.data)) this.tableData = this.common.copyObj(this.data);
        },
        initShow() {
            //是否展示序号
            if (this.common.isNotBlank(this.showNum)) this.isShowNum = this.showNum;
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
            }
            this.$emit("clickItem",data);
        },
        dblclickItem(data){
            this.$emit("dblclickItem",data);
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
        changeTop(top) {
            let tableH = this.$refs.table_height.offsetHeight; //table容器高度
            let fixtableH = this.$refs.simpleTable.offsetHeight; //table高度
            this.headTop = top;
            this._fixBottom = top+tableH;
        },
        //导出功能
        downloadExcelFile(fileName, beanName, methodName, loadParam){
            if (this.common.isBlank(beanName) || this.common.isBlank(methodName))
            {
                console.log("请传入下载的beanName、methodName")
                return;
            }
            let queryUrl = beanName+'|'+methodName;
            let excelKeys='';
            let excelLables='';

            for(let el of this.head){
                excelKeys+=','+el.code;
                excelLables+=','+el.name;
                if(el.isShow){//隐藏了这里没有

                }
            }
            if(excelKeys.length>0){
                excelKeys=excelKeys.substr(1);
                excelLables=excelLables.substr(1);
            }
            if(fileName == null || fileName==undefined){
                fileName ="";
            }
            this.common.downloadExcelFile(queryUrl, loadParam, excelLables, excelKeys, fileName, this.tableName);
        },
        getData(){
            return this.tableData;
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
    watch:{
        data:{
            handler(n){
                this.initData();
            },
            deep: true,     //深度检测
        }
    },
}
