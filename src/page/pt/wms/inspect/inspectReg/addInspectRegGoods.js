import myFileModel from '@/components/myFileModel/myFileModel.vue';
export default {
    data() {
        return {
            info: {
                id: null,
                workStoreId: null,
                customerName: null,
                materialNum: null,
                batchNum: null,
                count: null,
                planDealDate: null,
            },
            type: this.$route.query.type,//1新增  2修改 0详情
            view: this.$route.query.type == 0,
            workData: [],
            imgList: [{}],

        };
    },
    mounted()
    {
        this.initData();
        if (this.type != 1)
        {
            this.loadDataById();
        }
    },
    name: "addInspectRegGoods",
    components: {
        myFileModel
    },
    methods: {
        async loadDataById()
        {
            let data = await this.common.postUrl('wmsInspectionExceptionRecordService', 'loadWmsInspectionExceptionRecordDataById', {id: this.$route.query.id});
            this.info = data.info;
            if (this.common.isNotBlank(data.imgList))
            {
                let that = this;
                that.$nextTick(() => {
                    for (let i = 0; i < data.imgList.length; i++) {
                        eval("that.$refs.file" + i + "[0].initDate(" + data.imgList[i].imgId + ")");
                    }
                    if (that.type != 0 && data.imgList.length < 5)
                        data.imgList.push({});
                });
            }
            this.imgList = data.imgList;
            this.$forceUpdate();
        },
        async initData()
        {
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        successCallback(imgData)
        {
            imgData.imgId = imgData.flowId;
            imgData.imgPath = imgData.storePath;
            if (this.imgList.length <= 5)
                this.imgList[imgData.componentId] = imgData;
            let flag = true;
            for (let i = 0; i < this.imgList.length; i++)
            {
                if (this.common.isBlank(this.imgList[i].imgId))
                {
                    flag = false;//存在空的
                }
            }
            if (this.type != 0)
            {
                if(this.imgList.length  < 5 && flag){
                    this.imgList.push({});
                }
            }
            this.initListComponentId();
        },
        delCallback(index)
        {
            this.imgList.splice(index,1);
            let flag = true;
            for (let i = 0; i < this.imgList.length; i++)
                if (this.common.isBlank(this.imgList[i].imgId))
                {
                    flag = false;//存在空的
                }
            if(this.imgList.length === 4 && flag){
                this.imgList.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.imgList.length; i++)
                this.imgList[i].componentId = i;
            this.$forceUpdate();
        },
        imgDisplay(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.imgList.length; i++) {
                    if (that.imgList[i].imgId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.imgList[i].imgId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        async save()
        {
            if (this.common.isBlank(this.info.workStoreId))
            {
                this.$message.error("仓库不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.customerName))
            {
                this.$message.error("客户名称不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.materialNum))
            {
                this.$message.error("料号不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.batchNum))
            {
                this.$message.error("批次号不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.count))
            {
                this.$message.error("数量不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.planDealDate))
            {
                this.$message.error("计划处理时间不能为空!");
                return false;
            }
            let imgList = [];
            for (let i = 0; i < this.imgList.length; i++)
            {
                let item = this.imgList[i];
                if (this.common.isNotBlank(item.imgId) && this.common.isNotBlank(item.imgPath))
                {
                    imgList.push(item);
                }
            }
            if (imgList.length === 0)
            {
                this.$message.error("至少需要上传一张图片！");
                return false;
            }
            let param = this.common.copyObj(this.info);
            param.imgList = imgList;
            await this.common.postUrl('wmsInspectionExceptionRecordService', 'saveOrUpdateWmsInspectionExceptionRecord', param, null, null, null, true);
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