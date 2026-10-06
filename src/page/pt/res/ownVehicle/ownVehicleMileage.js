import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'ownVehicleMileage',
    data() {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "发生日期", "code": "createDate", "width": "120", "type": "text"},
                {"name": "总行驶里程", "code": "sumMileage", "width": "120", "type": "text"},
                {"name": "有效里程", "code": "effectiveMileage", "width": "120", "type": "text"},
                {"name": "空驶里程", "code": "deadheadMileage", "width": "120", "type": "text"},
                {"name": "导入人", "code": "importUserName", "width": "80", "type": "text"},
                {"name": "导入部门", "code": "orgName", "width": "150", "type": "text"},
                {"name": "导入时间", "code": "importDate", "width": "140", "type": "text"},
            ],
            query: this.initQuery(),
            info: this.initInfo(),
            showUpdate: false,
            uploadOpen: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel,
        searchList,
        myImport,
    },
    /**
     * 绑定函数
     */
    methods: {
        //初始化页面的静态数据
        initStaticData(){
        
        },
        initQuery()
        {
            return this.query = {
                plateNumber: null,
                createDate: null,
                importUserName: null,
            };
        },
        initInfo() {
            return this.info = {
                plateNumber: null,
                createDate: null,
                sumMileage: null,
                effectiveMileage: null,
            }
        },
        async doQuery(query = this.query) {
            this.query = query;
            if (this.common.isNotBlank(this.query.createDate) && this.query.createDate.length == 2) {
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            } else {
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            let {items} = await this.$refs.table.load("vehicleMileageService", "queryVehicleMileagePage", this.query);
            items.forEach((el) => {
                if (el.waybillState == enumData.waybillState.cancelled) {
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
        },
        async sureCallback()
        {
            this.$message.success("导入成功！");
            this.uploadOpen = false;
            await this.doQuery();
        },
        /**
         *
         */
        openUpdateDialog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条修改数据！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            this.updateShow(true);
            this.$forceUpdate();
        },
        updateShow(flag)
        {
            this.showUpdate = flag;
            this.$forceUpdate();
        },
        /**
         * 新增单据
         */
        async updateVehicleMileageInfo()
        {
            if (this.common.isBlank(this.info.effectiveMileage))
            {
                this.$message.error("请输入有效里程！");
                return false;
            }
            await this.common.postUrl("vehicleMileageService", "updateVehicleMileageInfo", this.info);
            await this.doQuery();
            this.updateShow(false);
            this.$message.success("修改成功");
        },
        download(){
            this.$refs.table.downloadExcelFile('自有车里程管理列表');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"发生日期","model":"createDate","type":"daterange","isshow":true},
                {"name":"导入人","model":"importUserName","type":"input","placeholder":"调度人","isshow":true},
            ]
        }
    },
}
