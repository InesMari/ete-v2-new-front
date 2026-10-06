import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'addShareholder',
    data() {
        return {
            info:{
                tenantName:'',
                abbreviationName:'',
                linkman:'',
                linkPhone:'',
                shareholderType:"1",
                address:'',
                orgIds:[],
            },
            shareholderTypeData:[],//股东类型
            orgData:[],//所有部门数据
            isLock: false,
            isUpdate: false,
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
        myFileModel,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery() {

        },
        init() {
            //加载静态枚举
            let that = this;
            //发票资质类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"SHAREHOLDER_TYPE"}, function (data) {
                that.shareholderTypeData = data;
            });
            //加载区域数据
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.orgData = data;
            });
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                let tenantId = this.$route.query.tenantId;
                this.common.postUrl("shShareholderTF", 'getShareholderDetailInfo', {tenantId}, function (data) {
                    if(data){
                        that.info = data;
                        that.info.orgIds = data.orgIds.split(',').map(Number);
                        that.info.shareholderType = that.info.shareholderType+'';
                    }
                });
                this.isUpdate = true;
            }
            if(this.common.isNotBlank(this.$route.query.isLock)){
                this.isLock = true;
            }
        },
        checkBillId(){
            let that = this;
            this.common.postUrl("userTF", "getUserName", {billId:that.info.linkPhone}, function (data) {
                if(data.userName){
                    that.$message.warning("登录账号："+that.info.linkPhone+"对应的用户已经存在，名称为："+data.userName+"，请确认是否添加他为管理员");
                }
            });
        },
        /**
         * 关闭新增股东
         */
        closeAddShareholder(){
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /**
         * 保存客户信息
         */
        addShareholder(){
            if(!this.info.tenantName){
                this.$message.error("股东名称不能为空");
                return;
            }
            if(this.info.tenantName.length<2){
                this.$message.error("股东名称长度不对");
                return;
            }
            if(this.common.checkNum(this.info.tenantName)){
                this.$message.error("股东名称不能全部为数字");
                return;
            }
            if(!this.info.abbreviationName){
                this.$message.error("股东简称不能为空");
                return;
            }
            if(!this.info.address){
                this.$message.error("地址不能为空");
                return;
            }
            if(this.info.address.length<2){
                this.$message.error("地址不能为空");
                return;
            }
            if(this.common.checkNum(this.info.address)){
                this.$message.error("地址不能全部为数字");
                return;
            }
            if(!this.info.linkman){
                this.$message.error("股东管理员不能为空");
                return;
            }
            if(this.info.linkman.length<2){
                this.$message.error("股东管理员长度不对");
                return;
            }
            if(this.common.checkNum(this.info.linkman)){
                this.$message.error("股东管理员不能全部为数字");
                return;
            }
            if(!this.info.linkPhone){
                this.$message.error("股东管理员账号不能为空");
                return;
            }
            if(!this.info.orgIds){
                this.$message.error("所属中心不能为空");
                return;
            }
            let that = this;
            let method = 'saveShareholderInfo';
            let dialogTitle = '新增股东';
            if(this.common.isNotBlank(this.$route.query.tenantId)){
                dialogTitle = '修改股东';
            }
            this.common.postUrl("shShareholderTF", method, this.info, function (data) {
                if(data){
                    that.$message.success(dialogTitle + "成功！");
                    that.closeAddShareholder();
                }
            },null,'',true);
        },
    },
}
