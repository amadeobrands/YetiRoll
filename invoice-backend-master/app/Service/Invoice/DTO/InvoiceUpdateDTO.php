<?php

declare(strict_types=1);

namespace App\Service\Invoice\DTO;

use App\Service\AbstractDTO;
use DateTime;

final class InvoiceUpdateDTO extends AbstractDTO
{

    // Properties
    public int $invoiceId;
    public ?string $title;
    public ?string $localId;
    public ?DateTime $dueDate;
    public ?string $authorName;
    public ?string $authorAddressFirstLine;
    public ?string $authorAddressSecondLine;
    public ?string $authorCountryIsoCode;
    public ?string $recipientName;
    public ?string $recipientAddressFirstLine;
    public ?string $recipientAddressSecondLine;
    public ?string $recipientCountryIsoCode;
    public ?string $note;
    public ?string $terms;


    // Array field
    public const
        INVOICE_ID = 'invoice_id',
        TITLE = 'title',
        LOCAL_ID = 'local_id',
        DUE_DATE = 'due_date',
        AUTHOR_NAME = 'author_name',
        AUTHOR_ADDRESS_FIRST_LINE = 'author_address_first_line',
        AUTHOR_ADDRESS_SECOND_LINE = 'author_address_second_line',
        AUTHOR_COUNTRY_ISO_CODE = 'author_country_iso_code',
        RECIPIENT_NAME = 'recipient_name',
        RECIPIENT_ADDRESS_FIRST_LINE = 'recipient_address_first_line',
        RECIPIENT_ADDRESS_SECOND_LINE = 'recipient_address_second_line',
        RECIPIENT_COUNTRY_ISO_CODE = 'recipient_country_iso_code',
        NOTE = 'note',
        TERMS = 'terms';

    public function __construct(
        int $invoiceId,
        ?string $title = null,
        ?string $localId = null,
        ?DateTime $dueDate = null,
        ?string $authorName = null,
        ?string $authorAddressFirstLine = null,
        ?string $authorAddressSecondLine = null,
        ?string $authorCountryIsoCode = null,
        ?string $recipientName = null,
        ?string $recipientAddressFirstLine = null,
        ?string $recipientAddressSecondLine = null,
        ?string $recipientCountryIsoCode = null,
        ?string $note = null,
        ?string $terms = null
    )
    {
        $this->invoiceId = $invoiceId;
        $this->title = $title;
        $this->localId = $localId;
        $this->dueDate = $dueDate;
        $this->authorName = $authorName;
        $this->authorAddressFirstLine = $authorAddressFirstLine;
        $this->authorAddressSecondLine = $authorAddressSecondLine;
        $this->authorCountryIsoCode = $authorCountryIsoCode;
        $this->recipientName = $recipientName;
        $this->recipientAddressFirstLine = $recipientAddressFirstLine;
        $this->recipientAddressSecondLine = $recipientAddressSecondLine;
        $this->recipientCountryIsoCode = $recipientCountryIsoCode;
        $this->note = $note;
        $this->terms = $terms;
    }

    public static function normalize(array $input): array
    {
        // Lowercase country code
        if (array_key_exists(self::AUTHOR_COUNTRY_ISO_CODE, $input)) {
            $input[self::AUTHOR_COUNTRY_ISO_CODE] = mb_strtolower((string)$input[self::AUTHOR_COUNTRY_ISO_CODE]);
        }

        // Lowercase country code
        if (array_key_exists(self::RECIPIENT_COUNTRY_ISO_CODE, $input)) {
            $input[self::RECIPIENT_COUNTRY_ISO_CODE] = mb_strtolower((string)$input[self::RECIPIENT_COUNTRY_ISO_CODE]);
        }

        // Convert to datetime
        if (array_key_exists(self::DUE_DATE, $input) && is_string($input[self::DUE_DATE])) {
            $input[self::DUE_DATE] = (new DateTime())->setTimestamp(strtotime($input[self::DUE_DATE]));
        }


        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_ID => ['required', 'integer', 'min:1'],
            self::TITLE => ['nullable', 'string'],
            self::LOCAL_ID => ['nullable', 'string'],
            self::DUE_DATE => ['nullable', 'date'],
            self::AUTHOR_NAME => ['nullable', 'string'],
            self::AUTHOR_ADDRESS_FIRST_LINE => ['nullable', 'string'],
            self::AUTHOR_ADDRESS_SECOND_LINE => ['nullable', 'string'],
            self::AUTHOR_COUNTRY_ISO_CODE => ['nullable', 'string', 'size:3', 'alpha'],
            self::RECIPIENT_NAME => ['nullable', 'string'],
            self::RECIPIENT_ADDRESS_FIRST_LINE => ['nullable', 'string'],
            self::RECIPIENT_ADDRESS_SECOND_LINE => ['nullable', 'string'],
            self::RECIPIENT_COUNTRY_ISO_CODE => ['nullable', 'string', 'size:3', 'alpha'],
            self::NOTE => ['nullable', 'string'],
            self::TERMS => ['nullable', 'string'],
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::INVOICE_ID],
            $input[self::TITLE] ?? null,
            $input[self::LOCAL_ID] ?? null,
            $input[self::DUE_DATE] ?? null,
            $input[self::AUTHOR_NAME] ?? null,
            $input[self::AUTHOR_ADDRESS_FIRST_LINE] ?? null,
            $input[self::AUTHOR_ADDRESS_SECOND_LINE] ?? null,
            $input[self::AUTHOR_COUNTRY_ISO_CODE] ?? null,
            $input[self::RECIPIENT_NAME] ?? null,
            $input[self::RECIPIENT_ADDRESS_FIRST_LINE] ?? null,
            $input[self::RECIPIENT_ADDRESS_SECOND_LINE] ?? null,
            $input[self::RECIPIENT_COUNTRY_ISO_CODE] ?? null,
            $input[self::NOTE] ?? null
        );
    }
}
