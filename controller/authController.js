import Record from "../model/Record.js";
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const USERNAME = "demo";
        const PASSWORD = "demo";

        if (username !== USERNAME) {
            return res.status(400).json({
                message: "credentials are not valid",
                status: false
            })
        }

        if (password !== PASSWORD) {
            return res.status(400).json({
                message: "credentials are not valid",
                status: false
            })
        }

        if (username === USERNAME && password === PASSWORD) {
            return res.status(200).json({
                message: "user logged in successfully",
                status: true
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            status: false
        })
    }
}


export const getPaginatedRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const search = req.query.search || ""; // Get the search query from the request
        const skip = (page - 1) * limit;

        // Build the filter query based on the search term
        const searchFilter = search
            ? { Domain: { $regex: search, $options: "i" } } // Case-insensitive search
            : {};

        const records = await Record.find(searchFilter) // Apply the search filter
            .skip(skip)
            .limit(limit)
            .lean();

        // Get the total count of records after applying the search filter
        const totalRecords = await Record.countDocuments(searchFilter);

        // Prepare the response with pagination and search results
        const response = {
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
            records,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching paginated records:", error);
        res.status(500).json({ message: "Error fetching records", error: error.message });
    }
};

