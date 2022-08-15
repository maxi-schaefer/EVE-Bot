const { EmbedBuilder } = require('@discordjs/builders')
const client = require('../../../bot')

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
  
  client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [
      new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({name: "NOW PLAYING", iconURL: client.user.displayAvatarURL()})
      .setTitle(song.name)
      .setDescription('🎶')
      .addFields([
        { name: '💠 Requested By', value: `\`\`\`${song.user.tag}\`\`\``, inline: true },
        { name: '💠 Duration', value: `\`\`\`${song.formattedDuration}\`\`\``, inline: true},
        { name: '💠 Volume', value: `\`\`\`${queue.volume}%\`\`\``, inline: true},
        { name: '💠 Filter', value: `\`\`\`${queue.filters.names.join(', ') || 'Off'}\`\`\``, inline: true},
        { name: '💠 Loop', value: `\`\`\`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\`\`\``, inline: true},
      ])
    ]})
    )
  .on('addSong', (queue, song) =>
  queue.textChannel.send({embeds: [
    new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({name: "ADDED TO QUEUE", iconURL: client.user.displayAvatarURL()})
    .setTitle(song.name)
    .setDescription('✅ Successfully Added Song to Queue')
    .addFields([
      { name: '💠 Requested By', value: `\`\`\`${song.user.tag}\`\`\``, inline: true },
      { name: '💠 Duration', value: `\`\`\`${song.formattedDuration}\`\`\``, inline: true}
    ])
  ]})
  )
  .on('addList', (queue, playlist) =>
  queue.textChannel.send({embeds: [
    new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({name: "ADDED TO QUEUE", iconURL: client.user.displayAvatarURL()})
    .setTitle(playlist.name)
    .setDescription('✅ Successfully Added Playlist to Queue')
    .addFields([
      { name: '💠 Requested By', value: `\`\`\`${playlist.user.tag}\`\`\``, inline: true },
      { name: '💠 Size', value: `\`\`\`${playlist.songs.length}\`\`\``, inline: true}
    ])
  ]})
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', queue => queue.textChannel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription('Voice channel is empty! Leaving the channel...')]}))
  .on('searchNoResult', (message, query) =>
    message.channel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription(`❌ | No result found for \`${query}\`!`)]})
  )
  .on('finish', queue => queue.textChannel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription("`✅ Finished!`")]}))