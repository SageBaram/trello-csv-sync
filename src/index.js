import fs from "fs";
import csvParser from "csv-parser";
import {
	fetchListIdByName,
  fetchCardsFromList,
  fetchBoardLabels,
  addCardToTrello,
  setCardLabels,
} from "./trello.js";
import { getLabelIdsByNames } from "./csv.js";
import { BOARD_ID, CSV_FILE_PATH, DEFAULT_LIST_NAME } from "./config.js";

const main = async () => {
  const labels = await fetchBoardLabels(BOARD_ID);

  const processRow = async (row, labels) => {
    const listName = row["List Name"] || DEFAULT_LIST_NAME;
    const listId = await fetchListIdByName(BOARD_ID, listName);

    const existingCards = await fetchCardsFromList(listId);
    const existingCardTitles = new Set(
      existingCards.map((card) => card.name.toLowerCase()),
    );

    const title = `${row["Epic Name"]} - ${row["User Story"]}`;
    const description = row["Description"];
    const labelNames = row["Labels"];
    const labelIds = getLabelIdsByNames(labels, labelNames);

    const titleLowerCase = title.toLowerCase();

    if (existingCardTitles.has(titleLowerCase)) {
      const existingCard = existingCards.find(
        (card) => card.name.toLowerCase() === titleLowerCase,
      );
      if (
        labelIds.length > 0 &&
        JSON.stringify(labelIds) !== JSON.stringify(existingCard.idLabels)
      ) {
        await setCardLabels(existingCard, labelIds);
      }
    } else {
      await addCardToTrello(listId, title, description, labelIds);
    }
  };

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csvParser())
    .on("data", async (row) => {
      await processRow(row, labels);
    })
    .on("end", () => {
      console.log("CSV file processed.");
    });
};

main();
