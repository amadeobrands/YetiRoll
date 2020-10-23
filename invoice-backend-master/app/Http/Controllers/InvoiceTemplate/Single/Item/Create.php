<?php

declare(strict_types=1);

namespace App\Http\Controllers\InvoiceTemplate\Single\Item;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\InvoiceTemplateItem\DTO\InvoiceTemplateItemCreateDTO;
use App\Service\InvoiceTemplateItem\InvoiceTemplateItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{

    private AuthService $auth;
    private InvoiceTemplateItemService $invoiceTemplateItem;

    public function __construct(AuthService $auth, InvoiceTemplateItemService $invoiceTemplateItem)
    {
        $this->auth = $auth;
        $this->invoiceTemplateItem = $invoiceTemplateItem;
    }

    public function __invoke(Request $request, $template)
    {
        $dto = InvoiceTemplateItemCreateDTO::build(array_merge(
            $request->all(),
            [InvoiceTemplateItemCreateDTO::INVOICE_TEMPLATE_ID => (int)$template]
        ))->usePassport($this->auth->getCurrentPassport());
        $item = $this->invoiceTemplateItem->create($dto);

        return response(new Resources\InvoiceTemplateItem\ItemResource($item), JsonResponse::HTTP_CREATED);
    }
}
