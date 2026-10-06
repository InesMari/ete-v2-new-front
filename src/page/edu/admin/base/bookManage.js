export default {
    name: 'bookManage',
    data() {
        return {
            list:[{}],
            info:{
                bookName:'',
                page:1,
                count:10,
            },
            currentPage:1,
        }
    },
    mounted() {
        this.doQuery();
    },
    components: {
    },
    methods: {
        async doQuery(){
            let {items} = await this.common.postUrl("eduBookService", "queryEduBookInfoPage", this.info);
            items.forEach(el=>{
                el.isSelect = false;
            })
            this.list = items;
            this.$forceUpdate();
        },
        // 改变每页查询条数
        handleSizeChange(val){
            this.info.count = val;
            this.doQuery();
        },
        // 切换当前页面
        handleCurrentChange(page){
            this.info.page = page;
            this.doQuery();
        },
        forceUpdate(){
            this.$forceUpdate();
        },

        // 新增书籍
        addBook(){
            this.$emit("openTab",{
                urlName: "新增书籍",
                urlId: "addBook"+new Date().getTime(),
                urlPath: "/edu/admin/base/addBook.vue",
                urlPathName: "/addBook",
            })
        },
        // 修改书籍
        editBook(){
            let selectTotal = 0;
            let id = 0;
            for(let item of this.list){
                if(item.isSelect){
                    selectTotal++;
                    id = item.id;
                }
            }
            if(selectTotal!=1){
                this.$message.error("请选择一个需要修改的书籍信息")
                return;
            }
            this.$emit("openTab",{
                urlName: "修改书籍",
                urlId: "addBook"+id+new Date().getTime(),
                urlPath: "/edu/admin/base/addBook.vue",
                urlPathName: "/addBook",
                query:{id,type:1}
            })
        },
        // 查看书籍
        bookDetail(){
            let selectTotal = 0;
            let id = 0;
            for(let item of this.list){
                if(item.isSelect){
                    selectTotal++;
                    id = item.id;
                }
            }
            if(selectTotal!=1){
                this.$message.error("请选择一个需要查看的书籍信息")
                return;
            }
            this.$emit("openTab",{
                urlName: "查看书籍",
                urlId: "bookDetail"+id+new Date().getTime(),
                urlPath: "/edu/admin/base/bookDetail.vue",
                urlPathName: "/bookDetail",
                query:{id}
            })
        },
        // 删除课程
        async delBook(){
            let selectTotal = 0;
            let param = {};
            for(let item of this.list){
                if(item.isSelect){
                    selectTotal++;
                    param = item;
                }
            }
            if(selectTotal!=1){
                this.$message.error("请选择一个需要删除的书籍信息")
                return;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("eduBookService", "delEduBookInfo", param, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功");
                },null,'',true);
            }).catch(() =>{})
        },
    }
}
