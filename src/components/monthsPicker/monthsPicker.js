export default {
    name: 'monthsPicker',
    props:[],
    data(){
        return{
            isshowMonthPicker:false,
            years:[],
            months:[
                {name:"一月",value:"01"},
                {name:"二月",value:"02"},
                {name:"三月",value:"03"},
                {name:"四月",value:"04"},
                {name:"五月",value:"05"},
                {name:"六月",value:"06"},
                {name:"七月",value:"07"},
                {name:"八月",value:"08"},
                {name:"九月",value:"09"},
                {name:"十月",value:"10"},
                {name:"十一月",value:"11"},
                {name:"十二月",value:"12"},
            ],
            selectValue:[],
        }
    },
    mounted(){
        this.initYears();
        this.windowClose();
    },
    methods:{
        showMonthPicker(){
            this.isshowMonthPicker = true;
            this.$nextTick(()=>{
                this.$refs['scrollbar'].wrap.scrollTop = 36*20;
            })
        },
        clear(){
            this.selectValue=[];
            this.initYears();
            this.$emit('changeData');
        },
        /**
         * 初始化年份
         */
        initYears(){
            this.years = [];
            let year = Number(new Date().getFullYear());
            if(this.common.isBlank(this.rang)) this.rang = 20;
            for(let i = year - this.rang;i<year + this.rang;i++){
                let obj = {name:i,value:i};
                if(year == i){
                    obj.active = true;
                    this.currentYear = obj;
                }
                this.years.push(obj);
            }
            //清空选中月份
            this.months.forEach(el => {
                el.active = false;
            });
            this.$forceUpdate();
        },
        /**
         * 点击选择年份
         * @param {*} item
         */
        yearClick(item){
            this.years.forEach(el => {
                el.active = false;
            })
            item.active = true;
            this.currentYear = item;
            //清空选中月份
            this.months.forEach(el => {
                el.active = false;
            });
            // 匹配当年已选中月
            this.selectValue.forEach(el => {
                let arr = el.split("-")
                if(arr[0] == item.value){  //匹配选中年
                    this.months.forEach(month => {
                        if(arr[1] == month.value){     //匹配选中年月
                            month.active = true;
                        }
                    })

                }
            })
            this.$forceUpdate();
        },
        /**
         * 点击选择月份
         * @param {} item
         */
        monthClick(item){
            item.active = item.active?false:true;
            let data = this.currentYear.value + "-" + item.value;
            if(item.active){
                this.selectValue.push(data);
            }else{
                this.selectValue.splice(this.selectValue.findIndex(item => item === data), 1)
            }
            this.selectValue.forEach(el => {
                if(el.indexOf(this.currentYear.value)>-1){
                    this.currentYear.isSel = true;
                }else{
                    this.currentYear.isSel = false;
                }
            })
            this.$forceUpdate();
            this.$emit('changeData');
        },
        /**
         * 删除月份
         */
        delMonth(index){
            this.selectValue.splice(index,1);
            this.yearClick(this.currentYear);
            this.$emit('changeData');
        },
        /**
         * 获取选中的数据
         */
        getData(){
            return this.selectValue;
        },
        /**
         * 点击隐藏弹窗
         */
        windowClose(){
            window.addEventListener("click",()=>{
                this.isshowMonthPicker = false;
            })
        }
    },
}
