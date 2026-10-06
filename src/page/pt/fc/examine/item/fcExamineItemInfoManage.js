import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'fcExamineItemInfoManage',
    data()
    {
        return {
            head: [
                {"name": "考核指标名称", "code": "itemName", "width": "200", "type": "text"},
                {"name": "数据来源", "code": "srcOrgName", "width": "120", "type": "text"},
                {"name": "一级部门", "code": "firstOrgName", "width": "120", "type": "text"},
                {"name": "二级部门", "code": "secondOrgName", "width": "120", "type": "text"},
                {"name": "月度目标", "code": "monthTarget", "width": "100", "type": "text"},
                {"name": "年度目标", "code": "yearTarget", "width": "100", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            regionData: [],//所有区域数据
            orgData: [],//所有部门数据
            loadParam: {
                itemName:'',
                firstOrgId:'',
                secondOrgId:'',
                remark:'',
            },
            title: '新增',
            showDialog: false,
            isLock: false,
            srcOrgData:[],
            secondOrgData:[],
            item:this.initItem(),
        }
    },
    async mounted()
    {
        this.doQuery();
        this.queryRegionData();
        this.queryAllOrg();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        async doQuery(query=this.loadParam)
        {
            this.loadParam = query;
            await this.$refs.table.load("fcExamineTF", "queryFcExamineItemInfoPage", this.loadParam);
        },
        initItem(){
            return this.item = {
                id: '',
                itemName: '',
                srcOrgId: '',
                firstOrgId: '',
                secondOrgId: '',
                monthTarget:'',
                yearTarget:'',
                remark: '',
            };
        },
        /** 查询区域列表 */
        queryRegionData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryRegionSelect", {}, function (data) {
                that.regionData = data;
            });
        },
        /** 选中区域 */
        changeRegionSelect(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isBlank(this.loadParam.firstOrgId)){
                this.orgData=[];
                return;
            }
            let that = this;
            this.common.postUrl("regionOrgTF", "queryOrgData", {regionId: that.loadParam.firstOrgId}, function (data) {
                that.orgData = data;
            });
            this.doQuery();
        },
        queryAllOrg(){
            let that = this;
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.srcOrgData = data;
            });
        },
        changeRegionSelect2() {
            let that = this;
            if(this.common.isBlank(this.item.firstOrgId)){
                this.secondOrgData=[];
                return;
            }
            this.common.postUrl("regionOrgTF", "queryOrgData", {regionId: that.item.firstOrgId}, function (data) {
                that.secondOrgData = data;
            });
        },
        async openDialog(flag)
        {
            this.showDialog = flag;
        },
        async dblclickItem(data)
        {
            this.title = '详情';
            this.isLock = true;
            this.item = this.common.copyObj(data);
            await this.openDialog(true);
        },
        async addItem()
        {
            this.title = '新增';
            this.isLock = false;
            this.initItem();
            await this.openDialog(true);
        },
        async updateItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            this.item = this.common.copyObj(selectData[0]);
            this.changeRegionSelect2();
            this.title = '修改';
            this.isLock = false;
            await this.openDialog(true);
        },
        async saveOrUpdateItem()
        {
            if (this.common.isBlank(this.item.itemName))
            {
                this.$message.error("考核指标名称不能为空！");
                return false;
            }
            if (this.common.isBlank(this.item.srcOrgId))
            {
                this.$message.error("数据来源不能为空");
                return false;
            }
            if (this.common.isBlank(this.item.firstOrgId))
            {
                this.$message.error("一级部门不能为空");
                return false;
            }
            if (this.common.isBlank(this.item.secondOrgId))
            {
                this.$message.error("二级部门不能为空");
                return false;
            }
            await this.common.postUrl("fcExamineTF", "saveFcExamineItemInfo", this.item);

            await this.doQuery();
            await this.openDialog(false);
            this.$message.success("保存成功!");
        },
        async deleteItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            let msg = `
                    <p style="text-align:center;">你要删除：${selectData[0].itemName}</p>
                    <p style="text-align:center;">是否继续？</p>
                    `;
            this.$confirm(msg, "提示",{dangerouslyUseHTMLString:true}).then(() =>{
                this.common.postUrl("fcExamineTF", "delFcExamineItemInfo", {id: selectData[0].id}, function ()
                {
                    that.doQuery(that.query);
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
    },
    computed:{
        formData(){
            return [
                {"name":"指标名称","model":"itemName","type":"year","isshow":true},
                {"name":"一级部门","model":"firstOrgId","type":"select","options":this.regionData,"label":"regionName","value":"id","placeholder":"一级部门","method":"changeRegionSelect","isshow":true},
                {"name":"二级部门","model":"secondOrgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"二级部门","method":"doQuery","isshow":true},
                {"name":"备注","model":"remark","type":"input","isshow":true},
            ]
        }
    },
}
