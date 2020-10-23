<?php

declare(strict_types=1);

namespace App\Service\Auth\Event;

use App\Models\Session;
use Illuminate\Queue\SerializesModels;

class AuthSessionCreatedByEmailAndPasswordEvent
{
    use SerializesModels;

    public Session $session;

    public function __construct(Session $session)
    {
        $this->session = $session;
    }
}
