<?php

declare(strict_types=1);

namespace App\DataAccess;

final class DataPagedPagination
{
    private const
        CONSTRAINT_MIN_PAGE = 1,
        CONSTRAINT_MAX_ON_PAGE = 50;

    private int $page;
    private int $numOnPage;

    public function __construct(
        int $page = self::CONSTRAINT_MIN_PAGE,
        int $numOnPage = self::CONSTRAINT_MAX_ON_PAGE
    )
    {
        $this->page = max($page, self::CONSTRAINT_MIN_PAGE);
        $this->numOnPage = min($numOnPage, self::CONSTRAINT_MAX_ON_PAGE);
    }

    public function getPage(): int
    {
        return (int)$this->page;
    }

    public function getNumOnPage(): int
    {
        return (int)$this->numOnPage;
    }


}
