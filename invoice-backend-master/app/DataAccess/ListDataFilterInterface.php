<?php

declare(strict_types=1);

namespace App\DataAccess;

interface ListDataFilterInterface
{
    public function iterate(callable $skip, callable $handler): void;
}
