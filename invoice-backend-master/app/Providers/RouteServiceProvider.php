<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/home';

    protected const
        ROUTE_BASE_FILE_PATH = 'routes/api/',
        ROUTE_BASE_NAMESPACE = 'App\Http\Controllers\\',
        ROUTE_MODULE_PREFIX_KEY = 'prefix',
        ROUTE_MODULE_ROUTE_FILE_KEY = 'route_file';

    protected const API_MODULES = [
        'Dev' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'dev',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'dev.php'
        ],
        'Me' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'me',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'me.php'
        ],
        'Currency' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'currency',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'currency.php'
        ],
        'Session' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'session',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'session.php'
        ],
        'Invoice' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'invoice',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'invoice.php'
        ],
        'Recipient' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'recipient',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'recipient.php'
        ],
        'InvoiceTemplate' => [
            self::ROUTE_MODULE_PREFIX_KEY => 'invoice-template',
            self::ROUTE_MODULE_ROUTE_FILE_KEY => 'invoice_template.php'
        ]
    ];

    public function boot()
    {
        parent::boot();
        $this->configureRateLimiting();

        // Register all API routes
        foreach (self::API_MODULES as $namespace => $properties) {
            Route::prefix(sprintf('api/%s', $properties[self::ROUTE_MODULE_PREFIX_KEY]))
                ->namespace(self::ROUTE_BASE_NAMESPACE . $namespace)
                ->group(base_path(self::ROUTE_BASE_FILE_PATH . $properties[self::ROUTE_MODULE_ROUTE_FILE_KEY]));
        }
    }

    protected function configureRateLimiting()
    {
//        RateLimiter::for('api', function (Request $request) {
//            return Limit::perMinute(60);
//        });
    }
}
