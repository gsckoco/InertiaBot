/* Copyright © Inertia Lighting | All Rights Reserved */

//---------------------------------------------------------------------------------------------------------------//

import { Discord } from '../discord_client.js';

import { command_permission_levels } from '../common/bot.js';

//---------------------------------------------------------------------------------------------------------------//

export default {
    name: 'downloads',
    description: 'why does this even exist',
    aliases: ['downloads', 'download', 'roles', 'retrieve', 'get'],
    permission_level: command_permission_levels.PUBLIC,
    cooldown: 10_000,
    async execute(
        message: Discord.Message<true>,
        args: {
            [key: string]: unknown;
        },
    ) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed({
                    color: 0x60A0FF,
                    description: 'You can download purchased products from our website!',
                }),
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: 'Products & Downloads',
                            url: 'https://inertia.lighting/products',
                        },
                    ],
                },
            ],
        }).catch(console.warn);
    },
};
