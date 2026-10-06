import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer";
import $echarts from "echarts";

export default {
    name: 'contract',
    data() {
        return {
            head: [
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "text"},
                {"name": "合同评审编号", "code": "reviewContractNum", "width": "150", "type": "text"},
                {"name": "合同名称", "code": "contractName", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "合同开始日期", "code": "beginDate", "width": "150", "type": "text"},
                {"name": "合同结束日期", "code": "endDate", "width": "150", "type": "text"},
                {"name": "是否顺延", "code": "isPostponeName", "width": "90", "type": "text"},
                {"name": "是否到期", "code": "isExpireName", "width": "90", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "创建人部门", "code": "regionOrgName", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "合同附件", "code": "", "width": "150", "type": "diy"},
            ],
            supplierData: [],
            whetherData: [],
            payTitleOptions:[],
            orgData:[],
            query: this.initQuery(this.$route.query.contractNum),

            contractType:1,
            contractReviewType:this.$route.query.contractType==1 ? 1 : 2,
            baseTitle:"保险",
            tenantName:"供应商",

            title: "新增合同",
            showDialog: false,//弹窗
            disabled: false,//是否禁用元素
            disabledEdit: false,//
            disabledDel: false,//
            srcList: [],
            contract: this.initContract(),
            text: '数据统计',
            showList: true, //默认展示列表
            showChart: true,
            list: [],
            contractData: [],
            storeHouseData:[],
            openFlg:this.$route.query.openFlg,
            expirationStatusData:[],
            endDate:'',
            workIds:[],
            orgIds:[],
            showDlg:false,
            tenantDisabled:false,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"合同编号","model":"contractNum","type":"input","isshow":true},
                {"name":"合同评审编号","model":"reviewContractNum","type":"input","isshow":true},
                {"name":"合同名称","model":"contractName","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"到期自动延期","model":"isPostpone","type":"select","options":this.whetherData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.payTitleOptions, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"到期状态","model":"expirationStatus","type":"select","options":this.expirationStatusData,"label":"codeName","value":"codeValue","placeholder":"到期状态","method":"doQuery","multiple":true,"isshow":true,"tipText":"将到期：在30天内到期；未到期：不包括30天内将到期的记录"},
                {"name":"合同开始日期","model":"daterange1","type":"daterange","isshow":true},
                {"name":"合同结束日期","model":"daterange2","type":"daterange","isshow":true},
            ]
        }
    },
    mounted() {
        // this.init();
        // this.doQuery();
    },
    components: {
        tableCommon,
        enumData,
        searchList,
        myFileModel,
        fileViewer,
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            let that = this;
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'EXPIRATION_STATUS,WHETHER,PAY_TITLE'});
            this.whetherData = data.WHETHER;
            this.expirationStatusData = data.EXPIRATION_STATUS;
            this.payTitleOptions = data.PAY_TITLE;
            
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.supplierData.forEach(item => {
                item.tenantId = item.tenantId + "";
            })
            this.contractData =  await this.common.postUrl("contractReviewTF", "queryAllContracts", {type: that.contractReviewType,contractType: that.contractType - 1});
            // this.storeHouseData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            // this.storeHouseData.push({
            //     workId:100,
            //     workName:'易迁易总部'
            // })
            this.storeHouseData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0})
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.$forceUpdate();
        },
        /**
         * 初始化查询条件
         * @returns
         */
        initQuery(contractNum) {
            return this.query = {
                contractNum: contractNum,
                contractName: '',
                tenantName: '',
                isPostpone: '',
                isExpire: '',
                beginDateStart:'',
                beginDateEnd:'',
                endDateStart:'',
                endDateEnd:'',
                expirationStatus:this.common.isBlank(this.$route.query.expirationStatus) ? [] : this.$route.query.expirationStatus,
            };
        },
        /**
         * 初始化合同对象
         * @returns
         */
        initContract()
        {
            let that = this;
            return this.contract = {
                id: '',
                contractNum: '',
                reviewContractId: '',
                contractName: '',
                contractType: that.contractType,
                tenantId: '',
                beginDate: '',
                endDate: '',
                isPostpone: '0',
                imgId: '',
                imgPath: '',
                remark: '',
                businessContent: '',
                partyATitle: '',
                partyAOrgId: '',
                partyBTitle: '',
                partyBOrgId: '',
                isVehicleInsurance:'0',
                vehicleInsuranceType:[],
            };
        },
        /**
         *
         */
        async doQuery(query = this.query) {
            this.query = query;
            this.query.contractType = this.contractType;
            if(this.common.isNotBlank(this.query.daterange1) && this.query.daterange1.length==2){
                this.query.beginDateStart = this.query.daterange1[0];
                this.query.beginDateEnd = this.query.daterange1[1];
            }else{
                this.query.beginDateStart = '';
                this.query.beginDateEnd = '';
            }
            if(this.common.isNotBlank(this.query.daterange2) && this.query.daterange2.length==2){
                this.query.endDateStart = this.query.daterange2[0];
                this.query.endDateEnd = this.query.daterange2[1];
            }else{
                this.query.endDateStart = '';
                this.query.endDateEnd = '';
            }
            let method = "";
            if (this.query.contractType == 1)
            {
                method = "queryCustomerContractPage";
            }
            else if (this.query.contractType == 2)
            {
                //供应商-运输
                method = "queryTransportationContractPage";
            }
            else if (this.query.contractType == 3)
            {
                //供应商-仓储运作
                method = "queryWarehousingOperationContractPage";
            }
            else if (this.query.contractType == 4)
            {
                //供应商-器具容器
                method = "queryPackingContainerContractPage";
            }
            else if (this.query.contractType == 5)
            {
                //供应商-保险
                method = "queryInsuranceContractPage";
            }
            else if (this.query.contractType == 6)
            {
                //供应商-其他
                method = "queryOtherContractPage";
            }
            else if (this.query.contractType == 7)
            {
                //供应商-内部结转
                method = "queryInnerContractPage";
            }
            let {items} = await this.$refs.table.load("contractService", method, this.query);
            items.forEach((el) =>{
                if (el.display == 1) {//1个月内到期
                    el.class = 'trRed';
                }else if(el.display==9){//已到期
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
            if(this.openFlg==1&&items.length>0){
                this.seeContract(items[0]);
                this.openFlg = '';
            }
            this.$forceUpdate();
        },
        /**
         * 打开会话弹窗
         * @param flag
         */
        open(flag)
        {
            this.showDialog = flag;
            this.$forceUpdate();
        },
        /**
         * 回调获取图片的信息
         * @param imgData
         */
        setImgData(imgData)
        {
            this.contract.imgId = imgData.flowId;
            this.contract.imgPath = imgData.storePath;
        },
        deleteImgData()
        {
            this.contract.imgId = "";
            this.contract.imgPath = "";
        },
        showImg(data){
            if(!data.imgUrl){
                this.$message.error("没有图片~");
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
                let fileType = this.common.getFileType('',data.imgUrl);
                if(fileType=='pdf'){   //查看pdf
                    let idx = data.imgUrl.indexOf("?");
                    let url = data.imgUrl;
                    if(idx>=0){
                        url = data.imgUrl.substring(idx,0);
                    }
                    this.srcList=[url];
      		        this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){   //查看pdf
                    this.srcList=[data.imgUrl];
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(data.imgUrl)
                }
            }
        },
        /**
         * 新增合同
         */
        addContract()
        {
            let title = "新增"+this.baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:1,contractType:this.contractType},
            });
        },
        /**
         * 修改合同
         */
        updateContract()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要修改的合同！");
                return false;
            }
            let title = "修改"+this.baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:2,contractType:this.contractType,id:selectData[0].id},
            });
        },
        /**
         * 双击查看详情
         * @param data
         */
        toContractDetail(data)
        {
            this.seeContract(data);
        },
        /**
         * 查看合同
         * @returns {boolean}
         */
        seeContract(data)
        {
            let contract = {};
            if (this.common.isNotBlank(data))
            {
                contract = this.common.copyObj(data);
            }else{
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要查看的合同！");
                    return false;
                }
                contract = selectData[0];
            }
            let title = "查看"+this.baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:this.contractType,id:contract.id},
            });
        },
        /**
         * 保存合同
         */
        async saveOrUpdateContract() {
            let that = this;
            if (that.contractType != 7)
            {
                if (this.common.userInfo().userId!=827&&this.common.isBlank(this.contract.reviewContractId)) {
                    if (that.contractType != 5)
                    {
                        this.$message.error("请填写合同评审编号！");
                        return false;
                    }
                }
                if (this.common.isBlank(this.contract.contractName)) {
                    this.$message.error("请填写合同名称！");
                    return false;
                }
                // if(this.contract.contractType!=1){
                //     if (this.common.isBlank(this.contract.workIds)||this.contract.workIds.length<=0) {
                //         this.$message.error("请选择物流中心！");
                //         return false;
                //     }
                // }else{
                    if (this.common.isBlank(this.contract.orgIds)||this.contract.orgIds.length<=0) {
                        this.$message.error("请选择部门！");
                        return false;
                    }
                // }
                if (this.common.isBlank(this.contract.tenantId)) {
                    this.$message.error("请选择"+that.tenantName+"名称！");
                    return false;
                }
            }
            else
            {
                if (this.common.isBlank(this.contract.partyATitle)) {
                    this.$message.error("请选择甲方开票抬头！");
                    return false;
                }
                if (this.common.isBlank(this.contract.partyAOrgId)) {
                    this.$message.error("请选择甲方所属部门！");
                    return false;
                }

                if (this.common.isBlank(this.contract.businessContent)) {
                    this.$message.error("请填写业务内容！");
                    return false;
                }
            }
            if (this.common.isBlank(this.contract.beginDate)) {
                this.$message.error("请选择合同开始日期！");
                return false;
            }
            if (this.common.isBlank(this.contract.endDate)) {
                this.$message.error("请选择合同结束日期！");
                return false;
            }
            if (that.contractType == 7)
            {
                if (this.common.isBlank(this.contract.partyBTitle)) {
                    this.$message.error("请选择乙方开票抬头！");
                    return false;
                }
                if (this.common.isBlank(this.contract.partyBOrgId)) {
                    this.$message.error("请选择乙方所属部门！");
                    return false;
                }
            }
            if(that.contractType == 5){
                if(this.contract.isVehicleInsurance==1){
                    if(this.common.isBlank(this.contract.vehicleId)){
                        this.$message.error("请选择车辆！");
                        return false;
                    }
                    if(this.common.isBlank(this.contract.vehicleInsuranceType)){
                        this.$message.error("请选择车辆保险类型！");
                        return false;
                    }
                    let vehicleInfo = this.vehicleData.filter(item=>item.id==this.contract.vehicleId);
                    this.contract.plateNumber = vehicleInfo[0].plateNumber;
                }
            }
            //判断子合同的逻辑
            if(this.contract.subContractList!=null&&this.contract.subContractList.length>0){
                for(let i=0;i<this.contract.subContractList.length;i++){
                    let lineStr = "第"+ (i+1)+"行的";
                    let subContract = this.contract.subContractList[i];
                    if (this.common.isBlank(subContract.contractName)) {
                        this.$message.error(lineStr+"合同名称不能为空！");
                        return false;
                    }
                    if (this.common.userInfo().userId!=827&&this.common.isBlank(subContract.reviewContractId)) {
                        this.$message.error(lineStr+"合同评审编号不能为空！");
                        return false;
                    }
                    if (this.common.isBlank(subContract.beginDate)) {
                        this.$message.error(lineStr+"合同开始日期不能为空！");
                        return false;
                    }
                    if (this.common.isBlank(subContract.endDate)) {
                        this.$message.error(lineStr+"合同结束日期不能为空！");
                        return false;
                    }
                    if(this.common.isBlank(subContract.imgId)){
                        this.$message.error(lineStr+"合同原件不能为空！");
                        return false;
                    }
                }
            }
            await this.common.postUrl("contractService", "saveOrUpdateContract", this.contract, function (data) {
                that.$message.success(that.contract.id > 0 ? that.baseTitle+"合同修改成功！" : "新增"+that.baseTitle+"合同成功");
                that.$forceUpdate();
                that.closePage();
                that.$parent.$parent.loadTodoData();
            },null,'',true);
        },
        /**
         * 删除
         */
        deleteContract()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的合同！");
                return false;
            }
            let data = selectData[0];
            let that = this;
            that.$confirm("确认需要删除合同？", "提示").then(() =>{
                that.common.postUrl("contractService", "deleteContract", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                    that.$parent.$parent.loadTodoData();
                },null,'',true);
            }).catch(() =>{});
        },
        async changeShowStyle()
        {
            if (this.showList)
            {
                //页面展示问题导致后面$nextTick再处理表格
                this.text = '切换列表';
            }
            else
            {
                this.text = '数据统计';
                await this.doQuery();
            }
            this.showList = !this.showList;
            //需要页面渲染完毕才处理图标
            if (!this.showList)
            {
                this.$nextTick(async() => {
                    await this.initEchart();
                })
            }
            this.$forceUpdate();
        },
        async initEchart(){
            let that = this;
            let total = await this.common.postUrl("contractService", "queryStatisticsData", {contractType: that.contractType});
            this.list = total.nameList;
            //饼图
            $echarts.init(document.getElementById("chart1")).setOption({
                title: {
                    text: that.tenantName+'总数：' + total.totalSize,  //Jimmy 产品一定要展示这个数值 讲不听拉到
                    left: 'center',
                    bottom: '2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: total.customerData
                }]
            });
            //柱形
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '合同份数：' + total.totalContract,
                    left: 'center',
                    bottom: '2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                xAxis: {
                    type: 'category',
                    data: total.provinceNameList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '',
                        type: 'bar',
                        data: total.provinceValueList
                    }
                ]
            });
            //饼图
            $echarts.init(document.getElementById("chart3")).setOption({
                title: {
                    text: '本月新增：' + total.createInCurrentMonthCount,
                    left: 'center',
                    bottom: '-2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    left: 'center',
                    bottom: 10,
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '50%',
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: total.createInCurrentMonthCount, name: '本月新增' },
                        { value: total.createNotInCurrentMonthCount, name: '历史合同' },
                    ]
                }]
            });
            //饼图
            $echarts.init(document.getElementById("chart4")).setOption({
                title: {
                    text: '已合作未提报'+that.tenantName+'数：' + total.notContractCount,
                    left: 'center',
                    bottom: '-2%',
                    textStyle:{
                        fontSize:14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'
                },
                legend: {
                    left: 'center',
                    bottom: 10,
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: total.hasContractCount, name: '已签合同' },
                        { value: total.notContractCount, name: '已合作未提报'+that.tenantName+'数' },
                    ]
                }]
            });
        },
        changeChartView(){
            this.showChart = !this.showChart;
            this.$forceUpdate();
        },
        changeContractReview(){
            let that = this;
            if(this.contract.reviewContractId){
                this.contractData.forEach(el=>{
                    if(el.contractId===that.contract.reviewContractId){
                        this.contract.beginDate = el.keepStartDate;
                        this.contract.endDate = el.keepEndDate;
                        if(that.common.isNotBlank(el.tenantId)){
                            this.contract.tenantId = el.tenantId+'';
                            this.tenantDisabled = true;
                        }else{
                            this.tenantDisabled = false;
                        }
                    }
                })
            }else{
                this.contract.beginDate = '';
                this.contract.endDate = '';
                this.tenantDisabled = false;
            }
        },
        showRenewal(){
            let item = this.$refs.table.getSelectItem();
            if(item.length!=1){
                this.$message.error("请选择一条数据。")
            }
            this.endDate = new Date(item[0].endDate);
            this.endDate.setFullYear(this.endDate.getFullYear()+1);
            let year = this.endDate.getFullYear();
            let month = this.endDate.getMonth()+1;
            let day = this.endDate.getDate();
            this.endDate = year +"-" + (month<10?'0'+month:month) +"-" + (day<10?'0'+day:day);

            if(this.common.isNotBlank(item.orgIds)){
                this.orgIds= item.orgIds.split(",").map(Number);
            }
            this.showDlg=true;
        },
        closeDialog(){
            this.showDlg=false;
        },
        renewal(){
            let item = this.$refs.table.getSelectItem();
            let that  = this;
            that.common.postUrl("contractService", 'renewal', {id: item[0].id,endDate:this.endDate,orgIds:this.orgIds}, function (data) {
                if (data) {
                    that.doQuery();
                    that.$message.success("续期成功！");
                    that.showDlg=false;
                }
            },null,'',true);

        },
        changeStartDate(item)
        {
            if (this.common.isNotBlank(item.beginDate))
            {
                let start = new Date(item.beginDate);
                let month = start.getMonth();
                let day = start.getDate();
                if (month == 1 && day == 29)
                    day = 28;
                let end = new Date(start.getFullYear() + 1, month, day - 1);
                item.endDate = this.common.formatDate.getDate(end);
                this.$forceUpdate();
            }
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
