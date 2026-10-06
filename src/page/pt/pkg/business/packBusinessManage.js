import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import myImport from "@/components/myImport/myImport";

export default {
    name: 'packBusinessManage',
    data() {
        return {
            head: [
                {"name": "客户名称", "code": "custTenantName", "width": "250", "type": "text"},
                {"name": "业务模式", "code": "logisticsModeName", "width": "110", "type": "text"},
                {"name": "包装名称", "code": "pkgName", "width": "200", "type": "text"},
                {"name": "包装类型", "code": "packingTypeName", "width": "110", "type": "text"},
                {"name": "长宽高", "code": "lengthStr", "width": "110", "type": "text"},
                {"name": "总数量", "code": "totalNums", "width": "110", "type": "text"},
                {"name": "内部在库", "code": "innerNums", "width": "110", "type": "text"},
                {"name": "客户在库", "code": "outterNums", "width": "110", "type": "text"},
                {"name": "未回收", "code": "reoveryNums", "width": "110", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            loadParam: {custTenantId : this.common.isBlank(this.$route.query.tenantId) ? '' : Number(this.$route.query.tenantId)},//客户详情租赁管理跳转
            pkgPackInfo: {tenantId : this.$route.query.tenantId},//包装回收信息
            packInfoDataSel: [],//所有货物包装名称 查询
            packInfoData: [],//所有货物包装名称
            packingTypeData: [],//所有货物包装类型
            tenantData: [],//归属客户
            tenantWorkData: [],//归属客户作业点
            showModify: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel,
        myImport,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {
            if(!this.common.isBlank(this.$route.query.pkgId)){
                this.loadParam.pkgId = this.$route.query.pkgId;
            }
            this.$refs.table.load("pkgBusinessTF", "queryPkgBusinessPage", this.loadParam);
        },
        init() {
            let that = this;
            //包装类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"GOODS_PACKING_TYPE"}, function (data) {
                that.packingTypeData = data;
            });
            //归属客户
            this.common.postUrl("pkgBusinessTF", "queryPkgCustomerList", {}, function (data) {
                that.tenantData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 选中客户 查询*/
        changeCustSel(data) {
            if(this.common.isBlank(data)){
                this.packInfoDataSel = [];
                return;
            }
            let that = this;
            //查询客户归属包装名称
            this.common.postUrl("pkgBusinessTF", "queryAllPkgNameNoPage", {tenantId:data}, function (data) {
                that.packInfoDataSel = data;
            });
        },
        /** 选中客户 */
        changeCust(data) {
            if(this.common.isBlank(data)){
                this.packInfoData = [];
                return;
            }
            let that = this;
            //查询客户归属作业点
            this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId:data}, function (data) {
                that.tenantWorkData = data;
            });
            //查询客户归属包装名称
            this.common.postUrl("pkgBusinessTF", "queryAllPkgNameNoPage", {tenantId:data}, function (data) {
                that.packInfoData = data;
            });
        },
        /** 打开关闭 手工回收弹窗 */
        showReovery(flag) {
            if (flag) {
                this.showModify = true;
            } else {
                this.pkgPackInfo = {};
                this.showModify = false;
            }
        },
        /** 确定回收 */
        saveReovery() {
            if(this.common.isBlank(this.pkgPackInfo.custTenantId)){
                this.$message.error("请选择客户名称！");
                return;
            }
            if(this.common.isBlank(this.pkgPackInfo.pkgId)){
                this.$message.error("请选择包装名称！");
                return;
            }
            if(this.common.isBlank(this.pkgPackInfo.workId)){
                this.$message.error("请选择交付地！");
                return;
            }
            if(this.common.isBlank(this.pkgPackInfo.reoveryNums)){
                this.$message.error("请输入回收数量！");
                return;
            }
            if(this.common.isBlank(this.pkgPackInfo.chargeDate)){
                this.$message.error("请选择开始计费时间！");
                return;
            }
            this.pkgPackInfo.isSaveUpload = "1";//服务端是否保存上传文件
            this.$refs.myImport.submitFileForm();
        },
        myImportSuccessCallback(){
            this.doQuery();
            this.showReovery(false);
            this.$message.success("回收成功！");
        },
        /** 查看明细 */
        toDetail()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条数据");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'packObjectManage' + array[0].pkgId + '_' + array[0].custTenantId,
                query: {pkgId:array[0].pkgId,custTenantId:array[0].custTenantId,unShowCheck: 1,},
                urlName: "查看明细",
                urlPathName: "/business",
                urlPath: "/pt/pkg/business/packObjectManage.vue"});
        },
        /** 地图查看 */
        toPackMonitor()
        {
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1)
            {
                this.$message.error("请选择一条数据!");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'packMonitor' + array[0].pkgId + '_' + array[0].custTenantId,
                query: {custTenantId:array[0].custTenantId,packId:array[0].pkgId},
                urlName: "地图查看",
                urlPathName: "/business",
                urlPath: "/pt/pkg/business/packMonitor.vue"});
        },
    },
}
