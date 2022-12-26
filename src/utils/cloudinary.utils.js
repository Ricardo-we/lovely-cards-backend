const getCloudinaryLinkId = (cloudinaryLink="") => {
    const idPlusLink = cloudinaryLink.split("/")[7];
    return [idPlusLink.split(".")[0], idPlusLink.split(".")[1]]
}

module.exports = {getCloudinaryLinkId};