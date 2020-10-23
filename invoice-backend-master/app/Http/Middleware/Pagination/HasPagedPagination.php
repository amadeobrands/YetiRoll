<?php

declare(strict_types=1);

namespace App\Http\Middleware\Pagination;

use App\Models\Pagination\PageOffsetPaginationMeta;
use Closure;

class HasPagedPagination
{
    const MAX_NUM_ON_PAGE = 50;
    const MIN_PAGE = 1;

    public function handle($request, Closure $next)
    {
        $numOnPage = (int)$request->get('num_on_page', self::MAX_NUM_ON_PAGE);
        $page = (int)$request->get('page', self::MIN_PAGE);
        $paginationMeta = new PageOffsetPaginationMeta($page, $numOnPage);
        $paginationMeta->applyConstraints(self::MIN_PAGE, self::MAX_NUM_ON_PAGE);

        $requestAsArray = $request->all();
        $requestAsArray['pagination'] = $paginationMeta;
        $request->replace($requestAsArray);

        return $next($request);
    }
}
