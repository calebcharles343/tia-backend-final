import Order from "../models/Order";

export const CreateOrderService = async (userId) => {
  const order = await Order.create(
    {
      UserId: 1,
      totalPrice: 150.0,
      status: "pending",
      items: [
        { ProductId: 1, quantity: 2, pricePerItem: 50.0 },
        { ProductId: 2, quantity: 1, pricePerItem: 50.0 },
      ],
    },
    {
      include: [{ model: OrderItem, as: "items" }],
    }
  );
};

const orderWithItems = await Order.findOne({
  where: { id: 1 },
  include: [
    {
      model: OrderItem,
      as: "items",
      include: [{ model: Product, as: "product" }],
    },
  ],
});
