import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'addReceipt',
    data() {
        return {
            query: {tenantName:this.$route.query.tenantName,supplierName:this.$route.query.supplierName},
            receipts: this.initReceipts(),
            waybillData: [],
            orderData: [],
            waybillWorkData: [],
            imgData: [],

            showSelect: true,
            isEditWaybill: false,//派车单号是否可选 默认不可选
            isEditOrder: false,//订单号是否可选 默认不可选
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.remoteSearchWaybill();
        },
        init() {
            //加载静态枚举
            let that = this;

        },

        initReceipts(receiptsType)
        {
            this.receipts = {
                rId: '',//ord_waybill_receipts_info id
                waybillId: '',
                dispatchId: '',
                waybillNum: '',
                orderId: '',
                orderNum: '',
                tenantName: '',
                waybillWorkId: '',
                workAddressStr: '',
                receiptsType: this.common.isBlank(receiptsType) ? '1' : receiptsType,
            };
            return this.receipts;
        },
        /**
         * 重置集合数据
         */
        initCollections()
        {
            this.waybillData = [];
            this.orderData = [];
            this.waybillWorkData = [];
        },
        /**
         * 远程搜索匹配运单号
         * @param waybillNum
         */
        async remoteSearchWaybill(waybillNum)
        {
            //重新输入运单重置数据
            this.initReceipts(this.receipts.receiptsType);
            this.initCollections();
            if (this.common.isNotBlank(waybillNum))
                this.query.waybillNum = waybillNum;
                this.waybillData = await this.common.postUrl("ordWaybillTF", "queryOrdWaybillList", this.query);
            this.$forceUpdate();
        },
        /**
         * 远程搜索匹配订单号
         * @param orderNum
         */
        async remoteSearchOrder(orderNum)
        {
            this.initReceipts(this.receipts.receiptsType);
            this.initCollections();
            if (this.common.isNotBlank(orderNum))
                this.query.orderNum = orderNum;
                this.query.isLoadHasOp = 1;
                this.orderData = await this.common.postUrl("orderTF", "queryOrderInfoData", this.query);
        },
        /**
         * 切换(只有上传的才有这个)
         */
        async doSwitch()
        {
            if (this.common.isBlank(this.receipts.waybillId))
                this.waybillWorkData = [];
            if (this.showSelect)//派车单搜索	订单选择
            {
                if (this.common.isNotBlank(this.receipts.orderId))//已经选择了订单  派车单下拉重新查询
                    await this.changeWaybillOrder(this.receipts.orderId);
            }
            else//订单搜索	派车单选择
            {
                if (this.common.isNotBlank(this.receipts.waybillId))//已经选择了派车单  订单下拉重新查询
                {
                    this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
                    if (this.orderData.length === 1)//一个订单默认选上
                    {
                        this.receipts.orderId = this.orderData[0].orderId;
                        this.receipts.orderNum = this.orderData[0].orderNum;
                        this.receipts.tenantName = this.orderData[0].tenantName;
                    }
                }
            }
            this.showSelect = !this.showSelect;

            this.$forceUpdate();
        },
        /**
         * 点击确认运单号
         * @param waybillId
         * @param flag 没有传 搜索派车单情况	flag =true 搜索订单情况 订单ID已经确认
         * @returns {Promise<void>}
         */
        async changeWaybill(waybillId, flag)
        {
            this.receipts.dispatchId = '';
            this.receipts.waybillWorkId = '';
            this.receipts.workAddressStr = '';
            this.waybillWorkData = [];//清空作业点
            if (!flag)
            {
                this.receipts.orderId = '';
                this.receipts.orderNum = '';
                this.receipts.tenantName = '';
            }
            if (this.common.isNotBlank(this.receipts.waybillId))
            {
                this.waybillData.forEach(item => {
                    if (item.waybillId == waybillId)
                    {
                        this.receipts.dispatchId = item.dispatchId;
                        this.receipts.waybillNum = item.waybillNum;
                    }
                });
                if (!flag)//派车单搜索时才加载订单数据   flag=true是订单搜索时 不加载
                {
                    this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
                    if (this.orderData.length === 1)//一个订单默认选上
                    {
                        this.receipts.orderId = this.orderData[0].orderId;
                        this.receipts.orderNum = this.orderData[0].orderNum;
                        this.receipts.tenantName = this.orderData[0].tenantName;
                    }
                }
                this.waybillWorkData = await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: this.receipts.waybillId});
            }
        },
        /**
         * 点击选择确认订单
         * @param orderId
         * @param loadFlag 没有传 搜索派车单情况  赋值客户可		flag =true 搜索订单情况 订单ID已经确认 加载订单相关的运单数据
         * @returns {Promise<void>}
         */
        async changeWaybillOrder(orderId, loadFlag)
        {
            this.receipts.tenantName = "";
            if (this.common.isNotBlank(orderId))
            {
                this.orderData.forEach(item => {
                    if (item.orderId == orderId)
                    {
                        this.receipts.tenantName = item.tenantName;
                        this.receipts.orderNum = item.orderNum;
                    }
                });
            }
            //订单搜索时确认订单	加载派车单数据
            if (loadFlag)
            {
                this.receipts.waybillId = '';
                this.receipts.dispatchId = '';
                this.receipts.waybillNum = '';
                this.waybillWorkData = [];
                this.receipts.waybillWorkId = '';
                this.receipts.workAddressStr = '';
                this.waybillData = await this.common.postUrl("ordWaybillTF", "getWaybillDataByOrderId", {orderId: this.receipts.orderId});
                if (this.waybillData.length === 1)//默认选上
                {
                    this.receipts.waybillId = this.waybillData[0].waybillId;
                    this.receipts.dispatchId = this.waybillData[0].dispatchId;
                    this.receipts.waybillNum = this.waybillData[0].waybillNum;

                    this.waybillWorkData = await this.loadWaybillWorkInfoByWaybillId(this.receipts.waybillId);
                    //后台只查询运单作业点 正常不会只有一个   后期改只查询该订单的时候可能有
                    if (this.waybillWorkData.length === 1)
                    {
                        this.receipts.waybillWorkId = this.waybillWorkData[0].waybillWorkId;
                        this.receipts.workAddressStr = this.waybillWorkData[0].workAddressStr;
                    }
                }
            }
        },
        /**
         * 加载运单作业点
         * @param waybillId
         * @returns {Promise<void>}
         */
        async loadWaybillWorkInfoByWaybillId(waybillId)
        {
            return await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: waybillId});
        },
        /**
         * 选择运单作业点
         * @param waybillWorkId
         */
        changeWaybillWork(waybillWorkId)
        {
            this.receipts.workAddressStr = '';
            if (this.common.isNotBlank(this.waybillWorkData))
            {
                this.waybillWorkData.forEach(item => {
                    if (item.waybillWorkId == waybillWorkId){ this.receipts.workAddressStr = item.workAddressStr; }
                });
            }
        },
        /**
         * 回调获取图片的信息
         * @param imgData
         */
        setImgData(imgData)
        {

        },
        /**
         * 新增单据
         */
        addReceipts()
        {
            if (this.common.isBlank(this.receipts.waybillId))
            {
                this.$message.error("请选择派车单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.orderId))
            {
                this.$message.error("请选择订单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.waybillWorkId))
            {
                this.$message.error("请选择作业点再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.receiptsType))
            {
                this.$message.error("请选择单据类型再提交！");
                return false;
            }
            for (let i = 1; i <= 5; i++) {
                let imageData = eval("this.$refs.receiptsImg"+i+".getImageData()");
                if(this.common.isNotBlank(imageData.flowId) && this.common.isNotBlank(imageData.storePath)){
                    let img = {
                        imgId : imageData.flowId,
                        imgPath : imageData.storePath,
                        fileName : imageData.fileName
                    };
                    this.imgData.push(img);
                }
            }
            if (this.imgData.length==0){
                this.$message.error("请上传图片信息再提交！");
                return false;
            }
            this.receipts.imgData = this.imgData;
            let that = this;
            this.common.postUrl("receiptsTF", "insertReceipts", this.receipts, function (data)
            {
                that.doQuery();
                that.changeReceiptsShow(false);
                that.$message.success("单据上传成功");
            },null, null,true);
        },
        /**
         * 关闭
         */
        changeReceiptsShow()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /**
         * 清空
         */
        clear()
        {
            this.query = {};
        },
    }
}
