import enumData from "@/page/pt/enum";
import mySimpleFileModelList from "@/components/myFileModel/mySimpleFileModelList.vue";

export default {
    name: 'requestFeeDetail',
    data()
    {
        return {
            request: this.initRequest(),
            moneyArray: this.initMoney(),
            map: enumData.yuanMap,
            stateEnumData: enumData.FC_STS,
            list: [],
            type: this.$route.query.type,
            payTypeData: [],
            showApply: false,
            verifyList:[],
            verifyRemark: null,
        }
    },
    async mounted()
    {
        await this.initData();
        await this.loadRequestFeeById();
    },
    methods: {
        initRequest()
        {
            return {
                id: '',
                payNum: '',
                payTitleName: '',
                orgName: '',
                payProject: '',
                payProjectName: '',
                payRemark: '',
                expectDate: '',
                createUserName: '',
                payFee: '',
                bankCard: '',
                bankDeposit: '',
                bankPhone: '',
                bankLinkman: '',
                bankAccountName: '',
                payee: '',
                createDate: '',
                state: '',
                applyRemark: '',
                costApplyName: '',
                costApply: '',
                hasCostApply: false,
                orgApplyName: '',
                orgApplyDate: '',
                orgApply: '',
                fcApplyName: '',
                fcApplyDate: '',
                fcApply: '',
                gmoApplyName: '',
                gmoApplyDate: '',
                gmoApply: '',
                payType: '',
                currentApplyStep: '',
                currentApplyUser: '',
                printTimes: '',
                verifyUsers:[],
                applyArray:[],
            }
        },
        /**
         *
         */
        initMoney()
        {
            this.moneyArray = [];
            for(let i = 0;i < 9; i++)
                this.moneyArray.push('');
            return this.moneyArray;
        },
        /**
         * 初始化静态数据
         */
        async initData()
        {
            let data = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_PAY_TYPE"});
            this.payTypeData = [];
            for (let i = 0; i < data.length; i++)
            {
                if (data[i].codeValue != 3)
                {
                    this.payTypeData.push(data[i]);
                }
            }
            this.$forceUpdate();
        },
        async loadRequestFeeById()
        {
            this.request = await this.common.postUrl("requestServiceImpl", "loadRequestFeeById", this.$route.query);
            if (this.request.payFee > 0)
                this.chnageMoney(String(this.request.payFee));
            if (this.common.isNotBlank(this.request.bankAccountName))
                this.hasSelectBank = true;
            if (this.common.isNotBlank(this.request.list) && this.type != 4 && this.request.list.length > 0)
            {
                this.$nextTick(() => {
                    this.$refs.other.initFileList(this.request.list);
                });
            }
            this.showApply = this.common.isNotBlank(this.request.applyId);
            
            this.verifyList = new Array();
            let i = 0;
            this.request.verifyUsers.forEach(item => {
                this.verifyList[i++] = item;
            })
            this.verifyList.reverse();
            this.$forceUpdate();
        },
        chnageMoney(data)
        {
            let none = '—';
            let yuan = '￥';
            this.initMoney();

            if (this.common.isNotBlank(data) && !isNaN(data))
            {
                let money = this.common.accMul(data, 100);
                let moneyStr = money.toString(); //转换为字符串
                let zero = false;
                let j = 0;//￥放的位置

                for (let i = moneyStr.length - 1; i >= 0; i--)
                {
                    let num = parseInt(moneyStr.charAt(i));
                    if (num > 0)
                        zero = true;
                    if (zero || num != 0)
                        this.moneyArray[j] = this.map.get(String(num));
                    else
                        this.moneyArray[j] = none;
                    j++;
                }
                //处理￥
                if(j <= this.moneyArray.length - 1)
                    this.moneyArray[j] = yuan;
                else
                    this.moneyArray[j - 1] = yuan + this.moneyArray[j - 1];
            }
        },
        /**
         * 审核
         * @param type
         * @returns {Promise<boolean>}
         */
        async verifyRequestFee(type)
        {
            if (this.common.isBlank(this.request.id))
            {
                this.$message.error("网络异常,关闭当前页面重新选择请款单审核!");
                return false;
            }
            if (!(enumData.FC_STS.WAIT == this.request.state || enumData.FC_STS.DOING == this.request.state))
            {
                this.$message.error("只有未审核和审核中的请款单才可以审核！");
                return false;
            }
            let param = {
                id: this.request.id,
                type,
                remark: this.verifyRemark,
            };
            await this.common.postUrl("requestServiceImpl", "verifyRequestFeeById", param);
            this.$message.success("审核成功！");
            this.closePage();
        },
        /**
         * 打印
         */
        print(){
            // lodopUtil.printHTMLInfoA5("printTable", "打印请款单");
            //打印次数加一
            this.increaseRequestFeePrintById();
        },
        /**
         * 打印调用自增打印次数
         */
        async increaseRequestFeePrintById()
        {
            await this.common.postUrl("requestServiceImpl", "increaseRequestFeePrintById", this.$route.query);
        },
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
        async clickItem(item, index)
        {
            let param = {id : item.applyId};
            if(this.request.feeApplySrc==2){
                this.$emit("openTab",{
                    query: {id : item.applyId},
                    urlId: "paymentPlanDetail" + item.applyId,
                    urlName: "查看费用清单",
                    urlPathName: "/paymentPlanDetail",
                    urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"});
            }else {
                this.$emit("openTab", {
                    query: param,
                    urlId: "purchaseDetail" + param.id,
                    urlName: "查看采购费用申请",
                    urlPathName: "/purchaseDetail",
                    urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue"
                });
            }
        },
        viewContractReview(data){
            let item = {
                urlName: '查看合同',
                urlId: "contractDetail" + data.contractId,
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:data.contractType,id:data.contractId},
            }
            this.$emit('openTab', item);
        },
    },
    components: {
        mySimpleFileModelList,
        enumData
    },
}
