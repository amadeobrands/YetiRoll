<?php

declare(strict_types=1);

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    public $timestamps = false;

    // Creation date
    protected DateTime $generatedAt;

    // Type of the token
    private string $tokenType;

    // Token lifetime in seconds
    private int $accessTokenExpiresIn;

    // Access token
    private string $accessToken;

    // Refresh token
    private ?string $refreshToken;

    public function __construct(
        DateTime $generatedAt,
        string $tokenType,
        int $accessTokenExpiresIn,
        string $accessToken,
        ?string $refreshToken = null
    )
    {
        parent::__construct([]);
        $this->generatedAt = $generatedAt;
        $this->tokenType = $tokenType;
        $this->accessTokenExpiresIn = $accessTokenExpiresIn;
        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;
    }

    public function getGeneratedAt(): DateTime
    {
        return $this->generatedAt;
    }

    public function getTokenType(): string
    {
        return $this->tokenType;
    }

    public function getAccessTokenExpiresIn(): int
    {
        return $this->accessTokenExpiresIn;
    }

    public function getAccessToken(): string
    {
        return $this->accessToken;
    }

    public function getRefreshToken(): ?string
    {
        return $this->refreshToken;
    }


}
