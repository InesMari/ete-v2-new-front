import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'iterationManage',
    data()
    {
        return {
            head: [
                {"name": "单号", "code": "number", "width": "150", "type": "text"},
                {"name": "标题", "code": "title", "width": "250", "type": "text"},
                {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "120", "type": "diy"},
                {"name": "计划开始时间", "code": "planStartDate", "width": "150", "type": "text"},
                {"name": "计划结束时间", "code": "planEndDate", "width": "150", "type": "text"},
                {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
                {"name": "验证人", "code": "testUserName", "width": "80", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            stateData:{
                stateData101:[],
                stateData102:[],
                stateData103:[],
            },
            stateDisable:true,
            itId:-1,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"单号","model":"number","type":"input","isshow":true},
                {"name":"标题","model":"title","type":"input","isshow":true},
                {"name":"负责人","model":"assignedToUserName","type":"input","isshow":true},
                {"name":"验证人","model":"testUserName","type":"input","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        this.initData();
        this.initEditFlag();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery()
        {
            this.query = {
                number: '',
                title: '',
                assignedToUserName: '',
                testUserName: '',
                relatedToMe:'',
                requirement:'',
                task:'',
                bug:'',
                unfinished:'1',
            }
            return this.query;
        },
        initEditFlag(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            entityIds.forEach(item => {
                if(item == 1007103){
                    this.stateDisable = false;
                }
            });
        },
        /**
         * 查询列表
         */
        async doQuery(query = this.query) {
            this.query = query;
            this.query.itId = this.itId;
            let {items} = await this.$refs.table.load("projIterationTF", "queryProjIterationRelItemInfoPage", this.query);
            items.forEach((el) => {
                if ((el.type == 101 && el.state == 6)
                    || (el.type == 102 && (el.state == 7 || el.state == 8))
                    || (el.type == 103 && el.state == 8)) {
                    el.disabled = true;
                }
                el.state = el.state+'';
            })
            this.$refs.table.resetData(items);
        },
        /**
         * 初始化数据
         */
        async initData(){
            this.stateData.stateData101 = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_STATE"});
            this.stateData.stateData102 = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "TASK_STATE"});
            this.stateData.stateData103 = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUG_STATE"});
        },

        /**
         * 双击打开详情页面
         */
        dblclickItem(item){
            if(item.type==101){
                this.gotoRequirement(item.id);
            }else if(item.type==102){
                this.gotoTask(item.id);
            }else{
                this.gotoBug(item.id);
            }
        },
        /**
         * 双击打开详情页面
         */
        gotoTask(id){
            this.$emit("openTab",{
                urlId: 'viewTask' + new Date().getTime(),
                query: {id:id},
                urlName: "任务详情",
                urlPathName: "/viewTask",
                urlPath: "/pt/proj/task/taskDetail.vue"});
        },
        gotoRequirement(id){
            this.$emit("openTab",{
                urlId: 'viewRequirement' + new Date().getTime(),
                query: {id:id},
                urlName: "需求详情",
                urlPathName: "/viewRequirement",
                urlPath: "/pt/proj/requirement/requirementDetail.vue"});
        },
        gotoBug(id){
            this.$emit("openTab",{
                urlId: 'viewBug' + new Date().getTime(),
                query: {id:id},
                urlName: "缺陷详情",
                urlPathName: "/viewBug",
                urlPath: "/pt/proj/bug/bugDetail.vue"});
        },
        /**
         * 新增
         */
        addRequirement(){
            this.$emit("openTab",{
                urlId: 'addRequirement' + new Date().getTime(),
                query: {iterationId:this.itId},
                urlName: "新增需求",
                urlPathName: "/addRequirement",
                urlPath: "/pt/proj/requirement/addRequirement.vue"});
        },
        addTask(){
            this.$emit("openTab",{
                urlId: 'addTask' + new Date().getTime(),
                query: {iterationId:this.itId},
                urlName: "新增任务",
                urlPathName: "/addTask",
                urlPath: "/pt/proj/task/addTask.vue"});
        },
        addBug(){
            this.$emit("openTab",{
                urlId: 'addBug' + new Date().getTime(),
                query: {iterationId:this.itId},
                urlName: "新增缺陷",
                urlPathName: "/addBug",
                urlPath: "/pt/proj/bug/addBug.vue"});
        },
        updateRelItemInfoByField(item,field){
            let param = {
                id:item.id,
                fieldName:field,
                fieldValue:item[field]
            };
            let beanName = '';
            let method = '';
            if(item.type==101){
                beanName = 'projRequirementTF';
                method = 'updateRequirementInfoByField';
            }else if(item.type==102){
                beanName = 'projTaskTF';
                method = 'updateTaskInfoByField';
            }else{
                beanName = 'projBugTF';
                method = 'updateBugInfoByField';
            }

            let that = this;
            this.common.postUrl(beanName, method, param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$forceUpdate();
                }
            },null,'',true);
            this.$forceUpdate();
        },


    },
}
