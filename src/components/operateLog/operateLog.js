export default {
    name: 'operateLog',
    props: {
        data: {
            type: Array,
            default: () => new Array(10)
        }
    },
    data()
    {
        return {
            list: [],
            isScroll: false,
            page: 1,
            pageNums: 30
        }
    },
    mounted()
    {
        //this.initScroll();
        this.initData();
    },
    components: {},
    methods: {
        async initData()
        {
            let data = await this.common.postUrl("logService", "loadLogData", {id: this.$route.query.logId, type: this.$route.query.logType});
            this.list = [...data];
            // this.page = 1;
            // this.list = [...data.slice(0, this.pageNums)];
            // this.pageTotal = Math.ceil(data.length / this.pageNums);
        },
        initScroll()
        {
            let scrollbar = this.$refs.scrollbar.$el.querySelector('.el-scrollbar__wrap');
            let _this = this;
            scrollbar.addEventListener('scroll', function ()
            {
                let top = this.scrollHeight - this.clientHeight;
                if (this.scrollTop >= (top - 10) && !_this.isScroll && _this.page <= _this.pageTotal)
                {
                    _this.isScroll = true;
                    _this.pushData();
                    _this.timer = setTimeout(() =>
                    {
                        _this.isScroll = false;
                    }, 300)
                }
            })
        },
        pushData()
        {
            this.list.push(...this.data.slice(this.pageNums * this.page, this.pageNums * (this.page + 1)));
            this.page++;
        },
    },
    watch: {
        data: {
            handler(n)
            {
                this.initData();
            },
            deep: true
        }
    }
}