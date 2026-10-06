import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum.js"

export default {
    name: 'oilManage',
    data()
    {
        return {
            head: [
                {"name": "车长(米)", "code": "vehicleLengthName", "width": "250", "type": "text"},
                {"name": "能源类型", "code": "energyTypeName", "width": "150", "type": "text"},
                {"name": "每公里油耗(元)", "code": "amount", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            info: this.initInfo(),
            query: {},
            vehicleLengthData: [],
            energyTypeData: [],
            title: "新增",
            showDialog: false,
            isVisible: false,
        }
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
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
     * 绑定函数
     */
    methods: {
        initInfo()
        {
            return this.info = {
                id: null,
                vehicleLength: null,
                energyType: null,
                amount: null,
            }
        },
        /**
         * 初始化数据
         */
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'VEHICLE_LENGTH,ENERGY_TYPE'});
            this.vehicleLengthData = data.VEHICLE_LENGTH;
            this.energyTypeData = data.ENERGY_TYPE;
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("standardCostBaseService", "queryStandardCostBasePage", this.query);
            items.forEach((el) =>
            {
                if (el.sts == 0)
                {
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        openDialog(flag, type, obj)
        {
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (type == 2 && selectData.length != 1)
                {
                    this.$message.error("请选择一条修改数据!");
                    return;
                }
                if (this.common.isNotBlank(obj))
                    this.info = obj;
                else
                {
                    if (type == 2)
                    {
                        this.info = this.common.copyObj(selectData[0]);
                    }
                    else
                    {
                        this.initInfo();
                    }
                }
                if (type == 1)
                {
                    this.title = "新增";
                    this.isVisible = false;
                }
                if (type == 2)
                {
                    this.title = "修改";
                    this.isVisible = false;
                    this.info.vehicleLength = this.info.vehicleLength + '';
                    this.info.energyType = this.info.energyType + '';
                }
                if (type == 5)
                {
                    this.title = "查看";
                    this.isVisible = true;
                    this.info.vehicleLength = this.info.vehicleLength + '';
                    this.info.energyType = this.info.energyType + '';
                }
            }
            this.showDialog = flag;
        },
        async deleteOil()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据~");
                return false;
            }
            let item = selectData[0];
            let that = this;
            this.$confirm("你将删除当前数据，是否确认删除", "删除提示" ,{
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                center: true
            }).then(async () => {
                await that.common.postUrl("standardCostBaseService", "deleteStandardCostBase", {id: item.id});
                await that.doQuery();
                that.$message.success("删除成功!");
            }).catch(() =>{})
        },
        dblclickItem(data)
        {
            this.openDialog(true, 5, data);
        },
        async savePersonCost()
        {
            if (this.common.isBlank(this.info.vehicleLength))
            {
                this.$message.error("请选择车长！");
                return;
            }
            if (this.common.isBlank(this.info.energyType))
            {
                this.$message.error("请选择能源类型！");
                return;
            }
            if (this.common.isBlank(this.info.amount))
            {
                this.$message.error("请输入每公里油耗(元)！");
                return;
            }
            let param = this.common.copyObj(this.info);
            param.type = 1;
            await this.common.postUrl("standardCostBaseService", "saveOrUpdateStandardCostBase", param, null, null, '', true);
            await this.doQuery();
            this.openDialog(false);
            this.$message.success(this.info.id > 0 ? "修改成功!" : "新增成功!");
        },
        download(){
          this.$refs.table.downloadExcelFile('车型油耗列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"能源类型","model":"energyType","type":"select","options":this.energyTypeData,"label":"codeName","value":"codeValue","placeholder":"能源类型","method":"doQuery","isshow":true},
            ]
        }
    },
}
