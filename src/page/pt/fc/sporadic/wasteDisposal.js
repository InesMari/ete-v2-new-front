import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'wasteDisposal',
    data()
    {
        return {
            id: this.$route.query.id,
            type: this.$route.query.type,
            info: this.initInfo(),
            settleBodyData: [],
            workData: [],
            scrapTypeData: [],
            isVisible: this.$route.query.id > 0 && this.$route.query.type > 2,
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        myFileModel,
    },
    methods: {
        initInfo()
        {
            return this.info = {
                settleBody: null,
                workId: null,
                month: null,
                scrapType: null,
                price: null,
                unit: null,
                nums: null,
                amount: null,
                postedAmount: null,
                remark: null,
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'PAY_TITLE,SCRAP_TYPE'});
            this.settleBodyData = data.PAY_TITLE;
            this.scrapTypeData = data.SCRAP_TYPE;
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            if (this.$route.query.id)
            {
                this.loadDataById(this.$route.query.id);
            }
        },
        successCallback(fileData)
        {
            if (fileData.componentId == 1)
            {
                this.info.handlingChecklistFileId = this.$refs.handlingChecklist.getImageData().flowId;
                this.info.handlingChecklistFilePath = this.$refs.handlingChecklist.getImageData().storePath;
            }
            else if (fileData.componentId == 2)
            {
                this.info.settlementDocumentFileId = this.$refs.settlementDocument.getImageData().flowId;
                this.info.settlementDocumentFilePath = this.$refs.settlementDocument.getImageData().storePath;
            }
            else if (fileData.componentId == 3)
            {
                this.info.salesRecordsFileId = this.$refs.salesRecords.getImageData().flowId;
                this.info.salesRecordsFilePath = this.$refs.salesRecords.getImageData().storePath;
            }
        },
        deleteCallback(componentId)
        {
            if (componentId == 1)
            {
                this.info.handlingChecklistFileId = null;
                this.info.handlingChecklistFilePath = null;
            }
            else if (componentId == 2)
            {
                this.info.settlementDocumentFileId = null;
                this.info.settlementDocumentFilePath = null;
            }
            else if (componentId == 3)
            {
                this.info.salesRecordsFileId = null;
                this.info.salesRecordsFilePath = null;
            }
        },
        async loadDataById(id)
        {
            let data = await this.common.postUrl('wasteDisposalIncomeService', 'loadWasteDisposalIncomeById', {id});
            this.info = data.info;
            this.info.settleBody = data.info.settleBody + "";
            this.info.scrapType = data.info.scrapType + "";
            
            if (this.info.handlingChecklistFileId)
            {
                this.$refs.handlingChecklist.initDate(this.info.handlingChecklistFileId);
            }
            if (this.info.settlementDocumentFileId)
            {
                this.$refs.settlementDocument.initDate(this.info.settlementDocumentFileId);
            }
            if (this.info.salesRecordsFileId)
            {
                this.$refs.salesRecords.initDate(this.info.salesRecordsFileId);
            }
            if(this.type == 6){
                this.info.receiveFeeDate = this.common.formatDate.getDate();
            }
            this.$forceUpdate();
        },
        async loadScrap(workId, scrapType)
        {
            let scrapData = await this.common.postUrl("scrapService", "loadScrapInfoList", {workId, scrapType});
            if (scrapData && scrapData.length > 0)
            {
                this.info.price = scrapData[0].price;
                this.info.unit = scrapData[0].unit;
                this.info.scrapId = scrapData[0].id;
            }
            this.$forceUpdate();
        },
        initScrap(){
            this.info.price = '';
            this.info.unit = '';
            this.info.scrapId = '';
        },
        async  changeWork()
        {
            this.initScrap();
            if (this.common.isNotBlank(this.info.workId) && this.common.isNotBlank(this.info.scrapType))
                await this.loadScrap(this.info.workId, this.info.scrapType);
            this.changePrice();
        },
        async changeScrapType()
        {
            this.initScrap();
            if (this.common.isNotBlank(this.info.workId) && this.common.isNotBlank(this.info.scrapType))
                await this.loadScrap(this.info.workId, this.info.scrapType);
            this.changePrice();
        },
        async changePrice()
        {
            this.info.amount = 0;
            this.info.postedAmount = 0;
            if (this.common.isNotBlank(this.info.price) && this.info.price > 0)
            {
                if (this.common.isNotBlank(this.info.nums) && this.info.nums > 0)
                {
                    this.info.amount = this.common.accMul(this.info.price, this.info.nums);
                    this.info.postedAmount = this.info.amount;
                }
            }
        },
        async changeNums()
        {
            this.info.amount = 0;
            this.info.postedAmount = 0;
            if (this.common.isNotBlank(this.info.nums) && this.info.nums > 0)
            {
                if (this.common.isNotBlank(this.info.price) && this.info.price > 0)
                {
                    this.info.amount = this.common.accMul(this.info.price, this.info.nums);
                    this.info.postedAmount = this.info.amount;
                }
            }
        },
        async confirm()
        {
            await this.common.postUrl('wasteDisposalIncomeService', 'confirmWasteDisposalIncome', this.info);
            this.$message.success("确认成功！");
            this.closePage();
        },
        async save()
        {
            if (this.common.isBlank(this.info.settleBody)) {
                this.$message.error("请选择结算主体！");
                return false;
            }
            if (this.common.isBlank(this.info.workId)) {
                this.$message.error("请选择物流基地！");
                return false;
            }
            if (this.common.isBlank(this.info.month)) {
                this.$message.error("请选择月份！");
                return false;
            }
            if (this.common.isBlank(this.info.scrapType)) {
                this.$message.error("请选择废品名称！");
                return false;
            }
            if (this.common.isBlank(this.info.price) || this.info.price <= 0) {
                this.$message.error("请输入单价！");
                return false;
            }
            if (this.common.isBlank(this.info.unit)) {
                this.$message.error("请输入计量单位！");
                return false;
            }
            if (this.common.isBlank(this.info.nums)) {
                this.$message.error("请输入数量！");
                return false;
            }
            if (this.common.isBlank(this.info.amount)) {
                this.$message.error("请输入金额！");
                return false;
            }
            if (this.common.isBlank(this.info.postedAmount) || this.info.postedAmount <= 0) {
                this.$message.error("请输入入账金额！");
                return false;
            }
            
            this.info.handlingChecklistFileId = this.$refs.handlingChecklist.getImageData().flowId;
            this.info.handlingChecklistFilePath = this.$refs.handlingChecklist.getImageData().storePath;
            
            this.info.settlementDocumentFileId = this.$refs.settlementDocument.getImageData().flowId;
            this.info.settlementDocumentFilePath = this.$refs.settlementDocument.getImageData().storePath;
            
            this.info.salesRecordsFileId = this.$refs.salesRecords.getImageData().flowId;
            this.info.salesRecordsFilePath = this.$refs.salesRecords.getImageData().storePath;
            
            await this.common.postUrl("wasteDisposalIncomeService", "saveOrUpdateWasteDisposalIncome", this.info);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}