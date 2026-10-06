import quoteSheetCommon from "./quoteSheetCommon.js";
export default {
    name: 'addQuote',
    mixins:[quoteSheetCommon],
    /**
     * 初始化
     */
    async mounted() {
        await this.initData();
        this.type = this.$route.query.type;
        this.isCopy = this.$route.query.isCopy;
        if(this.type == 1){  //新增
            this.initAddData();
        }else if(this.type == 2){  //修改、复制
            this.initUpdateData();
        }
    },
    /**
     * 绑定函数
     */
    methods: {
        // 新增
        async initAddData() {
            let {custTenantId,workStoreId} = this.info.baseInfo;
            this.info.details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems',{custTenantId,workId:workStoreId});
            // 默认勾选
            this.info.details.forEach(item => {
                item.display = 1;
                if(item.codeId == 1){
                    item.items.forEach(el => {
                        el.display = 1;
                    })
                }
                // 配送服务、器具回收自行生成ID
                if(item.codeId == 104 || item.codeId == 106){
                    item.items.forEach((el,index) => {
                        el.itemIdLog = el.itemId;
                        el.itemId = String(el.itemId) + index;
                    });
                }
            })
            // 仓储费对象
            this.firstTableItem = this.info.details[0];
            this.firstTableItem0 = [];
            this.firstTableItem1 = [];
            this.firstTableItem.items.forEach(item => {
                if(item.itemCode == "monthFee"){ //"定量仓储面积计费"
                    item.shareRate = 30;
                    item.storageCondition = '1';
                    this.firstTableItem0.push(item)
                }else if(item.itemCode == "tmpMonthFee"){    //"按件仓储计费"
                    item.storageCondition = '1';
                    item.countRule='1';
                    item.remark='临时仓储计费托数=前⼀天结存+当天⼊库';
                    this.firstTableItem1.push(item)
                }
            })
            //我方信息
            let {billId,userName,email} = JSON.parse(localStorage.getItem("userInfo"));
            this.info.baseInfo.ourLinkman = userName;
            this.info.baseInfo.ourBillId = billId;
            this.info.baseInfo.ourEmail = email;
            this.info.baseInfo.quoteDate = this.common.formatDate.getDate();
            this.info.baseInfo.remark = `1）计费吨托（MT)：按每托重量、体积最大值计算，最小计费单位为一托；
2）有以上相关价格外的业务则双方重新议价；   
3）如因报价条件发生变更则重新调整相关报价；   
4）费用为30天结算，我司开具增值税发票，贵司在次月30 日前付款到敝司指定账户；
5）其他未尽事宜，双方互相沟通协商后再行确认。`;
            this.$forceUpdate();
            this.setTableWidthDrag();
        },
        // 修改
        async initUpdateData() {
            this.info = await this.common.postUrl('wmsQuoteSheetTF','queryQuoteSheet',{quoteId:this.$route.query.quoteId,isUpdate:1});
            // 干掉旧的费用项目
            this.info.details = this.info.details.filter(item => item.codeId > 100 || item.codeId == 1);
            // 插入新的费用项目
            let {custTenantId,workStoreId} = this.info.baseInfo;
            let newDetails = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems',{custTenantId,workId:workStoreId});
            let pushDetails = [];
            newDetails.forEach(newItem => {
                let hasItem = false;
                this.info.details.forEach(item => {
                    if(item.codeId == newItem.codeId) hasItem = true;
                })
                if(!hasItem) pushDetails.push(newItem);
            })
            this.info.details.push(...pushDetails);
            //我方信息
            this.info.baseInfo.settleBody = this.info.baseInfo.settleBody+'';
            // 仓储费对象
            this.firstTableItem = this.info.details[0];
            this.firstTableItem.items.forEach(item => {
                if(item.itemCode == "monthFee"){ //"定量仓储面积计费"
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    this.firstTableItem0.push(item)
                }else if(item.itemCode == "tmpMonthFee"){    //"按件仓储计费"
                    item.countRule = item.countRule?String(item.countRule):'';
                    item.storageCondition = item.storageCondition?String(item.storageCondition):'';
                    this.firstTableItem1.push(item)
                }
            })
            if(this.firstTableItem0.length == 0){
               let details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems');
               this.firstTableItem0.push(details[0].items[0]);
            }
            if(this.firstTableItem1.length == 0){
               let details = await this.common.postUrl('wmsQuoteSheetTF','queryAllFeeItems');
               this.firstTableItem1.push(details[0].items[1]);
            }
            //我方信息
            let {billId,userName,email} = JSON.parse(localStorage.getItem("userInfo"));
            if(this.common.isBlank(this.info.baseInfo.ourLinkman)) this.info.baseInfo.ourLinkman = userName;
            if(this.common.isBlank(this.info.baseInfo.ourBillId)) this.info.baseInfo.ourBillId = billId;
            if(this.common.isBlank(this.info.baseInfo.ourEmail)) this.info.baseInfo.ourEmail = email;
            this.info.baseInfo.settleBody = this.info.baseInfo.settleBody+'';
            // 查询目的地数据
            await this.searchEndWorks(true);
            // 遍历处理数据
            for(let el of this.info.details){
                if(this.common.isBlank(el.display)) el.display = 0;
                // elmentUI需要置换数据类型
                // 配送服务和器具回收逻辑
                if(el.codeId == 104 || el.codeId == 106){
                    for(let item of el.items){
                        if(this.common.isNotBlank(item.endWorkId)) item.endWorkId = item.endWorkId.map(String);
                        if(el.codeId == 104){
                            if(this.common.isNotBlank(item.quoteVehicleType)) item.quoteVehicleType += '';
                            if(this.common.isNotBlank(item.vehicleLength)) item.vehicleLength += '';
                            // 赋值起始地
                            item.beginWorkId = this.info.baseInfo.workStoreId;
                        }
                        // id置换
                        item.itemIdLog = item.itemId;
                        if(this.common.isNotBlank(item.subItemId)){
                            item.itemId = item.subItemId;
                        }else{
                            item.subItemId = item.itemId;
                        }
                    }
                }
            }
            // 合并数组
            let mergeArr = [];
            this.mergeListCache = [];
            this.info.rebuildDetails.forEach(merge => {
                if(merge.rebuildType == 1){     //合并项
                    var obj = {titleName:merge.title,merge:[],rebuildType:'1'};
                    merge.items.forEach((item,index) => {
                        obj.merge[index] = {
                            items:[item]
                        };
                        //  下面注释是错误示例，这样会导致修改数据时数据不同步
                        // if(this.common.isNotBlank(item.relDetailList)){
                        //     obj.merge[index].items = [item,...item.relDetailList];
                        //     this.mergeListCache = [...this.mergeListCache,...item.relDetailList];
                        // }
                        //  end
    
                        // 遍历拿出明细类
                        if(this.common.isNotBlank(item.relIds)){    //获取合并明细类
                            item.relIds.forEach(id => {
                                let details = this.info.details;
                                for(let i=0;i<details.length;i++){    //遍历费用项目
                                    let detail = details[i].items;
                                    for(let m=0;m<detail.length;m++){     //遍历费用项目明细提取id相同明细类
                                        let innerItem = detail[m];
                                        if(id == innerItem.itemId){
                                            obj.merge[index].items.push(innerItem);     //插入明细类
                                            this.mergeListCache.push(innerItem);    //记录表插入明细
                                            break;
                                        }
                                    }
                                }
                            })
                        }
                    })
                }else if(merge.rebuildType == 2){   //分类项
                    var obj = {titleName:merge.title,merge:[{items:[]}],rebuildType:'2'};
                    // 遍历拿出明细类
                    if(this.common.isNotBlank(merge.relIds)){    //获取合并明细类
                        merge.relIds.forEach(id => {
                            let details = this.info.details;
                            for(let i=0;i<details.length;i++){    //遍历费用项目
                                let detail = details[i].items;
                                for(let m=0;m<detail.length;m++){     //遍历费用项目明细提取id相同明细类
                                    let innerItem = detail[m];
                                    if(id == innerItem.itemId){
                                        obj.merge[0].items.push(innerItem);    //插入明细类
                                        this.mergeListCache.push(innerItem);    //记录表插入明细
                                        break;
                                    }
                                }
                            }
                        })
                    }
                }
                mergeArr.push(obj);
            })
            if(mergeArr.length==0){
                this.mergeArr = this.initMergeData();
            }else{
                this.mergeArr = mergeArr;
            }
            this.$forceUpdate();
            this.setTableWidthDrag();
        },
    },
}
