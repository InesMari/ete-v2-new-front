import printJS from 'print-js'
export default {
    name: 'printTagCode',
    props:{
        tagType:{
            type:[Number,String],
            default:1,
        }
    },
    data() {
        return {
            materialCodeList:[],
            type:1, //1是入库，2是出库
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.loadInOrderInfo();
    },
    /**
     * 组件
     */
    components: {
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 加载订单数据
         */
        async loadInOrderInfo()
        {
            
            let {inOrderId,outOrderId:splitOutOrderId,id,ids,type,stockMaterialDtlId} = this.$route.query;
            if(this.common.isBlank(type)){
                this.type = this.tagType;
            }else{
                this.type = type;
            }
            if(this.type == 1){     //入库
                if(ids){
                    this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "loadStockQrcodeByCondition",{ids},null, null, null, true);
                }else{
                    this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "loadStockQrcodeByCondition",{inOrderId},null, null, null, true);
                }
            }else if (this.type == 2){      //出库拆托
                this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "loadStockQrcodeByCondition",{splitOutOrderId},null, null, null, true);
            }else if(this.type == 3){   //库位查看条码
                this.materialCodeList = await this.common.postUrl("wmsInOrderTF", "loadStockQrcodeByCondition",{stockMaterialDtlId},null, null, null, true);
            }
            // 判断条码图片是否生成完毕
            let haveCodes = true;
            this.materialCodeList.forEach(item => {
                if(this.common.isBlank(item.qrcodeFileUrl)){
                    haveCodes = false;
                }
                item.codeNum = this.common.getDisplayCodeNum(item.codeNum);
            })
            this.haveCodes = haveCodes;
            // 重复请求查询标签是否生成完
            if(!haveCodes){
                const timer = setTimeout(() => {
                    this.loadInOrderInfo();
                    clearTimeout(timer);
                }, 2000);
            }
        },
        changeSelect(item){
            if(item.sts==0) return;
            item.ischecked = !item.ischecked;
            this.$forceUpdate();
        },
        // 全选
        selectAll(){
            this.materialCodeList.forEach(item => {
                if(item.sts!=0){
                    item.ischecked = true;
                }
            })
            this.$forceUpdate();
        },
        // 打印条码
        print(){
            // 删除已插入的node节点
            let delNode = document.getElementById("printTagId");
            if(this.common.isNotBlank(delNode)) document.body.removeChild(delNode);
            let tag = "";
            this.materialCodeList.forEach(item => {
                if(item.ischecked){
                    let dom = `
                        <div class="codeItem outTag">
                            <div class="title">ETE物料标签</div>
                            <div class="tagId">${item.codeNum}</div>   
                            <div class="oldTagId" style="${item.parentCodeNum?'':'display:none;'}"><span>旧：${item.parentCodeNum}</span></div>
                            <div class="mark" style="${this.type==1?'display:none;':''}">${ item.mark == 1 ? '留' : '出' }</div>
                            <img class="logo" src="/static/image/logo3.png" alt="">
                            <img class="code" src="${item.qrcodeFileUrl}" alt="">
                            <div class="item">
                                <label class="label">批次号：</label>
                                <div class="text">${item.batchNum}</div>
                            </div>
                            <div class="item">
                                <label class="label">物料编码：</label>
                                <div class="text">${item.materialNum}</div>
                            </div>
                            <div class="item">
                                <label class="label">供应商批次：</label>
                                <div class="text">${item.supplierBatchNum}</div>
                            </div>
                            <div class="item">
                                <label class="label">ASN：</label>
                                <div class="text">${item.asn}</div>
                            </div>
                            <div class="item">
                                <label class="label">数量：</label>
                                <div class="text">${item.nums} <span class="unit">${ item.unitName }</span></div>
                            </div>
                            <div class="item">
                                <label class="label">原数量：</label>
                                <div class="text">${item.srcNums?item.srcNums:''} <span class="unit" style="${item.srcNums?'':'display:none;'}">${ item.unitName }</span></div>
                            </div>
                            <div class="item">
                                <label class="label">箱数：</label>
                                <div class="text">${item.boxNums?item.boxNums:""}</div>
                            </div>
                            <div class="item">
                                <label class="label">是否尾数：</label>
                                <div class="text">${item.isRemainderName}</div>
                            </div>
                            <div class="item">
                                <label class="label">入库时间：</label>
                                <div class="text">${item.createDate?item.createDate:''}</div>
                            </div>
                        </div> 
                    `
                    tag += dom;
                }
            })            
            if (this.common.isBlank(tag)) {
                this.$message.error("请至少选择一个标签！");
                return;
            }
            let view = document.createElement("div");
            console.log(view)
            view.style.display = "none";
            view.innerHTML = tag;
            view.id = 'printTagId';
            document.body.appendChild(view);
            printJS({
                printable: printTagId,
                type: 'html',
                css: './static/css/printInventoryCode.css',  //真实路径/public//static/css/printInventoryCode.css
                scanStyles: false,
            })  
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id,null,true);
            this.$parent.$emit("closeTab",this.$route.meta.id,null,true);
        },
    },
}
