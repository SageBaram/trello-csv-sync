import fs from "fs";
import csvParser from "csv-parser";
import {
  fetchCardsFromList,
  fetchBoardLabels,
  addCardToTrello,
  setCardLabels,
} from "./trello.js";
import { getLabelIdsByNames } from "./csv.js";
import { LIST_ID, BOARD_ID, CSV_FILE_PATH } from "./config.js";

const main = async () => {
  const existingCards = await fetchCardsFromList(LIST_ID);
  const labels = await fetchBoardLabels(BOARD_ID);

  const existingCardTitles = new Set(
    existingCards.map((card) => card.name.toLowerCase()),
  );

  const processRow = async (row, labels) => {
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
      await addCardToTrello(title, description, labelIds);
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
