<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice\Single\Item\Single;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceItem\DTO\InvoiceItemDeleteDTO;
use App\Service\InvoiceItem\InvoiceItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Delete extends Controller
{

    private AuthService $auth;
    private InvoiceItemService $invoiceItem;

    public function __construct(AuthService $auth, InvoiceItemService $invoiceItem)
    {
        $this->auth = $auth;
        $this->invoiceItem = $invoiceItem;
    }

    public function __invoke(Request $request, $invoice, $item)
    {
        $dto = InvoiceItemDeleteDTO::build([
            InvoiceItemDeleteDTO::INVOICE_ITEM_ID => (int)$item
        ])->usePassport($this->auth->getCurrentPassport());
        $isDeleted = $this->invoiceItem->delete($dto);

        return response(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
