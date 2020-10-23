<?php

declare(strict_types=1);

namespace App\Service\User\Event;

use App\Models\User;
use Illuminate\Queue\SerializesModels;

class UserCreatedEvent
{
    use SerializesModels;

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
