import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'bugManage',
    data()
    {
        return {
            head: [
                {"name": "缺陷单号", "code": "bugNum", "width": "120", "type": "text"},
                {"name": "缺陷标题", "code": "title", "width": "250", "type": "text"},
                {"name": "迭代", "code": "iterationId", "width": "150", "type": "diy"},
                {"name": "关联任务", "code": "relTaskNum", "width": "120", "type": "diy"},
                {"name": "父缺陷", "code": "parentBugNum", "width": "120", "type": "diy"},
                {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
                {"name": "严重程度", "code": "severityName", "width": "70", "type": "text"},
                {"name": "缺陷状态", "code": "stateName", "width": "120", "type": "diy"},
                {"name": "不修复理由", "code": "refuseDesc", "width": "180", "type": "text"},
                {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
                {"name": "验证人", "code": "testUserName", "width": "80", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            stateData:[],
            stateDisable:true,
            iterationData:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"缺陷单号","model":"bugNum","type":"input","isshow":true},
                {"name":"缺陷标题","model":"title","type":"input","isshow":true},
                {"name":"创建人","model":"createUserName","type":"input","isshow":true},
                {"name":"负责人","model":"assignedToUserName","type":"input","isshow":true},
                {"name":"验证人","model":"testUserName","type":"input","isshow":true},
                {"name":"缺陷状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","method":"doQuery",multiple:true,"isshow":true},
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
                bugNum: '',
                title: '',
                createUserName: '',
                assignedToUserName: '',
                testUserName: '',
                states: [],
                relatedToMe:'1',
                unfinished:"1",
            }
            return this.query;
        },
        initEditFlag(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            entityIds.forEach(item => {
                if(item == 1007099){
                    this.stateDisable = false;
                }
            });
        },
        /**
         * 查询列表
         */
        async doQuery(query = this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("projBugTF", "queryProjBugInfoPage", this.query);
            items.forEach((el) => {
                if (el.state == 8) {
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
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUG_STATE"});
            this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
        },

        /**
         * 双击打开详情页面
         */
        dblclickItem(item){
            this.$emit("openTab",{
                urlId: 'viewBug' + new Date().getTime(),
                query: {id:item.id},
                urlName: "缺陷详情",
                urlPathName: "/viewBug",
                urlPath: "/pt/proj/bug/bugDetail.vue"});
        },
        gotoTask(item){
            this.$emit("openTab",{
                urlId: 'viewTask' + new Date().getTime(),
                query: {id:item.relId},
                urlName: "任务详情",
                urlPathName: "/viewTask",
                urlPath: "/pt/proj/task/taskDetail.vue"});
        },
        gotoBug(item){
            this.$emit("openTab",{
                urlId: 'viewBug' + new Date().getTime(),
                query: {id:item.parentId},
                urlName: "缺陷详情",
                urlPathName: "/viewBug",
                urlPath: "/pt/proj/bug/bugDetail.vue"});
        },
        /**
         * 新增
         */
        add(){
            this.$emit("openTab",{
                urlId: 'addBug' + new Date().getTime(),
                urlName: "新增缺陷",
                urlPathName: "/addBug",
                urlPath: "/pt/proj/bug/addBug.vue"});
        },
        /**
         * 修改
         */
        update(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要修改的缺陷！");
                return;
            }
            this.$emit("openTab",{
                urlId: 'updateBug' + new Date().getTime(),
                query: {id:selectData[0].id},
                urlName: "缺陷详情",
                urlPathName: "/updateBug",
                urlPath: "/pt/proj/bug/bugDetail.vue"});

        },
        /**
         * 删除
         */
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要删除的缺陷！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除缺陷",
                message: h('p', null, [
                    h('span', null, "此操作将缺陷："),
                    h('i', { style: 'color: red' }, selectData[0].bugNum),
                    h('span', null, "删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("projBugTF", "delBugInfo", {id:selectData[0].id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });

        },
        trans(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要类型转换的缺陷！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "类型转换",
                message: h('p', null, [
                    h('span', null, "此操作将缺陷："),
                    h('i', { style: 'color: red' }, selectData[0].bugNum),
                    h('span', null, "类型转换，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("projBugTF", "transBugToTask", {id:selectData[0].id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("操作成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        /**
         * 导出
         */
        download(){
            this.$refs.table.downloadExcelFile('缺陷列表');
        },
        updateBugInfoByField(item,field){
            let param = {
                id:item.id,
                fieldName:field,
                fieldValue:item[field]
            };
            let that = this;
            this.common.postUrl("projBugTF", "updateBugInfoByField", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$forceUpdate();
                }
            },null,'',true);
            this.$forceUpdate();
        },

    },
}
