<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class InvoiceTemplate
 * @package App\Models
 *
 * @property int|null $id
 * @property DateTime $created_at
 * @property DateTime $updated_at
 * @property DateTime|null $deleted_at
 * @property string $title
 * @property BelongsTo $user
 * @property BelongsTo $recipient
 * @property BelongsTo $currency
 * @property HasMany $items
 */
class InvoiceTemplate extends Model
{
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

    public function getTitle(): string
    {
        return (string)$this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(Recipient::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceTemplateItem::class);
    }
}
