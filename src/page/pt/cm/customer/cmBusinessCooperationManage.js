import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'cmBusinessCooperationManage',
    data() {
        return {
            head: [
                {"name": "公司名称", "code": "companyName", "width": "160", "type": "text"},
                {"name": "登记姓名", "code": "userName", "width": "120", "type": "text"},
                {"name": "登记手机号", "code": "billId", "width": "120", "type": "text"},
                {"name": "登记邮箱", "code": "email", "width": "120", "type": "text"},
                {"name": "登记需求", "code": "demandDesc", "width": "300", "type": "text"},
                {"name": "状态", "code": "stsName", "width": "100", "type": "text"},
                {"name": "登记时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "回访描述", "code": "visitDesc", "width": "300", "type": "text"},
                {"name": "回访人", "code": "visitUserName", "width": "120", "type": "text"},
                {"name": "回访时间", "code": "visitDate", "width": "120", "type": "text"}
            ],
            loadParam: {},
            info: {},
            stsData: [],
            isLock: false,//查看
            title: '查看详情',
            showFlag:false,
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
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery() {
            await this.$refs.table.load("cmBusinessCooperationTF", "queryCmBusinessCooperationInfoPage", this.loadParam);
            let that = this.$refs.table;
            setTimeout(() => {
                that.resetTrHeight();
            }, 1000);
        },
        init() {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "COOPERATION_STATE"}, function (data) {
                that.stsData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 双击查看详情 */
        dblclickItem(data){
            this.toShowCmBusinessCooperationInfo(data);
        },
        async toShowCmBusinessCooperationInfo(data) {
            if(data==undefined||this.common.isBlank(data)){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条商务合作意向信息！");
                    return;
                }
                data = selectData[0];
                this.title = "回访登记";
            }else{//查看详情
                this.isLock = true;
                this.title = "查看详情";
            }
            this.info = this.common.copyObj(data);
            this.showFlag = true;
        },
        dealCmBusinessCooperationInfo() {
            if(this.common.isBlank(this.info.visitDesc)){
                this.$message.error("请输入回访描述！");
                return;
            }
            let that = this;
            that.common.postUrl("cmBusinessCooperationTF", "dealCmBusinessCooperationInfo", that.info, function (data_) {
                if (that.common.isNotBlank(data_)) {
                    that.doQuery();
                    that.showFlag = false;
                    that.$message.success("登记成功");
                }
            },null,'',true);
        },

    },
}
