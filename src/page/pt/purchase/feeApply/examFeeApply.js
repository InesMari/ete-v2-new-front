import myFileModel from '@/components/myFileModel/myFileModel.vue';
import dbTable from "@/components/dbTable/dbTable.vue";

export default {
    name: "examFeeApply",
    components: {
        myFileModel,
        dbTable,
    },
    data() {
        return {
            info: {
                dtls:[],
                files:[{}],
                userList:[],
            },
            totalReferTotalFee:0,
            viewType:this.$route.query.viewType,//1查看 2 审核
        };
    },
    mounted() {

        this.init();
    },
    methods: {
        async init() {
            let that = this;
            this.info = await this.common.postUrl('purFeeApplyTF', 'getPurFeeApplyInfo', {id: this.$route.query.id});
            if (this.common.isBlank(this.info.files) || this.info.files.length === 0)
            {
                this.info.files.push({});
            }
            this.$nextTick(() => {
                this.info.files.forEach((item, index) => {
                    if (this.common.isNotBlank(item.fileId)){
                        that.$refs['file' + index][0].initDate(item.fileId);
                    }
                });
            });
            this.calTotalFee();
            this.common.tableStretch(this.$refs.table)
            this.$forceUpdate();
        },
        calTotalFee(){
            this.totalReferTotalFee = 0;
            for (let i = 0; i < this.info.dtls.length; i++) {
                this.totalReferTotalFee = this.common.accAdd(this.totalReferTotalFee,this.info.dtls[i].referTotalFee);
            }
            this.$forceUpdate();
        },
        // 保存
        async save(type) {
            let param = {id:this.info.id,type};
            this.$prompt('请输入审核意见', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                if (this.common.isBlank(value)&&type==2)
                {
                    this.$message.error("请输入审核意见！");
                    return false;
                }
                param.verifyRemark = value;
                await this.common.postUrl('purFeeApplyTF', 'verifyInfo', param, null, null, null, true);
                this.$message.success("提交成功")
                this.closePage();
            }).catch(() => {});
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
        },
        toPurOrder(item){
            if(this.info.isDevPur){
                this.$emit("openTab", {
                    urlId: 'viewDevicePurchase'+item.id,
                    urlName: '查看器具采购单',
                    urlPathName: '',
                    query:{type:3,id:item.id},
                    urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'})
            }else {
                this.$emit("openTab", {
                    query: {id: item.id, type: 0},
                    urlId: 'detailPurOrder' + item.id + 0,
                    urlName: '采购单详情',
                    urlPathName: '/purFeeDetail',
                    urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
                });
            }
        },
    },
};