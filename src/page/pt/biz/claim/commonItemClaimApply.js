export default {
    name: 'commonItemClaimApply',
    data()
    {
        return {
            apply: this.initApply(),
            urgentLevelData: [],//紧急程度
            applyItemTypeData: [],//物品申请类型
            orgUserData: [],//部门审核人
            saveFlag: false,
        }
    },
    async mounted()
    {
        await this.initData();
    },
    methods: {
        initApply()
        {
            return {
                title: '',
                applyNum: '',
                urgentLevel: '1',//默认正常
                applyUser: this.common.userInfo().userName,
                applyUserOrg: this.common.userInfo().orgName,
                applyDate: this.common.formatDate.getDate(),
                applyItemType: '',
                orgVerifyUserId: '',
                applyReason: '',
                orgVerifyName: '',
                hrVerifyUserName: '',
                orgVerifyDate: '',
                hrVerifyDate: '',
                list: [this.initItem()],
            }
        },
        initItem()
        {
            return {
                itemType: '',
                itemName: '',
                itemSpecification: '',
                itemCount: '1',
                itemUnit: '',
                itemUse: '',
                itemRemark: '',
            }
        },
        async initData()
        {
            this.applyItemTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_ITEM_TYPE"});
            this.urgentLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "URGENT_LEVEL"});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {orgFlag:1,entityId: 1009011});
        },
        addDetail()
        {
            if (this.apply.list.length >= 20)
            {
                this.$message.error("不能超过20个！");
                return false;
            }
            this.apply.list.push(this.initItem());
        },
        removeDetail(detail, index)
        {
            this.apply.list.splice(index, 1);
        },
        async saveOrUpdateClaimApply()
        {
            if (this.saveFlag)
            {
                this.$message.error("请重新勿重复保存！");
                return false;
            }
            if (this.common.isBlank(this.apply.title))
            {
                this.$message.error("请填写标题!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyNum))
            {
                this.$message.error("请填写申请编号!");
                return false;
            }
            if (this.common.isBlank(this.apply.urgentLevel))
            {
                this.$message.error("请选择紧急程度!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyUser))
            {
                this.$message.error("请填写申请人!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyUserOrg))
            {
                this.$message.error("请填写申请人部门!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyDate))
            {
                this.$message.error("请填写申请日期!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyItemType))
            {
                this.$message.error("请选择物品申请类型!");
                return false;
            }
            if (this.common.isBlank(this.apply.orgVerifyUserId))
            {
                this.$message.error("请选择部门审核人!");
                return false;
            }
            if (this.common.isBlank(this.apply.applyReason))
            {
                this.$message.error("请填写申请理由!");
                return false;
            }
            //明细校验
            if (this.common.isBlank(this.apply.list) || this.apply.list.length == 0)
            {
                this.$message.error("请至少填写一条物品明细数据!");
                return false;
            }
            for (let i = 0; i < this.apply.list.length; i++)
            {
                let detail = this.apply.list[i];
                if (this.common.isBlank(detail.itemType))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的物品类型!");
                    return false;
                }
                if (this.common.isBlank(detail.itemName))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的物品明细!");
                    return false;
                }
                if (this.common.isBlank(detail.itemCount))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的数量!");
                    return false;
                }
                if (this.common.isBlank(detail.itemUnit))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的单位!");
                    return false;
                }
                if (this.common.isBlank(detail.itemUse))
                {
                    this.$message.error("请填写第" + (i + 1) + "行的用途!");
                    return false;
                }
            }
            await this.common.postUrl("claimApplyServiceImpl", "saveOrUpdateClaimApply", this.apply);
            this.$message.success((this.common.isNotBlank(this.$route.query.id) ? "物品领用申请修改" : "物品领用申请保存") + "成功！");
            this.saveFlag = true;
            //清空申请号
            if (this.common.isBlank(this.apply.id))
                localStorage.setItem("applyClaimNum" + this.common.formatDate.getDate(), "");
            setTimeout(() =>
            {
                this.saveFlag = false;
                this.closePage();
            }, 500);
        },
        async loadClaimApplyById()
        {
            this.apply = await this.common.postUrl("claimApplyServiceImpl", "loadClaimApplyById", this.$route.query);
            this.$forceUpdate();
        },
        closePage(flag)
        {
            if (flag)
                this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
            else
                this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
    components: {
    },
}
