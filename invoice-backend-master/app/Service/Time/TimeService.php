<?php

declare(strict_types=1);

namespace App\Service\Time;

use App\Service\AbstractService;
use DateTime;

class TimeService extends AbstractService
{
    private DateTime $now;

    public function __construct(?DateTime $now = null)
    {
        $this->now = $now ?? new DateTime();
    }

    public function now(): DateTime
    {
        return clone $this->now;
    }
}
