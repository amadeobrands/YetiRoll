<?php

declare(strict_types=1);

namespace App\Models\Auth;

use App\Exceptions\InsufficientPermissionsException;
use App\Models\User;

final class UserPassport implements UserPassportInterface
{
    private User $user;
    private array $permissions;

    public function __construct(User $user, array $permissions = [])
    {
        $this->user = $user;
        $this->permissions = $permissions;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getUserId(): int
    {
        return $this->user->getId();
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions);
    }

    public function ensureHasPermission(string $permission): void
    {
        if (!$this->hasPermission($permission)) {
            throw new InsufficientPermissionsException("No permission to perform this action");
        }
    }

    public function addOneTimePermission(string $permission): void
    {
        $this->permissions[] = $permission;
    }

}
