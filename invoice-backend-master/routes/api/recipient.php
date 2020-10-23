<?php
/**
 * Prefix: api/recipient
 * Namespace: App\Controllers\Recipient
 */

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/', 'GetList')->middleware(['pagination.paged']);;
    Route::post('/', 'Create');

    // Single
    Route::group(['prefix' => '{recipient}', 'namespace' => 'Single'], function () {
        Route::get('/', 'Get');
        Route::put('/', 'Update');
    });
});
