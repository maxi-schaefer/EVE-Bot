const { Client, CommandInteraction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    
    if(interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if(!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err)
        interaction.reply({content: `Something went wrong while executing this command.`, ephemeral: true})
      }

    } else if(interaction.isButton()) {
      const { buttons } = client;
      const button = buttons.get(interaction.customId);

      if(!button) return new Error("There is no code for this button!")

      try {
        await button.execute(interaction, client)
      } catch (error) {
        console.error(error)
      }


    } else if(interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const modal = modals.get(interaction.customId)

      if(!modal) return new Error("There is no code for this modal!")

      try {
        await modal.execute(interaction, client)
      } catch (error) {
        console.error(error)
      }
    } else if(interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName)
      if(!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if(interaction.isSelectMenu()) {
      const { selectMenus } = client;
      const menu = selectMenus.get(interaction.customId);
      if(!menu) return new Error('There is no code for this select menu.')
      try {
        await menu.execute(interaction, client);
      } catch (error) {
          console.error(error);
      }
    }

  },
};
