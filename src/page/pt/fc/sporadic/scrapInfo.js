import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'scrapInfo',
    data()
    {
        return {
            id: this.$route.query.id,
            type: this.$route.query.type,
            info: this.initInfo(),
            workData: [],
            salesMethodData: [],
            scrapTypeData: [],
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
        }
    },
    mounted()
    {
        this.initData();
        if (this.$route.query.id)
        {
            this.loadDataById(this.$route.query.id);
        }
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                workId: null,
                scrapType: null,
                unit: null,
                salesMethod: null,
                linkman: null,
                linkPhone: null,
                recyclingSubject: null,
                price: null,
                remark: null,
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'SALES_METHOD,SCRAP_TYPE'});
            this.salesMethodData = data.SALES_METHOD;
            this.scrapTypeData = data.SCRAP_TYPE;
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('scrapService', 'loadScrapById', {id});
            this.info = data.info;
            this.info.scrapType = data.info.scrapType + "";
            this.info.salesMethod = data.info.salesMethod + "";
            
            this.$forceUpdate();
        },
        async save()
        {
            if (this.common.isBlank(this.info.workId)) {
                this.$message.error("请选择物流基地！");
                return false;
            }
            if (this.common.isBlank(this.info.scrapType)) {
                this.$message.error("请选择废品名称！");
                return false;
            }
            if (this.common.isBlank(this.info.unit)) {
                this.$message.error("请输入计量单位！");
                return false;
            }
            if (this.common.isBlank(this.info.salesMethod)) {
                this.$message.error("请选择售卖方式！");
                return false;
            }
            if (this.common.isBlank(this.info.linkman)) {
                this.$message.error("请输入联系人！");
                return false;
            }
            if (this.common.isBlank(this.info.linkPhone)) {
                this.$message.error("请输入联系电话！");
                return false;
            }
            if (this.common.isBlank(this.info.recyclingSubject)) {
                this.$message.error("请输入回收方！");
                return false;
            }
            if (this.common.isBlank(this.info.price) || this.info.price <= 0) {
                this.$message.error("请输入单价！");
                return false;
            }
            await this.common.postUrl("scrapService", "saveOrUpdateScrap", this.info);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}