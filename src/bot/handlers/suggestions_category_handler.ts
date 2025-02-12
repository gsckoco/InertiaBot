/* Copyright © Inertia Lighting | All Rights Reserved */

//---------------------------------------------------------------------------------------------------------------//

import { Timer, string_ellipses } from '../../utilities.js';

import { Discord } from '../discord_client.js';

//---------------------------------------------------------------------------------------------------------------//

async function suggestionsCategoryHandler(message: Discord.Message) {
    if (!message.member) return;
    if (message.author.system || message.author.bot) return;
    if (message.content.length === 0) return;

    let message_content = message.content;

    /* don't allow staff to create suggestions, unless their message begins with bypass */
    if (message.member.roles.cache.has(process.env.BOT_STAFF_ROLE_ID as string) && !message_content.startsWith('!bypass')) {
        return;
    } else if (message_content.startsWith('!bypass ')) {
        message_content = message_content.substring(7);
    }

    const suggestions_channel = message.channel;

    /* suggestion text */
    const suggestion_text = string_ellipses(message_content, 1000);

    /* suggestion embed */
    const bot_suggestion_message = await suggestions_channel.send({
        embeds: [
            new Discord.MessageEmbed({
                color: 0x60A0FF,
                author: {
                    iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
                    name: `@${message.member.user.tag} (${message.member.id})`,
                },
                description: `${suggestion_text}`,
            }),
        ],
    }).catch(console.warn);
    if (!bot_suggestion_message) return;

    /* add the reactions to the suggestion embed */
    await bot_suggestion_message.react('<:approved:813023668211810334>');
    await bot_suggestion_message.react('<:declined:813023668187824158>');

    await Timer(500);

    /* remove the original message */
    await message.delete();
}

//---------------------------------------------------------------------------------------------------------------//

export {
    suggestionsCategoryHandler,
};
