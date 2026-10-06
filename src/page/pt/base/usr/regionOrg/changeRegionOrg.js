import dbTable from "@/components/dbTable/dbTable.vue"

export default {
    name: 'changeRegionOrg',
    data()
    {
        return {
            head: [
                {"name": "客户名称", "code": "name", "width": "110", "type": "text"},
            ],
            orgInfo: {
                id: Number(this.$route.query.id),
                regionId: Number(this.$route.query.regionId),
                parentOrgId: this.$route.query.parentOrgId?Number(this.$route.query.parentOrgId):null,
                orgName: this.$route.query.orgName,
                projectTeam: this.$route.query.projectTeam?Number(this.$route.query.projectTeam):0,
                weComPushUrl: this.$route.query.weComPushUrl,
            },
            regionData: [],//所有区域数据
            orgData: [],//所有部门数据
            unassociated:'',
            associated:'',
            onlyBind:this.$route.query.onlyBind ? true : false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.queryRegionData();
        this.changeRegionSelect();
        this.queryCustomerList();
    },
    /**
     * 组件
     */
    components: {
        dbTable,
    },
    /**
     * 绑定函数
     */
    methods: {
        /** 查询区域列表 */
        queryRegionData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryRegionSelect", {}, function (data) {
                that.regionData = data;
            });
        },
        /** 选中区域 */
        changeRegionSelect() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryOrgData", {regionId: this.orgInfo.regionId}, function (data) {
                that.orgData = data;
            });
        },
        /** 查询客户信息 */
        async queryCustomerList() {
            this.allCustomer = await this.common.postUrl("customerTF", "queryCustomerListNoPage",{sts:1});
            this.selectCustomer = await this.common.postUrl("customerTF", "queryCustomerListNoPage",{sts:1,orgId: this.$route.query.orgId});
            let allCustomer = this.common.copyObj(this.allCustomer);
            let selectCustomer = this.common.copyObj(this.selectCustomer);
            let data = allCustomer.slice(0, 50);
            this.$refs.table.setRightData(selectCustomer);
            this.$refs.table.setLeftData(data);
        },
        // 查询客户
        queryCustomer(type){
            clearTimeout(this.timer);
            // 加个延迟
            this.timer = setTimeout(() => {
                if(type == 2){      //左表格
                    let allCustomerFilter = this.allCustomer.filter(item => item.name.includes(this.unassociated));
                    let data = this.common.copyObj(allCustomerFilter);
                    this.$refs.table.setLeftData(data);
                }else if(type == 1){        //右表格
                    let selectCustomerFilter = this.selectCustomer.filter(item => item.name.includes(this.associated));
                    let data = this.common.copyObj(selectCustomerFilter);
                    this.$refs.table.setRightData(data);
                }
                clearTimeout(this.timer);
            }, 500);
        },
        changeSwitch() {
            this.orgInfo.projectTeam = this.orgInfo.projectTeam == 1 ? 0 : 1;
            this.$forceUpdate();
        },
        /**
         * 处理表格数据变化事件
         * @param {Array} leftData - 左侧表格数据
         * @param {Array} rightData - 右侧表格数据
         * @param {Boolean} isSelectAll - 是否全选
         * @param {Number} type - 表格类型，1表示左表格变化，2表示右表格变化
         * @param {Object} data - 变化的数据项
         */
        dataChange(leftData,rightData, isSelectAll,type,data){
            if(type == 1){  //左表格变化
                // 清空未关联搜索条件
                this.unassociated = "";
                // 将数据添加到所有客户列表开头
                this.allCustomer = this.allCustomer.filter(item => item.custId != data.custId);
                this.allCustomer.unshift(data);
                let allCustomer = this.common.copyObj(this.allCustomer);
                let arr = allCustomer.slice(0, 50);
                this.$refs.table.setLeftData(arr);
                // 从已选择客户列表中移除该数据
                this.selectCustomer = this.selectCustomer.filter(item => item.custId != data.custId);
            }else if(type == 2){
                // 清空已关联搜索条件
                this.associated = "";
                // 将数据添加到已选择客户列表开头
                this.selectCustomer.unshift(data);
                let selectCustomer = this.common.copyObj(this.selectCustomer);
                this.$refs.table.setRightData(selectCustomer);
                // 从所有客户列表中移除该数据
                this.allCustomer = this.allCustomer.filter(item => item.custId != data.custId);
            }
        },
        // 滚动加载回调
        scrollBack() {
            let data = this.allCustomer.slice(0, this.$refs.table.getLeftData().length + 50);
            this.$refs.table.setLeftData(data,false);
        },
        async submit(){

            if (this.common.isBlank(this.orgInfo.orgName)) {
                this.$message.error("请输入部门名称！");
                return;
            }
            let custIds = this.selectCustomer.map(item => item.custId);
            if(custIds.length > 0) this.orgInfo.custIds = custIds;
            let method  = this.onlyBind ? "addOrgInfo" : "addOrgInfo";
            let data = await this.common.postUrl("regionOrgTF", method, this.orgInfo);
            try{
                if (!this.orgInfo.id)
                {
                    const newChild = {
                        id: data.orgId,
                        regionId: data.regionId,
                        parentOrgId: data.parentOrgId,
                        label: data.orgName,
                        orgName: data.orgName,
                        regionName: data.regionName,
                        type: '2',
                        children: []
                    };
                    //添加部门到页面
                    this.$parent.appendOrg(newChild, data)
                }
            }catch(e){console.log(e)}
            this.$message.success("保存成功！");
            this.close();
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
        },
    },
}
