const handleGet = (req, res) => {
    console.log("Someone requesting /GET");
    res.status(200).json("OK");
}

const handlePost = (req, res) => {
    console.log("Someone requesting /POST");
    res.status(200).json("OK");
}

const handleDelete = (req, res) => {
    console.log("Someone requesting /DELETE");
    res.status(200).json("OK");
}

const handlePut = (req, res) => {
    console.log("Someone requesting /PUT");
    res.status(200).json("OK");
}
module.exports = { handleGet, handleDelete, handlePost, handlePut };