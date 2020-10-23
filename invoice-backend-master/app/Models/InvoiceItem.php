<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class InvoiceItem
 * @package App\Models
 *
 * @property int|null $id
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property DateTime|null $deleted_at
 * @property BelongsTo $invoice
 * @property string $name
 * @property int $quantity
 * @property double $price_per_unit
 */
class InvoiceItem extends Model
{
    use HasFactory, SoftDeletes;

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

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
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

    public function getQuantity(): int
    {
        return (int)$this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getPricePerUnit(): float
    {
        return (float)$this->price_per_unit;
    }

    public function setPricePerUnit(float $price_per_unit): self
    {
        $this->price_per_unit = $price_per_unit;
        return $this;
    }
}
