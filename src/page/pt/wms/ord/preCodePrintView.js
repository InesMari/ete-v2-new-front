import printJS from 'print-js'

export default {
    name: 'preCodePrintView',
    data() {
        return {
            codeList:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
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
        initInfo(){
            let that = this;
            this.common.postUrl("wmsQrcodeTF", 'queryQrcodeList', {ids:this.$route.query.ids}, function (data) {
                that.codeList = data;
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        /**
         * 打印条码
         */
        printCode(){
            // 删除已插入的node节点
            let delNode = document.getElementById("printQrCodesId");
            if(this.common.isNotBlank(delNode)) document.body.removeChild(delNode);
            let tag = "";
            this.codeList.forEach(item => {
                let dom = `
                    <div class="printQrCodeView">
                        <img border='0' src='${item.qrcodeFileUrl}' class="img" style="margin-top:1mm;width:100%;"/>
                    </div>
                `
                tag += dom;
            })
            let view = document.createElement("div");
            console.log(view)
            view.style.display = "none";
            view.innerHTML = tag;
            view.id = 'printQrCodesId';
            document.body.appendChild(view);
            printJS({
                printable: printQrCodesId,
                type: 'html',
                css: './static/css/print.css',  //真实路径/public//static/css/print.css
                scanStyles: false
            })
        },
    },
}
