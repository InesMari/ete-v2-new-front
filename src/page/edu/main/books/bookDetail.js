export default {
    name: 'bookDetail',
    props:['id'],
    data() {
        return {
            info:{
                
            },
            content:"",
            currentIndex:0,
            tabs:[
                {name:"推荐语"},
                {name:"内容简介"},
                {name:"作者简介"},
                {name:"书籍目录"},
                {name:"试读内容"},
            ]
        }
    },
    mounted() {
        this.doQuery();
    },
    components: {
    },
    methods: {
        async doQuery(){
            this.info = await this.common.postUrl("eduBookService", "getEduBookInfo", {id: this.id});
            this.content = this.info.recommendation;
        },
        changeTab(index){
              this.currentIndex = index;
              switch(index){
                case 0:  //推荐语
                    this.content = this.info.recommendation;
                    break;
                case 1:  //内容简介
                    this.content = this.info.contentOverview;
                    break;
                case 2:  //作者简介
                    this.content = this.info.authorOverview;
                    break;
                case 3:  //书籍目录
                    this.content = this.info.bookContents;
                    break;
                case 4:  //试读内容
                    this.content = this.info.trialContent;
                    break;
              }
        },
    }
}
