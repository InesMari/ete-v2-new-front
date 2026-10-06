import printJS from 'print-js'
export default {
    name: 'answerDetail',
    data() {
        return {
            param: {
                
            },
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        // 初始化页面数据 - 修改或复制时调用
        async initData(){
            this.param = await this.common.postUrl("answerService", "loadAnswerById", {id:this.$route.query.id}, null,null,null,true);
            this.param.customerName = decodeURI(this.param.customerName);
            try{
                this.param.titleList.forEach(el => {
                  el.questionList.forEach(item => {
                    item.questionAnswer = decodeURI(item.questionAnswer);
                  })
                })
              }catch(e){}
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/answerDetailPrint.css',  //真实路径/public//static/css/answerDetailPrint.css
                scanStyles: false
            })
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
