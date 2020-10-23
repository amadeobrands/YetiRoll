<?php

declare(strict_types=1);

namespace App\Models\Pagination;

class PageOffsetPaginationMeta
{
    /** @var int Requested page number */
    private int $pageNumber = 1;

    /** @var int Requested amount of items on page */
    private int $numOnPage = 6;


    public function applyConstraints(
        int $minPageNumber = 1,
        int $maxNumOnPage = 6
    ): self
    {
        $this->pageNumber = max($this->pageNumber, $minPageNumber);
        $this->numOnPage = min($this->numOnPage, $maxNumOnPage);
        return $this;
    }

    public function __construct(int $pageNumber = 1, int $numOnPage = 6)
    {
        $this->pageNumber = $pageNumber;
        $this->numOnPage = $numOnPage;
    }

    public function getPageNumber(): int
    {
        return $this->pageNumber;
    }

    public function getNumOnPage(): int
    {
        return $this->numOnPage;
    }

}

