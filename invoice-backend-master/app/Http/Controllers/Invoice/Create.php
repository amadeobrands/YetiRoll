<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Invoice\DTO\InvoiceCreateDTO;
use App\Service\Invoice\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{

    private AuthService $auth;
    private InvoiceService $invoice;

    public function __construct(AuthService $auth, InvoiceService $invoice)
    {
        $this->auth = $auth;
        $this->invoice = $invoice;
    }

    public function __invoke(Request $request)
    {
        $dto = InvoiceCreateDTO::build($request->all())->usePassport($this->auth->getCurrentPassport());
        $invoice = $this->invoice->create($dto);

        return response(new Resources\Invoice\ItemResource($invoice), JsonResponse::HTTP_CREATED);
    }
}
