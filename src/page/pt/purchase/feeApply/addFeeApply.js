import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue";
import enumData from "@/page/pt/enum";
import multiFileUpload from '@/mixins/multiFileUpload.js';

export default {
    name: "addFeeApply",
    mixins: [multiFileUpload],
    components: {
        myFileModel,
        dbTable,
    },
    data() {
        return {
            head:[
                {name:"费用类型",code:'feeNames',width:"200", "type": "text"},
                // {name: "采购类型", code: "purchaseTypeName", width: "150", "type": "text"},
                {name:"品名/项目",code:'projectName',width:"200", "type": "text"},
                {name:"规格型号",code:'specification',width:"180", "type": "text"},
                {name:"供应商",code:'tenantName',width:"250", "type": "text"},
                {name:"数量单位",code:'unit',width:"100", "type": "text"},
                {name:"在途数量",code:'inTheRoadNums',width:"150", "type": "text"},
                {name:"现有库存数量",code:'stockNums',width:"150", "type": "text"},
                {name:"上月使用数量",code:'lastMonthUseNums',width:"150", "type": "text"},
                {name:"付款类型",code:'payTypeName',width:"100", "type": "text"},
            ],
            info: {
                applySettleBody:'',
                applyRemark:'',
                urgentLevel:'1',
                expectDate:'',
                deliveryUser:'',
                deliveryPhone:'',
                deliveryAddress:'',
                dtls:[],
                files:[{}],
                isWithinBudget:'0',
            },
            loadParam:{
                feeTypeData:[],
                projectName: null,
                specification: null,
                purchaseType: null,
            }, //左右表格搜索对象
            isShowDialog:false,
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],

            urgentLevelData: [],//紧急程度
            totalReferTotalFee:0,
            whetherData: [],
            orgUserData: [],//部门审核人
            feeTypeDisabled:false,
            isFilter: true,//是否过滤
            purchaseTypeData:[],

            isWithinBudgetSwitch: true,//是否可以操作《是否预算内》默认不可以
            settleBodyData:[],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            // 获取当前数据
            let {oneLevelOrgName,userName, billId,workAddressStr,address} = JSON.parse(localStorage.getItem("userInfo"));
            this.info = {...this.info, oneLevelOrgName,userName, billId,workAddressStr,address};
            this.info.orgName = this.info.oneLevelOrgName;
            this.info.deliveryUser = this.info.userName;
            this.info.deliveryPhone = this.info.billId;
            this.info.deliveryAddress = this.info.workAddressStr;//仓库地址
            if(this.common.isNotBlank(this.info.address)){
                this.info.deliveryAddress = this.info.address;
            }
            this.info.date = this.common.formatDate.getDate(new Date);
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.urgentLevelData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "URGENT_LEVEL"});
            this.feeTypeData = await this.common.postUrl("purFeeBaseService", "getSysStaticDataForSpecify", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PURCHASE_TYPE"});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {orgFlag:1,entityId: 1014011});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
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
                data.disabled = true;
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
            if(this.$route.query.id){
                this.initFeeApplyData();
            }
            this.common.tableStretch(this.$refs.table);

            let cfg = await this.common.postUrl("commonTF", "getSysCfgByCfgName", {cfgName: "IS_WITHIN_BUDGET_SWITCH"});
            this.isWithinBudgetSwitch = cfg ? cfg.cfgValue != "1" : true;// 1 为打开可以使用 disabled = false

            let applySettleBody = await this.common.postUrl("userTF", "getRelSubsidiary");
            if(applySettleBody){
                this.info.applySettleBody=applySettleBody;
            }
            this.$forceUpdate();
        },
        // 初始化数据
        async initFeeApplyData() {
            this.info = await this.common.postUrl('purFeeApplyTF','getPurFeeApplyInfo',{id:this.$route.query.id});
            this.info.userName=this.info.applyUserName;
            this.info.date=this.info.applyDate;
            this.info.urgentLevel = this.info.urgentLevel+'';
            this.info.isWithinBudget = this.info.isWithinBudget+'';
            this.imgDisplay();
            if(this.info.files==null||this.info.files.length==0){
                this.info.files.push({})
            }
            // let feeType = "";
            // this.info.dtls.forEach(item => {
            //     if (this.common.isNotBlank(item.feeType)) {
            //         feeType = item.feeType + "";
            //     }
            // })
            // this.loadParam.feeTypeData = [];
            // this.loadParam.feeTypeData.push(feeType);
            // this.feeTypeDisabled = true;
            this.calTotalFee();
            this.$forceUpdate();
        },

        /**
         * 覆盖 mixin 配置，适配本页面的文件数据结构
         */
        _multiFileConfig() {
            return {
                getFileList: () => this.info.files,
                idField: 'fileId',
                pathField: 'filePath',
                maxCount: 5,
                refPrefix: 'file',
            };
        },
        /**
         * 操作
         */
        async operation(){
            if(!this.info.applySettleBody){
                this.$message.error("请选择申请主体！");
                return;
            }
            this.isShowDialog = true;
            this.$nextTick(async ()=>{
                this.$refs.selStockTable.setRightData(this.common.copyObj(this.info.dtls));
                this.doQuery();
            })
        },
        async doQuery() {
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
            this.loadParam.applySettleBody = this.info.applySettleBody;
            let data = await this.common.postUrl("purFeeBaseService", "queryPurFeeList", this.loadParam);

            let rightData = this.$refs.selStockTable.getRightData();
            if(rightData.length>0){
                this.dataChange(data,this.$refs.selStockTable.getRightData());
            }else{
                this.$refs.selStockTable.setLeftData(data);
            }
        },
        saveChange(){
            let data = this.$refs.selStockTable.getRightData();
            this.info.dtls = data;
            this.isShowDialog = false;
        },
        changeDemandNums(fee){
            fee.referTotalFee = this.common.accMul(fee.demandNums,fee.referPrice);
            this.calTotalFee();
        },
        calTotalFee(){
            this.totalReferTotalFee = 0;
            for (let i = 0; i < this.info.dtls.length; i++) {
                this.totalReferTotalFee = this.common.accAdd(this.totalReferTotalFee,this.info.dtls[i].referTotalFee);
            }
            this.$forceUpdate();
        },
        /**
         * 过滤function
         * @param data 选择的数据
         * @param index
         * @param isSelectAll 是否全选
         */
        filter(data, index, isSelectAll)
        {
            let intersection = [];
            if (isSelectAll)//全选
            {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (this.common.isNotBlank(item.branchBizType))
                    {
                        let split = item.branchBizType.split(",");
                        if(intersection.length==0){
                            intersection = split;
                        }else{
                            intersection = this.intersection(intersection,split);
                            if(intersection.length==0){
                                this.$message.error("包含多种费用审批类型,请重新选择！");
                                return false;
                            }
                        }
                    }
                }
            }
            //添加的和已经选择的归属同一个客户
            this.isFilter = false;
            this.$nextTick(() => {
                this.$refs.selStockTable.toRightTable(data, index, isSelectAll ? 'all' : '');
                this.isFilter = true;//视图渲染完变回继续走过滤
            })
        },
        /**
         * 校验选择的数据的费用类型是否和已选择的费用类型一致
         * @param feeType
         * @returns {boolean}
         */
        check(feeType)
        {
            let selectItems = this.$refs.selStockTable.getRightData();
            let flag = false;
            selectItems.forEach(item => {
                if (!flag){ flag = feeType !== item.feeType; }
            });
            return flag;
        },
        /**
         * 选择数据到右边
         * @param left 左边表格数据
         * @param right 右边选择数据
         * @param isSelectAll 是否选择全部
         */
        dataChange(left, right, isSelectAll)
        {
            let selectItems = this.$refs.selStockTable.getRightData();
            //找到交集
            let intersection = [];
            selectItems.forEach(item => {
                if (this.common.isNotBlank(item.branchBizType))
                {
                    let split = item.branchBizType.split(",");
                    if(intersection.length==0){
                        intersection = split;
                    }else{
                        intersection = this.intersection(intersection,split);
                    }
                }
            })
            if(right==null||right.length==0) {
                this.doQuery();
                return;
            }

            let data = left;
            let newData = [];
            data.forEach(item => {
                if (this.common.isNotBlank(item.branchBizType))
                {
                    let split = item.branchBizType.split(",");

                    if(this.getIncludes(split,intersection)){
                        newData.push(item);
                    }
                }
            })
            this.$refs.selStockTable.setLeftData(newData);
        },
        getIncludes(arr1, arr2) {
            let temp = []
            for (const item of arr2) {
                arr1.includes(item) ? temp.push(item) : ''
            }
            return temp.length ? true : false
        },
        intersection(arr1, arr2) {
            let result = [];
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i] === arr2[j]) {
                        result.push(arr1[i]);
                        break;
                    }
                }
            }
            return result;
        },

        // 保存
        async save() {
            if(this.common.isBlank(this.info.applyRemark)){
                this.$message.error("申请理由不能为空");
                return;
            }
            if(this.common.isBlank(this.info.urgentLevel)){
                this.$message.error("紧急程度不能为空");
                return;
            }
            if(this.common.isBlank(this.info.expectDate)){
                this.$message.error("期望完成日期不能为空");
                return;
            }
            if(this.common.isBlank(this.info.deliveryUser)){
                this.$message.error("收货人不能为空");
                return;
            }
            if(this.common.isBlank(this.info.deliveryPhone)){
                this.$message.error("收货人联系电话不能为空");
                return;
            }
            if(this.common.isBlank(this.info.deliveryAddress)){
                this.$message.error("收货地址不能为空");
                return;
            }

            await this.common.postUrl('purFeeApplyTF', 'savePurFeeApplyInfo', this.info, null, null, null, true);
            this.$message.success("提交成功")
            this.closePage();
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        forceUpdate(){
            this.$forceUpdate();
        }
    },
};