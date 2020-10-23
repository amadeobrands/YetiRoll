<?php

declare(strict_types=1);

namespace App\DataAccess\Recipient;

use App\DataAccess\AbstractDataAccess;
use App\DataAccess\ResultDataList;
use App\Exceptions\NotFoundException;
use App\Models\Recipient;

class RecipientDataAccess extends AbstractDataAccess
{
    protected static array $cache = [];

    public function getList(): ResultDataList
    {
        // Get passport
        $passport = $this->getPassportOrThrow();

        // Prepare query builder
        $list = Recipient::query();

        // Apply eager fetch
        if ($this->eagerFetch) {
            $list = $list->with($this->eagerFetch);
        }

        // Fetch only owned invoices
        $list = $list->where('user_id', $passport->getUserId());

        // Apply ordering (desc: id)
        $list = $list->orderBy('id', 'desc');

        // Prepare output
        $output = new ResultDataList();

        // Apply pagination
        if ($this->pagedPagination) {
            $output->numOnPage = $this->pagedPagination->getNumOnPage();
            $output->page = $this->pagedPagination->getPage();
            $output->total = (clone $list)->count();
            $list = $list
                ->skip(($this->pagedPagination->getPage() - 1) * $this->pagedPagination->getNumOnPage())
                ->take($this->pagedPagination->getNumOnPage());
        }

        // Fetch
        $output->collection = $list->get()->collect();

        return $output;
    }

    public function getById(int $id, bool $ignoreCache = false, bool $strict = true): ?Recipient
    {
        // Check cache
        if (!$ignoreCache && $this->cacheFetch((string)$id, false)) {
            return $this->cacheFetch((string)$id);
        }

        // Get passport
        $passport = $this->getPassportOrThrow();

        /** @var Recipient|null $recipient */
        $recipient = Recipient::query();

        // TODO: Ideally, there should be an ability to access all invoices for user with elevated permissions
        // Restrict access only to owned invoices
        $recipient = $recipient->where('user_id', $passport->getUserId());

        // Filter by ID
        $recipient = $recipient->where('id', $id)->first();

        if (!$recipient && $strict) {
            throw new NotFoundException("Recipient not found");
        }

        // Persist in cache
        if (!$ignoreCache) {
            $this->cacheStore((string)$id, $recipient);
        }

        return $recipient;
    }
}
