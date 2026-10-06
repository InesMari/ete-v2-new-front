import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
  name: 'insuranceRebate',
  data() {
    return {
        info:{},
    }
  },
  mounted() {
    this.doQuery();
  },
  components: {
    myFileModel,
  },
  methods: {
    doQuery() {
        
    },
  },
}