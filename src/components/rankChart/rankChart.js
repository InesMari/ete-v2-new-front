export default {
    name: 'rankChart',
    props:[
        'data',
        'name',
        'value',
    ],
    data(){
        return{
            list:[]
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.list = this.common.copyObj(this.data);
            // 初始化进度条
            this.list.forEach(item => {
                item.rate = 0;
            })
            // 渲染后计算进度条长度，为了动画能执行
            setTimeout(()=>{
                this.getRate();
            })
        },
        getRate(){
            let maxValue = this.list[0].value;
            this.list.forEach(item => {
                item.rate = item.value/maxValue*100;
            })
            this.$forceUpdate();
        }
    },
    watch: {
        data() {
            this.init();
        }
    }
}
