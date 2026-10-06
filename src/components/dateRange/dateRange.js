export default {
    name: 'innerTab',
    props:[
        'placeholder',
        'dayRange',  //时间选择时限（接收参数为天数），不传默认一年
        'value',    //回显赋值字段
    ],
    data(){
        return{
            dateArr:[],
            timeArr:[],
            dateRange:'',
            timeIndex:-1,
            showDateRange:false,
        }
    },
    mounted(){
        if(this.common.isNotBlank(this.value) && Array.isArray(this.value)){
            this.dateRange = this.value.join(",").replace(/\,/," ")
        }
        this.dateArr = this.getDate();
        this.initTimeRange();
    },
    methods:{
        async initTimeRange(){
            let url = "api/sysStaticDataBO.ajax?cmd=selectSysStaticDataByCodeType";            
            let {items} = await this.common.postUrl(url,{"codeType":"DELIVERY_TYPE"});
            items.forEach(el => {
                this.timeArr.push(el.codeName);
            })
        },
        selectDate(date){
            this.dateArr.forEach(el => {
                el.active = false;
            });
            date.active = true
            this.currentDate = date;
            this.$forceUpdate();
        },
        selectTime(index){
            this.timeIndex = index;
        },
        sureSel(){
            if(this.common.isBlank(this.currentDate)){
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                });
                return;
            }
            if(this.common.isBlank(this.timeArr[this.timeIndex])){
                this.$message({
                    message: '请选择时间范围',
                    type: 'warning'
                });
                return;
            }
            this.dateRange = this.currentDate.date + ' ' + this.timeArr[this.timeIndex];
            let backArr = [this.currentDate.date,this.timeArr[this.timeIndex]];
            this.cancelSel();
            this.$emit("callback",backArr);
        },
        cancelSel(){
            this.showDateRange = false;
        },
        showRangeDate(){
            this.showDateRange = true;
        },
        getDate(){
            let date = new Date();
            let year = date.getFullYear();  //获取当前年份
            let month = date.getMonth()+1; //获取当前月份
            let day = date.getDate(); //获取当前日(1-31)
            let currentYearDateList = this.getYearDate(year, month, day);
            let nextYearDateList = this.getYearDate(year+1, month, day);
            let dateList = [...currentYearDateList, ...nextYearDateList];
            if (this.common.isNotBlank(this.dayRange)){
                dateList.length = Number(this.dayRange);
            }
            return dateList;
        },
        //获取当前年的日子
        getYearDate(year, month,day) {
          let isCurrentYear = year == new Date().getFullYear() ? true : false;//判断是否今年
          let dateArr = [];
          let date = new Date();
          let febDay = 28; //是否闰年
          if (year % 4 == 0) {
            febDay = 29;
          }
          for (let i = 1; i <= 12; i++) {
            let monthCheck = false;
            if (isCurrentYear){ //如果是当前年，获取今年剩下的月份
              if (i >= month) monthCheck = true;
            }else { //若是下年，获取到下年当前月的前一个月
              if (i < month) monthCheck = true;
            }
            if (monthCheck){
              for (let d = 1; d <= 31; d++) {
                if (i == 2 && d > febDay) {  //2月份超过最大天数停止遍历
                  break;
                }else if((i==4 || i==6 || i==9 || i==11)&&d>30){  //30天月份超过天数停止遍历
                  break;
                }
                if(month==i&&day>d){  //当前月之前的日子不做选择
                  continue;
                }
                if (d < 10) { //天数小于10的时候加上0
                  var dayStr= '0' + d;
                }else{
                  var dayStr = d;
                }
                if(i<10){ //月份小于10的时候加上0
                  var monthStr = '0' + i;
                }else{
                  var monthStr = i;
                }
                let date = monthStr + '-' + dayStr;
                let week = this.getDay(year + '-' + i + '-' + d);
                let obj = {
                  date: year + '-' + monthStr + '-' + dayStr,
                  name: ''
                }
                if (month == i && day == d){
                  obj.name = "今天（" + week + "）"
                } else if (month == i && day+1 == d){
                  obj.name = "明天（" + week + "）"
                }else {
                  obj.name = date + "（" + week + "）"
                }
                dateArr.push(obj);
              }
            }
          }
          return dateArr;
        },
        getDay(day){
          let week = new Date(day).getDay();
          let str = '';
          switch(week){
            case 0 :
              str = '周日'
              break;
            case 1:
              str = '周一'
              break;
            case 2:
              str = '周二'
              break;
            case 3:
              str = '周三'
              break;
            case 4:
              str = '周四'
              break;
            case 5:
              str = '周五'
              break;
            case 6:
              str = '周六'
              break;
          }
          return str;
        },
    },
    watch:{
        value:{
            handler(n){
                if(this.common.isNotBlank(n) && Array.isArray(n)){
                    this.dateRange = n.join(",").replace(/\,/," ")
                }
            },
        },
    }
}