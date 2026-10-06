import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'purchaseOrderManage',
    data() {
        return {
            head: [
                {"name": "采购单单号", "code": "purchaseNum", "width": "120", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
                {"name": "费用申请单号", "code": "applyNums", "width": "350", "type": "diy"},
                {"name": "费用申请部门", "code": "applyOrgName", "width": "120", "type": "text"},
                {"name": "预计发货/提货时间", "code": "deliverDate", "width": "150", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "采购方名称", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "费用类型", "code": "feeSubTypeName", "width": "250", "type": "text"},
                {"name": "品名/项目", "code": "projectNames", "width": "200", "type": "text"},
                {"name": "需求总数量", "code": "totalDemandNums", "width": "120", "type": "text"},
                {"name": "采购总数量", "code": "purchaseNums", "width": "120", "type": "text"},
                {"name": "含税总金额（元）", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "采购人", "code": "purchaseUserName", "width": "160", "type": "text"},
                {"name": "采购部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "当前审核人", "code": "currentVerifyData", "width": "120", "type": "text"},
                {"name": "部门审核", "code": "verifyUserName1", "width": "180", "type": "text"},
                {"name": "部门审核意见", "code": "verifyRemark1", "width": "180", "type": "text"},
                // {"name": "经管中心/行政中心审核", "code": "verifyUserName2", "width": "180", "type": "text"},
                // {"name": "经管中心/行政中心审核意见", "code": "verifyRemark2", "width": "180", "type": "text"},
                // {"name": "总经理审核", "code": "verifyUserName3", "width": "180", "type": "text"},
                // {"name": "总经理审核意见", "code": "verifyRemark3", "width": "180", "type": "text"},
                {"name": "线下采购单存档", "code": "offLine", "width": "160", "type": "diy"},
                {"name": "入库单号", "code": "deliveryNums", "width": "250", "type": "diy"},
            ],
            loadParam: {
                purchaseNum:'',
                purchaseType:'',
                tenantName:'',
                settleBody:'',
                projectName:'',
                applyNum:'',
                state:'',
                verifyState:this.$route.query.todo == 1?['0','1']:[],
                feeType:'',
                feeSubType:'',
                createDate:'',
                currentVerifyData:this.$route.query.todo == 1?this.common.userInfo().userName:'',
                applyOrgIds:[],
            },
            info:{
                purchaseNum: null,
                settleBodyName: null,
                workName: null,
                inDate: null,
                orderRemark: null,
                dtlList:[{}],
            },
            showInWarehouse:false,  //入库弹窗
            showOfflinePur:false,   //线下采购
            settleBodyData:[],
            stateData:[],
            verifyStateData:[],
            feeTypeData:[],
            feeSubTypeData:[],
            disabledEdit: false,
            disabledDel: false,
            srcList: [],
            total:{
                purchaseNum: 0,
                deliveryNums: 0,
                nums: 0,
            },
            pickerOptions:{
                disabledDate(time) {
                    var now = new Date();
                    now.setHours(23);
                    now.setMinutes(59);
                    now.setSeconds(59);
                    now.setMilliseconds(0)
                    return time.getTime() >= now.getTime();
                }
            },
            orgData:[],
            treeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        searchList,
        myFileModel,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData() {
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
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
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_RECEIPT_STATE"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_VERIFY_STATE"});

            if (this.$route.query.todo == 1){
                this.loadParam.verifyState = ['0', '1'];
                this.loadParam.currentVerifyData = this.common.userInfo().userName;
            }

            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.createDate) && this.loadParam.createDate.length == 2) {
                this.loadParam.beginCreateDate = this.loadParam.createDate[0];
                this.loadParam.endCreateDate = this.loadParam.createDate[1];
            } else {
                this.loadParam.beginCreateDate = '';
                this.loadParam.endCreateDate = '';
            }
            let feeTypeData = this.loadParam.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.loadParam.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.loadParam.feeSubType = feeTypeData[1];
                }else{
                    this.loadParam.feeSubType = '';
                }
            }else{
                this.loadParam.feeType = '';
                this.loadParam.feeSubType = '';
            }
            await this.$refs.table.load("purPurchaseService", "queryPurPurchasePage", this.loadParam);
        },
        toApplyDetail(item, index){
            let id = item.applyIdArray[index];
            let data = {
                query:{id:id,viewType:1},
                urlId: 'feeApplyDetail'+id,
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        toInOrderDetail(item, index){
            this.open({
                query: {id: item.deliveryIdArray[index]},
                urlId: 'inOrderDetail' + item.deliveryIdArray[index],
                urlName: '入库管理详情',
                urlPathName: '/inOrderDetail',
                urlPath: "/pt/purchase/inOrder/inOrderDetail.vue",
            });
        },
        updateItem(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有创建人自己才能修改！");
                return false;
            }
            this.open({
                query:{id:selectData[0].id, type: 2, flag: 2},
                urlId: 'updatePurOrder' + selectData[0].id + 2,
                urlName: '修改采购单',
                urlPathName: '/updatePurOrder',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        verifyItem(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据审核！");
                return;
            }
            if (0 != selectData[0].verifyState && 1 != selectData[0].verifyState)
            {
                this.$message.error("只有未审核和审核中的采购单才可以审核！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].currentVerifyUserId){
                this.$message.error("只有当前审核人才可以审核");
                return false;
            }
            this.open({
                query:{id:selectData[0].id, type: 3},
                urlId: 'verifyPurOrder' + selectData[0].id + 3,
                urlName: '审核采购单',
                urlPathName: '/verifyPurOrder',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        cancelVerifyItem(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据取消审核！");
                return;
            }
            if (0 == selectData[0].verifyState)
            {
                this.$message.error("未审核的采购单不可以取消审核！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].currentVerifyUserId){
                this.$message.error("只有当前审核人才可以取消审核");
                return false;
            }
            //状态 0 未收货 1 部分收货 2 全部收货
            if (0 != selectData[0].state)
            {
                this.$message.error("未收货的采购单才能取消审核！");
                return false;
            }
            this.$confirm("是否确认取消审核采购单？", "提示").then(async () =>{
                await this.common.postUrl("purPurchaseService", "cancelVerifyPurPurchase", {id:selectData[0].id},
                    null, null, '', true);
                this.$message.success("取消审核采购单成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });

        },
        dblclickItem(item){
            this.open({
                query:{id:item.id,type:0},
                urlId: 'detailPurOrder' + item.id + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        purchaseOffLine()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据存档！");
                return;
            }
            if (3 != selectData[0].verifyState)
            {
                this.$message.error("只有审核完的采购单才可以存档！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            this.openShowOfflinePur(true);
            this.$nextTick(() => {
                if (this.common.isNotBlank(this.info.imgId))
                {
                    this.$refs.file.initDate(this.info.imgId);
                }
                else
                {
                    this.$refs.file.clean();
                }
            })
        },
        openShowOfflinePur(flag)
        {
            this.showOfflinePur = flag;
            this.$forceUpdate();
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
        async confirmOfflinePur()
        {
            if(this.common.isBlank(this.info.id))
            {
                this.$message.error("采购单不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.imgId))
            {
                this.$message.error("图片文件不能为空!");
                return;
            }
            if(this.common.isBlank(this.info.imgPath))
            {
                this.$message.error("图片文件不能为空!");
                return;
            }
            await this.common.postUrl('purPurchaseService', 'savePurPurchaseFile', this.info, null, null, null, true);
            this.$message.success("提交成功")
            this.openShowOfflinePur(false);
            await this.doQuery();
        },
        async inWarehouse()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据进行入库！");
                return;
            }
            if (3 != selectData[0].verifyState)
            {
                this.$message.error("只有审核完的采购单才可以入库！");
                return false;
            }
            //状态 0 未收货 1 部分收货 2 全部收货
            if (2 == selectData[0].state)
            {
                this.$message.error("全部收货的采购单不能继续收货！");
                return false;
            }
            this.open({
                query:{id:selectData[0].id},
                urlId: 'purchaseOrderInWarehouse' + selectData[0].id,
                urlName: '采购单入库',
                urlPathName: '/purchaseOrderInWarehouse',
                urlPath: "/pt/purchase/purOrder/purchaseOrderInWarehouse.vue",
            });

            // this.info = this.common.copyObj(selectData[0]);
            // this.openShowInWarehouse(true);
            // let data = await this.common.postUrl('purPurchaseService', 'loadPurPurchaseById', {id: this.info.id}, null, null, null, true);
            //
            // this.total.purchaseNum = 0;
            // this.total.deliveryNums = 0;
            // this.total.nums = 0;
            // for (let i = 0; i < data.dtlList.length; i++)
            // {
            //     let item = data.dtlList[i];
            //     if (!isNaN(item.purchaseNum))
            //     {
            //         this.total.purchaseNum = this.common.accAdd(this.total.purchaseNum, item.purchaseNum);
            //         item.nums = item.purchaseNum;
            //     }
            //     else
            //     {
            //         item.nums = 0;
            //     }
            //     if (!isNaN(item.deliveryNums))
            //     {
            //         this.total.deliveryNums = this.common.accAdd(this.total.deliveryNums, item.deliveryNums);
            //         item.nums = this.common.accSub(item.nums, item.deliveryNums);
            //     }
            //     if (item.nums == 0)
            //     {
            //         data.dtlList.splice(i, 1);
            //         i--;
            //     }
            // }
            // this.info.dtlList = data.dtlList;
            // this.$nextTick(()=>
            // {
            //     this.$refs.file.clean();
            // })
            // this.$forceUpdate();
        },
        // openShowInWarehouse(flag)
        // {
        //     this.showInWarehouse = flag;
        //     this.$forceUpdate();
        // },
        // changeDeliveryNums()
        // {
        //     this.total.nums = 0;
        //     this.info.dtlList.forEach(item => {
        //         if (!isNaN(item.nums))
        //         {
        //             this.total.nums = this.common.accAdd(this.total.nums, item.nums);
        //         }
        //     })
        //     this.$forceUpdate();
        // },
        // changeChargeDate()
        // {
        //     this.$forceUpdate();
        // },
        // async confirmInStorage()
        // {
        //     if(this.common.isBlank(this.info.id))
        //     {
        //         this.$message.error("采购单不能为空!");
        //         return;
        //     }
        //     if(this.common.isBlank(this.info.inDate))
        //     {
        //         this.$message.error("入库日期不能为空!");
        //         return;
        //     }
        //     if (this.common.isBlank(this.info.dtlList) || this.info.dtlList.length == 0)
        //     {
        //         this.$message.error("采购明细不能为空！");
        //         return false;
        //     }
        //     for (let i = 0; i < this.info.dtlList.length; i++)
        //     {
        //         let item = this.info.dtlList[i];
        //         if(this.common.isBlank(item.deliveryNums))
        //         {
        //             this.$message.error("第" + (i + 1) + "行的采购数量不能为空!");
        //             return;
        //         }
        //         if(item.nums > item.purchaseNum)
        //         {
        //             this.$message.error("第" + (i + 1) + "行的入库数量大于采购数量!");
        //             return;
        //         }
        //         if(item.payType != 1 && this.common.isBlank(item.chargeDate))
        //         {
        //             this.$message.error("第" + (i + 1) + "行的开始计费日期不能为空!");
        //             return;
        //         }
        //         if(item.payType != 1 && this.common.isBlank(item.chargeDateEnd))
        //         {
        //             this.$message.error("第" + (i + 1) + "行的结束计费日期不能为空!");
        //             return;
        //         }
        //     }
        //     let param = this.common.copyObj(this.info);
        //     param.dtlList = this.info.dtlList;
        //     await this.common.postUrl('purPurchaseOrderDeliveryService', 'savePurPurchaseOrderDelivery', param, null, null, null, true);
        //     this.$message.success("提交成功")
        //     this.openShowInWarehouse(false);
        //     await this.doQuery();
        // },
        // 打印
        print(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }            
            if (selectData[0].verifyState != 3) {
                this.$message.error("审核完成才能打印！");
                return;
            }
            this.open({
                query:{id:selectData[0].id},
                urlId: 'printPurOrder' + selectData[0].id,
                urlName: '打印采购单',
                urlPathName: '/printPurOrder',
                urlPath: "/pt/purchase/purOrder/printPurOrder.vue",
            });
        },
        deleteItem() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            this.$confirm("是否确认删除采购单？", "提示").then(async () =>{
                await this.common.postUrl("purPurchaseService", "deletePurPurchaseById", {id:selectData[0].id},
                        null, null, '', true);
                this.$message.success("删除采购单成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        // deleteDtlListItem(index)
        // {
        //     this.info.dtlList.splice(index, 1);
        //     this.$forceUpdate();
        // },
        showImg(data){
            if(!data.imgUrl){
                this.$message.error("没有附件~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.imgUrl.substring(data.imgUrl.lastIndexOf('.'), data.imgUrl.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.imgUrl);
                this.$refs.viewer.show();
            }else{
                data.imgUrl = data.imgUrl.replace("_big", "");
                let url = data.imgUrl;
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
        exportExcel()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"采购单单号","model":"purchaseNum","type":"input","placeholder":"采购单单号","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
                {"name":"采购方名称","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","placeholder":"采购方名称","method":"doQuery","isshow":true},
                {"name":"费用申请单号","model":"applyNum","type":"input","placeholder":"费用申请单号","isshow":true},
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":{ checkStrictly: true,value: 'codeValue',label: 'codeName' },"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"品名/项目","model":"projectName","type":"input","placeholder":"品名/项目","isshow":true},
                {"name":"状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"状态","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"状态","method":"doQuery","isshow":true},
                {"name":"当前审核人","model":"currentVerifyData","type":"input","placeholder":"当前审核人","isshow":true},
                {"name":"费用申请部门","model":"applyOrgIds","type":"select","options":this.orgData,"label":"orgName","value":"id",multiple:true,"placeholder":"费用申请部门","method":"doQuery","isshow":true},
                {"name":"采购部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"采购部门","method":"doQuery","isshow":true},
                {"name":"采购人","model":"purchaseUserName","type":"input","placeholder":"采购人","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
            ]
        }
    },
}
