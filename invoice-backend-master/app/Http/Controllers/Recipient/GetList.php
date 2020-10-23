<?php

declare(strict_types=1);

namespace App\Http\Controllers\Recipient;

use App\DataAccess\DataPagedPagination;
use App\DataAccess\Recipient\RecipientDataAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Models\Pagination\PageOffsetPaginationMeta;
use App\Service\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetList extends Controller
{

    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(Request $request)
    {
        /** @var PageOffsetPaginationMeta $pagination */
        $pagination = $request->pagination ?? new PageOffsetPaginationMeta();

        $list = (new RecipientDataAccess())
            ->usePassport($this->auth->getCurrentPassport())
            ->usePagedPagination(new DataPagedPagination($pagination->getPageNumber(), $pagination->getNumOnPage()))
            ->getList();

        return $this->createPagedPaginationDataJsonResponse(
            $list,
            Resources\Recipient\ListItemResource::class,
            JsonResponse::HTTP_OK
        );
    }
}
