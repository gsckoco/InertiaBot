/* Copyright © Inertia Lighting | All Rights Reserved */

//---------------------------------------------------------------------------------------------------------------//

import { Discord, client } from '../discord_client.js';

import { command_permission_levels, getUserPermissionLevel } from '../common/bot.js';

//---------------------------------------------------------------------------------------------------------------//

/**
 * This is defined in-place as a temporary definition to make typescript happy.
 */
type PseudoCommand = {
    name: string;
    description: string;
    usage?: string;
    aliases: string[];
    permission_level: number;
    cooldown?: number;
    execute: (message: Discord.Message, options: { [key: string]: unknown }) => Promise<void>;
};

//---------------------------------------------------------------------------------------------------------------//

export default {
    name: 'help',
    description: 'shows a list of commands for you to use.',
    usage: '[command_name]',
    aliases: ['help', 'commands'],
    permission_level: command_permission_levels.PUBLIC,
    cooldown: 2_500,
    async execute(
        message: Discord.Message<true>,
        args: {
            [key: string]: unknown;
            command_prefix: string;
            command_args: string[];
        },
    ) {
        const { command_prefix, command_args } = args;

        if (!message.member) return;

        const user_permission_level = getUserPermissionLevel(message.member);

        const commands_visible_to_user = (client.$.commands as Discord.Collection<string, PseudoCommand>).filter(cmd =>
            user_permission_level >= cmd.permission_level
        ).sort((a, b) =>
            a.permission_level - b.permission_level
        );

        const specified_command_alias = command_args[0];
        if (specified_command_alias?.length > 0) {
            /* display help for a specified command alias */
            const specified_command = commands_visible_to_user.find(cmd => cmd.aliases.includes(specified_command_alias.toLowerCase()));
            if (specified_command) {
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed({
                            color: 0x60A0FF,
                            author: {
                                iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
                                name: `${message.author.tag}`,
                            },
                            description: [
                                `**Name:** ${specified_command.name}`,
                                `**Aliases:** ${specified_command.aliases.join(', ') ?? 'n/a'}`,
                                `**Description:** ${specified_command.description ?? 'n/a'}`,
                                `**Usage:** ${specified_command.usage ? `\`${command_prefix}${specified_command.name} ${specified_command.usage}\`` : 'n/a'}`,
                                `**Permission Level:** \`${specified_command.permission_level}\``,
                            ].join('\n'),
                        }),
                    ],
                }).catch(console.warn);
            } else {
                message.reply({
                    content: `\`${specified_command_alias}\` is not a valid command alias to lookup!`,
                }).catch(console.warn);
            }
        } else {
            /* display all commands visible to the user */
            const commands_visible_to_user_with_prefix = commands_visible_to_user.map(command =>
                command.aliases.map(command_alias =>
                    `${command_prefix}${command_alias.replace('#{cp}', `${command_prefix}`)}`
                ).join(' | ')
            );
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed({
                        color: 0x60A0FF,
                        author: {
                            iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
                            name: `${message.author.tag}`,
                        },
                        title: 'Here\'s a list of all commands that you may use!',
                        description: [
                            `You can send \`${command_prefix}help [command name]\` to get info on a specific command!`,
                            `\`\`\`\n${commands_visible_to_user_with_prefix.join('\n')}\n\`\`\``,
                        ].join('\n'),
                    }),
                ],
            }).catch(console.warn);
        }
    },
};
