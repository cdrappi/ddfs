<template>
  <div>
    <multiselect
      :options="options"
      v-model="selected"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      placeholder="Search"
    >
    </multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import mixin from '../libs/mixinViews'
  import getGolfers from '../libs/getGolfers'
  export default {
    mixins: [mixin],
    components: { Multiselect },
    data () {
      return {
        selected: null,
        options: getGolfers()
      }
    }
  }
</script>
