import dbTable from "@/components/dbTable/dbTable.vue";
import vuedraggable from "vuedraggable";

export default {
    name: 'fcActualSalesDetail',
    data() {
        return {
            info:{    //全部信息的对象容器
                baseInfo:{
                    name:'',
                    year:'',
                    remark:'',
                },
                dtlList:[{custSource:'2',itemModifyFlag:true}],
                totalInfo:{},
            },
            id:this.$route.query.id,
            type:this.$route.query.type, //1 新增  2 修改 3 查看
            tmpYear:'',
            viewYear:'',
            regionData: [],//所有区域数据
            custSourceData:[],
            customerData:[],
            businessTypeData:[],

            baseInfoModifyFlag:true,
            modifyFlag:true,
            saveBthFlag:true,
            addBtnFlag:true,

            feeIdx:0,

            map:{},

        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.initInfo();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
        vuedraggable
    },
    /**
     * 绑定函数
     */
    methods: {
        initInfo(){
            if(this.type==1){
                this.info.baseInfo.year = new Date();
                this.initName(this.common.formatDate.year());
            }else{
                let that = this;
                this.common.postUrl("fcActualSalesTF", 'getFcActualSalesInfo', {id:this.id}, function (data) {
                    that.info = data;
                    that.map=new Map();
                    that.tmpYear = that.info.baseInfo.year;
                    that.viewYear = that.tmpYear+"年";
                    that.info.baseInfo.year = new Date(that.info.baseInfo.year+'/01'+'/01');
                    that.info.dtlList.forEach(item=>{
                        that.changeRegionSelect(item);
                        item.custSource = item.custSource+'';
                        item.businessType = item.businessType+'';
                        item.itemModifyFlag=false;
                    });
                    that.feeIdx = (new Date()).getMonth()-1;
                });
            }
            if(this.type==3){
                this.baseInfoModifyFlag=false;
                this.modifyFlag=false;
                this.saveBthFlag = false;
                this.addBtnFlag = false;
            }
        },
        initName(year){
            this.info.baseInfo.name = '年度实际营收表-'+year;
            this.tmpYear = year;
        },
        async initData() {
            this.queryRegionData();
            let that = this;

            //加载静态枚举
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CUST_SOURCE"}, function (data) {
                that.custSourceData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BUSINESS_TYPE"}, function (data) {
                that.businessTypeData = data;
            });
            // 客户
            this.common.postUrl("customerTF", "loadCustomerList", {}, function (data) {
                that.customerData = data;
            });
            this.map = await this.common.postUrl("regionOrgTF", "queryAllOrgData", {});
        },
        /** 查询区域列表 */
        queryRegionData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryRegionSelect", {}, function (data) {
                that.regionData = data;
            });
        },
        changeRegionSelect(item) {
            let that =this;
            if(this.common.isBlank(item.regionId)){
                item.orgData=[];
                item.orgId = '';
                return;
            }
            if(this.map[item.regionId]){
                item.orgData = this.map[item.regionId];
                that.$forceUpdate();
                return;
            }
        },
        // 选择客户
        async changeCustomer(value){
            this.customerData.forEach(item => {
                if(item.tenantId == value.custTenantId){
                    value.custName = item.name;
                }
            });
        },
        // 增加费用
        addItem(){
            this.info.dtlList.push({custSource:'2',itemModifyFlag:true})
        },
        /**
         * 删除费用列表
         * index 删除行的下标
         */
        delItem(index){
            this.info.dtlList.splice(index,1);
        },
        calFee(item){
            let totalFee = 0;
            for (let i = 1; i <= 12; i++) {
                totalFee = this.common.accAdd(totalFee,item['fee'+i]);
            }
            item.totalFee = totalFee;
            this.$forceUpdate();
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
        //  提交
        async submit(){
            let info = this.common.copyObj(this.info);
            info.baseInfo.year = this.tmpYear;
            let method = 'addFcActualSalesInfo';
            if(this.type==2){
                method = 'updateFcActualSalesInfo';
            }
            await this.common.postUrl('fcActualSalesTF',method,info,null,null,null,true);
            this.$message.success("提交成功")
            this.closePage();
        },
    },
}
