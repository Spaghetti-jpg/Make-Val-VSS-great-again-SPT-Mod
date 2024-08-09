import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPostAkiLoadMod } from "@spt/models/external/IPostAkiLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";


class Mod implements IPostDBLoadMod, IPostAkiLoadMod {

    public IPostAkiLoadMod(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        logger.info("Mod: Make VSS Great Again version: 1.0.6 by: Hacker228 loaded");
    }

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        // Define constant values
        const HEAT_FACTOR_BY_SHOT = 2.17;
        const HEAT_FACTOR_GUN = 0.98;
        const HEAT_FACTOR_AMMO_SP_5 = 1.273;
        const HEAT_FACTOR_AMMO_SP_6 = 1.34;
        const HEAT_FACTOR_AMMO_PUB_9 = 1.3;
        const HEAT_FACTOR_AMMO_SPP = 1.206;

        // Define item IDs and names to update
        const itemsToUpdate = [
            { id: "57838ad32459774a17445cd2", name_gun: "VSS" },
            { id: "57c44b372459772d2b39b8ce", name_gun: "VAL" }
        ];

        const ammoToUpdate = [
            { id: "57a0dfb82459774d3078b56c", heatFactor: HEAT_FACTOR_AMMO_SP_5, name_ammo: "SP-5" },
            { id: "57a0e5022459774d1673f889", heatFactor: HEAT_FACTOR_AMMO_SP_6, name_ammo: "SP-6" },
            { id: "61962d879bb3d20b0946d385", heatFactor: HEAT_FACTOR_AMMO_PUB_9, name_ammo: "PUB-9" },
            { id: "5c0d668f86f7747ccb7f13b2", heatFactor: HEAT_FACTOR_AMMO_SPP, name_ammo: "SPP" }
        ];

        // Define delay before starting to log messages in seconds
        const initialDelayInSeconds = 3;

        // Use setTimeout for initial delay
        setTimeout(() => {
            // Log an empty line before the first message
            const logger = container.resolve<ILogger>("WinstonLogger");
            logger.info("");

            itemsToUpdate.forEach(({ id, name_gun }) => {
                const item = tables.templates.items[id];

                if (item) {
                    // Update properties using constants
                    item._props.HeatFactorByShot = HEAT_FACTOR_BY_SHOT;
                    item._props.HeatFactorGun = HEAT_FACTOR_GUN;

                    // Log message if the item ID is found
                    logger.logWithColor(`${name_gun} item ID found. Сhanges applied.`, LogTextColor.GREEN);
                } else {
                    // Log message if the item ID is not found
                    logger.logWithColor(`${name_gun} item ID not found. Changes not applied.`, LogTextColor.RED);
                }
            });

            ammoToUpdate.forEach(({ id, heatFactor, name_ammo }) => {
                const ammoItem = tables.templates.items[id];

                if (ammoItem) {
                    // Update ammo properties
                    ammoItem._props.HeatFactor = heatFactor;

                    // Log message if the ammo ID is found
                    logger.logWithColor(`${name_ammo} item ID found. Changes applied.`, LogTextColor.GREEN);
                } else {
                    // Log message if the ammo ID is not found
                    logger.logWithColor(`${name_ammo} item ID not found. Changes not applied.`, LogTextColor.RED);
                }
            });

            // Log an empty line after all messages
            logger.info("");
        }, initialDelayInSeconds * 1000); // Convert seconds to milliseconds
    }
}

module.exports = { mod: new Mod() };
