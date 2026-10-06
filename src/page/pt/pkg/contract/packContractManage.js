import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";

export default {
    name: 'packContractManage',
    data() {
        return {
            head: [
                {"name": "客户名称", "code": "custTenantName", "width": "160", "type": "text"},
                {"name": "包装名称", "code": "packName", "width": "200", "type": "text"},
                {"name": "合同有效期/月", "code": "validityPeriod", "width": "90", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "90", "type": "text"},
                {"name": "在用包装数", "code": "packNums", "width": "90", "type": "text"},
                {"name": "累计产生收入", "code": "totalFee", "width": "100", "type": "text"},
                {"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "120", "type": "text"}
            ],
            headDetail:[
                {"name": "包装名称", "code": "packId", "width": "150", "type": "diy"},
                {"name": "免租期（天）", "code": "freePeriod", "width": "100", "type": "diy"},
                {"name": "回收单价", "code": "recyclePrice", "width": "100", "type": "diy"},
                {"name": "超期费用/租赁费用", "code": "price", "width": "100", "type": "diy"},
                {"name": "费用上限", "code": "maxFee", "width": "100", "type": "diy"},
                {"name": "操作", "code": "operate", "width": "100", "type": "diy"},
            ],
            loadParam: {
                custName: this.$route.query.tenantName,//客户详情包装合同跳转
            },
            title:'新增包装合同',
            bottonTitle:'确认新增',
            dialogShow:false,
            info:{},
            custTenantData:[],
            packData:[],
            details:[{
                packId:'',
                freePeriod:0,
                recyclePrice:0,
                price:0,
                maxFee:0
            }],
            type:1,
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
        tableCommon,
        scrollTable
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            this.$refs.table.load("pkgContractTF", "queryPkgContractPage", this.loadParam);
        },
        init() {
            this.initCustTenantData();
            this.initPackData();
        },
        initCustTenantData(){
            let that = this;
            this.common.postUrl("pkgContractTF", "getPackCust", {}, function (data) {
                that.custTenantData = data;
            });
        },
        initPackData(){
            let that = this;
            this.common.postUrl("pkgContractTF", "getPackInfo", {}, function (data) {
                that.packData = data;
            });
        },
        delContract(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条包装合同数据！");
                return false;
            }
            if(selectData[0].packNums>0){
                this.$message.error("该合同下面还有包装在使用，不能删除！");
                return false;
            }
            let that = this;
            that.$confirm("确认需要删除包装合同数据？", "提示").then(() =>{
                this.common.postUrl("pkgContractTF", "delContract", selectData[0], function (data) {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        clear() {
            this.loadParam = {};
        },
        //1 新增  2 修改
        showDialog(type){
            this.type = type;
            if(type==1){
                this.dialogShow=true;
                this.title='新增包装合同';
                this.bottonTitle='确认新增';
                this.details = [{
                    packData:this.packData,
                    packId:'',
                    freePeriod:0,
                    recyclePrice:0,
                    price:0,
                    maxFee:0
                }]
                this.$nextTick(()=>{
                    this.$refs.scrollTable.setData(this.details);    //设置表格数据
                    this.$refs.scrollTable.calcFootSum();   //表格合计
                    this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
                })
            }else{
                this.title='修改包装合同';
                this.bottonTitle='确认修改';

                //查询合同详情
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条包装合同数据！");
                    return false;
                }

                this.dialogShow=true;
                this.info = this.common.copyObj(selectData[0]);
                this.info.taxRate = this.info.taxRate.replaceAll('%','');
                this.$nextTick(async ()=>{
                    await this.$refs.scrollTable.load("pkgContractTF", "queryPkgContractDtlPage", {contractId:this.info.contractId});
                    this.changePack();
                })
            }
        },

        saveContract(){
            let method = 'addContract';
            let msg = '新增成功!';
            if(this.type==2){
                method = 'modifyContract';
                msg = '修改成功!'
            }
            if (!this.info.custTenantId){
                this.$message.error("请选择客户！");
                return false;
            }
            if (!this.info.validityPeriod){
                this.$message.error("请输入合同有效期！");
                return false;
            }
            if (!this.info.taxRate){
                this.$message.error("请输入税点！");
                return false;
            }
            this.info.details = this.$refs.scrollTable.getData();
            for (let i = 0; i < this.details.length; i++) {
                for (let j = 0; j < this.details.length; j++) {
                    if(i!=j&&this.details[i].packId==this.details[j].packId){
                        this.$message.error("不能选择相同的包装！");
                        return false;
                    }
                }
            }
            let that = this;
            this.info.custTenantName = this.custTenantData.find(item=>item.custTenantId===that.info.custTenantId).custTenantName;
            this.common.postUrl("pkgContractTF", method, this.info, function (data) {
                that.doQuery();
                that.$message.success(msg);
                that.closeDialog();
            },null,'',true);
        },
        //变更
        changePack(){
            this.details = this.$refs.scrollTable.getData();
            for (let i = 0; i < this.details.length; i++) {
                let packData = this.common.copyObj(this.packData);
                for (let j = 0; j < this.details.length; j++) {
                    if(i!=j){
                        for (let k = 0; k < packData.length; k++) {
                            if(packData[k].id===this.details[j].packId){
                                packData.splice(k, 1);
                            }
                        }
                    }
                }
                this.details[i].packData = packData;
            }
            this.$refs.scrollTable.setData(this.details);    //设置表格数据
            this.$forceUpdate();
        },

        /**
         * 增加合同包装
         */
        addItem(index)
        {
            let data = {
                freePeriod:0,
                recyclePrice:0,
                price:0,
                maxFee:0
            };
            this.details = this.$refs.scrollTable.getData();
            this.details.splice(index+1,0,data);
            this.$refs.scrollTable.setData(this.details);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            this.changePack();
        },
        /**
         * 移除合同包装
         * @param index
         */
        removeItem(index)
        {
            this.details = this.$refs.scrollTable.getData();
            this.details.splice(index, 1);
            this.$refs.scrollTable.setData(this.details);    //设置表格数据
            this.$refs.scrollTable.calcFootSum();   //表格合计
            this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
            this.changePack();
        },

        closeDialog(){
            this.dialogShow=false;
        }
    },
}
