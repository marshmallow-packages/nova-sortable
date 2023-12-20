<template>
  <div class="mm-flex mm-items-center">
    <slot></slot>
    <div class="mm-flex mm-items-center mm-ml-4" v-tooltip="reorderDisabledTooltip" v-if="canSeeReorderButtons">
      <div class="mm-flex mm-flex-col">
        <ChevronUpIcon
          @click.stop="!reorderDisabled && $emit('moveToStart')"
          :custom-class="{
            'mm-cursor-pointer text-gray-400 hover:text-primary-400 active:text-primary-500': !reorderDisabled,
            'mm-cursor-default text-gray-200 dark:text-gray-600': reorderDisabled,
          }"
          v-tooltip="moveToStartTooltip"
        />

        <ChevronDownIcon
          @click.stop="!reorderDisabled && $emit('moveToEnd')"
          :custom-class="{
            'mm-cursor-pointer text-gray-400 hover:text-primary-400  active:text-primary-500': !reorderDisabled,
            'mm-cursor-default text-gray-200 dark:text-gray-600': reorderDisabled,
          }"
          v-tooltip="moveToEndTooltip"
        />
      </div>

      <BurgerIcon
        style="min-width: 22px; width: 22px"
        :custom-class="{
          'handle mm-cursor-move text-gray-400 hover:text-primary-400 active:text-primary-500': !reorderDisabled,
          'mm-cursor-default text-gray-200 dark:text-gray-600': reorderDisabled,
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
  mixins: [InteractsWithQueryString],

  props: ['resource', 'viaResourceId', 'relationshipType', 'viaRelationship', 'resourceName'],

  inject: ['orderByParameter', 'orderByDirectionParameter'],

  mounted() {
    Nova.$on('resource-ordered-reset', field => this.resetOrderBy(field));
    Nova.$on('resource-ordered-changed', field => this.changedOrderBy(field));
  },

  methods: {
    changedOrderBy(field) {
      this.sortableUriKey = field.sortableUriKey;
    },

    /**
     * Reset the order by to its default ordered state
     */
    resetOrderBy(field) {
      this.sortableUriKey = field.sortableUriKey;

      this.updateQueryString({
        [this.orderByParameter]: null,
        [this.orderByDirectionParameter]: null,
      });
    },
  },

  computed: {
    canSeeReorderButtons() {
      return canSortResource(this.resource, this.relationshipType);
    },

    // Returns reason string why reordering is disabled
    reorderDisabled() {
      if (this.resource.sort_not_allowed) {
        return 'notAllowed';
      }

      if (this.hasDirection || this.isSorted) {
        return 'activeSort';
      }

      return false;
    },

    uriKey() {
      return this.sortableUriKey ?? this.routeParameters[this.sortKey];
    },

    /**
     * The current route parameters
     */
    routeParameters() {
      const searchParams = new URLSearchParams(window.location.search);
      return Object.fromEntries(searchParams.entries());
    },

    /**
     * The name of the sortable resource
     */
    resourceKey() {
      return this.viaRelationship ? this.viaRelationship : this.resourceName;
    },

    /**
     * The current order query parameter for this resource
     */
    sortKey() {
      return this.orderByParameter;
    },

    /**
     * The current order query parameter value
     */
    sortColumn() {
      return this.queryStringParams[this.sortKey];
    },

    /**
     * The current direction query parameter for this resource
     */
    directionKey() {
      return this.orderByDirectionParameter;
    },

    /**
     * The current direction query parameter value
     */
    direction() {
      return this.queryStringParams[this.directionKey];
    },

    /**
     * Check if there is a current direction
     */
    hasDirection() {
      return ['asc', 'desc'].includes(this.direction);
    },

    /**
     * Determine whether this column is being sorted
     */
    isSorted() {
      return this.sortColumn == this.uriKey && this.hasDirection;
    },

    /**
     * The content of the reorderDisabledTooltip
     */
    reorderDisabledTooltip() {
      return this.reorderDisabled ? this.__(`novaSortable.reorderingDisabledTooltip.${this.reorderDisabled}`) : void 0;
    },

    /**
     * The content of the moveToStartTooltip
     */
    moveToStartTooltip() {
      return !this.reorderDisabled ? this.__('novaSortable.moveToStart') : void 0;
    },

    /**
     * The content of the moveToEndTooltip
     */
    moveToEndTooltip() {
      return !this.reorderDisabled ? this.__('novaSortable.moveToEnd') : void 0;
    },
  },
};
</script>
