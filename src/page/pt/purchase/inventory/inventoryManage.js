import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
    name: 'inventorymanage',
    data()
    {
        return {
            head: [
                {"name": "库存地", "code": "workName", "width": "150", "type": "text"},
                {"name": "归属部门", "code": "orgName", "width": "150", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "物品种类", "code": "feeSubTypeName", "width": "150", "type": "text"},
                {"name": "品名", "code": "projectName", "width": "120", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "200", "type": "text"},
                {"name": "数量单位", "code": "unit", "width": "100", "type": "text"},
                {"name": "品名附件", "code": "baseId", "width": "200", "type": "diy"},
                {"name": "在库数量", "code": "nums", "width": "160", "type": "text"},
                {"name": "领用待审核数量", "code": "freezeNums", "width": "160", "type": "diy"},
                {"name": "付款类型", "code": "payTypeName", "width": "150", "type": "text"},
                {"name": "增值税", "code": "addValueTax", "width": "150", "type": "text"},
                {"name": "含税单价", "code": "actualPrice", "width": "150", "type": "text"},
                {"name": "含税金额", "code": "totalFee", "width": "150", "type": "text"},
                {"name": "租赁/分期/折旧月份数", "code": "depreciationMonthCount", "width": "200", "type": "text"},
                {"name": "开始计费日期", "code": "chargeDate", "width": "150", "type": "text"},
                {"name": "结束计费日期", "code": "chargeDateEnd", "width": "150", "type": "text"},
                {"name": "残值", "code": "scrapFee", "width": "150", "type": "text"},
                {"name": "累计产生成本", "code": "payFee", "width": "150", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "采购单号", "code": "purchaseNum", "width": "150", "type": "diy"},
                // {"name": "采购类型", "code": "purchaseTypeName", "width": "150", "type": "text"},
                {"name": "供应商合同号", "code": "contractNum", "width": "150", "type": "diy"},
                {"name": "使用客户", "code": "tenantName", "width": "150", "type": "text"},
                {"name": "领用部门", "code": "useOrgName", "width": "150", "type": "text"},
                {"name": "领用人员", "code": "useUserName", "width": "150", "type": "text"},
                {"name": "领用时间", "code": "useDate", "width": "150", "type": "text"},
                {"name": "领用备注", "code": "currentUseRemark", "width": "150", "type": "text"},
                {"name": "固定资产编号", "code": "stockNum", "width": "150", "type": "text"},
                {"name": "固定资产标识卡", "code": "url", "width": "150", "type": "diy"},
            ],
            query: {
                workId: '',
                supplierName: '',
                feeType: '',
                feeSubType: '',
                projectName: '',
                payType: '',
                chargeDate: '',
                purchaseType: '',
                contractNum: '',
            },
            srcList: [],
            workData: [],
            feeTypeData: [],
            feeSubTypeData: [],
            payTypeData: [],
            // purchaseTypeData: [],
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],
            consumingDialogShow: false,
            outboundDialogShow: false,
            allocateDialogShow: false,
            orgData:[],
            staffData:[],
            allStaffData:[],
            feeApplyData:[],
            customerData: [],
            deliveryWorkData:[],
            settleBodyData:[],
            allocateInfo: {
                applyId: null,
                applyDtlId: null,
                allocateNum: null,
                custTenantId: null,
                allocateWorkId: null,
                chargeDate: null,
                settleBody: null,
                remark: null,
            },
            consumingInfo: this.initInfo(),
            singleConsuming: true,
            consumingList: [],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initStaticData();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        searchList,
        myFileModel
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo()
        {
            return this.consumingInfo = {
                feeSubTypeName: "",
                projectName: "",
                specification: "",
                workName: "",
                nums: "",
                num: "",
                assetsNum: "",
                orgId: "",
                userId: "",
                useRemark:'',
            };
        },
        async initStaticData()
        {
            this.workData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0});
            // this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PURCHASE_TYPE"});
            this.payTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PAY_TYPE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.allStaffData = await this.common.postUrl("regionOrgTF", "getStaffInfoList", {tenantId:1});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
            this.treeData = [];
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })
            await this.loadWork();
            this.$forceUpdate();
        },
        changeOrg(){
            this.staffData=[];
            this.consumingInfo.userId = null;
            if(this.consumingInfo.orgId){
                for (let i = 0; i < this.allStaffData.length; i++) {
                    if(this.consumingInfo.orgId == this.allStaffData[i].orgId){
                        this.staffData.push(this.allStaffData[i]);
                    }
                }
            }
            this.$forceUpdate();
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            if (this.common.isNotBlank(this.query.chargeDate) && this.query.chargeDate.length == 2)
            {
                this.query.beginChargeDate = this.query.chargeDate[0];
                this.query.endChargeDate = this.query.chargeDate[1];
            } else
            {
                this.query.beginChargeDate = '';
                this.query.endCreateDate = '';
            }
            let feeTypeData = this.query.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.query.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.query.feeSubType = feeTypeData[1];
                }else{
                    this.query.feeSubType = '';
                }
            }else{
                this.query.feeType = '';
                this.query.feeSubType = '';
            }
            await this.$refs.table.load("purStockService", "queryPurStockPage", this.query);
        },
        dblclickItem(item)
        {
            this.open({
                query: {id: item.stockDtlId},
                urlId: 'inventoryDetail' + item.stockDtlId,
                urlName: '库存报表详情',
                urlPathName: '/inventoryDetail',
                urlPath: "/pt/purchase/inventory/inventoryDetail.vue",
            });
        },
        toPurOrder(item){
            this.open({
                query:{id:item.purchaseId,type:0},
                urlId: 'detailPurOrder' + item.purchaseId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        toContract(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
        toConsuming(item){
            if(item.freezeNums==0){
                return;
            }
            this.$emit('openTab', {
                urlName: "领用列表",
                urlId: 'consumingManage'+new Date().getTime(),
                urlPathName: "/consumingManage",
                urlPath: "/pt/purchase/consuming/consumingManage.vue",
                query: {verifyState:0,stockDtlId:item.stockDtlId},
            });
        },
        open(data)
        {
            this.$emit("openTab", {
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath
            });
        },
        async allocate(flag)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要调拨的库存！");
                return false;
            }
            this.allocateInfo = this.common.copyObj(selectData[0]);
            if (this.common.isNotBlank(this.allocateInfo.settleBody))
            {
                this.allocateInfo.settleBody = this.allocateInfo.settleBody + "";
            }
            this.allocateInfo.allocateNum = selectData[0].nums;
            this.$forceUpdate();
            this.feeApplyData = await this.common.postUrl("purFeeApplyTF", "loadPurFeeApplyData", {});
            this.openAllocateDialogShow(flag);
        },
        openAllocateDialogShow(flag)
        {
            this.allocateDialogShow = flag;
            this.$forceUpdate();
        },
        async consuming(singleConsuming)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (singleConsuming)
            {
                if (selectData.length !== 1)
                {
                    this.$message.error("请选择一条需要领用的库存！");
                    return false;
                }
            }
            else
            {
                if (selectData.length == 0)
                {
                    this.$message.error("请至少选择一条需要领用的库存！");
                    return false;
                }
            }
            this.singleConsuming = singleConsuming;
            if (singleConsuming)
            {
                this.consumingInfo = this.common.copyObj(selectData[0]);
                this.consumingInfo.assetsNum = this.consumingInfo.stockNum;
            }
            else
            {
                this.consumingInfo = this.initInfo();
                this.consumingList = [];
                for (let item of selectData)
                {
                    this.consumingInfo.feeSubTypeName += "," + (item.feeSubTypeName);
                    this.consumingInfo.projectName += "," + (item.projectName);
                    this.consumingInfo.specification += "," + (item.specification);
                    this.consumingInfo.workName += "," + (item.workName);
                    this.consumingInfo.nums += "," + (item.nums);
                    this.consumingInfo.num += "," + (item.nums);
                    this.consumingList.push(item);
                }
                if (this.common.isNotBlank(this.consumingInfo.feeSubTypeName))
                    this.consumingInfo.feeSubTypeName = this.consumingInfo.feeSubTypeName.substring(1);
                if (this.common.isNotBlank(this.consumingInfo.projectName))
                    this.consumingInfo.projectName = this.consumingInfo.projectName.substring(1);
                if (this.common.isNotBlank(this.consumingInfo.specification))
                    this.consumingInfo.specification = this.consumingInfo.specification.substring(1);
                if (this.common.isNotBlank(this.consumingInfo.workName))
                    this.consumingInfo.workName = this.consumingInfo.workName.substring(1);
                if (this.common.isNotBlank(this.consumingInfo.nums))
                    this.consumingInfo.nums = this.consumingInfo.nums.substring(1);
                if (this.common.isNotBlank(this.consumingInfo.num))
                    this.consumingInfo.num = this.consumingInfo.num.substring(1);
            }
            this.$forceUpdate();
            this.delCallback();
            this.openConsumingDialogShow(true);
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        openConsumingDialogShow(flag)
        {
            this.consumingDialogShow = flag;
            if (flag)
            {
                this.$nextTick(() => {
                    this.$refs.file.clean();
                });
            }
            this.$forceUpdate();
        },
        outbound(flag)
        {
            this.outboundDialogShow = flag;
            this.$forceUpdate();
        },
        successCallback(imgData)
        {
            this.consumingInfo.flowId = imgData.flowId;
            this.consumingInfo.storePath = imgData.storePath;
        },
        delCallback()
        {
            this.consumingInfo.flowId = null;
            this.consumingInfo.storePath = null;
        },
        async saveConsuming()
        {
            if (this.singleConsuming && this.common.isBlank(this.consumingInfo.num))
            {
                this.$message.error("领用数量为空！");
                return false;
            }
            if (this.common.isBlank(this.consumingInfo.orgId))
            {
                this.$message.error("领用部门为空！");
                return false;
            }
            if (this.common.isBlank(this.consumingInfo.userId))
            {
                this.$message.error("领用人员为空！");
                return false;
            }
            let method = "saveConsumingOld";
            if (!this.singleConsuming)
            {
                method = 'saveConsumingMultiple';
                this.consumingInfo.consumingList = this.consumingList;
            }
            await this.common.postUrl('purStockService', method, this.consumingInfo, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            this.openConsumingDialogShow(false);
        },
        changeApply()
        {
            if (this.common.isNotBlank(this.allocateInfo.applyDtlId))
            {
                this.feeApplyData.forEach(item => {
                    if (item.applyDtlId == this.allocateInfo.applyDtlId)
                    {
                        this.allocateInfo.allocateNum = this.common.accSub(item.demandNums, item.purchaseNums);
                        this.$forceUpdate();
                    }
                })
            }
        },
        async changeCustTenant(){
            this.allocateInfo.allocateWorkId = null;
            await this.loadWork();
            this.$forceUpdate();
        },
        async loadWork(tenantId)
        {
            this.deliveryWorkData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0,tenantId:tenantId});
        },
        async savePurAllocate()
        {
            let param = this.allocateInfo;
            if (this.common.isBlank(param.allocateNum))
            {
                this.$message.error("调拨数量为空！");
                return false;
            }
            if (this.common.isBlank(param.allocateWorkId))
            {
                this.$message.error("库存地为空！");
                return false;
            }
            if (this.common.isBlank(param.chargeDate))
            {
                this.$message.error("开始计费日期为空！");
                return false;
            }
            if (this.common.isBlank(param.settleBody))
            {
                this.$message.error("结算主体为空！");
                return false;
            }
            if (this.common.isBlank(param.orgId))
            {
                this.$message.error("调入部门为空！");
                return false;
            }
            await this.common.postUrl('purStockService', 'savePurAllocate', param, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            await this.openAllocateDialogShow(false);
        },
        changeAllocateWorkId()
        {
            if (this.allocateInfo.workId > 0 &&
            this.allocateInfo.workId == this.allocateInfo.allocateWorkId)
            {
                //Jimmy提交bug反馈的
                this.$message.error("调出库存地和调入的库存地不能是同一个地方！");
                this.allocateInfo.allocateWorkId = null;
                return false;
            }
            this.$forceUpdate();
        },
        showImg(data){
            if(!data.url){
                this.$message.error("没有图片~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.url.substring(data.url.lastIndexOf('.'), data.url.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.url);
                this.$refs.viewer.show();
            }else{
                data.url = data.url.replace("_big", "");
                let url = data.url;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },

    },
    computed:{
        formData(){
            return [
                {"name":"库存地","model":"workId","type":"select","options":this.workData,"label":"workName","value":"workId","placeholder":"仓库名称","method":"doQuery","isshow":true},
                {"name":"供应商","model":"supplierName","type":"input","isshow":true},
                {"name":"物品种类","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"品名","model":"projectName","type":"input","isshow":true},
                {"name":"付款类型","model":"payType","type":"select","options":this.payTypeData,"label":"codeName","value":"codeValue","placeholder":"付款类型","method":"doQuery","isshow":true},
                {"name":"结束计费日期","model":"chargeDate","type":"daterange","isshow":true},
                // {"name":"采购类型","model":"purchaseType","type":"select","options":this.purchaseTypeData,"label":"codeName","value":"codeValue","placeholder":"采购类型","method":"doQuery","isshow":true},
                {"name":"供应商合同号","model":"contractNum","type":"input","isshow":true},
                {"name":"固定资产编号","model":"stockNum","type":"input","isshow":true},
            ]
        }
    },

}
