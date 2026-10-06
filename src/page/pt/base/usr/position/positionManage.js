import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'positionManage',
    data()
    {
        return {
            head: [
                {"name": "岗位人员名称", "code": "", "width": "80", "type": "diy"},
                {"name": "岗位名称", "code": "positionName", "type": "text"},
                {"name": "备注", "code": "remark", "width": "300", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(),
            dialogShow: false,
            title: '新增岗位',
            info: this.initInfo(),
            staffData: [],//人员列表
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        searchList,
        tableCommon
    },
    methods: {
        initQuery()
        {
            return this.query =
                    {
                        staffName: "",
                        positionName: "",
                        remark: ""
                    };
        },
        initInfo()
        {
            return this.info = {
                id: '',
                positionName: '',
                remark: '',
                staffIds: [],
            }
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            let {items} = await this.$refs.table.load("positionService", "queryPositionPage", this.query);
            this.tableData = items;
        },
        initData()
        {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {}, function (data)
            {
                that.staffData = data;
            });
        },
        showInfo(item, index)
        {
            this.tableData = this.$refs.table.getData();
            if (this.common.isNotBlank(item.positionStaffNames))
            {
                this.tableData[index].showInfo = true;
                let info = {
                    isDiyTr: true,
                    positionStaffNames: item.positionStaffNames.split(","),
                }
                this.tableData.splice(index + 1, 0, info);
                this.$refs.table.resetData(this.tableData);
                this.$forceUpdate();
            }
            else
            {
                this.tableData[index].showInfo = false;
                this.$message.warning("该岗位没有人员！");
            }
        },
        hideInfo(item, index)
        {
            this.tableData = this.$refs.table.getData();
            this.tableData[index].showInfo = false;
            this.tableData.splice(index + 1, 1);
            this.$refs.table.resetData(this.tableData);
        },
        openDialog(flag)
        {
            this.dialogShow = flag;
            this.$forceUpdate();
        },
        addPosition(type)
        {
            this.initInfo();
            this.title = '新增岗位';
            this.openDialog(true);
        },
        updatePosition()
        {
            this.initInfo();
            this.title = '修改岗位';
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条岗位数据！");
                return;
            }
            this.info = this.common.copyObj(selectData[0]);
            this.openDialog(true);
        },
        async saveOrUpdatePosition()
        {
            if (this.common.isBlank(this.info.positionName))
            {
                this.$message.error("请输入岗位名称!");
                return;
            }
            let that = this;
            if (that.info.staffIds.length != 0)
            {
                let array = that.info.staffIds.map(Number);
            }
            let param = this.common.copyObj(this.info);
            await this.common.postUrl("positionService", "saveOrUpdatePosition", param, null, null, '', true);
            await this.openDialog(false);
            await this.doQuery();
            this.$message.success(this.title + "成功！");
        },
        async deletePosition()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条数据！");
                return;
            }
            //查询当前删除岗位绑定的人员提醒
            let bindStaffName = "";
            let param = this.common.copyObj(selectData[0]);
            let data = await this.common.postUrl("positionService", "loadPositionStaff", {id: param.id}, null, null, '', true);
            data.forEach(item =>
            {
                bindStaffName += "," + item.staffName;
            });
            let msg = '';
            if (bindStaffName.length > 0)
            {
                bindStaffName = bindStaffName.substring(1);
                msg += `<p style="text-align:center;">岗位名称：<span style="color:red;">${param.positionName}</span>包含如下人员：</p>`;
                let arr = bindStaffName.split(",");
                for (let i = 0; i < arr.length; i++)
                {
                    let name = arr[i];
                    msg += `<p style="text-align:center;">${i + 1}：${name}</p>`;
                }
                msg += `<p style="text-align:center;color:red;">执行删除岗位会把以上人员从该岗位移除!</p>`;
                msg += `<p style="text-align:center;margin-top:10px;color:red;">是否继续删除？</p>`;
            }
            else
            {
                msg += `<p style="text-align:center;">岗位名称：<span style="color:red;">${param.positionName}</span>没有包含任何人员</p>`;
                msg += `<p style="text-align:center;margin-top:10px;color:red;">是否继续删除？</p>`;
            }
            let that = this;
            this.$confirm(msg, "删除提示", {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                center: true
            }).then(async () => {
                await that.common.postUrl("positionService", "deletePosition", param, null, null, '', true);
                await that.doQuery();
                that.$message.success('岗位删除成功');
            }).catch(() => {});
        },

    },
    computed:{
        formData(){
            return [
                {"name":"岗位名称","model":"positionName","type":"input","placeholder":"岗位名称","isshow":true},
                {"name":"岗位人员名称","model":"staffName","type":"input","placeholder":"岗位人员名称","isshow":true},
                {"name":"备注","model":"remark","type":"input","placeholder":"备注","isshow":true},
            ]
        }
    },
}
