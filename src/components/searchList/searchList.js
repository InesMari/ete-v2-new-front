import vuedraggable from 'vuedraggable';
import monthsPicker from "@/components/monthsPicker/monthsPicker.vue";
export default {
    name: 'searchList',
    props: {
        "formData":Array,               //表单数组
        "searchKey":String,             //数据库保存字段
        "query":{                       //查询字段
            type: Object,
            default: () => {
              return {}
            }
          },
    },
    data() {
        return {
            params:{},
            isshowSearchList:false,
            formList:[],
            textareaFocus:false,
        }
    },
    mounted() {
        this.windowClose();
        this.initFormData();
        this.$forceUpdate();
        this.$nextTick(()=>{            
            this.common.initTableHeight(); //计算表格高度
        })
    },
    components: {
        vuedraggable,
        monthsPicker
    },
    methods: {
        // 初始化数据
        initFormData(){
            this.formList = this.common.copyObj(this.formData);     //复制页面配置数组
            let sysSearchParam = JSON.parse(localStorage.getItem("sysSearchParam"));    //获取数据库保存爆破
            let formData = sysSearchParam?sysSearchParam[this.searchKey]:null;
            if(this.common.isNotBlank(formData)){
                this.formList = [];
                formData.forEach(el=>{
                    this.formData.forEach(item=>{
                        if(el.model == item.model){
                            if(el.isShow==1){
                                item.isshow = true;
                            }else if(el.isShow==0){
                                item.isshow = false;
                            }
                            item.isPush = true;
                            if(item.if!=false) this.formList.push(item);
                        }
                    })
                })
                // 新增数据插入
                this.formData.forEach(item=>{
                    if(!item.isPush){
                        this.formList.push(item);
                    }
                })
            }
            this.params = this.common.copyObj(this.query);
            this.$forceUpdate();
        },
        /**
         * 展示隐藏筛选条件
         */
        searchShowChange(data){
            this.params[data.model] = "";
            data.isshow = data.isshow?true:false;
            this.$forceUpdate();
        },
        /**
         *
         * @param {选择返回值} event
         * @param {需要触发的父组件方法名} method
         * @param {改动的选择框识别字段} model
         */
        selectChange(event,method,model){
            if(this.common.isNotBlank(method)) this.$parent[method](this.params,event,model);
        },
        // 查询
        doQuery(){
            this.$emit("doQuery",this.params);
        },
        /**
         *
         * @param {选择返回值} event
         * @param {需要触发的父组件方法名} method
         * @param {改动的选择框识别字段} model
         */
         cascaderChange(event,method,model){
            if(this.common.isNotBlank(method)) this.$parent[method](this.params,event,model);
        },
        // 清空
        cleanQuery(){
            if(this.common.isNotBlank(this.$listeners.clearFn)){
                this.$emit("clearFn",this.params);
            }else{
                this.formList.forEach(el => {
                    if(!el.noClear){
                        if(el.multiple){
                            this.params[el.model] = [];
                        }else if(el.type=="monthsPicker"){
                            this.params[el.model] = [];
                            this.$refs.monthsPicker[0].clear();
                        }else if(el.type=="months"){
                            this.params[el.model] = [];
                        }else if(el.type=="years"){
                            this.params[el.model] = [];
                        }else{
                            this.params[el.model] = "";
                            if(el.children&&el.children.length > 1){
                                this.params[el.children[0].model] = "";
                                this.params[el.children[1].model] = "";
                            }
                        }
                    }
                })
            }
        },
        // 展示操作列表
        showSearchList(){
            this.searchShowAll();
            this.isshowSearchList = this.isshowSearchList?false:true;
            if(!this.isshowSearchList){
                this.initFormData();
            }
        },
        // 保存配置
        async saveSearchList(){
            let searchParamConfigList = [];
            this.formList.forEach(el=>{
                let obj = {
                    model:el.model,
                    isShow:el.isshow?1:0
                }
                searchParamConfigList.push(obj);
            })
            await this.common.postUrl("sysSearchParamConfigTF", "saveSysTableHeadConfigs",{searchKey:this.searchKey,searchParamConfigList});
            this.resetSysSearchParam();
            this.isshowSearchList = false;
            this.$message.success("保存成功！");
        },
        // 重新保存storage设置
        async resetSysSearchParam(){
            let res = await this.common.postUrl("sysSearchParamConfigTF", "loadSysSearchParamConfigList", {});
            if (this.common.isNotBlank(res)) localStorage.setItem("sysSearchParam", JSON.stringify(res));//刷新首页重新赋值过滤条件配置
        },
        /**
         * 点击隐藏弹窗
         */
        windowClose(){
            window.addEventListener("click",()=>{
                if(this.isshowSearchList){
                    this.isshowSearchList = false;
                    this.initFormData();
                }
            })
        },
        // 展开筛选栏
        searchShowAll(){
            let searchFormDom = this.$refs.searchForm;  //搜索条件
            let downDom = this.$refs.arrowDown; //向下图标
            let upDom = this.$refs.arrowUp; //向下图标
            searchFormDom.style.height = 'auto';
            upDom.style.display = "block";
            downDom.style.display = "none";
            this.common.initTableHeight();
        },
        // monthsPicker组件，选择回调
        chooseMonths(method,model){
            let months = this.$refs.monthsPicker[0].getData();
            this.params[model] = months;
            this.$parent[method](months);
        },
        // textarea焦点处理
        setTextareaFocus(){
            this.textareaFocus = this.textareaFocus?false:true;
            this.$refs.searchForm.scrollTop = 0;    //防止textarea把盒子撑变形
            this.searchShowAll();
        },
        textareaKeyup(event){
            event.stopPropagation();
            if(!event.shiftKey && event.keyCode==13){
                this.doQuery();
            }
        }
    },
    watch:{
        formData:{
            handler(n){
                this.initFormData();
            },
            deep:true
        },
        query:{
            handler(n){
                this.params = this.common.copyObj(n);
            },
            deep:true
        }
    },
}
