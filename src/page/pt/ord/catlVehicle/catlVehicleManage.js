import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import enumData from "@/page/pt/enum";


export default {
    beforeRouteEnter(to, from, next)
    {
        next(that => {
            that.doQuery();
        });
    },
    name: 'catlVehicleManage',
    data() {
        return {
            head: [
                {"name": "客户单号", "code": "custOrderNum", "width": "180", "type": "text"},
                {"name": "旧车牌号(普)", "code": "srcPlateNumber", "width": "180", "type": "text"},
                {"name": "新车牌号(危)", "code": "plateNumber", "width": "180", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
            ],
            query: this.initQuery(),
            vehicleData:[],
            uploadOpen:false,
            title: '新增',
            showDialog: false,
            info: this.initInfo(),
            vehicleLoading:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        myImport,
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            return this.info = {
                id:null,
                custOrderNum:'',
                srcVehicleId:'',
                plateNumber:'',
            }
        },
        initQuery() {
            return this.query = {
                custOrderNum:'',
                srcPlateNumber:'',
                plateNumber:'',
            };
        },
        // 远程搜索车辆（输入 ≥2 个字符才触发）
        async remoteSearchVehicle(query) {
            if (!query || query.trim().length < 2) {
                this.vehicleData = [];
                return;
            }
            this.vehicleLoading = true;
            try {
                let params = { count: 100, page: 1, plateNumber: query.trim() };
                let { items } = await this.common.postUrl("resVehicleInfoTF", "queryVehicleInfoList", params);
                this.vehicleData = items || [];
            } finally {
                this.vehicleLoading = false;
            }
        },
        async doQuery(query = this.query) {
            this.uploadOpen = false;
            await this.$refs.table.load("catlVehicleService", "queryCatlVehiclePage", query);
        },
        openAddDialog()
        {
            this.initInfo();
            this.vehicleData = [];
            this.title = '新增';
            this.openDialog(true);
        },
        openUpdateDialog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要修改的车牌替换！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            // 修改时回填旧车牌号选项，确保 select 能正确显示已选标签
            if (this.info.srcVehicleId) {
                this.vehicleData = [{
                    id: this.info.srcVehicleId,
                    plateNumber: selectData[0].srcPlateNumber || ''
                }];
            }
            this.title = '修改';
            this.openDialog(true);
        },
        openDialog(flag)
        {
            this.showDialog = flag;
            if (!flag) {
                this.vehicleData = [];
            }
        },
        deleteItem() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要删除的车牌替换！");
                return false;
            }
            let that = this;
            that.$confirm("确认删除这个车牌替换?", "提示", {
                center: true,
            }).then(() => {
                that.common.postUrl("catlVehicleService", "deleteCatlVehicleById", {id: selectData[0].id}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                }, null, '', true);
            }).catch(() => {});
        },
        async saveOrUpdateCatlVehicle()
        {
            if(this.common.isBlank(this.info.custOrderNum)){
                this.$message.error("请选择车辆！");
                return false;
            }
            if(this.common.isBlank(this.info.srcVehicleId)){
                this.$message.error("请选择旧车牌号(普)！");
                return false;
            }
            if(this.common.isBlank(this.info.plateNumber)){
                this.$message.error("请选择新车牌号(危)！");
                return false;
            }
            
            let data = await this.common.postUrl("catlVehicleService", "saveOrUpdateCatlVehicle", this.info);
            if (data)
            {
                this.$message.success("提交成功");
                this.openDialog(false);
                this.doQuery();
            }
        },
        handleSuccess()
        {
            this.doQuery();
            this.uploadOpen = false;
        },
        importExcel()
        {
            this.uploadOpen = true;
        },
    },
    computed:{
        formData(){
            return [
                {"name":"客户单号","model":"custOrderNum","type":"input","placeholder":"客户单号","isshow":true},
                {"name":"旧车牌号","model":"srcPlateNumber","type":"input","placeholder":"旧车牌号","isshow":true},
                {"name":"新车牌号","model":"plateNumber","type":"input","placeholder":"新车牌号","isshow":true},
            ]
        }
    },
}
