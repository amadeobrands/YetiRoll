<?php

namespace App\Console\Commands\User;

use App\Models\Auth\UserPassport;
use App\Models\User;
use App\Service\User\DTO\UserCreateDTO;
use App\Service\User\UserService;
use Illuminate\Console\Command;

class Create extends Command
{
    protected $signature = 'user:create';
    protected $description = 'Creates new user';

    // Wired services
    private UserService $user;

    public function __construct(UserService $user)
    {
        parent::__construct();

        $this->user = $user;
    }

    public function handle()
    {
        $name = $this->ask("Full Name (i.e. John Smith)");
        $email = $this->ask("Email (i.e. user@example.com)");
        $password = $this->secret("Password: (min: 6 chars)");
        $passwordRepeat = $this->secret("Repeat password");

        // Ensure passwords are matching
        if ($password !== $passwordRepeat) {
            $this->error("Passwords do not match");
            return 1;
        }

        // Create temp passport
        $passport = new UserPassport(new User(), [UserService::PERMISSION_CREATE]);

        // Create dto
        $dto = UserCreateDTO::build([
            UserCreateDTO::NAME => $name,
            UserCreateDTO::EMAIL => $email,
            UserCreateDTO::PASSWORD => $password
        ])->usePassport($passport);

        // Create user
        $user = $this->user->create($dto);

        $this->info(sprintf("User #%d created", $user->getId()));

        return 0;
    }
}
