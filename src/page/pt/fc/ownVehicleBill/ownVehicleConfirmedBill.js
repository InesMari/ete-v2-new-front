import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"

export default {
    name: 'ownVehicleConfirmedBill',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "200", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "200", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "付款状态", "code": "payStateName", "width": "150", "type": "text"},
                {"name": "成本记账", "code": "invoiceTotalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "已付金额", "code": "payFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "未付金额", "code": "noPayFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "确认人", "code": "confirmUserName", "width": "100", "type": "text"},
                {"name": "确认时间", "code": "confirmDate", "width": "150", "type": "text"}
            ],
            recordHead:
            [
                {"name": "付款渠道", "code": "payChannelName", "width": "120", "type": "text"},
                {"name": "付款金额", "code": "fee", "width": "80", "type": "text"},
                {"name": "实际付款日期", "code": "payDate", "width": "80", "type": "text"},
                {"name": "收款人", "code": "receiveUserName", "width": "80", "type": "text"},
                {"name": "手机号码", "code": "receiveUserPhone", "width": "100", "type": "text"},
                {"name": "开户卡号", "code": "bankCard", "width": "150", "type": "text"},
                {"name": "开户行", "code": "bankDepositName", "width": "100", "type": "text"},
                {"name": "支行名称", "code": "bankSubName", "width": "100", "type": "text"},
                {"name": "付款备注", "code": "remark", "width": "100", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "80", "type": "text", "issum": "true"},
                {"name": "操作时间", "code": "createDate", "width": "80", "type": "text"},
                {"name": "操作", "code": "", "width": "90", "type": "diy"},
            ],
            tenantData: [],//供应商
            query: this.initQuery(this.$route.query.supplierId),
            showPayRecord: false,
            payRecordShow: false,
            showPay:false,
            show: {},
            list: [],
            saveFlag: false,//点击保存标志
        }
    },
    mounted() {
		this.init();
        this.doQuery().then(r => {});
    },
    components: {
        tableCommon,
        scrollTable,
        enumData,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            this.tenantData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, applyInvoiceState: string, tenantId: string, confirmState: number, billNum: string}}
         */
        initQuery(tenantId) {
            this.query = {
                billNum: '',
                billMonth: '',
                tenantId: tenantId,
                applyInvoiceState: '',
                confirmState: enumData.FC_CONFIRM_STATE.CONFIRMED,//已确认
            };
            this.$forceUpdate();
            return this.query;
        },
        /**
         * 查询列表
         */
        async doQuery() {
            await this.$refs.table.load("ownVehicleBillTF", "queryOwnVehicleBillPage", this.query);
        },
        /**
         * 账单明细
         */
        toOwnVehicleBillDetail(data)
        {
            let selectItems = this.$refs.table.getSelectItem();
            if (this.common.isNotBlank(data))
            {
                selectItems[0] = data;
            }
            if(selectItems.length !== 1)
            {
                this.$message.error("请选择一条需要查看的账单！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '自有车账单明细',
                urlId: 'ownVehicleBillDetail',
                urlPathName: "/fc",
                urlPath: "/pt/fc/ownVehicleBill/detail/ownVehicleBillDetail.vue",
                query: {billId: selectItems[0].billId, flag: 1,unShowCheck: 1,},//后台查询标志
            });
        },
        /**
         * 付款款记录
         * @param flag
         */
        payRecord(flag)
        {
            if (flag)
            {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条需要查看付款记录的账单！");
                    return false;
                }
                this.payRecordShow = true;
                this.show = this.common.copyObj(selectItem[0]);
                //加载付款记录
                this.$nextTick(() => {
                    this.loadOwnVehiclePayRecord(this.show.billId);
                })
            }
            this.showPayRecord = flag;
        },
        /**
         * 列表查询
         */
        async loadOwnVehiclePayRecord(billId)
        {
            await this.$refs.ownVehiclePayRecordTable.load("ownVehicleBillTF", "loadOwnVehiclePayRecord", {billId: billId});
        },
        /**
         * 付款登记
         * @param flag
         */
        payRegister(flag)
        {
            if (flag)
            {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条需要付款登记的账单！");
                    return false;
                }
                if (selectItem[0].payState == enumData.PAY_STATE.ALL_PAY)
                {
                    this.$message.error("已付款的账单无法继续付款！");
                    return false;
                }
                this.show = this.common.copyObj(selectItem[0]);
                this.queryOwnVehiclePayableFee(this.show);
            }
            this.showPay = flag;
        },
        /**
         * 查询需付数据
         */
        queryOwnVehiclePayableFee(param)
        {
            let that = this;
            that.common.postUrl("ownVehicleBillTF", "queryOwnVehiclePayableFee", param, function (data) {
                that.list = data;
                data.forEach(item => {
                    that.show.needPayFee = that.common.accAdd(that.show.needPayFee, item.sumFee);
                })
                that.changePayFee();
            });
        },
        /**
         * 撤销付款
         * @param item
         */
        revokePayRecord(item)
        {
            let that = this;
            let param = this.common.copyObj(item);
            param.billNum = this.show.billNum;
            that.$confirm("确认需要撤销该付款记录？", "提示").then(() =>{
                that.common.postUrl("ownVehicleBillTF", "revokePayRecord", param, function (data)
                {
                    that.$message.success("自有车付款记录撤销成功！");
                    that.loadOwnVehiclePayRecord(that.show.billId);
                    that.doQuery();
                },null,'',true);
            }).catch(() =>{});
        },
        /**
         * 提交付款
         */
        submitPay()
        {
            if (this.common.isBlank(this.show.billId))
            {
                this.$message.error("请选择需要付款的账单！");
                return false;
            }
            let flag = 0;
            for (let i = 0; i < this.list.length; i++)
            {
                let item = this.list[i];
                if (item.payFee > item.sumFee)
                {
                    this.$message.error(item.payChannelName + "付款渠道的付款金额大于需付款金额！");
                    return false;
                }
                if (this.common.isNotBlank(item.payFee) && this.common.isBlank(item.payDate))
                {
                    this.$message.error(item.payChannelName + "付款渠道的实际付款日期不能为空！");
                    return false;
                }
                if (this.common.isBlank(item.payFee))
                {
                    flag++;
                }
                else
                {
                    if (item.payFee == 0)
                    {
                        this.$message.error("请输入有效的付款金额！");
                        return false;
                    }
                }
            }
            if (flag === this.list.length)
            {
                this.$message.error("请至少输入一个付款！");
                return false;
            }
            this.show.list = this.list;
            if (this.saveFlag)
            {
                this.$message.error("账单已经付款，请勿重复操作！");
                return false;
            }
            let that = this;
            that.saveFlag = true;
            that.common.postUrl("ownVehicleBillTF", "payOwnVehicleFee", this.show, function (data) {
                that.$message.success("自有车账单付款成功！");
                that.payRegister(false)
                that.doQuery();
                setTimeout(() => {
                    that.saveFlag = false;
                }, 3000);
            },null,'',true);
        },
        /**
         * 改变支付费用
         */
        changePayFee(obj)
        {
            this.show.sumPayFee = 0;
            this.list.forEach(item => {
                if (this.common.isNotBlank(item.payFee) && !isNaN(item.payFee))
                    this.show.sumPayFee = this.common.accAdd(this.show.sumPayFee, item.payFee);
            })
            if (this.common.isNotBlank(obj.payFee) && !isNaN(obj.payFee))
            {
                if (this.common.isBlank(obj.payDate))
                {
                    obj.payDate = this.common.formatDate.getDate();
                }
            }
            else
            {
                obj.payDate = '';
            }
        },
    },
}
