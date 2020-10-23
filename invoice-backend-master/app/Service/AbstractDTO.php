<?php

declare(strict_types=1);

namespace App\Service;

use App\Exceptions\UnauthorizedException;
use App\Models\Auth\UserPassportInterface;
use Illuminate\Validation\ValidationException;
use Validator;

abstract class AbstractDTO
{
    private ?UserPassportInterface $_passport = null;

    public function usePassport(UserPassportInterface $passport): self
    {
        $this->_passport = $passport;
        return $this;
    }

    public function getPassport(bool $strict = true): ?UserPassportInterface
    {
        if (!$this->_passport && $strict) {
            throw new UnauthorizedException("No auth passport data provided");
        }
        return $this->_passport;
    }

    public static function build(array $input): self
    {
        // Normalize input data
        $raw = static::normalize($input);

        // Determine if validation rules needs to be applied
        $validationRules = static::getValidationRules($raw);
        if ($validationRules) {
            $validator = Validator::make($raw, $validationRules);
            if ($validator->fails()) {
                throw new ValidationException($validator);
            }
        }

        return static::instantiate($raw);
    }

    public static function normalize(array $input): array
    {
        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return null;
    }

    protected static abstract function instantiate(array $input): self;
}
