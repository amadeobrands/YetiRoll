<?php

declare(strict_types=1);

namespace App\Http\Controllers\Currency;

use App\DataAccess\Currency\CurrencyDataAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetList extends Controller
{
    public function __invoke(Request $request)
    {
        $list = (new CurrencyDataAccess())->getList();
        return response(Resources\Currency\ItemResource::collection($list->collection), JsonResponse::HTTP_OK);
    }
}
