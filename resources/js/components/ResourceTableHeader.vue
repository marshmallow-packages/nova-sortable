<template>
  <thead class="bg-gray-50 dark:bg-gray-800">
    <tr>
      <!-- Select Checkbox -->
      <th
        class="td-fit mm-uppercase text-xxs text-gray-500 mm-tracking-wide mm-pl-5 mm-pr-2 mm-py-2"
        :class="{
          'mm-border-r border-gray-200 dark:border-gray-600': shouldShowColumnBorders,
        }"
        v-if="shouldShowCheckboxes || canSeeReorderButtons"
      >
        <span v-if="shouldShowCheckboxes" class="mm-sr-only">{{ __('Selected Resources') }}</span>
      </th>

      <th
        v-for="(field, index) in fields"
        :key="field.uniqueKey"
        :class="{
          [`text-${field.textAlign}`]: true,
          'mm-border-r border-gray-200 dark:border-gray-600': shouldShowColumnBorders,
          'mm-px-6': index == 0 && !shouldShowCheckboxes && !canSeeReorderButtons,
          'mm-px-2': index != 0 || shouldShowCheckboxes || canSeeReorderButtons,
          'mm-whitespace-nowrap': !field.wrapping,
        }"
        class="mm-uppercase text-gray-500 text-xxs mm-tracking-wide mm-py-2"
      >
        <SortableIcon
          @sort="requestOrderByChange(field)"
          @reset="resetOrderBy(field)"
          :resource-name="resourceName"
          :uri-key="field.sortableUriKey"
          v-if="sortable && field.sortable"
        >
          {{ field.indexName }}
        </SortableIcon>

        <span v-else>{{ field.indexName }}</span>
      </th>

      <!-- View, Edit, and Delete -->
      <th class="uppercase text-xxs tracking-wide px-2 py-2">
        <span class="sr-only">{{ __('Controls') }}</span>
      </th>
    </tr>
  </thead>
</template>

<script>
import ReordersResources from '../mixins/ReordersResources';

export default {
  name: 'ResourceTableHeader',

  mixins: [ReordersResources],

  emits: ['order', 'reset-order-by'],

  props: {
    resource: Object | null,
    resourceName: String,
    shouldShowColumnBorders: Boolean,
    shouldShowCheckboxes: Boolean,
    fields: {
      type: [Object, Array],
    },
    sortable: Boolean,
  },
  methods: {
    /**
     * Broadcast that the ordering should be updated.
     */
    requestOrderByChange(field) {
      this.$emit('order', field);
    },

    /**
     * Broadcast that the ordering should be reset.
     */
    resetOrderBy(field) {
      this.$emit('reset-order-by', field);
    },
  },
};
</script>
