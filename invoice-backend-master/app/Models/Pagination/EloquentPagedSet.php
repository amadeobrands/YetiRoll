<?php

declare(strict_types=1);

namespace App\Models\Pagination;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * Class EloquentPagedSet
 * @package App\Models\Pagination
 *
 * @property PageOffsetPaginationMeta $pagination_meta
 * @property mixed $records
 * @property mixed $formatter
 * @property int $total_records
 */
class EloquentPagedSet extends Model
{
    public static function build($inputSet, PageOffsetPaginationMeta $paginationMeta): EloquentPagedSet
    {
        $set = new self();
        $set->pagination_meta = $paginationMeta;
        $set->total_records = $inputSet->count();
        $set->records = $inputSet
            ->skip(($paginationMeta->getPageNumber() - 1) * $paginationMeta->getNumOnPage())
            ->take($paginationMeta->getNumOnPage())
            ->get();
        return $set;
    }

    public function getPaginationMeta(): PageOffsetPaginationMeta
    {
        return $this->pagination_meta;
    }

    public function getTotalRecords(): int
    {
        return $this->total_records;
    }

    public function setFormatterResource($formatter): self
    {
        $this->formatter = $formatter;
        return $this;
    }

    public function getRecords(): ?Collection
    {
        return $this->records;
    }
}
