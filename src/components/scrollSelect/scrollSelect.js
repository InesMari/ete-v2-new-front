export default {
    props:{
        selectData:{
            type:Array,
            default:[]
        },
        selectValue:{
            type:String,
            default:''
        },
        label:{
            type:String,
            default:'label'
        },
        placeholder:{
            type:String,
            default:'请输入筛选关键字'
        },
    },
    name: 'scrollSelect',
    data() {
        return {
            selectDataShow:[],  // 展示数据
            selectDataCache:[], // 缓存数据
            value:'',
            showPopover:false,
            currentItem:'',
            pageNum:20, //每次加载数据条数
            page:1, //当前页码
        }
    },
    mounted(){
        this.initScroll();
    },

    methods: {
        // 初始化数据
        initData(){
            this.page = 1;
            this.selectDataShow = this.selectData.filter((item,index) => index < this.pageNum);
            this.selectDataCache = this.common.copyObj(this.selectData);
        },
        // 监听滚动条
        initScroll(){
            let scrollView = this.$refs.searchList;
            let isLoad = false;
            let _this = this;
            scrollView.onscroll = function(){
                if(this.scrollTop + this.clientHeight >= scrollView.scrollHeight - 10 && !isLoad){
                    isLoad = true;
                    let datas = _this.selectDataCache.filter((item,index) => (index>_this.pageNum*_this.page && index<_this.pageNum*(_this.page+1)))
                    _this.selectDataShow = _this.selectDataShow.concat(datas);
                    _this.page++;
                    const timer = setTimeout(() => {
                        isLoad = false;
                        clearTimeout(timer);
                    },300);
                }
            }
        },
        blurSelect(){
            if(this.common.isBlank(this.currentItem)){
                this.value = '';
            }else if(this.currentItem[this.label] != this.value){
                this.value = this.currentItem[this.label]
            }
            this.$emit("blurSelect",this.currentItem);
        },
        inputData(){
            let escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            if(this.value){
                this.selectDataCache = [];
                for (let i = 0; i < this.selectData.length; i++) {
                    let visible = new RegExp(escapeRegexpString(this.value), 'i').test(this.selectData[i][this.label])
                    if (visible) {
                        this.selectDataCache.push(this.selectData[i]);
                    }
                }
            }else{
                this.selectDataCache = this.common.copyObj(this.selectData);
            }
            this.selectDataShow = this.selectDataCache.filter((item,index) => index<this.pageNum);
            this.page = 1;
        },
        selectItem(item){
            this.value = item[this.label];
            this.currentItem = this.common.copyObj(item);
            this.selectDataShow = this.common.copyObj(this.selectData);
            this.selectDataCache = this.common.copyObj(this.selectData);
            this.$emit("selectItem",item);
            this.showPopover = false;
        },
        
        clear(){
            this.value = '';
            this.currentItem = '';
            this.initData();
            this.$emit("clear");
        },
    },
    watch:{
        selectData:{
            handler(n){
                this.initData();
            },
            deep:true
        },
        selectValue:{
            handler(n){
                this.value = n;
            }
        }
    }
}