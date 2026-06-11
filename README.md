# Nova Sortable

> [!important]
> This package was originally forked from [outl1ne/nova-sortable](https://github.com/outl1ne/nova-sortable). Since we were making many opinionated changes and the owner archived the repository, we decided to continue development in our own version rather than submitting pull requests that might not benefit all users of the original package. You're welcome to use this package, we're actively maintaining it. If you encounter any issues, please don't hesitate to reach out.

[![Latest Version on Packagist](https://img.shields.io/packagist/v/marshmallow/nova-sortable.svg?style=flat-square)](https://packagist.org/packages/marshmallow/nova-sortable)
[![Total Downloads](https://img.shields.io/packagist/dt/marshmallow/nova-sortable.svg?style=flat-square)](https://packagist.org/packages/marshmallow/nova-sortable)

This [Laravel Nova](https://nova.laravel.com) package allows you to reorder models in a Nova resource's index view using drag & drop.

Uses Spatie's [eloquent-sortable](https://github.com/spatie/eloquent-sortable) under the hood.

## Requirements

- `php: >=8.0`
- `laravel/nova: ^4.24.0|^5.0`
- `spatie/eloquent-sortable: ^3.10.0|^4.0`

## Features

- Drag & drop reorder (on either Index view or HasMany view)
- BelongsTo/MorphsTo reorder support w/ pivot tables
- Move to start and end arrows (makes item first/last)
- Everything from [eloquent-sortable](https://github.com/spatie/eloquent-sortable)
- Localization

## Installation

Install the package in a Laravel Nova project via Composer:

```bash
# Install package
composer require marshmallow/nova-sortable
```

## Usage

### Create migration

Add an order field to the model using Laravel migrations:

```php
// Add order column to the model
Schema::table('some_model', function (Blueprint $table) {
  $table->integer('sort_order');
});

// Set default sort order (just copy ID to sort order)
DB::statement('UPDATE some_model SET sort_order = id');
```

### Implement eloquent-sortable

Implement the Spatie's `eloquent-sortable` interface and apply the trait:

```php
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class SomeModel extends Eloquent implements Sortable
{
  use SortableTrait;

  public $sortable = [
    'order_column_name' => 'sort_order',
    'sort_when_creating' => true,
  ];

  ...
}
```

When the model does not have a sortable configuration, the default eloquent-sortable configuration will be used.

### Apply HasSortableRows to Nova resource

Apply `HasSortableRows` trait from this package on the Resource:

```php
use Marshmallow\NovaSortable\Traits\HasSortableRows;

class MyResource extends Resource
{
  use HasSortableRows;

  ...
}
```

NB! This overrides the `indexQuery()` method.

### Disallowing sorting on a per-request/resource basis

You can disable sorting on a per-request or per-resource basis by overriding the `canSort()` on the Resource method like so:

```php
public static function canSort(NovaRequest $request, $resource)
{
  // Do whatever here, ie:
  // return user()->isAdmin();
  // return $resource->id !== 5;
  return true;
}
```

NB! This requires you to disable caching (see below).

### Disabling caching

If you want to disable caching due to using `canSort` or running tests, you can set `sortableCacheEnabled` to false on the resource that has the `HasSortableRows` trait. See the example below:

```php
class Artist extends Resource
{
    use HasSortableRows;

    public static $sortableCacheEnabled = false;
}
```

Or if you want to temporarily disable sortability cache (for tests), you can call `Resource::disableSortabilityCache()` on the resource.

## Custom sortable options

### Nova sorting order

To sort your resource in a different order in Nova, you can set the `nova_order_by` flag to `DESC` (`ASC` by default) in the `$sortable` array.

```php
class SomeModel extends Eloquent implements Sortable
{
  use SortableTrait;

  public $sortable = [
    'order_column_name' => 'sort_order',
    'sort_when_creating' => true,
    'nova_order_by' => 'DESC',
  ];

  ...
}
```

### Hiding the move-to-start/end arrows

By default each sortable row shows arrows to move an item to the start or end of the list. You can hide these arrows on a resource by setting the `$hideArrows` property on the resource that uses `HasSortableRows`:

```php
class Artist extends Resource
{
    use HasSortableRows;

    public static $hideArrows = true;
}
```

### Restricting sorting to specific relationships

You can restrict where a model is sortable using the `only_sort_on` and `dont_sort_on` keys in the `$sortable` array. The value is the `viaResource` key of the parent resource.

Use `only_sort_on` to allow sorting **only** when viewed through a specific relationship:

```php
public $sortable = [
  'order_column_name' => 'sort_order',
  'sort_when_creating' => true,
  'only_sort_on' => 'albums',
];
```

Use `dont_sort_on` to disable sorting on one or more relationships (accepts a string or an array):

```php
public $sortable = [
  'order_column_name' => 'sort_order',
  'sort_when_creating' => true,
  'dont_sort_on' => ['albums', 'playlists'],
];
```

## Sorting on HasMany relationship

**NB!** The resource can only be sorted on **either** the Index view **or** the HasMany list view, but not both!

Sorting on HasMany is simple. Add `'sort_on_has_many' => true` to the `$sortable` array on the model. Like so:

```php
public $sortable = [
  'order_column_name' => 'sort_order',
  'sort_when_creating' => true,
  'sort_on_has_many' => true,
];
```

The sort on has many configuration can be apply in a per model basis or it can be added in the eloquent-sortable configuration for all the models.

```php
return [

    // Spatie sortable configuration

    /**
     * Add sort on has many in all the models.
     **/
    'sort_on_has_many' => true,
];
```

## Sorting on ManyToMany relationships

Sorting on `BelongsToMany` and `MorphToMany` relationships is available through the dedicated `HasSortableManyToManyRows` trait, which disables sorting on the index view and sorts the records on the pivot table instead.

```php
use Marshmallow\NovaSortable\Traits\HasSortableManyToManyRows;

class MyResource extends Resource
{
  use HasSortableManyToManyRows;

  ...
}
```

The order is stored on the pivot table, so make sure the pivot has a sort order column and that the relationship is defined with `->withPivot(...)` and ordered by that column.

## Localization

The translation file(s) can be published by using the following publish command:

```bash
php artisan vendor:publish --provider="Marshmallow\NovaSortable\ToolServiceProvider" --tag="translations"
```

You can add your translations to `resources/lang/vendor/nova-sortable/` by creating a new translations file with the locale name (ie `et.json`) and copying the JSON from the existing `en.json`.

## Other usecases

### Using indexQuery

This package overwrites the `indexQuery` of the Resource and if you still want to use it, you can do it as follows:

```php
use HasSortableRows {
    indexQuery as indexSortableQuery;
}

public static function indexQuery(NovaRequest $request, $query)
{
  // Do whatever with the query
  // ie $query->withCount(['children', 'descendants', 'modules']);
  return parent::indexQuery($request, static::indexSortableQuery($request, $query));
}
```

## Security

If you discover any security related issues, please email security@marshmallow.dev instead of using the issue tracker.

## Credits

- [Marshmallow](https://github.com/marshmallow-packages)
- [Tarvo Reinpalu](https://github.com/Tarpsvo) (original author of [outl1ne/nova-sortable](https://github.com/outl1ne/nova-sortable))
- [All Contributors](https://github.com/marshmallow-packages/nova-sortable/contributors)

## License

Nova Sortable is open-sourced software licensed under the [MIT license](LICENSE.md).
