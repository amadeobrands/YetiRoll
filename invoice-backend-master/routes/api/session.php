<?php
/**
 * Prefix: api/session
 * Namespace: App\Controllers\Session
 */

Route::post('/', 'Create');
Route::post('/refresh', 'Refresh');
Route::delete('/', 'Invalidate');
