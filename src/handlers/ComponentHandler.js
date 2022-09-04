const { Client } = require('discord.js')

/** 
 * @param { Client } client
 */
function loadComponents(client) {
    const ascii = require('ascii-table');
    const fs = require('fs')
    const table = new ascii().setHeading("Components", "Type", "Status")

    const componentFolder = fs.readdirSync(`./src/types/components`);
    for (const folder of componentFolder) {
        const componentFiles = fs.readdirSync(`./src/types/components/${folder}`).filter(file => file.endsWith('.js'));

        const { modals, buttons, selectMenus } = client;
        switch (folder) {
            case "buttons": {
                for (const file of componentFiles) {
                    const button = require(`../types/components/${folder}/${file}`)
                    buttons.set(button.data.name, button);
                    table.addRow(file, "button", "✅");
                }
            }
            break;

            case "modals": {
                for (const file of componentFiles) {
                    const modal = require(`../types/components/${folder}/${file}`)
                    modals.set(modal.data.name, modal)
                    table.addRow(file, "modal", "✅");
                }
            }
            break;

            case "selectMenus": {
                for (const file of componentFiles) {
                    const selectMenu = require(`../types/components/${folder}/${file}`);
                    selectMenus.set(selectMenu.data.name, selectMenu);
                    table.addRow(file, "selectMenu", "✅")
                }
            } break;
        
            default:
                break;
        }
        continue;
    }

    return console.log(table.toString(), "\nLoaded Components!");
}

module.exports = { loadComponents }