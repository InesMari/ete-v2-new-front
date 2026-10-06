import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'workInfoManageDetail',
    data()
    {
        return {
            head: [
                {"name": "卸货点点名称", "code": "name", "width": "110", "type": "text"},
                {"name": "所属作业点", "code": "workName", "width": "110", "type": "text"},
                {"name": "联系人", "code": "linkman", "width": "110", "type": "text"},
                {"name": "联系电话", "code": "linkPhone", "width": "110", "type": "text"},
                {"name": "备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"}
            ],
            query: this.initQuery(),
            workDetail: this.initWorkDetail(),
            workData: [],//作业点
            showDialog: false,
            isOnlySee: false,
            title: "新增卸货点",

            showSelWork: false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
        this.initSelWork();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        searchList,
        tableCommon,
        selectWork
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.doQuery();
        },
        initQuery()
        {
            return this.query =
                {
                    name: '',
                    workId: '',
                    linkman: '',
                    linkPhone: '',
                };
        },
        initWorkDetail()
        {
            return this.workDetail =
                {
                    id: '',
                    name: '',
                    workId: '',
                    linkman: '',
                    linkPhone: '',
                    remark: '',
                };
        },
        doQuery(query=this.query)
        {
            this.query = query;
            this.$refs.table.load("workDetailService", "queryWorkDetailPage", this.query);
        },
        async init()
        {
            this.workData = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {isWmsWork: 1});
        },
        dblclickItem(data)
        {
            this.open(true, 3, data);
        },
        deleteWorkDetail()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要删除的卸货点！");
                return;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("workDetailService", "deleteWorkDetail", selectData[0], function (data)
                {
                    that.$message.success("删除成功!")
                    that.doQuery();
                });
            }).catch(() =>{})
        },
        open(flag, type, data)
        {
            this.initWorkDetail();
            if (flag)
            {
                this.isOnlySee = type === 3;
                if (type === 1)
                {
                    this.title = "新增卸货点";
                }
                else if (type === 2)
                {
                    let selectData = this.$refs.table.getSelectItem();
                    if (selectData.length !== 1)
                    {
                        this.$message.error("请选择一个需要修改的卸货点！");
                        return;
                    }
                    this.title = "修改卸货点";
                    this.workDetail = this.common.copyObj(selectData[0]);
                }
                else if (type === 3)
                {
                    this.title = "查看卸货点";
                    this.workDetail = data;
                }
            }
            this.showDialog = flag;
        },
        async saveOrUpdateWorkDetail()
        {
            if (this.common.isBlank(this.workDetail.name))
            {
                this.$message.error("请输入卸货点名称！");
                return;
            }
            if (this.common.isBlank(this.workDetail.workId))
            {
                this.$message.error("请选择所属作业点！");
                return;
            }
            await this.common.postUrl("workDetailService", "saveOrUpdateWorkDetail", this.workDetail);
            this.open(false);
            this.doQuery();
        },
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'workDetail' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WORK_DETAIL,
                },
                urlName: "卸货点" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"卸货点名称","model":"name","type":"input","isshow":true},
                {"name":"所属作业点","model":"workId","type":"select","options":this.workData, "label":"workName","value":"workId","method":"doQuery","isshow":true},
                {"name":"联系人","model":"linkman","type":"input","isshow":true},
                {"name":"联系电话","model":"linkPhone","type":"input","isshow":true},
            ]
        }
    },
}
