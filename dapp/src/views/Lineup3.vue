<template>
  <div>

    <ul class="resources-list">
      <template v-for="(resource, index) in selectedGolfers">
        <li class="resource-item" :data-index="index">
          <div class="resource-info">
            <div class="resource-title" :id="index">
              <span>{{ resource.name }} ({{resource.pga_id}}) ... Ξ{{resource.eth_salary}} </span>
            </div>
          </div>
          <div class="delete-controls" ><!-- v-on:click.prevent="removeDependency(index)"> -->
            <i class="fa fa-times fa-fw"></i>
          </div>
        </li>
      </template>
      <button class="btn btn-primary" </button><!-- :disabled="disableSubmit" @click="performSubmit">Save to blockchain</button> -->
        <strong v-show="submitting">Submitting...</strong>
        <strong v-show="errorSubmit" class="text-danger">Error occurred!</strong>
    </ul>
    <multiselect
      :options="options"
      v-model="selectedGolfers"
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
        selectedGolfers: null,
        options: getGolfers()
      }
    }
  }
</script>



<style scoped>
* {
  font-family: 'Lato', 'Avenir', sans-serif;
}

.resources-list {
  margin-top: 15px;
  padding: 0;
  list-style: none;
}

.resources-list li {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 10px 40px 10px 0;
  border-bottom: 1px solid rgba(51, 51, 51, 0.1);
  position: relative;
}

.resources-list li:last-child {
  border-bottom: none;
}

.resources-list li .resource-title {
  font-size: 1em;
  color: #333;
}

.resources-list li .version {
  opacity: 0.7;
  margin-left: 5px;
  font-size: 75%;
}

.resources-list li .resource-description,
.resources-list li .resource-url {
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
}

.resources-list li .resource-url {
  margin-top: 0;
}

.resources-list li .resource-description:empty {
  display: none;
}

.resources-list li .delete-controls {
  position: absolute;
  right: 0;
  width: 40px;
  text-align: center;
  color: #999;
  cursor: pointer;
}

.resources-list li .delete-controls:hover,
.resources-list li .delete-controls:focus {
  color: red;
}
</style>
