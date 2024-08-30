import { defineStore } from 'pinia'
import {ref} from "vue";

const useCoreStore = defineStore('useCoreStore',()=> {
    const core = ref()
    const structure = ref()
    const description = ref()
    const errorReason = ref()

    return {
        core,
        structure,
        description,
        errorReason
    }

})

export default useCoreStore
