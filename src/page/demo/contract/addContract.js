import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
    name: 'addContract',
    data() {
        return {
            options:[
                {value:"0",label:"负责人1"},
                {value:"1",label:"负责人2"},
                {value:"2",label:"负责人3"},
            ],
            model:""
        }
    },
    mounted() {
        
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
    },
    methods: {

    },
}
