import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'supplierQuoteManageZC',
    data()
    {
        return {
            head: [
                {"name": "供应商", "code": "tenantName", "width": "200", "type": "text"},//
                {"name": "指定客户", "code": "specifyTenantName", "width": "250", "type": "text"},//
                {"name": "起始作业点", "code": "beginWorkName", "width": "200", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "250", "type": "text"},
                {"name": "目的作业点", "code": "endWorkName", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "200", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "80", "type": "text"},//
                {"name": "报价车型", "code": "quoteVehicleTypeName", "width": "100", "type": "text"},//
                {"name": "车长", "code": "vehicleLengthName", "width": "100", "type": "text"},
                {"name": "计费方式", "code": "billingTypeName", "width": "100", "type": "text"},
                {"name": "价格/元", "code": "feePriceName", "width": "100", "type": "text"},
                {"name": "点位费单价/元", "code": "pointFee", "width": "100", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "diyColorTd"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(this.$route.query.tenantId),
            stsData:[],
            customerData:[],
            supplierData:[],
            billingTypeData:[],
            vehicleLengthData:[],
            quoteVehicleTypeData:[],
            isShowPage: false,//是否展示新增修改页面
            canEditFee: false,//是否可编辑费用
            showSubmit: true,//是否展示提交
            title:'查看报价',
            form: this.initObj(),
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        enumData,
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
            this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                that.customerData = data;
            });
            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"STS"}, function (data) {
                that.stsData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"BILLING_TYPE_ORDER"}, function (data) {
                that.billingTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VEHICLE_TYPE_QUOTE"}, function (data) {
                that.quoteVehicleTypeData = data;
            });
        },
        /**
         * 清空查询条件
         */
        initQuery(tenantId)
        {
            this.query = {
                beginIndexSearchStr: "",
                endIndexSearchStr: "",
                vehicleLength: "",
                quoteVehicleType: "",
                tenantId: tenantId,
                sts: "",
            };
            return this.query;
        },
        /**
         * 初始化表单对象
         * @returns
         */
        initObj()
        {
            this.form = {
                tenantId: '',
                specifyTenantId: '',
                transportTimeliness:'',
                beginIndexSearchStr:'',
                endIndexSearchStr:'',
                billingType:'',
                quoteVehicleType:'',
                vehicleLength:'',
                feePrice:'',
                pointFee:'',
            };
            return this.form;
        },
        /**
         * 加载整车报价列表
         */
        async doQuery()
        {
            let {items} = await this.$refs.table.load("quoteTF", "querySuplierZCQuoteData", this.query);
            items.forEach((el)=>{
                if(el.sts == 0){ el.disabled = true; }
            });
            this.$refs.table.resetData(items);
        },
        /**
         * 双击查看详情
         * @param data
         */
        dblclickItem(data)
        {
            this.isShow(2, data);
        },
        /**
         * 是否展示
         * @param flag 2查看报价 3修改报价
         */
        isShow(flag, data)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (this.common.isNotBlank(data))
            {
                selectData[0] = data;
            }
            if (flag && selectData.length !== 1)
            {
                this.$message.error("请选择一条报价！");
                return false;
            }
            this.isShowPage = !this.isShowPage;
            if (flag === 2)
            {
                this.title = '查看报价';
                this.canEditFee = true;
                this.showSubmit = false;
                this.form = this.common.copyObj(selectData[0]);
            }
            else if (flag === 3)
            {
                this.title = '修改报价';
                this.canEditFee = false;
                this.showSubmit = true;
                this.form = this.common.copyObj(selectData[0]);
            }
            else
            {
                this.initObj();
            }
        },
        /**
         * 跳转新增报价页面
         */
        toAddQuotePage()
        {
            this.$emit("openTab",{
                urlId: 'addSupplierZCQuote',
                query: this.$route.query,
                urlName: "新增供应商整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierQuoteZC.vue"});
        },
        /**
         * 修改报价
         * @returns {boolean}
         */
        submit()
        {
            let that = this;
            if (this.common.isBlank(this.form.feePrice))
            {
                this.$message.error("请输入价格再保存！");
                return false;
            }
            this.form.quoteType = 2;
            this.common.postUrl("quoteTF", "updateZCQuote", this.form, function (data)
            {
                that.isShowPage = false;
                that.doQuery();
                that.$message.success("修改报价成功！");
            },null,'',true);
        },
        /**
         * 启用禁用
         */
        changeZCQuoteSts(sts)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要"+ ((sts === 1) ? "启用" : "禁用") + "的报价！");
                return false;
            }
            this.form = this.common.copyObj(selectData[0]);
            if (this.form.sts === sts)
            {
                this.$message.error("该报价已经是"+ ((sts === 1) ? "启用" : "禁用") + "状态！");
                return false;
            }
            this.form.sts = sts;
            this.form.quoteType = 2;
            let that = this;
            this.common.postUrl("quoteTF", "changeZCQuoteSts", this.form, function (data)
            {
                that.doQuery();
                that.$message.success("报价" + (sts === 1 ? "启用" : "禁用") + "成功！");
            },null,'',true);
        },
        /**
         * 删除报价
         */
        deleteZCQuote()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条需要删除的报价！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("quoteTF", "deleteZCQuote", array[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("报价删除成功！");
                },null,'',true);
            }).catch(() =>{})
        },
    },
}
