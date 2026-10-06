export default {
    name: 'toMain',
    data() {
        return {
            weeks:[],
            currentDate:'',//当前日期
            monthCache:new Date().getMonth()+1,//切换日历记录月份
            monthPicker:"",//选择月份
        }
    },
    mounted() {
        this.initWeek();
    },
    components: {

    },
    methods: {
        /**
         * 初始化日历
         * e Date格式，月份
         */
        initWeek(e){
            this.weeks = [];
            if(this.common.isBlank(e)){     //开始初始化
                var date = new Date();
                var week = date.getDay();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                // 初始化当前日期
                if(month<10){
                    var dataMonth = "0" + month;
                }else{
                    var dataMonth = month;
                }
                if(day<10){
                    var dataDay = "0" + day;
                }else{
                    var dataDay = day;
                }
                this.currentDate = year + "-" + dataMonth + "-" + dataDay;          
            }else{  //选择月份初始化
                var date = e;
                var week = date.getDay();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = 1;
                if(month<10){
                    var dataMonth = "0" + month;
                }
                this.selectDate(year +  "-" + dataMonth + "-" + '01');
            }
            for(let i=0;i<7;i++){
                let obj = {};
                // 日期
                obj.date = day - week + i;
                let monthDay = new Date(date.getFullYear(), month, 0).getDate();
                if(obj.date<1){     //上个月日期处理
                    obj.date = new Date(date.getFullYear(), month-1, 0).getDate() + obj.date;
                    var dataMonth = month - 1;
                }else if(obj.date>monthDay){    //下个月日期处理
                    obj.date = obj.date - monthDay;
                    var dataMonth = month + 1;
                }else{
                    var dataMonth = month;
                }
                // 完整年月日
                if(month<1){
                    year = year - 1;
                }else if(month > 12){
                    year = year +1;
                }
                if(dataMonth<10){
                    dataMonth = "0" + dataMonth;
                }
                if(obj.date<10){
                    var dataDay = "0" + obj.date;
                }else{
                    var dataDay = obj.date;
                }
                obj.data = year + "-" + dataMonth + "-" + dataDay;
                // 星期
                switch(i){
                    case 0:
                        obj.week = "周日";
                        break;
                    case 1:
                        obj.week = "周一";
                        break;
                    case 2:
                        obj.week = "周二";
                        break;
                    case 3:
                        obj.week = "周三";
                        break;
                    case 4:
                        obj.week = "周四";
                        break;
                    case 5:
                        obj.week = "周五";
                        break;
                    case 6:
                        obj.week = "周六";
                        break;
                }
               this.weeks.push(obj);
            }
        },
        /**
         * 上周
         */
        preWeek(){            
            const date = new Date();
            this.weeks.forEach(el=>{
                let day = el.date - 7;
                if(day>0){
                    el.date = day;
                    el.data = this.getDate(new Date(date.getFullYear(), date.getMonth(), el.date));
                }else{
                    el.date = new Date(date.getFullYear(), date.getMonth(), 0).getDate() + day;
                    el.data = this.getDate(new Date(date.getFullYear(), date.getMonth()-1, el.date));
                }
            })
        },
        /**
         * 下周
         */
        nextWeek(){            
            const date = new Date();
            this.weeks.forEach(el=>{
                let day = el.date + 7;
                let monthDay = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
                if(day>monthDay){
                    el.date = day - monthDay;
                    el.data = this.getDate(new Date(date.getFullYear(), date.getMonth()+1, el.date));
                }else{
                    el.date = day;
                    el.data = this.getDate(new Date(date.getFullYear(), date.getMonth(), el.date));
                }
            })
        },
        getDate(date){
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if(month<10){
                month = "0" + month;
            }
            if(day<10){
                day = "0" + day;
            }
            return year + "-" + month + "-" + day;
        },
        // 选择月份
        changeMonth(e){
            this.initWeek(e);
        },
        /**
         * 选择日期里
         * @param {日期，格式xxxx-xx-xx} data 
         */
        selectDate(data){
            this.currentDate = data;
            console.log(data)
        },
    }
}
