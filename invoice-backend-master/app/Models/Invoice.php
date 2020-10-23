<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Invoice
 * @package App\Models
 *
 * @property int|null $id
 * @property DateTime|null $created_at
 * @property DateTime|null $updated_at
 * @property DateTime|null $deleted_at
 * @property DateTime|null $finalized_at
 * @property BelongsTo $user
 * @property string $title
 * @property BelongsTo $currency
 * @property string $local_id
 * @property DateTime|null $due_date
 * @property string $author_name
 * @property string $author_address_first_line
 * @property string $author_address_second_line
 * @property string $author_country_iso_code
 * @property string $recipient_name
 * @property string $recipient_address_first_line
 * @property string $recipient_address_second_line
 * @property string $recipient_country_iso_code
 * @property string $note
 * @property string $terms
 * @property int $tax_percent
 * @property HasMany $items
 */
class Invoice extends Model
{

    use HasFactory, SoftDeletes;

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'finalized_at' => 'datetime',
        'due_date' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function getId(): ?int
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

    public function getDeletedAt(): ?DateTime
    {
        return $this->deleted_at;
    }

    public function getFinalizedAt(): ?DateTime
    {
        return $this->finalized_at;
    }

    public function setFinalizedAt(?DateTime $finalized_at): self
    {
        $this->finalized_at = $finalized_at;
        return $this;
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

    public function getLocalId(): string
    {
        return (string)$this->local_id;
    }

    public function setLocalId(string $local_id): self
    {
        $this->local_id = $local_id;
        return $this;
    }

    public function getDueDate(): ?DateTime
    {
        return $this->due_date;
    }

    public function setDueDate(?DateTime $due_date): self
    {
        $this->due_date = $due_date;
        return $this;
    }

    public function getAuthorName(): string
    {
        return (string)$this->author_name;
    }

    public function setAuthorName(string $author_name): self
    {
        $this->author_name = $author_name;
        return $this;
    }

    public function getAuthorAddressFirstLine(): string
    {
        return (string)$this->author_address_first_line;
    }

    public function setAuthorAddressFirstLine(string $author_address_first_line): self
    {
        $this->author_address_first_line = $author_address_first_line;
        return $this;
    }

    public function getAuthorAddressSecondLine(): string
    {
        return (string)$this->author_address_second_line;
    }

    public function setAuthorAddressSecondLine(string $author_address_second_line): self
    {
        $this->author_address_second_line = $author_address_second_line;
        return $this;
    }

    public function getAuthorCountryIsoCode(): string
    {
        return (string)$this->author_country_iso_code;
    }

    public function setAuthorCountryIsoCode(string $author_country_iso_code): self
    {
        $this->author_country_iso_code = $author_country_iso_code;
        return $this;
    }

    public function getRecipientName(): string
    {
        return (string)$this->recipient_name;
    }

    public function setRecipientName(string $recipient_name): self
    {
        $this->recipient_name = $recipient_name;
        return $this;
    }

    public function getRecipientAddressFirstLine(): string
    {
        return (string)$this->recipient_address_first_line;
    }

    public function setRecipientAddressFirstLine(string $recipient_address_first_line): self
    {
        $this->recipient_address_first_line = $recipient_address_first_line;
        return $this;
    }

    public function getRecipientAddressSecondLine(): string
    {
        return (string)$this->recipient_address_second_line;
    }

    public function setRecipientAddressSecondLine(string $recipient_address_second_line): self
    {
        $this->recipient_address_second_line = $recipient_address_second_line;
        return $this;
    }

    public function getRecipientCountryIsoCode(): string
    {
        return (string)$this->recipient_country_iso_code;
    }

    public function setRecipientCountryIsoCode(string $recipient_country_iso_code): self
    {
        $this->recipient_country_iso_code = $recipient_country_iso_code;
        return $this;
    }

    public function getNote(): string
    {
        return (string)$this->note;
    }

    public function setNote(string $note): self
    {
        $this->note = $note;
        return $this;
    }

    public function getTerms(): string
    {
        return (string)$this->terms;
    }

    public function setTerms(string $terms): self
    {
        $this->terms = $terms;
        return $this;
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
