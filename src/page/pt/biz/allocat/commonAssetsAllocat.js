export default {
    name: 'commonAssetsAllocat',
    data()
    {
        return {
            allocat: this.initAllocat(),
            urgentLevelData: [],//紧急程度
            allocatSrcOrgData: [],//调出部门
            allocatDestOrgData: [],//调入部门
            allocatSrcVerifyData: [],//调出部门审核人
            allocatDestVerifyData: [],//调入部门审核人
            saveFlag: false,
        }
    },
    async mounted()
    {
        await this.initData();
    },
    methods: {
        initAllocat()
        {
            return {
                title: '',
                allocatNum: '',
                urgentLevel: '1',//默认正常
                applyUser: this.common.userInfo().userName,
                applyUserOrg: this.common.userInfo().orgName,
                applyDate: this.common.formatDate.getDate(),
                allocatSrcOrgId: '',
                allocatDestOrgId: '',
                allocatDate: this.common.formatDate.getDate(),
                allocatSrcVerifyId: null,
                allocatDestVerifyId: null,
                hrVerifyUserName: null,
                allocatSrcVerifyDate: null,
                allocatDestVerifyDate: null,
                hrVerifyDate: null,
                currentVerifyUserName: null,
                allocatReason: '',
                list: [this.initDetail()],
            }
        },
        initDetail()
        {
            return {
                assetsType: '',
                assetsName: '',
                assetsDescribe: '',
                assetsCount: '1',
                assetsOriginal: '',
                assetsDepreciation: '',
                assetsNum: '',
                assetsRemark: '',
            }
        },
        async initData()
        {
            this.urgentLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "URGENT_LEVEL"});
            this.allocatSrcOrgData = await this.common.postUrl("assetsAllocatServiceImpl", "getSelectOrgData", {});
            this.allocatDestOrgData = this.common.copyObj(this.allocatSrcOrgData);
        },
        async loadAllocatSrcVerifyData(orgId, noInit)
        {
            if (!noInit)
                this.allocat.allocatSrcVerifyId = null;//修改部门初始化
            this.allocatSrcVerifyData = await this.common.postUrl("assetsAllocatServiceImpl", "getUserSelectData", {orgId: orgId, entityId: 1009015});
            this.$forceUpdate();
        },
        async loadAllocatDestVerifyData(orgId, noInit)
        {
            if (!noInit)
                this.allocat.allocatDestVerifyId = null;//修改部门初始化
            this.allocatDestVerifyData = await this.common.postUrl("assetsAllocatServiceImpl", "getUserSelectData", {orgId: orgId, entityId: 1009015});
            this.$forceUpdate();
        },
        addDetail()
        {
            if (this.allocat.list.length >= 20)
            {
                this.$message.error("不能超过20个！");
                return false;
            }
            this.allocat.list.push(this.initDetail());
        },
        removeDetail(detail, index)
        {
            this.allocat.list.splice(index, 1);
        },
        async saveOrUpdateAssetsAllocat()
        {
            if (this.saveFlag)
            {
                this.$message.error("请重新勿重复保存！");
                return false;
            }
            if (this.common.isBlank(this.allocat.title))
            {
                this.$message.error("请填写标题!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatNum))
            {
                this.$message.error("请填写调拨编号!");
                return false;
            }
            if (this.common.isBlank(this.allocat.urgentLevel))
            {
                this.$message.error("请选择紧急程度!");
                return false;
            }
            if (this.common.isBlank(this.allocat.applyUser))
            {
                this.$message.error("请填写申请人!");
                return false;
            }
            if (this.common.isBlank(this.allocat.applyUserOrg))
            {
                this.$message.error("请填写申请人部门!");
                return false;
            }
            if (this.common.isBlank(this.allocat.applyDate))
            {
                this.$message.error("请填写申请日期!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatSrcOrgId))
            {
                this.$message.error("请选择调出部门!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatDestOrgId))
            {
                this.$message.error("请选择调入部门!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatDate))
            {
                this.$message.error("请填写调拨日期!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatSrcVerifyId))
            {
                this.$message.error("请选择调出部门审核人!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatDestVerifyId))
            {
                this.$message.error("请选择调入部门审核人!");
                return false;
            }
            if (this.common.isBlank(this.allocat.allocatReason))
            {
                this.$message.error("请填写调拨原因!");
                return false;
            }

            //明细校验
            if (this.common.isBlank(this.allocat.list) || this.allocat.list.length === 0)
            {
                this.$message.error("请至少填写一条资产明细数据!");
                return false;
            }
            for (let i = 0; i < this.allocat.list.length; i++)
            {
                let detail = this.allocat.list[i];
                if (this.common.isBlank(detail.assetsType))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的资产型号!");
                    return false;
                }
                if (this.common.isBlank(detail.assetsName))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的资产名称!");
                    return false;
                }
                if (this.common.isBlank(detail.assetsDescribe))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的资产描述!");
                    return false;
                }
                if (this.common.isBlank(detail.assetsCount))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的数量!");
                    return false;
                }
                if (this.common.isBlank(detail.assetsOriginal))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的资产原价值!");
                    return false;
                }
                if (this.common.isBlank(detail.assetsDepreciation))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的资产折旧价值!");
                    return false;
                }
            }
            await this.common.postUrl("assetsAllocatServiceImpl", "saveOrUpdateAssetsAllocat", this.allocat);
            this.$message.success((this.common.isNotBlank(this.$route.query.id) ? "固定资产调拨修改" : "固定资产调拨保存") + "成功！");
            this.saveFlag = true;
            //清空申请号
            if (this.common.isBlank(this.allocat.id))
                localStorage.setItem("assetsAllocatNum" + this.common.formatDate.getDate(), "");
            setTimeout(() =>
            {
                this.saveFlag = false;
                this.closePage();
            }, 500);
        },
        async loadAssetsAllocatById()
        {
            this.allocat = await this.common.postUrl("assetsAllocatServiceImpl", "loadAssetsAllocatById", this.$route.query);
            await this.loadAllocatSrcVerifyData(this.allocat.allocatSrcOrgId, true);
            await this.loadAllocatDestVerifyData(this.allocat.allocatDestOrgId, true);
        },
        closePage(flag)
        {
            if (flag)
                this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
            else
                this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
    components: {
    },
}


