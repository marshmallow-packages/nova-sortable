<?php

namespace Marshmallow\NovaSortable\Traits;

trait HasSortableManyToManyRows
{
    use HasSortableRows;

    public $disableSortOnIndex = true;
}
