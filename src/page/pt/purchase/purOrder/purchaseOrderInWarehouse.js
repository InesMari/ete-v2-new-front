import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'purchaseOrderInWarehouse',
    data() {
        return {
            info:{
                purchaseNum: null,
                settleBodyName: null,
                workName: null,
                inDate: null,
                orderRemark: null,
                dtlList:[{}],
            },
            total:{
                purchaseNum: 0,
                deliveryNums: 0,
                nums: 0,
            },
            // pickerOptions:{
            //     disabledDate(time) {
            //         var now = new Date();
            //         now.setHours(23);
            //         now.setMinutes(59);
            //         now.setSeconds(59);
            //         now.setMilliseconds(0)
            //         return time.getTime() >= now.getTime();
            //     }
            // },

            pickerOptions : {},
            allAssetClassData:[],
            allAssetSubClassData:[],
            whetherData:[],
            contractData:[],
            billingCycleData:[],
            tip:"",
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
        myFileModel,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initInfo()
        {
            this.allAssetClassData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_CLASS"});
            this.allAssetSubClassData = await this.common.postUrl("assetTF", "getAssetSubClassData", {});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.billingCycleData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ASSET_BILLING_CYCLE"});
            this.info.id = this.$route.query.id;
            let data = await this.common.postUrl('purPurchaseService', 'loadPurPurchaseById', {id: this.info.id}, null, null, null, true);
            this.contractData = await this.common.postUrl("contractService", "queryContractList", {isloadSupplier: 1,tenantId:data.tenantId});

            this.info = data.info;
            this.total.purchaseNum = 0;
            this.total.deliveryNums = 0;
            this.total.nums = 0;
            for (let i = 0; i < data.dtlList.length; i++)
            {
                let item = data.dtlList[i];
                if (!isNaN(item.purchaseNum))
                {
                    this.total.purchaseNum = this.common.accAdd(this.total.purchaseNum, item.purchaseNum);
                    item.nums = item.purchaseNum;
                }
                else
                {
                    item.nums = 0;
                }
                if (!isNaN(item.deliveryNums))
                {
                    this.total.deliveryNums = this.common.accAdd(this.total.deliveryNums, item.deliveryNums);
                    item.nums = this.common.accSub(item.nums, item.deliveryNums);
                }
                if (item.nums == 0)
                {
                    data.dtlList.splice(i, 1);
                    i--;
                }
                if(item.feeType==26){
                    item.assetType = '2';
                    item.assetClass = '4';
                    item.assetSubClass = item.deviceType +'';
                }
                item.isCentralPurchase = '0';
                let assetClassData = this.allAssetClassData.filter(el=>el.codeId==item.assetType);
                if(assetClassData.length==0){
                    assetClassData = this.allAssetClassData;
                }
                item.assetClassData = assetClassData;
                this.changeAssetClass(item);
            }
            this.info.dtlList = data.dtlList;
            this.$nextTick(()=>
            {
                this.$refs.file.clean();
            })

            let billDateInfo = await this.common.postUrl("commonTF", "getBillDate", {});

            let date = parseInt(billDateInfo.billDate);
            this.tip = (date - 1) + "日前入库，时间可以选择上月任意一天，如果是" + date + "日后，包括" + date + "日，只能选择本月的任意一天，不能选择上月的日期"
            // if(this.common.userInfo().orgId==99){
            // 	this.pickerOptions = {
            // 		disabledDate(time) {
            // 			//当前日期小于等于5号时,可以选择上月和当月.
            // 			let curDate = new Date().getTime();
            // 			let monthTime = 30 * 24 * 3600 * 1000;
            // 			let startDate = curDate - monthTime;
            // 			return time.getTime() < startDate;
            // 		}
            // 	}
            // }else{
            this.pickerOptions = {
                disabledDate(time) {
                    //当前日期小于等于5号时,可以选择上月和当月.
                    let now = new Date();
                    let date = now.getDate();
                    //当月指定日期之前可以选择上月的，超过只能选择当月
                    if (date < parseInt(billDateInfo.billDate)||billDateInfo.specialOrg) {
                        let month = parseInt(billDateInfo.billMonth);
                        let curDate = new Date().getTime();
                        let monthTime = 30 * 24 * 3600 * 1000 * month;
                        let startDate = curDate - monthTime;
                        
                        let curDate2 = new Date();
                        return time.getTime() < new Date(curDate2.getFullYear(), curDate2.getMonth() - 1, 1).getTime();
                    } else {
                        let curDate = new Date();
                        return time.getTime() < new Date(curDate.getFullYear(), curDate.getMonth(), 1).getTime();
                    }
                },
            };
            this.$forceUpdate();
        },
        changeAssetClass(item){
            let that = this;
            if(item.assetClass){
                item.assetSubClassData = [];
                this.allAssetSubClassData.forEach(el=>{
                        let array = el.codeValue.split('#');
                        if(array[0]==item.assetClass){
                            let subItem = that.common.copyObj(el);
                            subItem.codeValue = array[1];
                            item.assetSubClassData.push(subItem);
                        }
                    }
                );
            }else{
                this.assetSubClassData = [];
            }
            this.forceUpdate();
        },
        successCallback(imgData)
        {
            this.info.imgId = imgData.flowId;
            this.info.imgPath = imgData.storePath;
        },
        delCallback(index)
        {
            this.info.imgId = null;
            this.info.imgPath = null;
        },
        successCallbackReal(imgData)
        {
            this.info.realImgId = imgData.flowId;
            this.info.realImgPath = imgData.storePath;
        },
        delCallbackReal(index)
        {
            this.info.realImgId = null;
            this.info.realImgPath = null;
        },
        changeDeliveryNums()
        {
            this.total.nums = 0;
            this.info.dtlList.forEach(item => {
                if (!isNaN(item.nums))
                {
                    this.total.nums = this.common.accAdd(this.total.nums, item.nums);
                }
            })
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        async confirmInStorage()
        {
            if(this.common.isBlank(this.info.id))
            {
                this.$message.error("采购单不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.inDate))
            {
                this.$message.error("入库日期不能为空!");
                return;
            }
            if (this.common.isBlank(this.info.dtlList) || this.info.dtlList.length == 0)
            {
                this.$message.error("采购明细不能为空！");
                return false;
            }
            for (let i = 0; i < this.info.dtlList.length; i++)
            {
                let item = this.info.dtlList[i];
                if(this.common.isBlank(item.deliveryNums))
                {
                    this.$message.error("第" + (i + 1) + "行的采购数量不能为空!");
                    return;
                }
                if(item.nums > item.purchaseNum)
                {
                    this.$message.error("第" + (i + 1) + "行的入库数量大于采购数量!");
                    return;
                }
                if(item.payType != 1 && this.common.isBlank(item.chargeDate))
                {
                    this.$message.error("第" + (i + 1) + "行的开始计费日期不能为空!");
                    return;
                }
                if(item.payType != 1 && this.common.isBlank(item.chargeDateEnd))
                {
                    this.$message.error("第" + (i + 1) + "行的结束计费日期不能为空!");
                    return;
                }
            }
            let param = this.common.copyObj(this.info);
            param.dtlList = this.info.dtlList;
            await this.common.postUrl('purPurchaseOrderDeliveryService', 'savePurPurchaseOrderDelivery', param, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },

        deleteDtlListItem(index)
        {
            this.info.dtlList.splice(index, 1);
            this.$forceUpdate();
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
    computed:{},
}
