<?php

namespace App\Http\Controllers;

use App\DataAccess\ResultDataList;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function createPagedPaginationDataJsonResponse(
        ResultDataList $list,
        $formatter,
        int $httpCode = JsonResponse::HTTP_OK
    ) {
        return response([
            'records' => $formatter::collection($list->collection),
            'pagination' => [
                'page' => $list->page,
                'num_on_page' => $list->numOnPage,
                'total' => $list->total
            ]
        ]);
    }
}
