<?php

declare(strict_types=1);

namespace App\Http\Controllers\InvoiceTemplate\Single;

use App\DataAccess\InvoiceTemplate\InvoiceTemplateDataAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Get extends Controller
{

    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(Request $request, $template)
    {
        $model = (new InvoiceTemplateDataAccess())
            ->usePassport($this->auth->getCurrentPassport())
            ->getById((int)$template);
        return response(new Resources\InvoiceTemplate\ItemResource($model), JsonResponse::HTTP_OK);
    }
}
