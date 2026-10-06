import commonAssetsAllocat from '../commonAssetsAllocat.js'

export default {
    mixins: [commonAssetsAllocat],
    name: 'assetsAllocatDetail',
    data()
    {
        return {

        }
    },
    async mounted()
    {
        setTimeout((async () =>{
            await this.loadAssetsAllocatById();
        }),500);
    },
    methods: {

    },
    components: {
    },
}
