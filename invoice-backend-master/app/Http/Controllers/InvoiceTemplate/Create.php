<?php

declare(strict_types=1);

namespace App\Http\Controllers\InvoiceTemplate;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceTemplate\DTO\InvoiceTemplateCreateDTO;
use App\Service\InvoiceTemplate\InvoiceTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{

    private AuthService $auth;
    private InvoiceTemplateService $invoiceTemplate;

    public function __construct(AuthService $auth, InvoiceTemplateService $invoiceTemplate)
    {
        $this->auth = $auth;
        $this->invoiceTemplate = $invoiceTemplate;
    }

    public function __invoke(Request $request)
    {
        $dto = InvoiceTemplateCreateDTO::build($request->all())->usePassport($this->auth->getCurrentPassport());
        $template = $this->invoiceTemplate->create($dto);
        return response(new Resources\InvoiceTemplate\ItemResource($template), JsonResponse::HTTP_CREATED);
    }
}
