import { Store, Getters, Mutations, Actions } from './state';
import UtilGetters from './blogBuilderUtils/UtilGetters';

export default class BlogBuilder {
  store: Store
  getters: Getters
  mutations: Mutations
  actions: Actions
  utilGetters: UtilGetters

  constructor( root: string, output: string ) {
    this.store = new Store()    
    this.getters = new Getters( this.store, this )    
    this.mutations = new Mutations( this.getters )    
    this.actions = new Actions( this.mutations )    
    this.utilGetters = new UtilGetters()

    const { mutations } = this

    mutations.UPDATE_ROOT( root )
    mutations.UPDATE_OUTPUT( output )

  }

  build() {
    this.actions.build()
  }
}