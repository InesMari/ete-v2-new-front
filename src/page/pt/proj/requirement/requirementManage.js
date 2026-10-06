import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'requirementManage',
    data()
    {
        return {
            head: [
                {"name": "需求单号", "code": "requirementNum", "width": "150", "type": "text"},
                {"name": "需求标题", "code": "title", "width": "250", "type": "text"},
                {"name": "需求来源", "code": "requirementClassName", "width": "90", "type": "text"},
                {"name": "需求类型", "code": "typeName", "width": "90", "type": "text"},
                {"name": "迭代", "code": "iterationId", "width": "150", "type": "diy"},
                {"name": "优先级", "code": "priorityName", "width": "70", "type": "text"},
                {"name": "采纳状态", "code": "acceptStateName", "width": "70", "type": "text"},
                {"name": "不采纳理由", "code": "refuseDesc", "width": "180", "type": "text"},
                {"name": "需求状态", "code": "stateName", "width": "120", "type": "diy"},
                {"name": "需求人", "code": "srcUserName", "width": "80", "type": "text"},
                {"name": "需求部门", "code": "srcOrgName", "width": "150", "type": "text"},
                {"name": "需求客户", "code": "srcTenantName", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "srcSettleBodyName", "width": "220", "type": "text"},
                {"name": "工时", "code": "workHours", "width": "90", "type": "text"},
                {"name": "需求确认人", "code": "confirmUserName", "width": "80", "type": "text"},
                {"name": "需求确认时间", "code": "confirmDate", "width": "150", "type": "text"},
                {"name": "负责人", "code": "assignedToUserName", "width": "80", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(),
            requirementClassData:[],
            acceptStateData:[],
            stateData:[],
            stateDisable:true,
            iterationData:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"需求单号","model":"requirementNum","type":"input","isshow":true},
                {"name":"需求标题","model":"title","type":"input","isshow":true},
                {"name":"需求来源","model":"requirementClass","type":"select","options":this.requirementClassData,"label":"codeName","value":"codeValue","method":"doQuery",multiple:true,"isshow":true},
                {"name":"需求人","model":"srcUserName","type":"input","isshow":true},
                {"name":"需求部门","model":"srcOrgName","type":"input","isshow":true},
                {"name":"创建人","model":"createUserName","type":"input","isshow":true},
                {"name":"负责人","model":"assignedToUserName","type":"input","isshow":true},
                {"name":"采纳状态","model":"acceptStates","type":"select","options":this.acceptStateData,"label":"codeName","value":"codeValue","method":"doQuery",multiple:true,"isshow":true},
                {"name":"需求状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","method":"doQuery",multiple:true,"isshow":true},
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
                requirementNum: '',
                title: '',
                requirementClass:'',
                srcUserName: '',
                srcOrgName: '',
                createUserName: '',
                assignedToUserName: '',
                acceptState: '',
                states: [],
                relatedToMe:0,
                unfinished:"1",
            }
            return this.query;
        },
        initEditFlag(){
            let entityIds = localStorage.getItem("entityIds").split(",");
            entityIds.forEach(item => {
                if(item == 1007091){
                    this.stateDisable = false;
                }
            });
        },
        /**
         * 列表查询
         */
        async doQuery(query = this.query) {
            this.query = query;
            let {items} = await this.$refs.table.load("projRequirementTF", "queryRequirementPage", this.query);
            items.forEach((el) => {
                if (el.state == 6) {
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
            this.requirementClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_CLASS"});
            this.acceptStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCEPT_STATE"});
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUIREMENT_STATE"});
            this.iterationData = await this.common.postUrl("projIterationTF", "queryProjIterationInfoList", {state: 1});
        },

        /**
         * 双击打开详情页面
         */
        dblclickItem(item){
            this.$emit("openTab",{
                urlId: 'viewRequirement' + new Date().getTime(),
                query: {id:item.id},
                urlName: "需求详情",
                urlPathName: "/viewRequirement",
                urlPath: "/pt/proj/requirement/requirementDetail.vue"});
        },
        /**
         * 新增
         */
        add(){
            this.$emit("openTab",{
                urlId: 'addRequirement' + new Date().getTime(),
                urlName: "新增需求",
                urlPathName: "/addRequirement",
                urlPath: "/pt/proj/requirement/addRequirement.vue"});
        },
        /**
         * 修改
         */
        update(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要修改的需求！");
                return;
            }
            //
            if (selectData[0].acceptState != 1) {
                this.$message.error("该需求的采纳状态不是待处理，不能修改！");
                return;
            }
            this.$emit("openTab",{
                urlId: 'updateRequirement' + new Date().getTime(),
                query: {id:selectData[0].id},
                urlName: "需求详情",
                urlPathName: "/updateRequirement",
                urlPath: "/pt/proj/requirement/requirementDetail.vue"});

        },
        /**
         * 处理
         */
        deal(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要处理的需求！");
                return;
            }
            this.$emit("openTab",{
                urlId: 'dealRequirement' + new Date().getTime(),
                query: {id:selectData[0].id},
                urlName: "需求详情",
                urlPathName: "/dealRequirement",
                urlPath: "/pt/proj/requirement/requirementDetail.vue"});
        },
        /**
         * 删除
         */
        del(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要删除的需求！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除需求",
                message: h('p', null, [
                    h('span', null, "此操作将需求："),
                    h('i', { style: 'color: red' }, selectData[0].requirementNum),
                    h('span', null, "删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("projRequirementTF", "delRequirementInfo", {id:selectData[0].id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消删除");
            });

        },
        confirm(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要确认的需求！");
                return;
            }
            if (selectData[0].acceptState == 3) {
                this.$message.error("该需求已确定，无需重复操作！");
                return;
            }
            if (selectData[0].confirmUserId != this.common.userInfo().userId) {
                this.$message.error("该需求的需求确认人不是你，无权操作！");
                return;
            }
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "确认需求",
                message: h('p', null, [
                    h('span', null, "此操作将需求："),
                    h('i', { style: 'color: red' }, selectData[0].requirementNum),
                    h('span', null, "确认，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("projRequirementTF", "confirmRequirementInfo", {id:selectData[0].id}, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("需求确认成功！");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消确认");
            });
        },
        /**
         * 导出
         */
        download(){
            this.$refs.table.downloadExcelFile('需求列表');
        },
        updateRequirementInfoByField(item,field){
            let param = {
                id:item.id,
                fieldName:field,
                fieldValue:item[field]
            };
            let that = this;
            this.common.postUrl("projRequirementTF", "updateRequirementInfoByField", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$forceUpdate();
                }
            },null,'',true);
            this.$forceUpdate();
        },

    },
}
