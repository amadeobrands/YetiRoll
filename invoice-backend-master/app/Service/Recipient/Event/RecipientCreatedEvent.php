<?php

declare(strict_types=1);

namespace App\Service\Recipient\Event;

use App\Models\Recipient;
use Illuminate\Queue\SerializesModels;

class RecipientCreatedEvent
{
    use SerializesModels;

    public Recipient $recipient;

    public function __construct(Recipient $recipient)
    {
        $this->recipient = $recipient;
    }
}
