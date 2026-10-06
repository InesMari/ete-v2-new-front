import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'cmCustTimeLimitManage',
    data()
    {
        return {
            head: [
                {"name": "客户", "code": "custName", "width": "120", "type": "text"},
                {"name": "提货限定时间/分钟", "code": "pickupLimitTimeDisplay", "width": "150", "type": "text"},
                {"name": "卸货限定时间/分钟", "code": "deliveryLimitTimeDisplay", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query:{
                custName: this.$route.query.tenantName,//客户详情运作时间配置跳转
            },
            customerData:[],
            limitTypeData:[],
            dialogTitle:'新增',
            showDialog:false,
            cmCustTimeLimitInfo:{},
            type:0,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
    },
    /**
     * 绑定函数
     */
    methods: {

        /**
         *
         */
        doQuery(){
            this.$refs.table.load("cmCustTimeLimitTF", "queryCmCustTimeLimitInfoPage", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            //申请开票静态
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "LIMIT_TYPE"}, function (data)
            {
                that.limitTypeData = data;
            });
            this.loadCustomerData();
        },
        /**
         * 加载客户数据
         */
        loadCustomerData()
        {
            let that = this;
            //查询当前所有组织的客户
            that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data)
            {
                that.customerData = data;
            });
        },
        /**
         * 清空
         */
        clear(){
            this.query={};
        },
        displayDialog(type){
            this.cmCustTimeLimitInfo={};
            this.type = type;
            if(type==1){
                this.cmCustTimeLimitInfo.pickupLimitType = '1';
                this.cmCustTimeLimitInfo.deliveryLimitType = '1';
                this.dialogTitle = '新增';
                this.showDialog = true;
            }else{
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一个需要修改的配置！");
                    return false;
                }
                this.dialogTitle = '修改';
                this.cmCustTimeLimitInfo = selectData[0];
                this.cmCustTimeLimitInfo.custTenantId = this.cmCustTimeLimitInfo.custTenantId+'';
                this.cmCustTimeLimitInfo.pickupLimitType = this.cmCustTimeLimitInfo.pickupLimitType+'';
                this.cmCustTimeLimitInfo.deliveryLimitType = this.cmCustTimeLimitInfo.deliveryLimitType+'';
                this.showDialog = true;

            }
        },
        doSaveCmCustTimeLimit(){
            let that = this;
            let msg = "";
            let method = '';
            if(this.type==1){
                msg="新增成功";
                method='addCmCustTimeLimitInfo';
            }else{
                msg="修改成功";
                method='updateCmCustTimeLimitInfo';
            }
            this.cmCustTimeLimitInfo.custName = that.customerData.find(item=>item.tenantId===that.cmCustTimeLimitInfo.custTenantId).name;
            this.common.postUrl("cmCustTimeLimitTF", method, this.cmCustTimeLimitInfo,function (data){
                if(data){
                    that.$message.success(msg);
                    that.showDialog = false;
                    that.doQuery();
                }
            },null,'',true);
        },
        delCmCustTimeLimitInfo(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个需要删除的配置！");
                return false;
            }
            let that = this;
            that.$confirm("确认删除这个配置", "提示").then(() =>{
                that.common.postUrl("cmCustTimeLimitTF", "delCmCustTimeLimitInfo", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        forupdate(){
            this.$forceUpdate();
        }

    },
}
