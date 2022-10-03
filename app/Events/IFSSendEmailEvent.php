<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IFSSendEmailEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mail_data;
    public $sleep;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($mail_data)
    {
        $this->mail_data = $mail_data;
        // $this->sleep = $sleep;
        \Log::info('send event mail');
        // \Log::info($mail_data);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
