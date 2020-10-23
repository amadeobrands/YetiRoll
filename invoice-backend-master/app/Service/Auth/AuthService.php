<?php

declare(strict_types=1);

namespace App\Service\Auth;

use App\Exceptions\UnauthorizedException;
use App\Models\Auth\UserPassport;
use App\Models\Auth\UserPassportInterface;
use App\Models\Session;
use App\Models\User;
use App\Service\AbstractService;
use App\Service\Auth\DTO\AuthCreateSessionByEmailAndPasswordDTO;
use App\Service\Auth\DTO\AuthRefreshSessionDTO;
use App\Service\Auth\Event\AuthSessionCreatedByEmailAndPasswordEvent;
use App\Service\Auth\Event\AuthSessionRefreshedEvent;
use App\Service\Time\TimeService;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Request;

class AuthService extends AbstractService
{
    // List of http statuses, which would indicate successful auth
    const OK_HTTP_STATUSES = [200];

    // Authorization endpoint
    const OAUTH_TOKEN_ENDPOINT = '/oauth/token';

    // First party credentials, fetched from config file
    private int $appClientId;
    private string $appClientSecret;

    // Time service
    private TimeService $time;

    public function __construct(TimeService $time)
    {
        $this->time = $time;

        // Fetch app credentials from config
        $this->appClientId = (int)config('auth.oauth_password_client_id');
        $this->appClientSecret = (string)config('auth.oauth_password_client_secret');
    }

    public function getCurrentUser(): ?User
    {
        return Auth::user();
    }

    public function getCurrentPassport(bool $strict = true): ?UserPassportInterface
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            if ($strict) {
                throw new UnauthorizedException("No authorization data provided");
            }
            return null;
        }
        return new UserPassport($user);
    }

    public function refreshSession(AuthRefreshSessionDTO $dto): Session
    {
        // Loopback to oauth endpoint
        $refreshRequest = Request::create(
            self::OAUTH_TOKEN_ENDPOINT,
            'POST',
            [
                'grant_type' => 'refresh_token',
                'client_id' => $this->appClientId,
                'client_secret' => $this->appClientSecret,
                'refresh_token' => $dto->refreshToken
            ]
        );

        // Perform OAuth call
        $refreshResponse = app()->handle($refreshRequest);
        if (!in_array($refreshResponse->status(), self::OK_HTTP_STATUSES)) {
            throw new UnauthorizedException();
        }

        // At this point, session is refreshed
        $refreshResponseContent = json_decode($refreshResponse->getContent());
        $session = new Session(
            $this->time->now(),
            $refreshResponseContent->token_type,
            $refreshResponseContent->expires_in,
            $refreshResponseContent->access_token,
            $refreshResponseContent->refresh_token ?? null
        );

        event(new AuthSessionRefreshedEvent($session));

        return $session;
    }

    public function createSessionByEmailAndPassport(AuthCreateSessionByEmailAndPasswordDTO $dto): Session
    {
        // Loopback to oauth endpoint to get token
        $authRequest = Request::create(
            self::OAUTH_TOKEN_ENDPOINT,
            'POST',
            [
                'grant_type' => 'password',
                'client_id' => $this->appClientId,
                'client_secret' => $this->appClientSecret,
                'username' => $dto->email,
                'password' => $dto->password
            ]
        );

        // Perform OAuth call
        $authResponse = app()->handle($authRequest);
        if (!in_array($authResponse->status(), self::OK_HTTP_STATUSES)) {
            throw new UnauthorizedException("Failed to authorized, using credentials provided");
        }

        // At this point auth is successful
        $authResponseContent = json_decode($authResponse->getContent());
        $session = new Session(
            $this->time->now(),
            $authResponseContent->token_type,
            $authResponseContent->expires_in,
            $authResponseContent->access_token,
            $authResponseContent->refresh_token ?? null
        );

        event(new AuthSessionCreatedByEmailAndPasswordEvent($session));

        return $session;
    }

}
