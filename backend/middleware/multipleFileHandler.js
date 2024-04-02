const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPropertyImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

exports.resizePropertyImages = async (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({ message: "No images uploaded!" });
  }

  if (!req.files.imageCover || req.files.imageCover.length === 0) {
    return res.status(400).json({ message: "Cover image is required!" });
  }

  if (!req.files.images || req.files.images.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one property image is required!" });
  }

  const imagesDirectory = path.join(
    __dirname,
    "..",
    "public",
    "img",
    "properties"
  );

  try {
    // 1) Cover image
    const coverFilename = `property-${req.user._id}-${Date.now()}-cover.jpeg`;
    const coverImagePath = path.join(imagesDirectory, coverFilename);
    ensureDirectoryExists(coverImagePath);
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(coverImagePath);
    req.body.imageCover = coverFilename;

    // 2) Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `property-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;
        const imagePath = path.join(imagesDirectory, filename);
        ensureDirectoryExists(imagePath);
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(imagePath);

        req.body.images.push(filename);
      })
    );

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while processing images" });
  }
};
