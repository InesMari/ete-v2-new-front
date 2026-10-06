export default {
    data() {
        return {
            info: {
                id: null,
                inspectionNum: null,
                inspectionItem: null,
                type: null,
                scanQrcode:false,
                inspectMethod:[],
            },
            view: false,
            type: this.$route.query.type,//1新增  2修改
            typeData: [],
            equipmentTypeData: [],
            inspectMethodData:[],
            list: [{inspectMethod:[]}],
        };
    },
    mounted()
    {
        if (this.type == 2)
        {
            this.loadDataById();
        }
        this.initData();
    },
    name: "addInspectNorm",
    components: {},
    methods: {
        async loadDataById()
        {
            let data = await this.common.postUrl('wmsInspectionStandardService', 'loadWmsInspectionStandardDataById', {id: this.$route.query.id});
            this.info = data.info;
            this.info.scanQrcode = data.info.scanQrcode==1;
            this.list = data.list;
            for (let i = 0; i < this.list.length; i++)
            {
                let item = this.list[i];
                if(this.common.isBlank(item.inspectMethod)){
                    item.inspectMethod = [];
                }else{
                    item.inspectMethod = item.inspectMethod.split(",");
                }
            }
            this.$forceUpdate();
        },
        async initData()
        {
            this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_INSPECTION_STANDARD_RESULT_FILL_TYPE"});
            this.equipmentTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_EQUIPMENT_TYPE"});
            this.inspectMethodData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INSPECT_METHOD"});
        },
        addItem()
        {
            this.list.push({inspectMethod:[]});
        },
        removeItem(index)
        {
            this.list.splice(index, 1);
        },
        async save()
        {
            if (this.common.isBlank(this.info.inspectionItem))
            {
                this.$message.error("巡检事项不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.type))
            {
                this.$message.error("检查结果填写方式不能为空!");
                return false;
            }
            if (this.common.isBlank(this.list) || this.list.length == 0)
            {
                this.$message.error("检查基准不能为空!");
                return false;
            }
            for (let i = 0; i < this.list.length; i++)
            {
                let item = this.list[i];
                if (this.common.isBlank(item.inspectItem))
                {
                    this.$message.error("第" + (i + 1) + "行巡检项目的内容不能为空!");
                    return false;
                }
                if (this.common.isBlank(item.content))
                {
                    this.$message.error("第" + (i + 1) + "行检查基准的内容不能为空!");
                    return false;
                }
                if (this.common.isBlank(item.inspectRequire))
                {
                    this.$message.error("第" + (i + 1) + "行巡检要求的内容不能为空!");
                    return false;
                }
                if(item.inspectMethod.length==0){
                    this.$message.error("第" + (i + 1) + "行巡检方法不能为空!");
                    return false;
                }
            }
            let param = this.common.copyObj(this.info);
            param.list = this.common.copyObj(this.list);
            await this.common.postUrl('wmsInspectionStandardService', 'saveOrUpdateWmsInspectionStandard', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
};