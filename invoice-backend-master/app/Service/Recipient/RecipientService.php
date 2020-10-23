<?php

declare(strict_types=1);

namespace App\Service\Recipient;

use App\DataAccess\Recipient\RecipientDataAccess;
use App\Models\Recipient;
use App\Service\AbstractService;
use App\Service\Recipient\DTO\RecipientCreateDTO;
use App\Service\Recipient\DTO\RecipientUpdateDTO;
use App\Service\Recipient\Event\RecipientCreatedEvent;
use App\Service\Recipient\Event\RecipientUpdatedEvent;

class RecipientService extends AbstractService
{
    public function update(RecipientUpdateDTO $dto): Recipient
    {
        $passport = $dto->getPassport();
        $recipient = (new RecipientDataAccess())->usePassport($passport)->getById($dto->recipientId);
        $recipient
            ->setName($dto->name ?? $recipient->getName())
            ->setEmail($dto->email ?? $recipient->getEmail())
            ->setAddressFirstLine($dto->addressFirstLine ?? $recipient->getAddressFirstLine())
            ->setAddressSecondLine($dto->addressSecondLine ?? $recipient->getAddressSecondLine())
            ->setCountryIsoCode($dto->countryIsoCode ?? $recipient->getCountryIsoCode());
        $recipient->save();

        event(new RecipientUpdatedEvent($recipient));

        return $recipient;
    }

    public function create(RecipientCreateDTO $dto): Recipient
    {
        $passport = $dto->getPassport();

        $recipient = new Recipient();
        $recipient->user()->associate($passport->getUser());
        $recipient
            ->setName($dto->name)
            ->setEmail($dto->email)
            ->setAddressFirstLine($dto->addressFirstLine)
            ->setAddressSecondLine($dto->addressSecondLine)
            ->setCountryIsoCode($dto->countryIsoCode);
        $recipient->save();

        event(new RecipientCreatedEvent($recipient));

        return $recipient;
    }
}
