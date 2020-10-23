<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Invoice\DTO\InvoiceCreateInstanceFromTemplateDTO;
use App\Service\Invoice\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateFromTemplate extends Controller
{

    private AuthService $auth;
    private InvoiceService $service;

    public function __construct(AuthService $auth, InvoiceService $service)
    {
        $this->auth = $auth;
        $this->service = $service;
    }

    public function __invoke(Request $request, $template)
    {
        $dto = InvoiceCreateInstanceFromTemplateDTO::build([
            InvoiceCreateInstanceFromTemplateDTO::INVOICE_TEMPLATE_ID => (int)$template
        ])->usePassport($this->auth->getCurrentPassport());
        $invoice = $this->service->createInstanceFromTemplate($dto);
        return response(new Resources\Invoice\ItemResource($invoice), JsonResponse::HTTP_CREATED);
    }
}
