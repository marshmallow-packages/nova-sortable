<template>
  <thead class="bg-gray-50 dark:bg-gray-800">
    <tr>
      <!-- Select Checkbox -->
      <th
        class="w-[1%] white-space-nowrap uppercase text-xxs text-gray-500 tracking-wide pl-5 pr-2 py-2"
        :class="{
          'border-r border-gray-200 dark:border-gray-600': shouldShowColumnBorders,
        }"
        v-if="shouldShowCheckboxes || canSeeReorderButtons"
      >
        <span class="sr-only">{{ __('Selected Resources') }}</span>
      </th>

      <!-- Field Names -->
      <th
        v-for="(field, index) in fields"
        :key="field.uniqueKey"
        :class="{
          [`text-${field.textAlign}`]: true,
          'border-r border-gray-200 dark:border-gray-600': shouldShowColumnBorders,
          'px-6': index == 0 && !shouldShowCheckboxes && !canSeeReorderButtons,
          'px-2': index != 0 || shouldShowCheckboxes || canSeeReorderButtons,
          'whitespace-nowrap': !field.wrapping,
        }"
        class="py-2 tracking-wide text-gray-500 uppercase text-xxs"
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
      <th class="px-2 py-2 tracking-wide uppercase text-xxs">
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
