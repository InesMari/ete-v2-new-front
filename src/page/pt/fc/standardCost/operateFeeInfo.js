import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'scrapInfo',
    data()
    {
        return {
            id: this.$route.query.id,
            type: this.$route.query.type,
            info: this.initInfo(),
            details: [this.initItem()],
            deliveryFormData: [],
            processTypeData: [],
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
                name: null,
                deliveryForm: null,
                amount: 0,
            };
        },
        initItem()
        {
            return {
                processType: null,
                amount: null,
            };
        },
        async initData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes',
                {'codeType': 'DELIVERY_FORM,PROCESS_TYPE'});
            this.deliveryFormData = data.DELIVERY_FORM;
            this.processTypeData = data.PROCESS_TYPE;
        },
        
        async loadDataById(id)
        {
            let data = await this.common.postUrl('standardCostOperateFeeService', 'loadStandardCostOperateFeeById', {id});
            this.info = data.info;
            this.info.deliveryForm = data.info.deliveryForm + "";
            this.details = data.details;
            for (let i = 0; i < this.details.length; i++)
            {
                let item = this.details[i];
                item.processType = item.processType + "";
            }
            //this.changeAmount();
            this.$forceUpdate();
        },
        addItem()
        {
            this.details.push(this.initItem());
        },
        removeItem(index)
        {
            if (this.details.length === 1)
            {
                this.$message.error("至少保留一条数据！");
                return false;
            }
            this.details.splice(index,1);
        },
        changeAmount()
        {
            let amount = 0;
            for (let i = 0; i < this.details.length; i++)
            {
                let item = this.details[i];
                if (this.common.isNotBlank(item.amount) && item.amount > 0)
                {
                    amount = this.common.accAdd(amount, item.amount);
                }
            }
            this.info.amount = amount;
        },
        async save()
        {
            if (this.common.isBlank(this.info.deliveryForm)) {
                this.$message.error("请选择到货形式！");
                return false;
            }
            if (this.common.isBlank(this.details) || this.details.length == 0)
            {
                this.$message.error("工序为空！");
                return false;
            }
            for (let i = 0; i < this.details.length; i++)
            {
                let item = this.details[i];
                if (this.common.isBlank(item.processType)) {
                    this.$message.error("请选择" + (i + 1) + "工序名称！");
                    return false;
                }
                if (this.common.isBlank(item.amount) || item.amount <= 0) {
                    this.$message.error("请输入" + (i + 1) + "单价！");
                    return false;
                }
            }
            let param = this.common.copyObj(this.info);
            param.details = this.common.copyObj(this.details);
            await this.common.postUrl("standardCostOperateFeeService", "saveOrUpdateStandardCostOperateFee", param);
            this.$message.success("保存成功！");
            this.closePage();
        },
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}