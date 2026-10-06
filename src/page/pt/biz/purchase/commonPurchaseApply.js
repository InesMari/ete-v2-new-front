import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum.js"

export default {
    name: 'commonPurchaseApply',
    data()
    {
        return {
            apply: this.initApply(),
            urgentLevelData: [],//紧急程度
            purchaseTypeData: [],//采购类型
            purchasePayTypeData: [],//采购方式
            payTypeData: [],//付款方式
            orgUserData: [],//部门审核人
            whetherData: [],
            saveFlag: false,
            enumData: enumData,
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        myFileModel
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
                purchaseType: '',
                orgVerifyUserId: '',
                payFee: '',
                purchaseName: '',
                purchasePayType: '',
                payType: '2',
                expectDate: '',
                purchaseReason: '',
                purchaseInquiry: '',
                currentVerifyUserName: '',
                orgVerifyName: '',
                nextVerifyUserName: '',
                gmoVerifyUserName: '',
                orgVerifyDate: '',
                nextVerifyDate: '',
                gmoVerifyDate: '',
                list: [{}],
                reqArray: [],
                payArray: [],
                detailList: [{}],
                isWithinBudget: '0',
            }
        },
        async initData()
        {
            this.payTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_PAY_TYPE"});
            this.urgentLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "URGENT_LEVEL"});
            this.purchaseTypeData = [];
            let purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            let type = this.$route.query.type;
            if (type != 0)
            {
                purchaseTypeData = await this.common.postUrl("purchaseApplyServiceImpl", "getSysStaticDataForSpecify", {codeType: "PURCHASE_TYPE"});
            }
            for (let i = 0; i < purchaseTypeData.length; i++)
            {
                this.purchaseTypeData.push(purchaseTypeData[i]);
            }
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.purchasePayTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_PAY_TYPE"});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {orgFlag:1,entityId: 1009006});
            this.$forceUpdate();
        },
        successCallback(imgData)
        {
            if (this.apply.list.length <= 5)
            {
                this.apply.list[imgData.componentId] = imgData;
            }
            if (this.apply.list.length < 5)
            {
                this.apply.list.push({});
            }
            this.initListComponentId();
        },
        delCallback(index)
        {
            this.apply.list.splice(index, 1);
            let flag = true;
            for (let i = 0; i < this.apply.list.length; i++)
            {
                if (this.common.isBlank(this.apply.list[i].flowId))
                {
                    flag = false;//存在空的
                }
            }
            if (this.apply.list.length === 4 && flag)
            {
                this.apply.list.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        imgDisplay()
        {
            this.$nextTick(() =>
            {
                let that = this;
                for (let i = 0; i < this.apply.list.length; i++)
                {
                    if (that.apply.list[i].flowId)
                    {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.apply.list[i].flowId + ")");
                    } else
                    {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        initListComponentId()
        {
            for (let i = 0; i < this.apply.list.length; i++)
                this.apply.list[i].componentId = i;
            this.$forceUpdate();
        },
        async saveOrUpdatePurchaseApply()
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
            if (this.common.isBlank(this.apply.purchaseName))
            {
                this.$message.error("请填写采购名称!");
                return false;
            }
            if (this.common.isBlank(this.apply.purchasePayType))
            {
                this.$message.error("请选择采购方式!");
                return false;
            }
            if (this.common.isBlank(this.apply.payType))
            {
                this.$message.error("请选择付款方式!");
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
            if (this.common.isBlank(this.apply.purchaseType))
            {
                this.$message.error("请选择采购类型!");
                return false;
            }
            if (this.common.isBlank(this.apply.payFee))
            {
                this.$message.error("请填写总采购金额!");
                return false;
            }
            if (this.common.isNotBlank(this.apply.detailList))
            {
                for (let index in this.apply.detailList)
                {
                    let item = this.apply.detailList[index];
                    if (this.common.isBlank(item.name))
                    {
                        this.$message.error("请填写" + (index + 1) + "条费用项目名称!");
                        return false;
                    }
                    if (this.common.isBlank(item.fee))
                    {
                        this.$message.error("请填写" + (index + 1) + "条采购金额!");
                        return false;
                    }
                }
            }
            if (this.common.isBlank(this.apply.orgVerifyUserId))
            {
                this.$message.error("请选择部门审核人!");
                return false;
            }
            let apply = await this.common.postUrl("purchaseApplyServiceImpl", "saveOrUpdatePurchaseApply", this.apply);
            this.$message.success(this.common.isNotBlank(this.$route.query.id) ? apply.applyNum + "修改成功！" : apply.applyNum + "新增成功！");
            this.saveFlag = true;
            setTimeout(() =>
            {
                this.saveFlag = false;
                this.closePage();
            }, 500);
        },
        async loadPurchaseApplyById()
        {
            this.apply = await this.common.postUrl("purchaseApplyServiceImpl", "loadPurchaseApplyById", this.$route.query);
            let that = this;
            if (this.common.isNotBlank(this.apply.list))
            {
                this.$nextTick(() =>
                {
                    for (let i = 0; i < that.apply.list.length; i++)
                    {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.apply.list[i].flowId + ")");
                    }
                    if (that.apply.list.length == 0)
                    {
                        this.apply.list.push({});
                    }
                });
            }
            this.$forceUpdate();
        },
        closePage(flag)
        {
            if (flag)
                this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
            else
                this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        clickItem(id, type)
        {
            let isReq = type === enumData.PAY_TYPE.REQ;
            this.$emit("openTab",{
                query: {id: id, type:0},
                urlId: isReq ? "requestFeeDetail" + id : "payOrderDetail" + id,
                urlName: isReq ? "查看请款单" : "查看付款单",
                urlPathName: isReq ? "/requestFeeDetail" : "/payOrderDetail",
                urlPath: isReq ? "/pt/fc/receipts/detail/requestFeeDetailMain.vue" : "/pt/fc/receipts/detail/payOrderDetailMain.vue"});
        },
        addItem()
        {
            this.apply.detailList.push({name:null, fee:null, remark:null, });
            this.$forceUpdate();
        },
        removeItem(index)
        {
            this.apply.detailList.splice(index, 1);
            this.$forceUpdate();
        },
        calcFee()
        {
            let sum = 0;
            for (let index in this.apply.detailList)
            {
                let item = this.apply.detailList[index];
                if (this.common.isNotBlank(item) && this.common.isNotBlank(item.fee) && !isNaN(item.fee))
                {
                    sum = this.common.accAdd(sum, item.fee);
                }
            }
            this.apply.payFee = sum;
            this.$forceUpdate();
        },
    },
}
