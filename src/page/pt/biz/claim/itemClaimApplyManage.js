import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'itemClaimApplyManage',
    data()
    {
        return {
            head: [
                {"name": "申请单号", "code": "applyNum", "width": "120", "type": "text"},
                {"name": "申请人", "code": "applyUser", "width": "90", "type": "text"},
                {"name": "申请部门", "code": "applyUserOrg", "width": "150", "type": "text"},
                {"name": "标题", "code": "title", "width": "200", "type": "text"},
                {"name": "紧急程度", "code": "urgentLevelName", "width": "70", "type": "text"},
                {"name": "申请日期", "code": "applyDate", "width": "90", "type": "text"},
                {"name": "申请物品类型", "code": "applyItemTypeName", "width": "90", "type": "text"},
                {"name": "申请理由", "code": "applyReason", "width": "200", "type": "text"},
                {"name": "当前审核人", "code": "currentVerifyUserName", "width": "120", "type": "text"},
                {"name": "部门审核人", "code": "orgVerifyName", "width": "120", "type": "text"},
                {"name": "部门审核时间", "code": "orgVerifyDate", "width": "120", "type": "text"},
                {"name": "部门审核备注", "code": "orgVerifyRemark", "width": "120", "type": "text"},
                {"name": "人事审核人", "code": "hrVerifyUserName", "width": "120", "type": "text"},
                {"name": "人事审核时间", "code": "hrVerifyDate", "width": "120", "type": "text"},
                {"name": "人事审核备注", "code": "hrVerifyRemark", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "130", "type": "text"},
            ],
            query: this.initQuery(),
            stateData: [],
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.initData();
        await this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData()
        {
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_VERIFY_STATE"});
        },
        initQuery(init)
        {
            this.query = {
                applyNum: '',
                applyUserOrg: '',
                applyUser: '',
                currentVerifyUserName:this.common.isBlank(this.$route.query.currentVerifyUserName) ? null : this.$route.query.currentVerifyUserName,
                verifyState: this.common.isBlank(this.$route.query.verifyState) ? [] : init ? [] : this.$route.query.verifyState,
            };
            return this.query;
        },
        async doQuery()
        {
            let {items} = await this.$refs.table.load("claimApplyServiceImpl", "loadClaimApplyPage", this.query);
            this.tableData = items;
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async addClaimApply()
        {
            let data = {
                urlId: 'claimAdd',
                urlName: '新增物品领用申请单',
                urlPathName: '/claimAdd',
                urlPath: "/pt/biz/claim/add/addItemClaimApply.vue",
            }
            await this.open(data);
        },
        async updateClaimApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要需要修改的物品领用申请单！");
                return false;
            }
            if (enumData.applyVerifyState.approved == selectData[0].verifyState)
            {
                this.$message.error("审核完的物品领用申请单不可以修改！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有物品领用申请人自己才可以修改！");
                return false;
            }
            let param = this.common.copyObj(selectData[0]);
            param.urlId = "claimUpdate" + param.id;
            param.urlName = "修改物品领用申请单";
            param.urlPathName = "/claimUpdate";
            param.urlPath = "/pt/biz/claim/add/addItemClaimApply.vue";
            await this.open(param);
        },
        async dblclickItem(data)
        {
            let param = {id : data.id};
            param.urlId = "claimDetail" + param.id;
            param.urlName = "查看物品领用申请单";
            param.urlPathName = "/claimDetail";
            param.urlPath = "/pt/biz/claim/detail/itemClaimApplyDetailMain.vue";
            await this.open(param);
        },
        async deleteClaimApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的物品领用申请单！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有物品领用申请人自己才可以删除！");
                return false;
            }
            if (!(enumData.applyVerifyState.notReviewed == selectData[0].verifyState || enumData.applyVerifyState.noApproved == selectData[0].verifyState))
            {
                this.$message.error("只有未审核或审核不通过的物品领用申请单才可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("claimApplyServiceImpl", "deleteClaimApplyById", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async verifyClaimApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的物品领用申请单！");
                return false;
            }
            if (!(enumData.applyVerifyState.notReviewed == selectData[0].verifyState || enumData.applyVerifyState.approving == selectData[0].verifyState))
            {
                this.$message.error("只有未审核或审核中的物品领用申请单才可以审核！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].currentVerifyUserId)
            {
                this.$message.error("您不是当前的审核人！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("您正在操作审核确认，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核备注',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.type = 1;
                        await that.common.postUrl("claimApplyServiceImpl", "verifyClaimApplyById", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.type = 2;
                        await that.common.postUrl("claimApplyServiceImpl", "verifyClaimApplyById", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        // 审批流程设置
        setProcess()
        {
            this.$emit("openTab",{
                urlId: new Date().getTime(),
                urlName: "领用审批流程设置",
                urlPath: "/pt/biz/claim/processSet.vue",
                query: {branchType: 2}});
        }

    },
    computed:{
        formData(){
            return [
                {"name":"申请单号","placeholder":"请输入申请单号","model":"applyNum","type":"input","isshow":true},
                {"name":"申请人","placeholder":"请输入申请人","model":"applyUser","type":"input","isshow":true},
                {"name":"当前审核人","placeholder":"请输入当前审核人","model":"currentVerifyUserName","type":"input","isshow":true},
                {"name":"申请部门","placeholder":"请输入申请部门","model":"applyUserOrg","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","multiple":true, "method":"doQuery","isshow":true},
            ]
        }
    },
}
