export default {
    name: 'processSet',
    data()
    {
        return {
            userName:this.common.userInfo().userName,
            branchType: this.$route.query.branchType,
            purchaseTypeData: [],//采购类型数据
            userData: [],//系统用户数据
            qywxUserData: [],//企业微信用户数据
            branchData: [],//分支数据
            list: [],
            cfg: this.initCfg(),
            defaultCfg: {},//默认配置
            orgData: [],
            tip: '用户自选,不可修改',
        }
    },
    mounted()
    {
        this.initData();
    },
    methods: {
        async initData()
        {
            let purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            for (let i = 0; i < purchaseTypeData.length; i++) {
                if (purchaseTypeData[i].codeValue > 5)
                {
                    this.purchaseTypeData.push(purchaseTypeData[i]);
                }
            }
            this.userData = await this.common.postUrl("userTF", "loadAllUser");
            this.qywxUserData = await this.common.postUrl("userTF", "loadAllUser", {isOnlyLoadQYWX: 1});
            let orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.orgData.push({
                id:0,
                orgName: '总部'
            });
            for (let i = 0; i < orgData.length; i++) {
                this.orgData.push(orgData[i]);
            }
            await this.loadData();
        },
        async loadData()
        {
            this.list = await this.common.postUrl("branchCfgService", "loadPurchaseBranchCfgByBranchTypeOrderDefault", {});
            let flag = false;
            for (let i = 0; i < this.list.length; i++)
            {
                let item = this.list[i];
                if (this.common.isNotBlank(item.branchBizType))
                {
                    item.branchBizType = item.branchBizType.split(",");
                }
                if (item.isDefault)
                {
                    item.branchBizType = ["所有采购类型"];
                    item.orgId = ["总部/所有中心"];
                    if (!flag)
                    {
                        this.defaultCfg = item;
                        flag = true;
                    }
                }
                this.changeName(0, i);
                this.changeName(1, i);
                this.changeName(2, i);
                this.changeName(3, i);
                this.changeName(4, i);
            }
            this.$forceUpdate();
        },
        initCfg()
        {
            return this.cfg = {
                branchName: "",
                branchType: this.branchType,
                isDefault: false,
                branchDefault: 0,//都是非默认的
                regionId:null,
                orgId:null,
                branchBizType: null,
                orgVerifyUserId:null,
                orgVerifyName:"部门",
                nextVerifyUserId: null,
                nextVerifyName:"财务",
                gmoaVerifyUserId: null,
                gmoaVerifyName:"副总经理",
                gmoVerifyUserId: null,
                gmoVerifyName:"总经办",
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
                this.changeName(0, i);
                this.changeName(1, i);
                this.changeName(2, i);
                this.changeName(3, i);
                this.changeName(4, i);
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
                if (data.isDefault)
                {
                    continue;//默认的不校验
                }
                if (this.common.isBlank(data.branchName))
                {
                    this.$message.error("请输入第" + (i + 1) + "条流程的流程名称！");
                    return false;
                }
                if (this.common.isBlank(data.branchBizType) || data.branchBizType.length == 0)
                {
                    this.$message.error("请选择第" + (i + 1) + "条采购类型对应流程！");
                    return false;
                }
            }
            let param = {branchType: this.branchType, list: this.list};
            await this.common.postUrl("branchCfgService", "saveOrUpdateBranchCfg", param);
            this.$message.success("操作成功！");
            this.closePage();
        },
        changeOrg(cfg, index)
        {
            for (let i = 0; i < this.orgData.length; i++) {
                if (cfg.orgId && cfg.orgId.length == 1 && this.orgData[i].id == cfg.orgId)
                {
                    if (this.common.isBlank(cfg.branchName))
                    {
                        cfg.branchName = this.orgData[i].orgName + "采购费用申请流程";
                    }
                }
            }
            this.changeName(0, index);
            this.$forceUpdate();
        },
        changeName(type, index)
        {
            let cfg = this.list[index];
            if (type === 0)//部门
            {
                let value = "";
                let orgId = cfg.orgId;
                if (cfg && orgId && orgId.length > 0)
                {
                    for(let i in orgId)
                    {
                        for(let j in this.orgData)
                        {
                            if (this.orgData[j].id == orgId[i])
                            {
                                value += "," + this.orgData[j].orgName;
                                break;
                            }
                        }
                        if (isNaN(orgId[i]))
                        {
                            value += "," + orgId[i];
                        }
                    }
                    value = value.substring(1);
                }
                cfg.orgNameStr = value;
            }
            else if (type === 1)
            {
                let value = "";
                let ccBill = cfg.ccBill;
                if (cfg && ccBill && ccBill.length > 0)
                {
                    for(let i in ccBill)
                    {
                        for(let j in this.qywxUserData)
                        {
                            if (this.qywxUserData[j].qywxBillId == ccBill[i])
                            {
                                value += this.qywxUserData[j].userName + ",";
                                break;
                            }
                        }
                    }
                    value = value.substring(0, value.length - 1);
                }
                cfg.ccBillStr = value;
            }
            else if (type === 2)
            {
                let value = "";
                let authSeeUserId = cfg.authSeeUserId;
                if (cfg && authSeeUserId && authSeeUserId.length > 0)
                {
                    for(let i in authSeeUserId)
                    {
                        for(let j in this.userData)
                        {
                            if (this.userData[j].userId == authSeeUserId[i])
                            {
                                value += this.userData[j].userName + ",";
                                break;
                            }
                        }
                    }
                    value = value.substring(0, value.length - 1);
                }
                cfg.authSeeUserIdStr = value;
            }
            else if (type === 3)
            {
                let value = "";
                let applyGeneratePay = cfg.applyGeneratePay;
                if (cfg && applyGeneratePay && applyGeneratePay.length > 0)
                {
                    for(let i in applyGeneratePay)
                    {
                        for(let j in this.userData)
                        {
                            if (this.userData[j].userId == applyGeneratePay[i])
                            {
                                value += this.userData[j].userName + ",";
                                break;
                            }
                        }
                    }
                    value = value.substring(0, value.length - 1);
                }
                cfg.applyGeneratePayStr = value;
            }
            else if (type === 4)//采购类型
            {
                let value = "";
                let branchBizType = cfg.branchBizType;
                if (cfg && branchBizType && branchBizType.length > 0)
                {
                    for(let i in branchBizType)
                    {
                        for(let j in this.purchaseTypeData)
                        {
                            if (this.purchaseTypeData[j].codeValue == branchBizType[i])
                            {
                                value += "," + this.purchaseTypeData[j].codeName;
                                break;
                            }
                        }
                        if (isNaN(branchBizType[i]))
                        {
                            value += "," + branchBizType[i];
                        }
                    }
                    value = value.substring(1);
                }
                cfg.branchBizTypeNameStr = value;
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
