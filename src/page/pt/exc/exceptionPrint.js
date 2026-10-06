import printJS from 'print-js'
export default {
    name: "exceptionPrint",
    data() {
        return {
            info: {},
            type:this.$route.query.type,
            imgList:[],
        };
    },
    mounted() {
        this.initExceptionData();
    },
    methods: {
        // 初始化数据
        async initExceptionData() {
            this.info = await this.common.postUrl('exceptionTF','getExceptionInfo',{id:this.$route.query.id});
            this.info.files.forEach((item, index) => {
                // 判断是否图片类型
                if (this.isImagePath(item.fileUrl)) {
                    this.imgList.push(item);
                }
            });
            this.$forceUpdate();
        },
        // 是否图片路径
        isImagePath(path){
            if (!path || typeof path !== 'string') {
                return false;
            }            
            // 支持的图片格式
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];            
            // 获取文件扩展名（转为小写）
            const extension = path.toLowerCase().substring(path.lastIndexOf('.'));            
            // 检查是否在支持的图片格式列表中
            return imageExtensions.includes(extension);
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/printException.css',  //真实路径/public/static/css/printException.css
                scanStyles: false,
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
};