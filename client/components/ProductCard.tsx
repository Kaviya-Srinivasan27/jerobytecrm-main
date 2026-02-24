import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../CartContext";

interface Props {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, addToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
