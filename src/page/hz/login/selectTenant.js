
export default {
    name: 'selectTenant',
    data() {
        return {
            selTenantId:-1,
            selOrgId:-1,
            selRegionId:-1,
            tenantList:[],
            orgList:[]
        }
    },
    mounted() {
        this.init();
    },
    components: {

    },
    methods: {
        init(){
            this.tenantList = JSON.parse(localStorage.getItem("tenantList"));
            this.selTenantId = this.tenantList[0].id;
            if(localStorage.getItem("orgList")){
                let allOrgList = JSON.parse(localStorage.getItem("orgList"));
                this.orgList = allOrgList['tenantId'+this.selTenantId];
                this.selOrgId = this.orgList[0].id;
                this.selRegionId = this.orgList[0].regionId;
            }
        },
        selTenant(tenant){
            this.selTenantId = tenant.id;
            if(localStorage.getItem("orgList")){
                let allOrgList = JSON.parse(localStorage.getItem("orgList"));
                this.orgList = allOrgList['tenantId'+this.selTenantId];
                this.selOrgId = this.orgList[0].id;
            }
        },
        selOrg(org){
            this.selOrgId = org.id;
            this.selRegionId = org.regionId;
        },
        back(){
            localStorage.removeItem("defaultUrl");
            localStorage.removeItem("rememberTime");
            this.$store.commit('resetData',{name:'componentName',data:'login'});
        },
        commitSelTenant(){
            let that = this;
            let param = {
                tenantId:this.selTenantId,
                orgId:this.selOrgId,
                regionId:this.selRegionId
            };
            this.common.postUrl("userTF", "selTenant", param, function (data) {
                if(data){
                    let userInfo = that.common.userInfo();
                    userInfo.tenantId = that.selTenantId;
                    userInfo.orgId = that.selOrgId;
                    userInfo.regionId = that.selRegionId;
                    localStorage.setItem("userInfo",JSON.stringify(userInfo));
                    localStorage.setItem("entityIds",data.entityIds);
                    let toUrl = "hzHome";
                    if(localStorage.getItem("rememberTime")){
                        localStorage.setItem("defaultUrl",toUrl);
                        localStorage.setItem("rememberTime",new Date().getTime());
                    }else{
                        localStorage.removeItem("rememberTime");
                    }
                    that.$store.commit('resetData',{name:'componentName',data:toUrl});
                    that.$router.replace('/');   //防止后退去到登录页
                }
            });
        }
    }
}
