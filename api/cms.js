// File: nama-proyek-starter-anda/api/cms.js

import { apiClient } from "./client"; // Mengimpor apiClient dari client.js

/**
 * TASK: use `apiClient` to fetch list of diary content
 *
 * Mengambil daftar entri diary.
 * Parameter `status` harus ada dan bernilai `'posted'`.
 *
 * @returns {Promise<Array>} Array of diary entries.
 */
export async function getDiaryFeed() {
  const ids = [
    359007, 358317, 343275, 342861, 342723, 342240, 341343, 296907, 253782,
    177123,
  ];

  try {
    const response = await apiClient.get("/cms/diary", {
      params: {
        id: ids, // Axios akan mengubah array ini menjadi id=X&id=Y...
        status: "posted",
      },
    });
    // Berdasarkan respons Postman Anda, data yang relevan ada di `response.data.content`
    return response.data.content;
  } catch (error) {
    console.error(
      "Error fetching diary feed:",
      error.response ? error.response.data : error.message
    );
    throw error; // Lempar error agar bisa ditangani di komponen Vue
  }
}

/**
 * TASK: use `apiClient` to fetch diary content by id
 *
 * Mengambil konten diary berdasarkan ID tunggal.
 * Parameter `status` harus ada dan bernilai `'posted'`.
 *
 * @param {string|number} id - ID dari diary entry.
 * @returns {Promise<Object|null>} Objek diary entry, atau null jika tidak ditemukan.
 */
export async function getDiaryContentById(id) {
  try {
    const response = await apiClient.get("/cms/diary", {
      params: {
        id: id,
        status: "posted",
      },
    });
    return response.data.content && response.data.content.length > 0
      ? response.data.content[0]
      : null;
  } catch (error) {
    console.error(
      `Error fetching diary content for ID ${id}:`,
      error.response ? error.response.data : error.message
    );
    throw error; // Lempar error agar bisa ditangani di komponen Vue
  }
}
