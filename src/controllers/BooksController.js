/** @format */

const uuid = require("../utility/uuid");
let books = [
	// Testing Optional Directly
	// {
	// 	id: "b287d7f3-021a-4214-9cb1-cfd1cd2d6bd7",
	// 	name: "Buku A",
	// 	year: 2010,
	// 	author: "John Doe",
	// 	summary: "Lorem ipsum dolor sit amet",
	// 	publisher: "Dicoding Indonesia",
	// 	pageCount: 100,
	// 	readPage: 100,
	// 	finished: true,
	// 	reading: true,
	// 	insertedAt: "2024-10-05T16:17:26.016Z",
	// 	updatedAt: "2024-10-05T16:17:26.017Z",
	// },
	// {
	// 	id: "85f68b42-da66-463d-8af7-9d360dfae771",
	// 	name: "Kelas Dicoding",
	// 	year: 2010,
	// 	author: "John Doe",
	// 	summary: "Lorem ipsum dolor sit amet",
	// 	publisher: "Dicoding Indonesia",
	// 	pageCount: 100,
	// 	readPage: 99,
	// 	finished: false,
	// 	reading: true,
	// 	insertedAt: "2024-10-05T16:17:28.369Z",
	// 	updatedAt: "2024-10-05T16:17:28.369Z",
	// },
	// {
	// 	id: "99f0a07f-b73f-4512-a42b-91470b75831e",
	// 	name: "dicoding Jobs",
	// 	year: 2010,
	// 	author: "John Doe",
	// 	summary: "Lorem ipsum dolor sit amet",
	// 	publisher: "Dicoding Indonesia",
	// 	pageCount: 100,
	// 	readPage: 0,
	// 	finished: false,
	// 	reading: false,
	// 	insertedAt: "2024-10-05T16:17:30.477Z",
	// 	updatedAt: "2024-10-05T16:17:30.477Z",
	// },
	// {
	// 	id: "eed8ce04-5438-4f00-9358-5fd409453a89",
	// 	name: "Buku A",
	// 	year: 2010,
	// 	author: "John Doe",
	// 	summary: "Lorem ipsum dolor sit amet",
	// 	publisher: "Dicoding Indonesia",
	// 	pageCount: 100,
	// 	readPage: 0,
	// 	finished: false,
	// 	reading: false,
	// 	insertedAt: "2024-10-05T16:17:32.968Z",
	// 	updatedAt: "2024-10-05T16:17:32.968Z",
	// },
];

// Controller Book
const BooksController = {
	/**
	 * Display a listing of the resource.
	 */
	index(req, res) {
		const { reading, finished, name } = req.query || {};
		let results = books;

		if (reading) results = results.filter(book => book.reading === (reading == 1));
		if (finished) results = results.filter(book => book.finished === (finished == 1));
		if (name) results = results.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));

		const formated = results.map(({ id, name, publisher }) => ({ id, name, publisher }));

		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		return res.end(
			JSON.stringify({
				status: "success",
				data: {
					books: formated || results,
				},
			}),
		);
	},

	/**
	 * Store a newly created resource in storage.
	 */
	store(req, res) {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const book = JSON.parse(body);

			if (!book.name) {
				res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
				return res.end(
					JSON.stringify({
						status: "fail",
						message: "Gagal menambahkan buku. Mohon isi nama buku",
					}),
				);
			}

			if (book.readPage > book.pageCount) {
				res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
				return res.end(
					JSON.stringify({
						status: "fail",
						message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
					}),
				);
			}

			const newBook = {
				id: uuid(),
				name: book.name,
				year: book.year,
				author: book.author,
				summary: book.summary,
				publisher: book.publisher,
				pageCount: book.pageCount,
				readPage: book.readPage,
				finished: book.pageCount === book.readPage,
				reading: book.reading,
				insertedAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			books.push(newBook);
			res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(
				JSON.stringify({
					status: "success",
					message: "Buku berhasil ditambahkan",
					data: {
						bookId: newBook.id,
					},
				}),
			);
		});
	},

	/**
	 * Display the specified resource.
	 */
	show(id, res) {
		const book = books.find(b => b.id === id);
		if (!book) {
			res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(
				JSON.stringify({
					status: "fail",
					message: "Buku tidak ditemukan",
				}),
			);
		}

		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		return res.end(
			JSON.stringify({
				status: "success",
				data: {
					book,
				},
			}),
		);
	},

	/**
	 * Update the specified resource in storage.
	 */
	update(id, req, res) {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const bookUpdate = JSON.parse(body);
			const bookIndex = books.findIndex(b => b.id === id);

			if (bookIndex === -1) {
				res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
				return res.end(
					JSON.stringify({
						status: "fail",
						message: "Gagal memperbarui buku. Id tidak ditemukan",
					}),
				);
			}

			if (!bookUpdate.name) {
				res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
				return res.end(
					JSON.stringify({
						status: "fail",
						message: "Gagal memperbarui buku. Mohon isi nama buku",
					}),
				);
			}

			if (bookUpdate.readPage > bookUpdate.pageCount) {
				res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
				return res.end(
					JSON.stringify({
						status: "fail",
						message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
					}),
				);
			}

			const updatedBook = {
				...books[bookIndex],
				...bookUpdate,
				finished: bookUpdate.pageCount === bookUpdate.readPage,
				updatedAt: new Date().toISOString(),
			};

			books[bookIndex] = updatedBook;

			res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(
				JSON.stringify({
					status: "success",
					message: "Buku berhasil diperbarui",
				}),
			);
		});
	},

	/**
	 * Remove the specified resource from storage.
	 */
	destroy(id, res) {
		const bookIndex = books.findIndex(b => b.id === id);
		if (bookIndex === -1) {
			res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(
				JSON.stringify({
					status: "fail",
					message: "Buku gagal dihapus. Id tidak ditemukan",
				}),
			);
		}

		books.splice(bookIndex, 1);
		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		return res.end(
			JSON.stringify({
				status: "success",
				message: "Buku berhasil dihapus",
			}),
		);
	},
};

module.exports = BooksController;
