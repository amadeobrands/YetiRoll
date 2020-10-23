<?php

declare(strict_types=1);

namespace App\Http\Controllers\Invoice\Single;

use App\DataAccess\Invoice\InvoiceDataAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use Illuminate\Http\Request;

class Get extends Controller
{

    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(Request $request, $invoice)
    {
        $invoice = (new InvoiceDataAccess())
            ->usePassport($this->auth->getCurrentPassport())
            ->getById((int)$invoice);
        return response(new Resources\Invoice\ItemResource($invoice));
    }
}
