const api = (req, res) => {
    console.log("Someone request in home");
    res.status(200).json("OK");
}

module.exports = { api };