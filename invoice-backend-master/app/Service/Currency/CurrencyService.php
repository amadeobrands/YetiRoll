<?php

declare(strict_types=1);

namespace App\Service\Currency;

use App\Exceptions\BadInputException;
use App\Models\Currency;
use App\Service\AbstractService;
use App\Service\Currency\DTO\CurrencyCreateDTO;
use App\Service\Currency\Event\CurrencyCreatedEvent;

class CurrencyService extends AbstractService
{
    public const
        PERMISSION_CREATE = 'currency-create';

    public function create(CurrencyCreateDTO $dto): Currency
    {
        $passport = $dto->getPassport();
        $passport->ensureHasPermission(self::PERMISSION_CREATE);

        // Ensure ISO code is not taken
        $isIsoCodeAvailable = Currency::where('iso', $dto->iso)->count() === 0;
        if (!$isIsoCodeAvailable) {
            throw new BadInputException("This ISO code is already in use");
        }

        // Create currency
        $currency = new Currency();
        $currency
            ->setIso($dto->iso)
            ->setName($dto->name)
            ->setLocalName($dto->localName)
            ->setSymbol($dto->symbol)
            ->setUnitPrecision($dto->unitPrecision);
        $currency->save();

        // Fire event
        event(new CurrencyCreatedEvent($currency));

        return $currency;
    }
}
