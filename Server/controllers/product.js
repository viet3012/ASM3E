const Product = require("../models/Product");

exports.getProducts = async (req, res, next) => {
  try {
    const product = await Product.find();

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  const images = req.files;
  const data = req.body;
  try {
    const newProduct = new Product({
      name: data.productName,
      category: data.category,
      price: data.price,
      short_desc: data.shortdesc,
      long_desc: data.longdesc,
      img1: images[0].path,
      img2: images[1].path,
      img3: images[2].path,
      img4: images[3].path,
    });
    newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.prodId;
    await Product.findByIdAndDelete(prodId);
  } catch (err) {
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  prodId = req.params.id;
  try {
    const updated = await Product.findByIdAndUpdate(prodId, {
      name: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      short_desc: req.body.shortdesc,
      long_desc: req.body.longdesc,
    });
  } catch (err) {
    next(err);
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    const query = req.query.product;
    const product = await Product.find();
    const search = product.filter((prod) =>
      prod.category.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json(search);
  } catch (err) {
    next(err);
  }
};
