import tableCommon from "@/components/table/tableCommon.vue";

export default {
    name: 'hzStaffManage',
    data()
    {
        return {
            head: [
                {"name": "登录账号", "code": "billId", "type": "text"},
                {"name": "使用人", "code": "userName", "width": "100", "type": "text"},
                {"name": "所属角色", "code": "roleNames", "width": "100", "type": "text"},
                {"name": "创建人", "code": "createUser", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"}
            ],
            query:{keyword: ""},
            staffDialogShow:false,//弹出框是否展示
            dialogTitle:'新增人员',
            form:{
                billId:'',
                userName:'',
                roleIds:[],
            },
            roleData:[],//角色列表
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 清空查询条件
         */
        clear()
        {
            this.query = {keyword: ""};
        },
        /**
         * 加载人员列表
         */
        doQuery()
        {
            this.$refs.table.load("staffTF", "queryStaffs", this.query);
        },
        /**
         * 初始化数据
         */
        initData(){
            let that = this;
            //加载角色数据
            this.common.postUrl("roleTF", "loadRoleInfoListNoPage", {}, function (data) {
                that.roleData = data;
            });
        },
        checkBillId(){
            let that = this;
            this.common.postUrl("staffTF", "getUserName", {billId:that.form.billId}, function (data) {
                that.form.userName = data.userName;
            });
        },
        /**
         * 显示人员新增修改框
         * @param type
         */
        showStaffDialog(type){
            let that = this;
            this.form={
                billId:'',
                userName:'',
                roleIds:[],
            };
            if(type==2){
                this.dialogTitle = '修改人员';
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1) {
                    this.$message.error("请选择一条数据！");
                    return;
                }
                this.common.postUrl("staffTF", "getStaff", {staffId:selectData[0].staffId}, function (data) {
                    that.form=data;
                    //角色多选要转换成数组
                    that.form.roleIds=that.form.roleIds.split(',');
                    that.form.roleIds=that.form.roleIds.map(Number);
                });
            }
            this.staffDialogShow = true;
        },
        /**
         * 关闭弹出框
         */
        close(){
            this.staffDialogShow = false;
            this.orgData = JSON.parse(JSON.stringify(this.orgData));
            this.selData = [];
            if(this.$refs.elTree){
                this.$refs.elTree.setCheckedKeys([]);
            }
        },
        /**
         * 新增修改员工
         */
        addStaff()
        {
            let that = this;
            let method = "addStaff";
            if(this.form.staffId){
                method = "updateStaff";
            }
            if(!this.form.billId){
                this.$message.error("请输入登录账号!");
                return;
            }
            if(!this.form.userName){
                this.$message.error("请输入使用人!");
                return;
            }
            let param = JSON.parse(JSON.stringify(this.form));
            param.roleIds = param.roleIds.join(",");
            this.common.postUrl("staffTF", method, param, function (data) {
                if(data){
                    that.staffDialogShow = false;
                    that.doQuery();
                    that.$message.success(that.dialogTitle + "成功！");
                }
            },null,'',true);
        },
        /**
         * 删除人员
         */
        deleteStaff() {
            let that = this;
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length < 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let staffIds = '';
            for (let i = 0; i < selectData.length; i++) {
                staffIds+=','+selectData[i].staffId;
            }
            staffIds = staffIds.substr(1);
            this.common.postUrl("staffTF", "delStaff", {staffIds:staffIds}, function (data) {
                if(data){
                    that.doQuery();
                    that.$message.success("删除人员成功！");
                }
            },null,'',true);
        },
    },
}
