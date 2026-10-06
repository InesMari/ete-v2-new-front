import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'purchaseOrderDtlManage',
    data() {
        return {
            head: [
                {"name": "采购单单号", "code": "purchaseNum", "width": "120", "type": "diy"},
                {"name": "收货状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
                {"name": "费用申请单号", "code": "applyNums", "width": "350", "type": "diy"},
                {"name": "入库单号", "code": "deliveryNums", "width": "250", "type": "diy"},
                {"name": "费用申请部门", "code": "applyOrgName", "width": "120", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "采购方名称", "code": "settleBodyName", "width": "200", "type": "text"},
                {"name": "费用类型", "code": "feeSubTypeName", "width": "250", "type": "text"},
                {"name": "品名/项目", "code": "projectNames", "width": "200", "type": "text"},
                {"name": "需求数量", "code": "itemDemandNums", "width": "120", "type": "text"},
                {"name": "采购数量", "code": "itemPurchaseNums", "width": "120", "type": "text"},
                {"name": "含税单价（元）", "code": "actualPrice", "width": "100", "type": "text"},
                {"name": "含税金额（元）", "code": "totalFee", "width": "100", "type": "text"},
            ],
            loadParam: {
                purchaseNum:'',
                tenantName:'',
                settleBody:'',
                applyNum:'',
                feeType:'',
                feeSubType:'',
                projectName:'',
                state:'',
                verifyState:'',
                applyOrgIds:[],
                orgId:'',
                purchaseUserName:'',
                createDate:'',
            },

            settleBodyData:[],
            stateData:[],
            verifyStateData:[],
            feeTypeData:[],
            feeSubTypeData:[],
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
            await this.$refs.table.load("purPurchaseService", "queryPurPurchaseDtlPage", this.loadParam);
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
        toDetail(item){
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
                {"name":"费用申请部门","model":"applyOrgIds","type":"select","options":this.orgData,"label":"orgName","value":"id",multiple:true,"placeholder":"费用申请部门","method":"doQuery","isshow":true},
                {"name":"采购部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"采购部门","method":"doQuery","isshow":true},
                {"name":"采购人","model":"purchaseUserName","type":"input","placeholder":"采购人","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
            ]
        }
    },
}
