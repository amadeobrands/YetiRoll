<?php

declare(strict_types=1);

namespace App\DataAccess;

abstract class AbstractListDataFilter implements ListDataFilterInterface
{
    protected array $values = [];
    protected array $setters = [];

    public function __construct(array $values = [])
    {
        $this->init();
        foreach ($values as $key => $value) {
            $this->setValue($key, $value);
        }
    }

    protected abstract function init(): void;

    public function iterate(callable $skip, callable $handler): void
    {
        foreach ($this->values as $key => $value) {
            if ($skip($value)) continue;
            $handler($key, $value);
        }
    }

    public function getValue(string $key, $default = null)
    {
        return $this->values[$key] ?? $default;
    }

    public function setValue(string $key, $value): void
    {
        if (isset($this->setters[$key])) {
            $this->values[$key] = $this->setters[$key]($value);
        }
    }

    protected function registerValueSetter(string $key, callable $setter): void
    {
        $this->setters[$key] = $setter;
    }

    protected function toArrayOfInts($value): array
    {
        return is_array($value) ? array_map(fn($x) => (int)$x, $value) : [(int)$value];
    }
}
