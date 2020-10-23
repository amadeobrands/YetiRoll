<?php
/**
 * Prefix: api/invoice
 * Namespace: App\Controllers\Invoice
 */

Route::group(['middleware' => ['auth:api']], function () {
    Route::post('/from-template/{template}', 'CreateFromTemplate');
    Route::get('/', 'GetList')->middleware(['pagination.paged']);
    Route::post('/', 'Create');

    // Single
    Route::group(['prefix' => '{invoice}', 'namespace' => 'Single'], function () {
        Route::get('/', 'Get');
        Route::put('/', 'Update');

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
