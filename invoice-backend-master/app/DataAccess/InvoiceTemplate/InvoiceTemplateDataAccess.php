<?php

declare(strict_types=1);

namespace App\DataAccess\InvoiceTemplate;

use App\DataAccess\AbstractDataAccess;
use App\DataAccess\ResultDataList;
use App\Exceptions\NotFoundException;
use App\Models\InvoiceTemplate;

final class InvoiceTemplateDataAccess extends AbstractDataAccess
{
    protected static array $cache = [];

    public function getList(): ResultDataList
    {
        // Get passport
        $passport = $this->getPassportOrThrow();

        // Prepare query builder
        $list = InvoiceTemplate::query();

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

        // Apply filter, if needed
        if ($this->filter) {
            $this->filter->iterate(
                fn($x) => $x === null,
                function ($key, $value) use ($list) {
                    switch ($key) {
                        case InvoiceTemplateListDataFilter::CURRENCY:
                            $list->whereIn('currency_id', $value);
                            break;
                        case InvoiceTemplateListDataFilter::RECIPIENT:
                            $list->whereIn('recipient_id', $value);
                            break;
                    }
                }
            );
        }

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

    public function getById(int $id, bool $ignoreCache = false, bool $strict = true): ?InvoiceTemplate
    {
        // Check cache
        if (!$ignoreCache && $this->cacheFetch((string)$id, false)) {
            return $this->cacheFetch((string)$id);
        }

        // Get passport
        $passport = $this->getPassportOrThrow();

        /** @var InvoiceTemplate|null $invoiceTemplate */
        $invoiceTemplate = InvoiceTemplate::query();

        // TODO: Ideally, there should be an ability to access all invoices for user with elevated permissions
        // Restrict access only to owned invoices
        $invoiceTemplate = $invoiceTemplate->where('user_id', $passport->getUserId());

        // Filter by ID
        $invoiceTemplate = $invoiceTemplate->where('id', $id)->first();

        if (!$invoiceTemplate && $strict) {
            throw new NotFoundException("Invoice not found");
        }

        // Persist in cache
        if (!$ignoreCache) {
            $this->cacheStore((string)$id, $invoiceTemplate);
        }

        return $invoiceTemplate;
    }
}
