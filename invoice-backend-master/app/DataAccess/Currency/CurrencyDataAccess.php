<?php

declare(strict_types=1);

namespace App\DataAccess\Currency;

use App\DataAccess\AbstractDataAccess;
use App\DataAccess\ResultDataList;
use App\Exceptions\NotFoundException;
use App\Models\Currency;

class CurrencyDataAccess extends AbstractDataAccess
{
    protected static array $cache = [];

    public function getList(): ResultDataList
    {
        $output = new ResultDataList();
        $output->collection = Currency::orderBy('name', 'asc')->get()->collect();
        return $output;
    }

    public function getById(int $id, bool $ignoreCache = false, bool $strict = true): ?Currency
    {
        // Check cache
        if (!$ignoreCache && $this->cacheFetch((string)$id, false)) {
            return $this->cacheFetch((string)$id);
        }

        /** @var Currency|null $currency */
        $currency = Currency::where('id', $id)->first();

        if (!$currency && $strict) {
            throw new NotFoundException("Currency not found");
        }

        // Persist in cache
        if (!$ignoreCache) {
            $this->cacheStore((string)$id, $currency);
        }

        return $currency;
    }
}
