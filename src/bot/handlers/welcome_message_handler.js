/* Copyright © Inertia Lighting | All Rights Reserved */

//---------------------------------------------------------------------------------------------------------------//

'use strict';

//---------------------------------------------------------------------------------------------------------------//

const { Discord, client } = require('../discord_client.js');

//---------------------------------------------------------------------------------------------------------------//

/**
 * @param {Discord.GuildMember} member
 */
async function welcomeMessageHandler(member) {
    const message_options = {
        content: `${member}`,
        embeds: [
            new Discord.MessageEmbed({
                color: 0x60A0FF,
                title: 'Welcome to Inertia Lighting!',
                description: [
                    `You need to accept our rules in <#${member.guild.rulesChannelId}> (click the button)!`,
                    'Once you accept, you will gain access to the server.',
                    '',
                    'To get started, check out these channels:',
                    `- <#${member.guild.rulesChannelId}>`,
                    `- <#${process.env.BOT_INFO_CHANNEL_ID}>`,
                    `- <#${process.env.BOT_NEWS_CHANNEL_ID}>`,
                    `- <#${process.env.BOT_SUPPORT_CHANNEL_ID}>`,
                    `- <#${process.env.BOT_GENERAL_CHANNEL_ID}>`,
                    '',
                    'Make sure to visit our product hub to purchase our products using Robux!',
                    'Alternatively, you can go to our website to make a purchase using PayPal!',
                ].join('\n'),
            }),
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        label: 'Our Website',
                        url: 'https://inertia.lighting/',
                    }, {
                        type: 2,
                        style: 5,
                        label: 'Product Hub',
                        url: 'https://product-hub.inertia.lighting/',
                    }, {
                        type: 2,
                        style: 5,
                        label: 'Privacy Policy',
                        url: 'https://inertia.lighting/privacy',
                    }, {
                        type: 2,
                        style: 5,
                        label: 'F.A.Q.',
                        url: 'https://inertia.lighting/faq',
                    },
                ],
            },
        ],
    };

    try {
        const dm_channel = await member.createDM();
        await dm_channel.send(message_options);
    } catch {} // ignore any errors

    const general_chat_channel = client.channels.resolve(process.env.BOT_GENERAL_CHANNEL_ID);
    await general_chat_channel.send(message_options).catch(console.warn);
}

//---------------------------------------------------------------------------------------------------------------//

module.exports = {
    welcomeMessageHandler,
};
