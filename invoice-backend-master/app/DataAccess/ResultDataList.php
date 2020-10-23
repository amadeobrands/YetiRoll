<?php

declare(strict_types=1);

namespace App\DataAccess;

use Illuminate\Support\Collection;

final class ResultDataList
{
    public ?Collection $collection = null;
    public int $page = 0;
    public int $numOnPage = 0;
    public int $total = 0;
}
