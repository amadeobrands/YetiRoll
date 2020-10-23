<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Currency
 * @package App\Models
 *
 * @property int|null $id
 * @property string $iso
 * @property string $name
 * @property string $local_name
 * @property string $symbol
 * @property int $unit_precision
 */
class Currency extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIso(): string
    {
        return (string)$this->iso;
    }

    public function setIso(string $iso): self
    {
        $this->iso = $iso;
        return $this;
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

    public function getLocalName(): string
    {
        return (string)$this->local_name;
    }

    public function setLocalName(string $localName): self
    {
        $this->local_name = $localName;
        return $this;
    }

    public function getSymbol(): string
    {
        return (string)$this->symbol;
    }

    public function setSymbol(string $symbol): self
    {
        $this->symbol = $symbol;
        return $this;
    }

    public function getUnitPrecision(): int
    {
        return (int)$this->unit_precision;
    }

    public function setUnitPrecision(int $unitPrecision): self
    {
        $this->unit_precision = $unitPrecision;
        return $this;
    }
}
