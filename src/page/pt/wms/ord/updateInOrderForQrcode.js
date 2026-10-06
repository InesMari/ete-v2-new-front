import addOrUpdateInOrder from './addOrUpdateInOrder.js'

export default {
    name: 'updateInOrderForQrcode',
    mixins:[addOrUpdateInOrder],
    /**
     * 初始化
     */
    async mounted() {

    },
    /**
     * 绑定函数
     */
    methods: {
        // 添加一行
        addTag(index){
            let obj = this.common.copyObj(this.materialCodeListFromServer[index]);
            obj.id = null;//置空一下
            obj.onShelvesDate = null;//置空一下
            obj.onShelvesUserName = null;//置空一下
            obj.canDelete = true;
            if (index == this.materialCodeListFromServer.length - 1)
            {
                this.materialCodeListFromServer.push(obj);
            }
            else
            {
                this.materialCodeListFromServer.splice(index + 1, 0, obj);
            }
        },
        // 删除当前行
        delTag(index){
            this.$confirm("确定删除该行？", "提示").then(() =>{
                this.materialCodeListFromServer.splice(index,1);
            }).catch(() =>{})
        },
        /** 保存入库单 */
        saveInOrder() {
            if(!this.showNext){
                if(!this.checkFirstPageInfo()) return;
            }
            this.info.materialList = this.materialData;
            this.info.materialCodeList = this.materialCodeListFromServer;
            this.info.packMaterialList = this.packMaterialData;
            let that = this;
            that.info.isUpdateQrcode = that.$route.query.isUpdateQrcode;
            that.common.postUrl("wmsInOrderTF", "addOrUpdateInOrder", that.info, function (data) {
                that.$message.success("修改入库单标签成功！");
                that.closePage();
            },null,'',true);
        },
    },
}
