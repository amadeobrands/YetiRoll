<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice\Single\Item;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceItem\DTO\InvoiceItemCreateDTO;
use App\Service\InvoiceItem\InvoiceItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{

    private AuthService $auth;
    private InvoiceItemService $invoiceItem;

    public function __construct(AuthService $auth, InvoiceItemService $invoiceItem)
    {
        $this->auth = $auth;
        $this->invoiceItem = $invoiceItem;
    }

    public function __invoke(Request $request, $invoice)
    {
        $dto = InvoiceItemCreateDTO::build(array_merge(
            $request->all(),
            [InvoiceItemCreateDTO::INVOICE_ID => (int)$invoice]
        ))->usePassport($this->auth->getCurrentPassport());
        $item = $this->invoiceItem->create($dto);

        return response(new Resources\InvoiceItem\ItemResource($item), JsonResponse::HTTP_CREATED);
    }
}
