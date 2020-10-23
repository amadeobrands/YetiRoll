<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice\Single;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Invoice\DTO\InvoiceUpdateDTO;
use App\Service\Invoice\InvoiceService;
use Illuminate\Http\Request;

class Update extends Controller
{

    private AuthService $auth;
    private InvoiceService $invoice;

    public function __construct(AuthService $auth, InvoiceService $invoice)
    {
        $this->auth = $auth;
        $this->invoice = $invoice;
    }

    public function __invoke(Request $request, $invoice)
    {
        $dto = InvoiceUpdateDTO::build(array_merge(
            $request->all(),
            [InvoiceUpdateDTO::INVOICE_ID => (int)$invoice],
        ))->usePassport($this->auth->getCurrentPassport());
        $invoice = $this->invoice->update($dto);

        return response(new Resources\Invoice\ItemResource($invoice));
    }
}
