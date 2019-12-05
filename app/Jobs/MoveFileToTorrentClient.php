<?php

namespace App\Jobs;

use Exception;
use App\Models\MongoDB\Biblioteca;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class MoveFileToTorrentClient implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $file;

    protected $success;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $retryAfter = 15;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Biblioteca $file) {
        $this->file = $file;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
      $source = storage_path('app/public/' . $this->file->Path);
      $destination = base_path('../oneshow-seeder/files') . '/' . $this->file->id . '.' . $this->file->Extension;
      $success = copy($source, $destination);

      if (!$success) {
        throw new Exception('The file could not be copied to ' . $destination);
      }
    }
}
