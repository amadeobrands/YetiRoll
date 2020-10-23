<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice\Single\Item\Single;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceItem\DTO\InvoiceItemUpdateDTO;
use App\Service\InvoiceItem\InvoiceItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Update extends Controller
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
        $dto = InvoiceItemUpdateDTO::build(array_merge(
            $request->all(),
            [InvoiceItemUpdateDTO::INVOICE_ITEM_ID => (int)$item]
        ))->usePassport($this->auth->getCurrentPassport());

        $item = $this->invoiceItem->update($dto);

        return response(new Resources\InvoiceItem\ItemResource($item), JsonResponse::HTTP_OK);
    }
}
