import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"

export default {
    name: 'ownVehicleUnconfirmedBill',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "200", "type": "text"},
                {"name": "账单月份", "code": "billMonth", "width": "200", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "成本记账", "code": "invoiceTotalFee", "width": "150", "type": "text", "issum": "true"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            tenantData: [],//供应商
            query: this.initQuery(this.$route.query.supplierId),
        }
    },

    mounted() {
    	this.init();
		this.doQuery().then(r => {});
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        enumData,
    },
    methods: {
        /**
         * 初始化下拉
         */
        init()
        {
            let that = this;
			that.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
            	that.tenantData = data;
            });
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, tenantId: string, billNum: string}}
         */
        initQuery(tenantId)
        {
            this.query = {
                billNum: '',
                billMonth: '',
                tenantId: tenantId,
                confirmState: enumData.FC_CONFIRM_STATE.UNCONFIRMED,//未确认
            };
            this.$forceUpdate();
            return this.query;
        },
        /**
         * 查询列表
         */
        async doQuery()
        {
			await this.$refs.table.load("ownVehicleBillTF", "queryOwnVehicleBillPage", this.query);
        },
        /**
         * 新增账单
         * @returns {boolean}
         */
        addOwnVehicleBill()
        {
            this.$emit('openTab', {
                urlName: '新增自有车账单',
                urlId: 'addOwnVehicleBill',
                urlPathName: "/fc",
                urlPath: "/pt/fc/ownVehicleBill/add/addOwnVehicleBillMain.vue",
                query: {},
            });
        },
        /**
         * 账单确认
         */
        sureOwnVehicleBill()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要确认的账单！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("已确认的账单,无须再次确认！");
                return false;
            }
            let that = this;
            that.$confirm("确认账单后不可回退,不可对该账单下的派车单进行成本登记，是否确认账单？", "提示").then(() =>{
                that.common.postUrl("ownVehicleBillTF", "sureOwnVehicleBill", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("自有车账单确认成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        /**
         * 删除账单
         */
        deleteOwnVehicleBill()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的账单！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("已确认的账单,无法删除！");
                return false;
            }
            let that = this;
            that.$confirm("确认需要删除账单？", "提示").then(() =>{
                that.common.postUrl("ownVehicleBillTF", "deleteOwnVehicleBill", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("自有车账单删除成功！");
                },null,'',true);
            }).catch(() =>{});
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
         * 账单修改
         */
        updateOwnVehicleBill()
        {
            let selectItems = this.$refs.table.getSelectItem();
            if(selectItems.length !== 1)
            {
                this.$message.error("请选择一条需要修改的账单！");
                return false;
            }
            let data = selectItems[0];
            if(data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("已确认的账单不允许修改！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '自有车账单修改',
                urlId: 'updateOwnVehicleBill',
                urlPathName: "/fc",
                urlPath: "/pt/fc/ownVehicleBill/update/updateOwnVehicleBillMain.vue",
                query: {billId: data.billId, flag: 1,unShowCheck: 1,},
            });
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    },
}
