<template>
  <div class="flex items-center">
    <slot></slot>
    <div class="flex items-center ml-4" v-tooltip="reorderDisabledTooltip" v-if="canSeeReorderButtons">
      <div class="flex flex-col">
        <ChevronUpIcon
          @click="!reorderDisabled && $emit('moveToStart')"
          :custom-class="{
            'cursor-pointer text-gray-400 hover:text-primary-400 active:text-primary-500': !reorderDisabled,
            'cursor-default text-gray-200': reorderDisabled,
          }"
          v-tooltip="moveToStartTooltip"
        />

        <ChevronDownIcon
          @click="!reorderDisabled && $emit('moveToEnd')"
          :custom-class="{
            'cursor-pointer text-gray-400 hover:text-primary-400  active:text-primary-500': !reorderDisabled,
            'cursor-default text-gray-200': reorderDisabled,
          }"
          v-tooltip="moveToEndTooltip"
        />
      </div>

      <BurgerIcon
        style="min-width: 22px; width: 22px"
        :custom-class="{
          'handle cursor-move text-gray-400 hover:text-primary-400 active:text-primary-500': !reorderDisabled,
          'text-gray-200 cursor-default': reorderDisabled,
        }"
      />
    </div>
  </div>
</template>

<script>
import ChevronUpIcon from '../icons/ChevronUpIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import BurgerIcon from '../icons/BurgerIcon';
import { canSortResource } from '../mixins/canSortResource';
import { InteractsWithQueryString } from 'laravel-nova-mixins';

export default {
  components: { ChevronUpIcon, ChevronDownIcon, BurgerIcon },

  // mixins: { InteractsWithQueryString },

  props: ['resource', 'viaResourceId', 'relationshipType', 'viaRelationship', 'resourceName'],

  computed: {
    canSeeReorderButtons() {
      return canSortResource(this.resource, this.relationshipType);
    },

    // Returns reason string why reordering is disabled
    reorderDisabled() {
      if (this.resource.sort_not_allowed) {
        return 'notAllowed';
      }

      // if (!!this.resourceRequestQueryString[this.orderByParameter]) {
      //   return 'activeSort';
      // }

      return false;
    },

    orderByParameter() {
      return this.viaRelationship ? this.viaRelationship + '_order' : this.resourceName + '_order';
    },

    reorderDisabledTooltip() {
      return this.reorderDisabled ? this.__(`novaSortable.reorderingDisabledTooltip.${this.reorderDisabled}`) : void 0;
    },

    moveToStartTooltip() {
      return !this.reorderDisabled ? this.__('novaSortable.moveToStart') : void 0;
    },

    moveToEndTooltip() {
      return !this.reorderDisabled ? this.__('novaSortable.moveToEnd') : void 0;
    },
  },
};
</script>
