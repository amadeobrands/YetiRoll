<?php

declare(strict_types=1);

namespace App\Http\Controllers\InvoiceTemplate\Single\Item\Single;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceTemplateItem\DTO\InvoiceTemplateItemUpdateDTO;
use App\Service\InvoiceTemplateItem\InvoiceTemplateItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Update extends Controller
{

    private AuthService $auth;
    private InvoiceTemplateItemService $invoiceTemplateItem;

    public function __construct(AuthService $auth, InvoiceTemplateItemService $invoiceTemplateItem)
    {
        $this->auth = $auth;
        $this->invoiceTemplateItem = $invoiceTemplateItem;
    }

    public function __invoke(Request $request, $template, $item)
    {
        $dto = InvoiceTemplateItemUpdateDTO::build(array_merge(
            $request->all(),
            [InvoiceTemplateItemUpdateDTO::INVOICE_TEMPLATE_ITEM_ID => (int)$item]
        ))->usePassport($this->auth->getCurrentPassport());

        $item = $this->invoiceTemplateItem->update($dto);

        return response(new Resources\InvoiceTemplateItem\ItemResource($item), JsonResponse::HTTP_OK);
    }
}
