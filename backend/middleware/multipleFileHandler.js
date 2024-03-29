const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
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

  try {
    // 1) Cover image
    req.body.imageCover = `property-${req.user._id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/properties/${req.body.imageCover}`); // Changed directory to 'properties'

    // 2) Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `property-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/properties/${filename}`); // Changed directory to 'properties'

        req.body.images.push(filename);
      })
    );

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while processing images" });
  }
};
