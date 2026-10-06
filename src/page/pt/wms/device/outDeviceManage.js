import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import myImport from "@/components/myImport/myImport";

export default {
    name: 'maintenanceManage',
    data()
    {
        return {
            head:
                [
                    {"name": "器具名称", "code": "name", "width": "150", "type": "text"},
                    {"name": "长宽高（mm*mm*mm）", "code": "spec", "width": "150", "type": "text"},
                    {"name": "器具图片", "code": "img", "width": "100", "type": "diy"},
                    {"name": "器具备注", "code": "remark", "width": "150", "type": "text"},
                    {"name": "管理单位", "code": "deviceUnitName", "width": "100", "type": "text"},
                    {"name": "器具类型", "code": "deviceTypeName", "width": "100", "type": "text"},
                    {"name": "回收收入单价", "code": "incomePrice", "width": "100", "type": "text", "issum": "true"},
                    {"name": "运输单价", "code": "transportPrice", "width": "100", "type": "text", "issum": "true"},
                    {"name": "回收成本单价", "code": "reoveryPrice", "width": "100", "type": "text", "issum": "true"},
                    {"name": "仓内整理单价", "code": "clearUpPrice", "width": "100", "type": "text", "issum": "true"},
                    {"name": "创建人", "code": "createUserName", "width": "100", "type": "text", "issum": "true"},
                    {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                ],
            query: this.initQuery(),
            deviceInfo: this.initDeviceInfo(),
            title: "新增器具",
            dialogShow: false,
            uploadOpen: false,
            srcList: [],
            deviceUnitOptions: [],
            deviceTypeOptions: [],
            deviceAttributeOptions: [],
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
        myFileModel,
        fileViewer,
        myImport
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery()
        {
            return this.query = {
                deviceName: '',
                deviceType: '',
            };
        },
        /**
         * 查询列表
         */
        doQuery()
        {
            this.uploadOpen = false;
            this.query.type = 2;//客户器具
            this.$refs.table.load("deviceBaseService", "queryDeviceInfoPage", this.query);
        },
        async initData()
        {
            this.deviceUnitOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_UNIT"});
            this.deviceTypeOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_TYPE"});
            this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_PACK_TYPE"});
            this.deviceUnitOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_UNIT"});
            this.deviceTypeOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_TYPE"});
            this.deviceAttributeOptions = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEVICE_ATTRIBUTE"});
        },
        initDeviceInfo()
        {
            return this.deviceInfo = {
                type: '2',
                name: null,
                length: null,
                width: null,
                height: null,
                deviceUnit: null,
                deviceType: null,
                remark: null,
                incomePrice: null,
                transportPrice: null,
                reoveryPrice: null,
                clearUpPrice: null,
                imgId: null,
                imgPath: null,
            };
        },
        successCallback(imgData)
        {
            this.deviceInfo.imgId = imgData.flowId;
            this.deviceInfo.imgPath = imgData.storePath;
        },
        delCallback(componentId)
        {
            this.deviceInfo.imgId = "";
            this.deviceInfo.imgPath = "";
        },
        openAddDialog(flag)
        {
            this.initDeviceInfo();
            this.dialogShow = flag;
            if (flag)
            {
                this.title = '新增器具';
                this.$nextTick(() =>
                {
                    if (this.$refs.file)
                    {
                        this.$refs.file.clean();
                    }
                })
            }
            this.$forceUpdate();
        },
        openUpdateDialog(type)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条数据!");
                return false;
            }
            this.deviceInfo = this.common.copyObj(selectData[0]);
            if (this.deviceInfo.deviceUnit)
            {
                this.deviceInfo.deviceUnit = this.deviceInfo.deviceUnit + '';
            }
            if (this.deviceInfo.deviceType)
            {
                this.deviceInfo.deviceType = this.deviceInfo.deviceType + '';
            }
            this.dialogShow = true;
            this.title = '修改器具';
            this.$nextTick(() =>
            {
                if (this.$refs.file)
                {
                    this.$refs.file.initDate(this.deviceInfo.imgId);
                }
            })
        },
        async delDevInfo()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条数据!");
                return false;
            }
            let data = selectData[0];
            await this.$confirm('确定要删除此器具信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });
            await this.common.postUrl("deviceBaseService", "delDeviceInfo", data);
            this.$message.success("删除成功！");
            this.doQuery();
        },
        async saveOrUpdateDevice()
        {
            let param = this.common.copyObj(this.deviceInfo);
            if (this.common.isBlank(param.name))
            {
                this.$message.error("请输入器具名称！");
                return false;
            }
            if (this.common.isBlank(param.length))
            {
                this.$message.error("请输入器具长度！");
                return false;
            }
            if (this.common.isBlank(param.width))
            {
                this.$message.error("请输入器具宽度！");
                return false;
            }
            if (this.common.isBlank(param.height))
            {
                this.$message.error("请输入器具高度！");
                return false;
            }
            if (this.common.isBlank(param.deviceUnit))
            {
                this.$message.error("请选择管理单位！");
                return false;
            }
            if (this.common.isBlank(param.deviceType))
            {
                this.$message.error("请选择器具类型！");
                return false;
            }
            if (this.common.isBlank(param.incomePrice))
            {
                this.$message.error("请输入回收收入单价！");
                return false;
            }
            if (this.common.isBlank(param.transportPrice))
            {
                this.$message.error("请输入运输单价！");
                return false;
            }
            if (this.common.isBlank(param.reoveryPrice))
            {
                this.$message.error("请输入回收成本单价！");
                return false;
            }
            if (this.common.isBlank(param.clearUpPrice))
            {
                this.$message.error("请输入仓内整理单价！");
                return false;
            }
            await this.common.postUrl("deviceBaseService", 'saveDeviceInfo', param, null, true);
            this.$message.success("保存成功！")
            await this.doQuery();
            this.openAddDialog(false);
        },
        showImg(data)
        {
            this.srcList = [];
            this.srcList.push(data.imgUrl);
            this.$refs.viewer.show();
        },
        exportExcel()
        {
            this.$refs.table.downloadExcelFile();
        },

    },
}