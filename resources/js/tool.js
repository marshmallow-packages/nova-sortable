// import ResourceTable from './components/ResourceTable';
// import ResourceTableRow from './components/ResourceTableRow';
// import ReorderButtons from './components/ReorderButtons';

// Nova.booting((app, router, store) => {
//   app.component('resource-table', ResourceTable);
//   app.component('resource-table-row', ResourceTableRow);
//   app.component('reorder-buttons', ReorderButtons);
// });

const Vue = require('@vue/compat/dist/vue.cjs.prod');

Nova.booting(Vue => {
  Vue.component('ResourceTable', require('./components/ResourceTable').default);
  Vue.component('ResourceTableRow', require('./components/ResourceTableRow').default);
  Vue.component('ReorderButtons', require('./components/ReorderButtons').default);
});
