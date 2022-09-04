const { Client, ActivityType } = require('discord.js')

/**
 * @param {Client} client
 */
 async function updateActivity(client, interval) {
  
  const activities = client.config.activities

  const servercount = client.guilds.cache.size;
  const usercount = []

  await client.guilds.cache.forEach(guild => {
    guild.members.cache.forEach(member => {
      if(member.user.bot) return;
      usercount.push(member)
    })
  })

  setInterval(() => {
    const status = activities[Math.floor(Math.random() * activities.length)]
    client.user.setActivity(status.replace("{servercount}", servercount))
  }, interval*1000)
}

module.exports = { updateActivity }