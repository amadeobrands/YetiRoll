<?php

declare(strict_types=1);

namespace App\Service\User;

use App\Exceptions\BadInputException;
use App\Models\User;
use App\Service\AbstractService;
use App\Service\User\DTO\UserCreateDTO;
use App\Service\User\Event\UserCreatedEvent;

class UserService extends AbstractService
{
    public const
        PERMISSION_CREATE = 'user-create';

    public function create(UserCreateDTO $dto): User
    {
        $passport = $dto->getPassport();
        $passport->ensureHasPermission(self::PERMISSION_CREATE);

        // Check if email already exists
        $isEmailAvailable = User::where('email', $dto->email)->count() === 0;
        if (!$isEmailAvailable) {
            throw new BadInputException("Email is already taken");
        }

        // Create new user
        $user = new User();
        $user
            ->setName($dto->name)
            ->setEmail($dto->email)
            ->setPassword($dto->password);
        $user->save();

        // Fire event
        event(new UserCreatedEvent($user));

        return $user;
    }
}
