import commonItemClaimApply from '../commonItemClaimApply.js'

export default {
    mixins: [commonItemClaimApply],
    name: 'itemClaimApplyDetail',
    data()
    {
        return {

        }
    },
    async mounted()
    {
        setTimeout((async () =>{
            await this.loadClaimApplyById();
        }),500);
    },
    methods: {

    },
    components: {
    },
}
