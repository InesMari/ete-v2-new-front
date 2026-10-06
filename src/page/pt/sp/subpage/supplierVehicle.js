import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'supplierVehicle',
    props: ['supplierTenantId'],
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
                {"name": "是否可调度", "code": "canDispatch", "width": "100", "type": "text"},
                {"name": "车辆状态", "code": "stsName", "width": "100", "type": "text"},
                {"name": "资质审核", "code": "innerAuthStateName", "width": "100", "type": "text"},
                // {"name": "三方审核", "code": "outerAuthStateName", "width": "100", "type": "text"},
            ],
            vehicleQuery:{
                plateNumber: ''
            },
            showDialog: false,
            selVehicleList:[],
            vehicleList:[]
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
            this.vehicleQuery.tenantId = this.supplierTenantId;
            this.$refs.vehicleTable.load("supplierTF", "querySupplierVehicleInfoListByCond", this.vehicleQuery);
        },

        /**
         * 清空
         */
        clear(){
            this.vehicleQuery={
                plateNumber: ''
            };
        },
        showAddVehicle(){
            let that = this;
            this.common.postUrl("supplierTF","queryVehicleInfoListNoRelByCond",{tenantId:this.supplierTenantId},function (data){
                that.vehicleList = data;
                that.showDialog = true;
            });
        },
        addVehicle(){
            let that = this;
            this.common.postUrl("supplierTF","addSupplierVehicleRel",{tenantId:this.supplierTenantId,vehicleIds:this.selVehicleList},function (){
                that.showDialog = false;
                that.selVehicleList = [];
                that.doQuery();
            },null,'',true);
        },
        delVehicle(){
            let that = this;
            let array = this.$refs.vehicleTable.getSelectItem();
            if (array.length === 0) {
                this.$message.error("请选择一条车辆信息");
                return false;
            }
            let vehicleIds = [];
            for (let i = 0; i < array.length; i++) {
                vehicleIds.push(array[i].vehicleId);
            }
            this.common.postUrl("supplierTF","delSupplierVehicleRel",{tenantId:this.supplierTenantId,vehicleIds:vehicleIds},function (){
                that.doQuery();
            },null,'',true);
        },

    },
}
