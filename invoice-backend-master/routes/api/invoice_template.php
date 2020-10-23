<?php
/**
 * Prefix: api/invoice-template
 * Namespace: App\Controllers\InvoiceTemplate
 */

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/', 'GetList')->middleware(['pagination.paged']);;
    Route::post('/', 'Create');

    // Single
    Route::group(['prefix' => '{template}', 'namespace' => 'Single'], function () {
        Route::get('/', 'Get');

        // Item collection
        Route::group(['prefix' => 'item', 'namespace' => 'Item'], function () {
            Route::post('/', 'Create');

            // Single item
            Route::group(['prefix' => '{item}', 'namespace' => 'Single'], function () {
                Route::put('/', 'Update');
                Route::delete('/', 'Delete');
            });
        });
    });
});
