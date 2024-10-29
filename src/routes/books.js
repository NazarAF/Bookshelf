/** @format */

const url = require("url");
const BooksController = require("../controllers/BooksController");

// Route Books
const booksRoutes = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const method = req.method;
	const pathParts = parsedUrl.pathname.split("/");
	const id = pathParts.length > 2 ? pathParts[2] : null;

	req.query = parsedUrl.query;

	res.setHeader("Content-Type", "application/json; charset=utf-8");

	if (method === "GET" && parsedUrl.pathname === "/books") BooksController.index(req, res);
	else if (method === "GET" && id) BooksController.show(id, res);
	else if (method === "POST" && parsedUrl.pathname === "/books") BooksController.store(req, res);
	else if (method === "PUT" && id) BooksController.update(id, req, res);
	else if (method === "DELETE" && id) BooksController.destroy(id, res);
	else {
		res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
		return res.end(
			JSON.stringify({
				status: "fail",
				message: "Halaman tidak ditemukan",
			}),
		);
	}
};

module.exports = booksRoutes;
