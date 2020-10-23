<?php
/**
 * Prefix: api/me
 * Namespace: App\Controllers\Me
 */

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/', 'Get');
});
