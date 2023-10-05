import axios from "axios";
import { API_KEY, TOKEN } from "./config.js";

const BASE_URL = "https://api.trello.com/1";

async function request(method, endpoint, data = {}, params = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultParams = {
    key: API_KEY,
    token: TOKEN,
  };

  try {
    return await axios({
      method: method,
      url: url,
      data: data,
      params: { ...defaultParams, ...params },
    });
  } catch (error) {
    console.error(
      `Error in request method: ${method} to endpoint: ${endpoint}`,
    );
    console.error(`Error details: ${error}`);
    throw error; // Propagate the error up so you can handle it in the calling function if needed.
  }
}

export async function fetchListIdByName(boardId, listName) {
  try {
    const response = await request("GET", `/boards/${boardId}/lists`);
    const list = response.data.find((list) => list.name === listName);
    return list ? list.id : null;
  } catch (error) {
    console.error(`Error fetching list ID: ${error.message}`);
    return null;
  }
}

export async function fetchCardsFromList(listId) {
  try {
    const response = await request("GET", `/lists/${listId}/cards`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards from list: ${error.message}`);
    return [];
  }
}

export async function fetchBoardLabels(boardId) {
  try {
    const response = await request("GET", `/boards/${boardId}/labels`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching labels: ${error.message}`);
    return [];
  }
}

export async function addCardToTrello(listId, title, description, labelIds) {
  try {
    const response = await request("POST", "/cards", {
      name: title,
      desc: description,
      idList: listId,
      // if labelId is provided, attach it to the card
      idLabels: labelIds.length > 0 ? labelIds : [],
    });
    console.log(`Added card: ${response.data.name}`);
  } catch (error) {
    console.error(`Error adding card: ${error.message}`);
  }
}

export async function setCardLabels(card, labelIds) {
  try {
    const response = await request("PUT", `/cards/${card.id}/idLabels`, {
      value: labelIds,
    });
    console.log(`Set labels for card: ${card.name}`);
  } catch (error) {
    console.error(`Error setting card labels: ${error.message}`);
    console.error(`Error response body: ${error.response?.data}`);
  }
}
