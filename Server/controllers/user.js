const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.cart.items);
  } catch (err) {
    next(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const count = req.body.count;
    const product = await Product.findById(req.body.productId);
    user.addToCart(product, count);
    return res.status(200).json("Add To Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const count = req.body.count;
    const product = await Product.findById(req.body.productId);
    user.updateCart(product, count);
    return res.status(200).json("Update Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const product = await Product.findById(req.body.productId);
    user.deleteCartItem(product);
    return res.status(200).json("Delete Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};

function convertMoney(money) {
  const str = money + "";
  let output = "";
  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    count++;
    output = str[i] + output;
    if (count % 3 === 0 && i !== 0) {
      output = "." + output;
      count = 0;
    }
  }
  return output;
}

exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    const newOrder = await new Order(req.body);
    const product = newOrder.products.map((p) => p);
    const table = product.map((pro) => {
      return `<tr>
      <td style="text-align:center;">${pro.product.name}</td>
      <td style="text-align:center;"><img src=${
        pro.product.img1
      } width='100%' alt=${pro.product.name}></td>
      <td style="text-align:center;">${convertMoney(pro.product.price)}VND</td>
      <td style="text-align:center;">${pro.quantity}</td>
      <td style="text-align:center;">${convertMoney(
        Number(pro.quantity) * Number(pro.product.price)
      )} VND</tr>`;
    });
    newOrder.save();
    const mailOptions = {
      from: "vietlhfx21680@funix.edu.vn",
      to: `${newOrder.email}`,
      subject: `Xin Chào ${newOrder.name}`,
      html: `<p>Phone:${newOrder.phone}</p><span>
      <p>Address:${newOrder.address}</p>
      </span>
      <table>
  <tr>
    <th width = '35%'>Tên sản phẩm</th>
    <th width = '15%'>Hình ảnh</th>
    <th width = '20%'>Giá</th>
    <th width = '10%'>Số lượng</th>
    <th width = '20%'>Thành tiền</th>
  </tr>
  ${table}
  </table>
<h1>Tổng Thanh Toán: ${convertMoney(newOrder.total)} VND</h1>
<h1>Cảm ơn bạn!</h1>
      `,
    };
    user.clearCart();
    transport.sendMail(mailOptions);
    return res.status(200).json("Order Thành Công");
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId: userId });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const detailId = req.params.detailid;
    const orders = await Order.find({ userId: userId });
    const detail = orders.filter((order) => order._id.toString() === detailId);
    return res.status(200).json(detail);
  } catch (err) {
    next(err);
  }
};

const calEarning = async () => {
  try {
    const priceList = await Order.find().select("total");
    const earning = priceList.reduce((totals, currentValue) => ({
      total: totals.total + currentValue.total,
    }));
    return earning.total;
  } catch (error) {
    console.log("error:", error);
  }
};

exports.getBusinessInfo = async (req, res) => {
  const earning = await calEarning();
  const result = {
    users: await User.count({ role: "user" }),
    orders: await Order.count(),
    earning: earning,
  };
  res.send(result);
};
