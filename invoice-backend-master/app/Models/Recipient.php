<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Recipient
 * @package App\Models
 *
 * @property int|null $id
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property DateTime|null $deleted_at
 * @property BelongsTo $user
 * @property string $name
 * @property string $address_first_line
 * @property string $address_second_line
 * @property string $email
 * @property string $country_iso_code
 */
class Recipient extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->created_at;
    }

    public function getUpdatedAt(): DateTime
    {
        return $this->updated_at;
    }

    public function getDeletedAt(): ?DateTime
    {
        return $this->deleted_at;
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

    public function getAddressFirstLine(): string
    {
        return (string)$this->address_first_line;
    }

    public function setAddressFirstLine(string $address_first_line): self
    {
        $this->address_first_line = $address_first_line;
        return $this;
    }

    public function getAddressSecondLine(): string
    {
        return (string)$this->address_second_line;
    }

    public function setAddressSecondLine(string $address_second_line): self
    {
        $this->address_second_line = $address_second_line;
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

    public function getCountryIsoCode(): string
    {
        return $this->country_iso_code;
    }

    public function setCountryIsoCode(string $country_iso_code): self
    {
        $this->country_iso_code = $country_iso_code;
        return $this;
    }

}
