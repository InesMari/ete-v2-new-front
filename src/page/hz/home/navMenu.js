export default {
    name: 'navMenu',
    data() {
        return {
            tabs:[],
            routeId:'-1',
            isshowNav:true,
        }
    },
    mounted() {
        this.loadMenuTree();
        this.$nextTick(()=>{
            this.routeId = this.$store.state.routeId+'';
        })
    },
    components: {

    },
    methods: {
        openTab(item){
            this.$emit("openTab",item);
        },
        /**
         * 加载菜单树
         */
        loadMenuTree()
        {
            let that = this;
            that.common.postUrl("menuTF", "loadMenuTree",{}, function (data)
            {
                that.tabs = data;
            });
        },
        // 侧边栏展示隐藏
        navMenuSwitch(){
            this.isshowNav = this.isshowNav?false:true;
            this.$emit("navMenuSwitch",this.isshowNav);
        },
    }
}
