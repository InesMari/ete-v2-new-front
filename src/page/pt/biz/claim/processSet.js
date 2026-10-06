export default {
    name: 'processSet',
    data()
    {
        return {
            userName:this.common.userInfo().userName,
            branchType: this.$route.query.branchType,
            applyItemTypeData: [],//物品申请类型数据
            userData: [],//系统用户数据
            qywxUserData: [],//企业微信用户数据
            branchData: [],//分支数据
            list: [],
            cfg: this.initCfg(),
            defaultCfg: {},//默认配置
            tip: "用户自选,不可修改",
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        
    },
    methods: {
        async initData()
        {
            this.applyItemTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_ITEM_TYPE"});
            this.userData = await this.common.postUrl("userTF", "loadAllUser");
            this.qywxUserData = await this.common.postUrl("userTF", "loadAllUser", {isOnlyLoadQYWX: 1});
            await this.loadData();
        },
        async loadData()
        {
            this.list = await this.common.postUrl("branchCfgService", "loadClaimBranchCfgByBranchTypeOrderDefault", {branchType: this.branchType});
            this.list.forEach(item => {
                if (item.isDefault)
                {
                    item.branchBizType = "所有物品申请类型";
                    this.defaultCfg = item;
                }
            })
            this.$forceUpdate();
        },
        initCfg()
        {
            return this.cfg = {
                branchName: "",
                branchType: this.branchType,
                isDefault: false,
                branchDefault: 0,//都是非默认的
                branchBizType: "",
                orgVerifyName:"部门",
                nextVerifyUserId: "",
                nextVerifyName:"行政",
                gmoaVerifyName:"副总经理",
                gmoVerifyUserId: "",
                gmoVerifyName:"总经理",
                applyGeneratePay: [],
                authSeeUserId: [],
                ccBill: [],
            }
        },
        addCfg: function ()
        {
            let cfg = this.initCfg();
            //拷贝部门默认数据到新增流程
            this.common.isNotBlank(this.defaultCfg)
            {
                cfg.applyGeneratePay = this.common.copyObj(this.defaultCfg.applyGeneratePay);
                cfg.authSeeUserId = this.common.copyObj(this.defaultCfg.authSeeUserId);
                cfg.ccBill = this.common.copyObj(this.defaultCfg.ccBill);
            }
            this.list.push(cfg);
            for (let i = 0; i < this.list.length; i++) {
                this.changeName(1, i);
                this.changeName(2, i);
                this.changeName(3, i);
            }
            this.$forceUpdate();
        },
        removeCfg(cfg, index)
        {
            if (cfg.isDefault)
            {
                this.$message.error("默认流程不允许删除!");
                return;
            }
            this.list.splice(index, 1);
            this.$forceUpdate();
        },
        async saveOrUpdate()
        {
            if (this.list.length === 0)
            {
                this.$message.error("数据错误,请刷新页面试试！");
                return false;
            }
            //重复流程校验
            for (let i = 0; i < this.list.length; i++)
            {
                let data = this.list[i];
                if (this.common.isBlank(data.branchName))
                {
                    this.$message.error("请输入第" + (i + 1) + "条流程的流程名称！");
                    return false;
                }
                if (this.common.isBlank(data.branchBizType))
                {
                    this.$message.error("请选择第" + (i + 1) + "条流程的物品申请类型对应流程！");
                    return false;
                }
            }
            let param = {branchType: this.branchType, list: this.list};
            await this.common.postUrl("branchCfgService", "saveOrUpdateBranchCfg", param);
            this.$message.success("操作成功！");
            this.closePage();
        },
        changeName(type, index)
        {
            let cfg = this.list[index];
            if (type === 1)
            {
                let tip = "";
                let ccBill = cfg.ccBill;
                if (ccBill.length > 0)
                {
                    for(let i in ccBill)
                    {
                        for(let j in this.qywxUserData)
                        {
                            if (this.qywxUserData[j].qywxBillId == ccBill[i])
                            {
                                tip += this.qywxUserData[j].userName + ",";
                                break;
                            }
                        }
                    }
                    tip = tip.substring(0, tip.length - 1);
                }
                cfg.ccBillStr = tip;
            }
            else if (type === 2)
            {
                let tip = "";
                let authSeeUserId = cfg.authSeeUserId;
                if (authSeeUserId.length > 0)
                {
                    for(let i in authSeeUserId)
                    {
                        for(let j in this.userData)
                        {
                            if (this.userData[j].userId == authSeeUserId[i])
                            {
                                tip += this.userData[j].userName + ",";
                                break;
                            }
                        }
                    }
                    tip = tip.substring(0, tip.length - 1);
                }
                cfg.authSeeUserIdStr = tip;
            }
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },

    },

}
