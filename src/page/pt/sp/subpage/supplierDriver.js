import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'supplierDriver',
    props: ['supplierTenantId'],
    data()
    {
        return {
            head: [
                {"name": "司机名称", "code": "driverName", "width": "150", "type": "text"},
                {"name": "手机号码", "code": "driverPhone", "width": "120", "type": "text"},
                {"name": "是否可调度", "code": "canDispatch", "width": "100", "type": "text"},
                {"name": "司机状态", "code": "stsName", "width": "100", "type": "text"},
                {"name": "资质审核", "code": "innerAuthStateName", "width": "100", "type": "text"},
                // {"name": "三方审核", "code": "outerAuthStateName", "width": "100", "type": "text"},
                // {"name": "签约状态", "code": "signAuthStateName", "width": "80", "type": "text"},

            ],
            query:{
                driverName: '',
                driverPhone:''
            },
            showDialog: false,
            selDriverList:[],
            driverList:[]
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
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
         * 列表查询
         */
        doQuery()
        {
            this.query.tenantId = this.supplierTenantId;
            this.$refs.driverTable.load("supplierTF", "querySupplierDriverInfoListByCond", this.query);
        },

        /**
         * 清空
         */
        clear(){
            this.query={
                driverName: '',
                driverPhone:''
            };
        },
        showAdd(){
            let that = this;
            this.common.postUrl("supplierTF","queryDriverInfoListNoRelByCond",{tenantId:this.supplierTenantId},function (data){
                that.driverList = data;
                that.showDialog = true;
            });
        },
        add(){
            let that = this;
            let driverList = [];
            for (let i = 0; i < that.driverList.length; i++) {
                for (let j = 0; j < that.selDriverList.length; j++) {
                    if(that.driverList[i].driverId ==that.selDriverList[j]){
                        driverList.push({
                            driverId:that.driverList[i].driverId,
                            driverUserId:that.driverList[i].driverUserId
                        })
                    }
                }
            }
            this.common.postUrl("supplierTF","addSupplierDriverRel",{tenantId:this.supplierTenantId,driverList:driverList},function (){
                that.showDialog = false;
                that.selDriverList = [];
                that.doQuery();
            },null,'',true);
        },
        del(){
            let that = this;
            let array = this.$refs.driverTable.getSelectItem();
            if (array.length === 0) {
                this.$message.error("请选择一条司机信息");
                return false;
            }
            let driverList = [];
            for (let i = 0; i < array.length; i++) {
                driverList.push(array[i].driverId);
            }
            this.common.postUrl("supplierTF","delSupplierDriverRel",{tenantId:this.supplierTenantId,driverList:driverList},function (){
                that.doQuery();
            },null,'',true);
        },

    },
}
