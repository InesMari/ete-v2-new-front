import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
  name: 'cashOutOrder',
  data() {
    return {
      options:[{
        value: '1',
        label: '时效≥'
      }, {
        value: '2',
        label: '价格'
      }],
      inputvalue:"",
      selectValue:""
    }
  },
  mounted() {

  },
  methods: {
    
  },
  components: {
    myFileModel
  },
}
