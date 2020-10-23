<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;

class Handler extends ExceptionHandler
{
    const
        HTTP_RESPONSE_CODE_KEY = 'type',
        HTTP_RESPONSE_DESCRIPTION_KEY = 'description';

    protected $dontReport = [];

    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        // Laravel: Access denied
        $this->renderable(function (AuthorizationException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'access-denied',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => 'You are not authorized to do this action'
            ], JsonResponse::HTTP_FORBIDDEN);
        });

        // Laravel: Not found
        $this->renderable(function (ModelNotFoundException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'not-found',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => 'One or more of the requested resources is cannot be found'
            ], JsonResponse::HTTP_NOT_FOUND);
        });

        // Generic unauthorized
        $this->renderable(function (UnauthorizedException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'unauthorized',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => 'Incorrect authorization data provided'
            ], JsonResponse::HTTP_UNAUTHORIZED);
        });

        // UserPassport permission requirement is not met
        $this->renderable(function (InsufficientPermissionsException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'insufficient-permissions',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => $e->getMessage()
            ], JsonResponse::HTTP_FORBIDDEN);
        });

        // Not found
        $this->renderable(function (NotFoundException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'not-found',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => $e->getMessage()
            ], JsonResponse::HTTP_NOT_FOUND);
        });

        // Input has correct format, however logically is incorrect
        $this->renderable(function (BadInputException $e) {
            return new JsonResponse([
                self::HTTP_RESPONSE_CODE_KEY => 'bad-input',
                self::HTTP_RESPONSE_DESCRIPTION_KEY => $e->getMessage()
            ], JsonResponse::HTTP_FORBIDDEN);
        });
    }
}
