<?php

declare(strict_types=1);

namespace App\DataAccess;

use App\Exceptions\UnauthorizedException;
use App\Models\Auth\UserPassportInterface;

abstract class AbstractDataAccess
{
    // Data fetched during single run
    protected static array $cache = [];

    // User passport
    private ?UserPassportInterface $passport = null;

    // Applied filtering
    protected ?ListDataFilterInterface $filter = null;

    // Applied eager fetch
    protected ?array $eagerFetch = [];

    // Applied paged pagination
    protected ?DataPagedPagination $pagedPagination = null;

    public function useFilter(ListDataFilterInterface $filter): self
    {
        $this->filter = $filter;
        return $this;
    }

    public function usePagedPagination(DataPagedPagination $pagedPagination): self
    {
        $this->pagedPagination = $pagedPagination;
        return $this;
    }

    public function useEagerFetch(array $fields): self
    {
        $this->eagerFetch = $fields;
        return $this;
    }

    public function usePassport(UserPassportInterface $passport): self
    {
        $this->passport = $passport;
        return $this;
    }

    public function getPassportOrThrow(): UserPassportInterface
    {
        if ($this->passport === null) {
            throw new UnauthorizedException("No authentication data provided for data access");
        }
        return $this->passport;
    }

    protected function cacheStore(string $key, $value): self
    {
        static::$cache[$key] = $value;
        return $this;
    }

    protected function cacheFetch(string $key, $default = null)
    {
        return static::$cache[$key] ?? $default;
    }

    protected function cacheClean()
    {
        static::$cache = [];
    }
}
