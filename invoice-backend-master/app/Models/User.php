<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\HasApiTokens;

/**
 * Class User
 * @package App\Models
 *
 * @property int $id
 * @property DateTime|null $created_at
 * @property DateTime|null $updated_at
 * @property string $name
 * @property string $email
 * @property string $password
 * @property int $role
 * @property array $permissions
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'permissions' => 'array'
    ];

    public function getId(): int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?DateTime
    {
        return $this->created_at;
    }

    public function getUpdatedAt(): ?DateTime
    {
        return $this->updated_at;
    }

    public function getName(): string
    {
        return (string)$this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getEmail(): string
    {
        return (string)$this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return (string)$this->password;
    }

    public function setPassword(string $password, bool $rawInput = true): self
    {
        $this->password = $rawInput ? Hash::make($password) : $password;
        return $this;
    }

    public function getRole(): int
    {
        return (int)$this->role;
    }

    public function setRole(int $role): self
    {
        $this->role = $role;
        return $this;
    }

    public function getPermissions(): array
    {
        return $this->permissions ?? [];
    }

    public function setPermissions(array $permissions): self
    {
        $this->permissions = $permissions;
        return $this;
    }


}
