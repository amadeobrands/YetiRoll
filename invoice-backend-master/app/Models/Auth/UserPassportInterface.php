<?php

declare(strict_types=1);

namespace App\Models\Auth;

use App\Models\User;

interface UserPassportInterface
{
    public function getUser(): User;

    public function getUserId(): int;

    public function hasPermission(string $permission): bool;

    public function ensureHasPermission(string $permission): void;

    public function addOneTimePermission(string $permission): void;
}
