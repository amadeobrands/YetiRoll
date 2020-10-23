<?php

namespace App\Console\Commands\Data;

use App\Models\Auth\UserPassport;
use App\Models\Currency;
use App\Models\User;
use App\Service\Currency\CurrencyService;
use App\Service\Currency\DTO\CurrencyCreateDTO;
use Illuminate\Console\Command;

class Fix extends Command
{
    protected $signature = 'data:fix';
    protected $description = 'Ensures data in the database is correct';

    protected const CURRENCIES = [
        'usd' => [
            'name' => 'United States Dollar',
            'local_name' => 'United States Dollar',
            'symbol' => '$',
            'unit_precision' => 2
        ],
        'php' => [
            'name' => 'Philippine Peso',
            'local_name' => 'Philippine Peso',
            'symbol' => '₱',
            'unit_precision' => 2
        ]
    ];

    private CurrencyService $currency;

    public function __construct(CurrencyService $currency)
    {
        parent::__construct();

        $this->currency = $currency;
    }

    public function handle()
    {
        // Currency
        $this->info("Currency");
        $currencyPassport = new UserPassport(new User(), [CurrencyService::PERMISSION_CREATE]);
        foreach (self::CURRENCIES as $iso => $currency) {
            // Check if ISO code exists
            $isIsoCodeExists = Currency::where('iso', $iso)->count() !== 0;
            if ($isIsoCodeExists) {
                $this->line(sprintf("Currency `%s` already exists", $iso));
            } else {
                $dto = CurrencyCreateDTO::build([
                    CurrencyCreateDTO::ISO => $iso,
                    CurrencyCreateDTO::NAME => $currency['name'],
                    CurrencyCreateDTO::LOCAL_NAME => $currency['local_name'],
                    CurrencyCreateDTO::SYMBOL => $currency['symbol'],
                    CurrencyCreateDTO::UNIT_PRECISION => $currency['unit_precision']
                ])->usePassport($currencyPassport);
                $model = $this->currency->create($dto);
                $this->line(sprintf("Currency `%s` created - %d", $iso, $model->getId()));
            }
        }
        return 0;
    }
}
