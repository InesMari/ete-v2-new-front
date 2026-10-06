import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum";
import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
    name: 'giftManage',
    data()
    {
        return {
            head: [
                {"name": "礼品方案编码", "code": "schemeNum", "width": "100", "type": "text"},
                {"name": "礼品方案名称", "code": "schemeName", "width": "200", "type": "text"},
                {"name": "礼品图片", "code": "imgUrl", "width": "100", "type": "diy"},
                {"name": "截止日期", "code": "deadlineDate", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
            ],
            query: this.initQuery(),
            srcList: [],
        }
    },
    mounted()
    {
        this.doQuery();
    },
    components: {
        fileViewer,
        tableCommon,
    },
    methods: {
        initQuery() {
            return this.query = {
                schemeNum: '',
                schemeName: '',
                remark: '',
            };
        },
        async doQuery()
        {
            await this.$refs.table.load("schemeService", "loadGiftSchemePage", this.query);
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async dblclickItem(item) {
            let data = {
                query: {id:item.id, type: 0},//type 0 查看 1 新增 2 修改 3 复制
                urlId: 'giftDetail' + item.id,
                urlName: '礼品方案详情',
                urlPathName: '/giftDetail',
                urlPath: "/pt/biz/gift/addGift.vue",
            }
            await this.open(data);
        },
        async addGift() {
            let data = {
                query:{type:1},//type 0 查看 1 新增 2 修改 3 复制
                urlId: 'addGift' + new Date().getTime(),
                urlName: '新增礼品方案',
                urlPathName: '/addGift',
                urlPath: "/pt/biz/gift/addGift.vue",
            }
            this.open(data);
        },
        async updateGift() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let data = {
                query: {type: 2,id:selectData[0].id},//type 0 查看 1 新增 2 修改 3 复制
                urlId: 'updateGift' + selectData[0].id,
                urlName: '修改礼品方案',
                urlPathName: '/updateGift',
                urlPath: "/pt/biz/gift/addGift.vue",
            }
            await this.open(data);
        },
        async copyGift() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的数据！");
                return false;
            }
            let data = {
                query: {type: 3,id:selectData[0].id},//type 0 查看 1 新增 2 修改 3 复制
                urlId: 'copyGift' + selectData[0].id,
                urlName: '复制礼品方案',
                urlPathName: '/copyGift',
                urlPath: "/pt/biz/gift/addGift.vue",
            }
            await this.open(data);
        },
        async shareGift() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要分享的数据！");
                return false;
            }
            let deadlineDate = new Date(selectData[0].deadlineDate + " 23:59:59").getTime();
            let now =  new Date().getTime();
            if (deadlineDate < now)
            {
                this.$message.error("已经超过截止时间，无法继续分享！");
                setTimeout(()=>{ this.$message.success("真要分享可以先修改截止时间！"); }, 3000);
                return false;
            }
            let data = {
                query: {id:selectData[0].id},
                urlId: 'shareGift' + selectData[0].id + new Date().getTime(),
                urlName: '分享礼品方案',
                urlPathName: '/shareGift',
                urlPath: "/pt/biz/gift/shareGift.vue",
            }
            await this.open(data);
        },
        deleteGift(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的数据！");
                return false;
            }
            let that = this;
            this.$confirm("确定删除礼品方案？", "提示").then(() =>{
                this.common.postUrl("schemeService", "deleteGiftSchemeById", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async recordGiftDetail()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的数据！");
                return false;
            }
            let data = {
                query: {id:selectData[0].id},
                urlId: 'giftReg' + new Date().getTime(),
                urlName: '礼品登记详情',
                urlPathName: '/giftReg',
                urlPath: "/pt/biz/gift/giftReg.vue",
            }
            await this.open(data);
        },
        showBigImg(data)
        {
            if (this.common.isBlank(data.imgUrl))
            {
                this.$message.error("图片为空！");
                return false;
            }
            this.srcList = [];
            this.srcList.push(data.imgUrl);
      		this.$refs.viewer.show();
        },

    },
}
